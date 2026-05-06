// app_data.js
// Course data loading + schema validation + UI reporting

(function () {
  'use strict';

  window.Prog1 = window.Prog1 || {};
  const Prog1 = window.Prog1;
  // Avoid destructuring for broader browser compatibility.
  const $ = Prog1.util.$;
  const escapeHtml = Prog1.util.escapeHtml;
  const WEBAPP_PREFIX = (typeof window.__PROG1_WEBAPP_PREFIX__ === 'string') ? window.__PROG1_WEBAPP_PREFIX__ : '';

  // -----------------------------
  // Data loading
  // -----------------------------
  let DATA = window.__COURSE__;

  const loadLocalScript = (src) => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error('script load failed: ' + src));
    document.head.appendChild(s);
  });

  const ensureDataLoaded = async () => {
    if (DATA && Array.isArray(DATA.sessions)) return true;
    try {
      const isFile = location.protocol === 'file:';
      const dataPath = `${WEBAPP_PREFIX}data/bundle.js`;
      await loadLocalScript(isFile ? dataPath : (dataPath + '?ts=' + Date.now()));
      DATA = window.__COURSE__;
      return !!(DATA && Array.isArray(DATA.sessions));
    } catch (_) {
      return false;
    }
  };

  const getData = () => DATA;

  // -----------------------------
  // Data schema/version validation
  // -----------------------------
  const EXPECTED_SCHEMA_VERSION = 2;

  const ensureNoticeBox = () => {
    let box = $('dataNotice');
    if (box) return box;
    const head = document.querySelector('.session-head');
    if (!head) return null;
    box = document.createElement('div');
    box.id = 'dataNotice';
    box.className = 'dataNotice hidden';
    const toolbar = head.querySelector('.toolbar');
    head.insertBefore(box, toolbar || null);
    return box;
  };

  const showNotice = (kind, lines) => {
    const box = ensureNoticeBox();
    if (!box) return;
    if (!lines || lines.length === 0) {
      box.classList.add('hidden');
      box.textContent = '';
      return;
    }
    box.classList.remove('hidden');
    box.classList.toggle('warn', kind === 'warn');
    box.classList.toggle('err', kind === 'err');
    box.innerHTML =
      `<div style="font-weight:700;margin-bottom:4px;">${kind === 'err' ? 'データ整合性エラー' : 'データ警告'}</div>` +
      `<ul style="margin:0;padding-left:18px;">` +
      lines.map((x) => `<li>${escapeHtml(x)}</li>`).join('') +
      `</ul>`;
  };

  const validateCourseData = (data) => {
    const warnings = [];
    const errors = [];

    if (!data || typeof data !== 'object') {
      errors.push('COURSEデータがオブジェクトではありません。');
      return { ok: false, warnings, errors };
    }

    const sv = data.schemaVersion;
    if (sv == null) {
      warnings.push('bundle.js に schemaVersion がありません（旧形式の可能性）。');
    } else if (sv !== EXPECTED_SCHEMA_VERSION) {
      warnings.push(`schemaVersion=${sv}（期待=${EXPECTED_SCHEMA_VERSION}）。動作はしますが不整合の可能性があります。`);
    }

    if (!Array.isArray(data.sessions)) {
      errors.push('sessions が配列ではありません。');
      return { ok: false, warnings, errors };
    }
    if (data.sessions.length === 0) {
      errors.push('sessions が空です。');
      return { ok: false, warnings, errors };
    }

    const seenId = new Set();
    const seenNo = new Set();
    data.sessions.forEach((s, i) => {
      if (!s || typeof s !== 'object') {
        errors.push(`sessions[${i}] がオブジェクトではありません。`);
        return;
      }
      if (typeof s.id !== 'string' || !s.id.trim()) {
        errors.push(`sessions[${i}].id が不正です。`);
      } else if (seenId.has(s.id)) {
        warnings.push(`session id が重複しています: ${s.id}`);
      } else {
        seenId.add(s.id);
      }

      if (!Number.isFinite(s.no)) {
        errors.push(`sessions[${i}].no が不正です。`);
      } else if (seenNo.has(String(s.no))) {
        warnings.push(`session no が重複しています: ${s.no}`);
      } else {
        seenNo.add(String(s.no));
      }

      if (typeof s.title !== 'string' || !s.title.trim()) {
        warnings.push(`sessions[${i}].title が空です（id=${s.id}）。`);
      }

      if (s.slides != null && !Array.isArray(s.slides)) {
        errors.push(`sessions[${i}].slides は配列である必要があります（id=${s.id}）。`);
      }
    });


    return { ok: errors.length === 0, warnings, errors };
  };

  const showLoadErrorUI = () => {
    const list = $('sessionList');
    if (list) list.innerHTML = '<li><span class="small">データ（bundle.js）の読み込みに失敗しました。</span></li>';
    const title = $('sessionTitle');
    if (title) title.textContent = 'データ読み込みエラー';
  };

  /**
   * Ensure data is available and (lightly) valid.
   * Returns data or null.
   */
  const ensureDataOrShowError = async () => {
    await ensureDataLoaded();
    DATA = window.__COURSE__;
    if (!DATA || !Array.isArray(DATA.sessions)) {
      showLoadErrorUI();
      return null;
    }

    const diag = validateCourseData(DATA);
    if (!diag.ok) {
      // Show in UI and stop
      const list = $('sessionList');
      if (list) list.innerHTML = diag.errors.map((e) => `<li><span class="small">ERR: ${escapeHtml(e)}</span></li>`).join('');
      const title = $('sessionTitle');
      if (title) title.textContent = 'データ整合性エラー';
      showNotice('err', diag.errors);
      console.error('[COURSE DATA] invalid', diag.errors, diag.warnings);
      return null;
    }
    if (diag.warnings.length) {
      showNotice('warn', diag.warnings);
      console.warn('[COURSE DATA] warnings', diag.warnings);
    } else {
      showNotice('warn', []);
    }
    return DATA;
  };

  Prog1.data = {
    getData,
    ensureDataLoaded,
    ensureDataOrShowError,
    validateCourseData,
    showNotice,
    EXPECTED_SCHEMA_VERSION,
  };
})();
