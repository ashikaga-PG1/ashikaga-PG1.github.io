// app_main.js
// Main UI (tabs, slides, quiz, sample)

(function () {
  'use strict';

  window.Prog1 = window.Prog1 || {};
  const Prog1 = window.Prog1;

  // Avoid destructuring for broader browser compatibility.
  const $ = Prog1.util.$;
  const escapeHtml = Prog1.util.escapeHtml;
  const clamp = Prog1.util.clamp;
  const normalizeDash = Prog1.util.normalizeDash;
  const copyToClipboard = Prog1.util.copyToClipboard;
  const toast = Prog1.util.toast;
  const readTextFile = Prog1.util.readTextFile;
  const WEBAPP_PREFIX = (typeof window.__PROG1_WEBAPP_PREFIX__ === 'string') ? window.__PROG1_WEBAPP_PREFIX__ : '';
  const withWebappPrefix = (p) => {
    const s = String(p || '');
    if (!s) return s;
    if (!WEBAPP_PREFIX) return s;
    if (/^(https?:|data:|blob:|\/)/i.test(s)) return s;
    if (s.startsWith(WEBAPP_PREFIX)) return s;
    return WEBAPP_PREFIX + (s.startsWith('./') ? s.slice(2) : s);
  };

  const ensureDataOrShowError = Prog1.data.ensureDataOrShowError;

  let DATA = null;

  const labelOf = (s) => (s && s.displayLabel ? s.displayLabel : ('第' + (s ? s.no : '') + '回'));
  const keyOf = (s) => String(s ? s.no : '');
  const mdKeyFromNo = (no) => (Number(no) === -1 ? 'sessionPre' : `session${String(Number(no)).padStart(2, '0')}`);

  const extractFirstHeading = (mdText) => {
    const lines = String(mdText || '').replace(/\r\n/g, '\n').split('\n');
    let inFence = false;
    for (const line0 of lines) {
      const line = String(line0 || '');
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        continue;
      }
      if (inFence) continue;
      if (/^\s*:::\s*set\b/.test(line)) continue;
      const m = line.match(/^\s*#\s+(.+?)\s*$/);
      if (m) return m[1].trim();
    }
    return '';
  };

  const normalizeHeadingTitle = (raw, no) => {
    let t = String(raw || '').trim();
    if (!t) return '';
    if (Number(no) === -1) {
      t = t.replace(/^準備回\s*[：:]\s*/, '');
      return t.trim();
    }
    t = t.replace(/^第\s*[0-9０-９]+\+?\s*回\s*[：:]\s*/, '');
    return t.trim();
  };

  const syncSessionTitlesFromMd = (sessions) => {
    const bundle = (window.MD_BUNDLE || window.__MD_BUNDLE__ || {});
    if (!bundle || typeof bundle !== 'object') return;
    if (!Array.isArray(sessions)) return;
    sessions.forEach((s) => {
      if (!s || typeof s !== 'object') return;
      const key = mdKeyFromNo(s.no);
      const md = bundle[key];
      if (typeof md !== 'string' || !md.trim()) return;
      const h = extractFirstHeading(md);
      const t = normalizeHeadingTitle(h, s.no);
      if (t) s.title = t;
    });
  };

  class App {
    constructor() {
      // Cache elements (avoid repeated DOM lookups)
      this.el = {
        sessionList: $('sessionList'),
        sessionTitle: $('sessionTitle'),
        textbookRefs: $('textbookRefs'),
        themeToggle: $('themeToggle'),
        heroFocusTitle: $('heroFocusTitle'),
        heroFocusDesc: $('heroFocusDesc'),
        heroOpenCurrent: $('heroOpenCurrent'),
        heroResetProgress: $('heroResetProgress'),
        heroSessionSelect: $('heroSessionSelect'),
        heroPrevSession: $('heroPrevSession'),
        heroNextSession: $('heroNextSession'),
        dashCurrentSessionValue: $('dashCurrentSessionValue'),
        dashSessionsValue: $('dashSessionsValue'),
        dashSlidesValue: $('dashSlidesValue'),
        dashQuizzesValue: $('dashQuizzesValue'),
        dashSamplesValue: $('dashSamplesValue'),

        // Tabs
        tabSlides: $('tabSlides'),
        tabQuiz: $('tabQuiz'),
        tabSample: $('tabSample'),

        viewSlides: $('viewSlides'),
        viewQuiz: $('viewQuiz'),
        viewSample: $('viewSample'),

        // Slides
        slideImg: $('slideImg'),
        slideMd: $('slideMd'),
        slideCounter: $('slideCounter'),
        prevSlide: $('prevSlide'),
        nextSlide: $('nextSlide'),
        slideFullscreen: $('slideFullscreen'),

        // Quiz
        quizBox: $('quizBox'),
        quizResult: $('quizResult'),
        gradeQuiz: $('gradeQuiz'),

        // Sample
        sampleSelect: $('sampleSelect'),
        sampleCode: $('sampleCode'),
        sampleOut: $('sampleOut'),
        sampleStepInfo: $('sampleStepInfo'),
        varsTable: $('varsTable'),
        sampleStep: $('sampleStep'),
        sampleRun: $('sampleRun'),
        sampleReset: $('sampleReset'),
        samplePlay: $('samplePlay'),
        sampleCopy: $('sampleCopy'),
        sampleCopyMsg: $('sampleCopyMsg'),
        secretNotice: $('secretNotice'),
      };

      this.state = {
        session: null,
        slideIdx: 0,
        slideMode: 'none', // 'png' | 'md' | 'none'
        md: { slides: [], idx: 0, cache: new Map(), loadedNo: null },
        traceIdx: -1,
        activeTab: 'slides',
        currentCode: '',
        isPlaying: false,
        playInterval: null,
        bpMap: {},
        revealedAnswer: false,
      };

      // Ensure marked is configured to support fenced code blocks and language classes
      try {
        if (window.marked && window.marked.setOptions) {
          window.marked.setOptions({
            gfm: true,
            breaks: false,
            langPrefix: 'language-',
          });
        }
      } catch (_) {}

      // Pre-sort sessions
      syncSessionTitlesFromMd(DATA.sessions);
      this.sessions = [...DATA.sessions].sort((a, b) => a.no - b.no);

      this.renderSessionList();
      this.renderHeroSessionSelect();
      this.bindEvents();
      this.initTheme();

      // Select first session (smallest no)
      this.selectSession(this.sessions[0]?.id);
    }

    // -------------------------
    // Session list / navigation
    // -------------------------
		    renderSessionList() {
		      const list = this.el.sessionList;
		      if (!list) return;
	      list.innerHTML = '';
	      const groupBreaks = new Set([0, 5, 8, 11, 14]);

	      for (const s of this.sessions) {
	        const li = document.createElement('li');
	        const btn = document.createElement('button');
	        btn.textContent = `${labelOf(s)}：${s.title}`;
        btn.dataset.sid = s.id;
	        btn.addEventListener('click', () => this.selectSession(s.id));
	        li.appendChild(btn);
	        list.appendChild(li);

	        if (groupBreaks.has(Number(s.no))) {
	          const divider = document.createElement('li');
	          divider.className = 'session-divider';
	          divider.setAttribute('aria-hidden', 'true');
	          list.appendChild(divider);
	        }
		      }
		    }

    renderHeroSessionSelect() {
      const select = this.el.heroSessionSelect;
      if (!select) return;

      const currentId = this.state.session?.id || this.sessions[0]?.id || '';
      select.innerHTML = '';

      for (const s of this.sessions) {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `${labelOf(s)}：${s.title}`;
        select.appendChild(opt);
      }

      if (currentId) select.value = currentId;
      this.updateHeroSessionNav();
    }

    getCurrentSessionIndex() {
      const currentId = this.state.session?.id;
      return this.sessions.findIndex((s) => s.id === currentId);
    }

    updateHeroSessionNav() {
      const idx = this.getCurrentSessionIndex();
      const hasSessions = this.sessions.length > 0;
      const atStart = !hasSessions || idx <= 0;
      const atEnd = !hasSessions || idx < 0 || idx >= this.sessions.length - 1;

      if (this.el.heroSessionSelect && idx >= 0) {
        this.el.heroSessionSelect.value = this.state.session.id;
      }
      if (this.el.heroPrevSession) this.el.heroPrevSession.disabled = atStart;
      if (this.el.heroNextSession) this.el.heroNextSession.disabled = atEnd;
    }

    selectAdjacentSession(delta) {
      const idx = this.getCurrentSessionIndex();
      if (idx < 0) return;
      const nextIdx = clamp(idx + delta, 0, this.sessions.length - 1);
      if (nextIdx === idx) return;
      this.selectSession(this.sessions[nextIdx].id);
    }

    highlightSession() {
      const list = this.el.sessionList;
      if (list) {
        for (const btn of list.querySelectorAll('button')) {
          btn.classList.toggle('active', btn.dataset.sid === this.state.session?.id);
        }
      }
      this.updateHeroSessionNav();
    }

    selectSession(sessionId) {
      const s = this.sessions.find((x) => x.id === sessionId) || this.sessions[0];
      this.state.session = s;
      this.state.slideIdx = 0;
      this.state.md.idx = 0;
      this.state.traceIdx = -1;
      this.stopSamplePlay();

      this.highlightSession();
      this.renderAll();
      this.setTab('slides');
    }

    tabLabel(name) {
      if (name === 'quiz') return '確認テスト';
      if (name === 'sample') return 'サンプル実験';
      return 'スライド';
    }

    scrollSessionTop() {
      const target = document.querySelector('.session-head') || this.el.viewSlides;
      if (!target || typeof target.scrollIntoView !== 'function') return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    getCurrentSlideCount() {
      const s = this.state.session;
      if (!s) return 0;
      if (this.state.slideMode === 'md') return this.state.md.slides?.length || 0;
      if (this.state.slideMode === 'png') return Array.isArray(s.slides) ? s.slides.length : 0;
      return Array.isArray(s.slides) ? s.slides.length : 0;
    }

    getCurrentQuizCount() {
      const s = this.state.session;
      return ((DATA.quizzes && DATA.quizzes[keyOf(s)]) || []).length;
    }

    currentSessionMetricValue() {
      const no = Number(this.state.session?.no);
      if (no === -1) return 'Pre';
      if (!Number.isFinite(no)) return '-';
      return String(no);
    }

    getCurrentSampleCount() {
      const samples = this.getSamples();
      return Array.isArray(samples) ? samples.length : 0;
    }

    renderHeroOverview() {
      const s = this.state.session;
      const slideCount = this.getCurrentSlideCount();
      const quizCount = this.getCurrentQuizCount();
      const sampleCount = this.getCurrentSampleCount();
      const totalSessions = Array.isArray(this.sessions) ? this.sessions.length : 0;
      const activeTabLabel = this.tabLabel(this.state.activeTab);
      const textbookCount = Array.isArray(s?.textbook_refs) ? s.textbook_refs.length : 0;

      if (this.el.dashCurrentSessionValue) this.el.dashCurrentSessionValue.textContent = this.currentSessionMetricValue();
      if (this.el.dashSessionsValue) this.el.dashSessionsValue.textContent = String(totalSessions);
      if (this.el.dashSlidesValue) this.el.dashSlidesValue.textContent = String(slideCount);
      if (this.el.dashQuizzesValue) this.el.dashQuizzesValue.textContent = String(quizCount);
      if (this.el.dashSamplesValue) this.el.dashSamplesValue.textContent = String(sampleCount);

      if (!s) return;

      if (this.el.heroFocusTitle) {
        this.el.heroFocusTitle.textContent = `現在地: ${labelOf(s)} ${s.title}`;
      }
      if (this.el.heroFocusDesc) {
        let desc = `${activeTabLabel}を表示中です。`;
        desc += ' この回のスライド、確認テスト、サンプル実験の件数は下の dashboard にまとめています。';
        if (textbookCount > 0) desc += ` 教科書の関連項目は ${textbookCount} 件です。`;
        this.el.heroFocusDesc.textContent = desc;
      }
    }

    // -------------------------
    // Slides navigation helper
    // -------------------------
    prevSlide() {
      if (this.state.slideMode === 'md') {
        this.state.md.idx = Math.max(0, this.state.md.idx - 1);
      } else {
        this.state.slideIdx--;
      }
      this.renderSlides();
    }

    nextSlide() {
      if (this.state.slideMode === 'md') {
        const last = Math.max(0, (this.state.md.slides?.length || 1) - 1);
        this.state.md.idx = Math.min(last, this.state.md.idx + 1);
      } else {
        this.state.slideIdx++;
      }
      this.renderSlides();
    }

    // -------------------------
    // Rendering
    // -------------------------
    renderAll() {
      const s = this.state.session;
      if (!s) return;

      if (this.el.sessionTitle) {
        this.el.sessionTitle.textContent = `${labelOf(s)}：${s.title}`;
      }

      if (this.el.secretNotice) {
        if (this.isExplainSession(s)) {
          const kNo = (s.no === 5 ? 1 : s.no === 8 ? 2 : s.no === 11 ? 3 : s.no === 14 ? 4 : 0);
          this.el.secretNotice.innerHTML = `<span>🔒 この回は <b>課題 ${kNo}</b> の解説回です。詳細な解答・解説は <a href="secret/index.html">こちら（制限エリア）</a> から確認できます。</span>`;
          this.el.secretNotice.classList.remove('hidden');
        } else {
          this.el.secretNotice.classList.add('hidden');
        }
      }

      this.renderTextbookRefs();
      this.renderSlides();
      this.renderQuiz();
      this.renderSample();
      this.renderHeroOverview();
    }

    renderTextbookRefs() {
      const box = this.el.textbookRefs;
      const s = this.state.session;
      if (!box) return;

      const tb = DATA.textbook;
      const refs = s?.textbook_refs || [];
      if (!tb || !Array.isArray(refs) || refs.length === 0) {
        box.innerHTML = '';
        return;
      }

      const tocMap = new Map((tb.toc || []).map((x) => [x.id, x]));
      const items = refs.map((id) => tocMap.get(id)).filter(Boolean);

      if (items.length === 0) {
        box.innerHTML = '';
        return;
      }

      const listHtml = items.map((it) => `<li>${escapeHtml(it.title)}</li>`).join('');
      box.innerHTML = `
        <details class="accordion">
          <summary>教科書（関連項目）</summary>
          <div class="accordion-body">
            <div class="small" style="margin:4px 0 8px;">
              ${escapeHtml(tb.title)}
              ${tb.url ? `<a href="${tb.url}" target="_blank" rel="noopener" class="small">（出版社ページ）</a>` : ''}
            </div>
            <ul class="toclist">${listHtml}</ul>
          </div>
        </details>
      `;
    }

    async renderSlides() {
      const img = this.el.slideImg;
      const mdBox = this.el.slideMd;
      const counter = this.el.slideCounter;
      const s = this.state.session;
      if (!img || !mdBox || !counter || !s) return;

      const no = Number(s.no);
      const pad2 = String(no).padStart(2, '0');

      // Markdown優先（課題回・課題解説回）
      // 4&5, 7&8, 10&11, 13&14 は「課題（仕様・未完成コード）」をスライドタブでMarkdown表示する
      const mdPreferNos = new Set([4, 5, 7, 8, 10, 11, 13, 14, 16]);

      // 1) PNG slides (課題回は現行維持 / 次回も同じPNGを表示)
      const copyFrom = new Map([[5, 4], [8, 7], [11, 10], [14, 13]]);
      let pngSlides = Array.isArray(s.slides) ? s.slides : [];
      if (no === 0) pngSlides = [];
      if (mdPreferNos.has(no)) pngSlides = [];
      if ((!pngSlides || pngSlides.length === 0) && copyFrom.has(no)) {
        const prevNo = copyFrom.get(no);
        const prev = this.sessions.find((x) => Number(x.no) === prevNo);
        pngSlides = Array.isArray(prev?.slides) ? prev.slides : [];
      }

      if (Array.isArray(pngSlides) && pngSlides.length > 0) {
        // PNG mode
        this.state.slideMode = 'png';
        if (this.el.viewSlides) this.el.viewSlides.classList.remove('mode-md');
        mdBox.classList.add('hidden');
        img.classList.remove('hidden');

        this.state.slideIdx = clamp(this.state.slideIdx, 0, pngSlides.length - 1);
        img.src = withWebappPrefix(pngSlides[this.state.slideIdx]);
        img.alt = `slide ${this.state.slideIdx + 1}`;
        counter.textContent = `${this.state.slideIdx + 1} / ${pngSlides.length}`;
        this.renderHeroOverview();

        img.onerror = () => {
          img.removeAttribute('src');
          img.alt = 'スライドPNGの読み込みに失敗しました（パス/同梱漏れの可能性）。';
          counter.textContent = '（読み込み失敗）';
        };
        return;
      }

      // 2) Markdown slides (それ以外の回)
      // Markdownスライド対象（PNGが無い回）
      // 15+（no=16）も Markdown で表示する
      // NOTE: 「準備回」は no=-1 だが、ファイル名は sessionPre に統一する（session-1 は使用しない）
      const mdTargetNos = new Set([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
      if (!mdTargetNos.has(no)) {
        // No PNG + No Markdown target => fallback
        this.state.slideMode = 'none';
        if (this.el.viewSlides) this.el.viewSlides.classList.remove('mode-md');
        img.removeAttribute('src');
        img.alt = 'この回はスライドPNG未登録です。PPTXを参照してください。';
        img.classList.remove('hidden');
        mdBox.classList.add('hidden');
        counter.textContent = '（PNG未登録）';
        this.renderHeroOverview();
        return;
      }

      // Load & cache markdown
      const cacheKey = (no === -1) ? 'sessionPre' : `session${pad2}`;
      if (!this.state.md.cache.has(cacheKey)) {
        // If opened via file://, fetch() is blocked by browser CORS.
        // Always prefer bundled markdown (md_bundle.js). Support both MD_BUNDLE and legacy __MD_BUNDLE__.
        const BUNDLE = (window.MD_BUNDLE || window.__MD_BUNDLE__ || {});
        const bundled0 = (BUNDLE && BUNDLE[cacheKey]) ? String(BUNDLE[cacheKey]) : '';

        if (location.protocol === 'file:') {
          if (bundled0.trim()) {
            const parts = bundled0
              .replace(/\r\n/g, '\n')
              .split(/^---\s*$/m)
              .map((x) => x.trim())
              .filter((x) => x.length > 0);
            this.state.md.cache.set(cacheKey, parts.length ? parts : ['（Markdownが空です）']);
          } else {
            this.state.md.cache.set(cacheKey, [`（Markdown読み込み失敗：assets/md/${cacheKey}.md を読み込めませんでした。\n\n原因：file:// で開いているためブラウザが assets/md/*.md の fetch を禁止しています。\n対処：同梱の md_bundle.js を再生成してから開くか、ローカルサーバ（プレビュー）で開いてください。）`]);
          }
        } else {
try {
          const text = await readTextFile(withWebappPrefix(`assets/md/${cacheKey}.md`));
          const parts = text
            .replace(/\r\n/g, '\n')
            .split(/^---\s*$/m)
            .map((x) => x.trim())
            .filter((x) => x.length > 0);
          this.state.md.cache.set(cacheKey, parts.length ? parts : ['（Markdownが空です）']);
        } catch (e) {
          // Fallback: bundled markdown (for browsers that block file:// fetch)
          const bundled = (BUNDLE && BUNDLE[cacheKey]) ? String(BUNDLE[cacheKey]) : '';
          if (bundled.trim()) {
            const parts = bundled
              .replace(/\r\n/g, '\n')
              .split(/^---\s*$/m)
              .map((x) => x.trim())
              .filter((x) => x.length > 0);
            this.state.md.cache.set(cacheKey, parts.length ? parts : ['（Markdownが空です）']);
          } else {
            this.state.md.cache.set(cacheKey, [`（Markdown読み込み失敗：assets/md/${cacheKey}.md を読み込めませんでした。

対処：ZIPを展開後、index.html を開いているか確認してください。
補足：一部ブラウザは file:// での読み込み（fetch/XHR）を制限します。
回避策：同梱の md_bundle.js（埋め込み版）が見つかれば自動で表示しますが、見つかりませんでした。）`]);
          }
        }
        }

      }

      this.state.slideMode = 'md';
      if (this.el.viewSlides) this.el.viewSlides.classList.add('mode-md');
      this.state.md.slides = this.state.md.cache.get(cacheKey) || [];
      this.state.md.idx = clamp(this.state.md.idx, 0, Math.max(0, this.state.md.slides.length - 1));
      this.state.md.loadedNo = no;

      // Render
const rawMd = this.state.md.slides[this.state.md.idx] || '';
      const _tmp = this.extractSetDirectives(rawMd);
      const mdSrc = _tmp.md;
      const directives = _tmp.directives;

let html = '';
try{
  html = (window.marked && window.marked.parse) ? window.marked.parse(mdSrc) : escapeHtml(mdSrc).split('\n').join('<br>');
}catch(e){
  console.error('Markdown parse failed:', e);
  html = escapeHtml(mdSrc).split('\n').join('<br>');
}
mdBox.innerHTML = html;

      // Resolve markdown image paths in a predictable way (serverless-friendly).
      // Supported:
      //   ![](img:foo.png)  -> assets/img/sessionXX/foo.png
      //   ![](foo.png)      -> assets/img/sessionXX/foo.png
      //   ![](sub/fig.png)  -> assets/img/sessionXX/sub/fig.png
      // Absolute/URL/data are left as-is.
      this.resolveMdAssets(no, mdBox);
this.applySlideBackground(mdBox, no, directives);
this.applyLayout(mdBox, directives);
await this.renderMermaid(mdBox);

      img.classList.add('hidden');
      mdBox.classList.remove('hidden');
      counter.textContent = `${this.state.md.idx + 1} / ${this.state.md.slides.length}`;
      this.renderHeroOverview();
    }


    resolveMdAssets(no, mdBox) {
      try {
        const base = (no === -1)
          ? withWebappPrefix('assets/img/sessionPre/')
          : withWebappPrefix(`assets/img/session${String(no).padStart(2, '0')}/`);

        const imgs = mdBox.querySelectorAll('img');
        imgs.forEach((img) => {
          let raw = normalizeDash((img.getAttribute('src') || '').trim());
          if (!raw) return;

          // Keep absolute/remote/data/blob paths
          if (/^(https?:|data:|blob:|\/)/i.test(raw)) return;

          // Keep explicit internal paths (e.g. assets/img/...) as-is
          if (raw.startsWith('assets/') || raw.startsWith('./assets/')) {
            img.setAttribute('src', withWebappPrefix(raw));
            return;
          }

          // img: shorthand
          if (raw.startsWith('img:')) {
            img.setAttribute('src', base + raw.slice(4));
            return;
          }

          // If already authored as ../... keep it
          if (raw.startsWith('../')) return;

          // Default: treat as relative within the session folder
          const cleaned = raw.startsWith('./') ? raw.slice(2) : raw;
          img.setAttribute('src', base + cleaned);
        });
      } catch (_) {}
    }

// -------------------------
// Markdown directives (:::set ...)
// -------------------------
extractSetDirectives(mdSrc) {
  const directives = {};
  const lines = String(mdSrc || '').replace(/\r\n/g,'\n').split('\n');
  const out = [];
  for (let i=0;i<lines.length;i++){
    const line = lines[i];
    const m = line.match(/^\s*:::\s*set\s+(.*)$/);
    if (!m){ out.push(line); continue; }
    const body = m[1].trim();
    if (!body) continue;
    // tokens like key=value or key=val,val or bare tokens ignored
    body.split(/\s+/).forEach(tok=>{
      let sep = tok.indexOf('=');
      if (sep <= 0) sep = tok.indexOf(':'); // allow key:value
      if (sep<=0) return;
      const k = tok.slice(0,sep).trim();
      let v = tok.slice(sep+1).trim();
      v = normalizeDash(v);
      directives[k] = v;
    });
  }
  return { md: out.join('\n').trim(), directives };
}

applySlideBackground(mdBox, no, directives) {
  const bg = directives.bg;
  if (!bg) {
    mdBox.style.backgroundImage = '';
    mdBox.style.backgroundSize = '';
    mdBox.style.backgroundPosition = '';
    mdBox.style.backgroundRepeat = '';
    return;
  }
  // Resolve relative bg (img: / relative) similarly to images
  let url = bg;
  const base = (no === -1)
    ? withWebappPrefix('assets/img/sessionPre/')
    : withWebappPrefix(`assets/img/session${String(no).padStart(2,'0')}/`);
  if (url.startsWith('img:')) url = base + url.slice(4);
  if (!/^(https?:|data:|blob:|\/)/i.test(url) && !(url.startsWith('assets/') || url.startsWith('./assets/')) && !url.startsWith('../')) {
    url = base + (url.startsWith('./') ? url.slice(2) : url);
  }
  mdBox.style.backgroundImage = `url("${url}")`;
  mdBox.style.backgroundSize = 'cover';
  mdBox.style.backgroundPosition = 'center';
  mdBox.style.backgroundRepeat = 'no-repeat';
}

applyLayout(mdBox, directives) {
  // Backward-compatible aliases:
  //   :::set layout=2col
  //   :::set cols=2
  //   :::set col=2
  //   :::set twoCol=true
  let layout = (directives.layout || '').toLowerCase();
  const cols = String(directives.cols || directives.col || '').toLowerCase();
  const twoCol = String(directives.twoCol || directives.twocol || '').toLowerCase();
  if (!layout) {
    if (cols === '2' || cols === '2col') layout = '2col';
    else if (twoCol === 'true' || twoCol === '1' || twoCol === 'yes') layout = '2col';
  }
  if (layout !== '2col') return;

  const side = (directives.side || 'right').toLowerCase();
  const wRaw = directives.w || '40';
  const gapRaw = directives.gap || '16';
  const fit = (directives.fit || 'contain').toLowerCase();
  const opacity = directives.opacity || '1';

  // Find first image in content
  const firstImg = mdBox.querySelector('img');
  if (!firstImg) return;

  // Build 2col structure
  const container = document.createElement('div');
  container.className = 'md-2col';

  const colA = document.createElement('div');
  colA.className = 'md-col md-col-text';
  const colB = document.createElement('div');
  colB.className = 'md-col md-col-fig';

  // Width
  const w = /px$|%$|vw$|vh$/.test(wRaw) ? wRaw : `${wRaw}%`;
  colB.style.flex = `0 0 ${w}`;
  colB.style.maxWidth = w;

  const gap = /px$/.test(gapRaw) ? gapRaw : `${gapRaw}px`;
  container.style.gap = gap;

  // Move all existing nodes into text col, then extract first image into fig col
  while (mdBox.firstChild) colA.appendChild(mdBox.firstChild);

  // Move first image (and its nearest paragraph wrapper if exists)
  let imgWrapper = firstImg.closest('p');
  if (!imgWrapper || imgWrapper.querySelectorAll('img').length !== 1) {
    imgWrapper = firstImg;
  }
  // Remove wrapper from text column
  if (imgWrapper.parentNode) imgWrapper.parentNode.removeChild(imgWrapper);

  // Prepare image element
  const imgEl = (imgWrapper.tagName && imgWrapper.tagName.toLowerCase() === 'img') ? imgWrapper : imgWrapper.querySelector('img');
  if (imgEl) {
    imgEl.style.maxWidth = '100%';
    imgEl.style.height = 'auto';
    imgEl.style.objectFit = (fit === 'cover') ? 'cover' : 'contain';
    imgEl.style.opacity = String(opacity);
  }
  colB.appendChild(imgWrapper);

  if (side === 'left') {
    container.appendChild(colB);
    container.appendChild(colA);
  } else {
    container.appendChild(colA);
    container.appendChild(colB);
  }

  mdBox.appendChild(container);
}


async renderMermaid(mdBox) {
  if (!mdBox) return;
  if (!window.mermaid) return;

  const candidates = new Set();

  mdBox.querySelectorAll('pre > code.language-mermaid, pre > code.lang-mermaid, pre.language-mermaid > code, pre.lang-mermaid > code')
    .forEach(n => candidates.add(n));
  mdBox.querySelectorAll('code.mermaid, code[class*="language-mermaid"], code[class*="lang-mermaid"], code[class*=" mermaid"]')
    .forEach(n => candidates.add(n));

  // Fallback: some markdown parsers emit plain <pre><code> without language class.
  const isMermaidText = (t) => {
    const s = String(t || '').trimStart();
    return /^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|stateDiagram-v2|erDiagram|journey|gantt|pie|mindmap|timeline)\b/i.test(s);
  };
  mdBox.querySelectorAll('pre > code').forEach((code) => {
    if (candidates.has(code)) return;
    if (isMermaidText(code.textContent || '')) candidates.add(code);
  });

  if (candidates.size === 0) return;

  const theme = (this.state?.ui?.theme === 'dark') ? 'dark' : 'default';
  try {
    window.mermaid.initialize({ startOnLoad:false, securityLevel:'loose', theme });
  } catch (_) {}

  for (const codeEl of Array.from(candidates)) {
    const pre = codeEl.closest('pre');
    const src = (codeEl.textContent || '').trim();
    if (!src) continue;

    const div = document.createElement('div');
    div.className = 'mermaid';
    div.textContent = src;

    if (pre && pre.parentElement) pre.replaceWith(div);
    else if (codeEl.parentElement) codeEl.parentElement.replaceWith(div);
  }

  try {
    if (window.mermaid.run) await window.mermaid.run({ nodes: mdBox.querySelectorAll('.mermaid') });
    else if (window.mermaid.init) window.mermaid.init(undefined, mdBox.querySelectorAll('.mermaid'));
  } catch (e) {
    console.warn('Mermaid render failed:', e);
  }
}



    renderQuiz() {
      // Quiz feature removed
    }


    varsToTable(vars) {
      const entries = Object.entries(vars || {});
      if (entries.length === 0) return '<div style="padding:20px;color:var(--muted);font-size:0.85rem;">（表示する変数がありません）</div>';

      let html = '<table><thead><tr><th>変数 (Name)</th><th>値 (Value)</th></tr></thead><tbody>';
      for (const [k, v] of entries) {
        html += `<tr><td><span class="var-name">${escapeHtml(k)}</span></td><td><span class="var-val">${escapeHtml(v)}</span></td></tr>`;
      }
      html += '</tbody></table>';
      return html;
    }
    getSamples() {
      const s = this.state.session;
      const all = (DATA.samples && DATA.samples[keyOf(s)]) || [];

      // 解説回（5/8/11/14）はサンプル実験に「解答例」も追加して扱う。
      if (this.isExplainSession(s)) {
        const base = all.filter((x) => !(String(x.title || '').includes('解答例')));
        const answers = this.getAnswerSamplesForSampleTab();
        return base.concat(answers);
      }
      return all;
    }

    getAnswerSamplesForSampleTab() {
      const s = this.state.session;
      if (!this.isExplainSession(s)) return [];
      // まず answers を優先（存在しなければ title に「解答例」を含むサンプルを拾う）
      const fromAnswers = (DATA.answers && DATA.answers[keyOf(s)]) || null;
      if (Array.isArray(fromAnswers) && fromAnswers.length) return fromAnswers;

      const all = (DATA.samples && DATA.samples[keyOf(s)]) || [];
      return all.filter((x) => String(x.title || '').includes('解答例'));
    }


    isExplainSession(s) {
      const n = Number(s?.no);
      return n === 5 || n === 8 || n === 11 || n === 14;
    }

    isTaskSession(s) {
      const n = Number(s?.no);
      return n === 4 || n === 7 || n === 10 || n === 13;
    }

    buildBreakpointMap(code) {
      const map = {};
      const lines = String(code || '').split('\n');
      lines.forEach((line, i) => {
        const match = line.match(/\/\/\s*@(bp|breakpoint)\s+(.+)$/);
        if (match) {
          const label = match[2].trim();
          map[label] = i;
        }
      });
      return map;
    }

    getSelectedSample() {
      const samples = this.getSamples();
      const idx = Number(this.el.sampleSelect?.value || 0);
      return samples[idx] || samples[0] || null;
    }


    renderSample() {
      const sel = this.el.sampleSelect;
      const code = this.el.sampleCode;
      if (!sel || !code) return;

      const samples = this.getSamples();
      sel.innerHTML = '';

      for (let i = 0; i < samples.length; i++) {
        const opt = document.createElement('option');
        opt.value = String(i);
        opt.textContent = samples[i].title || `サンプル${i + 1}`;
        sel.appendChild(opt);
      }

      // reset runtime
      this.state.traceIdx = -1;
      // show first
      this.state.revealedAnswer = false;
      this.showSample();
    }

	    showSample() {
	      const sample = this.getSelectedSample();

      // サンプル実験タブではシミュレーションUIは使わない
      // Sim tab removed

      if (!sample) {
        if (this.el.sampleCode) this.el.sampleCode.textContent = '';
        this.renderSampleTrace(null);
        return;
      }

      // Split code into lines for highlighting
      this.state.currentCode = String(sample.code || '');
      this.state.bpMap = this.buildBreakpointMap(this.state.currentCode);
      const lines = this.state.currentCode.split('\n');
      this.el.sampleCode.innerHTML = '';
      lines.forEach((line, i) => {
        const div = document.createElement('div');
        div.className = 'code-line-wrapper';
        div.dataset.line = String(i);
        div.textContent = line || ' ';
        this.el.sampleCode.appendChild(div);
      });

      this.renderSampleTrace(sample);

      // Reveal logic for Answer samples in Explanation sessions
      const isAnswer = String(sample.title || '').includes('解答例');
      const shouldHide = this.isExplainSession(this.state.session) && isAnswer;

      if (shouldHide && !this.state.revealedAnswer) {
        const overlay = document.createElement('div');
        overlay.className = 'answer-reveal-overlay';
        overlay.innerHTML = `
          <div class="reveal-content">
            <p>このプログラムの解答はスライドに記載されています。<br>自分で考えてから確認しましょう。</p>
            <button class="reveal-button">解答を表示して動かす</button>
          </div>
        `;
        overlay.querySelector('.reveal-button').onclick = () => {
          overlay.remove();
          this.state.revealedAnswer = true;
        };
        // Position relative for overlay
        this.el.sampleCode.style.position = 'relative';
        this.el.sampleCode.appendChild(overlay);
      }
    }

	    updateSampleControls(sample, trace) {
	      const readOnlySample = this.isTaskSession(this.state.session);
	      const traceList = Array.isArray(trace) ? trace : [];
	      const hasTrace = traceList.length > 0;
	      const lastIdx = traceList.length - 1;
	      const hasProgress = this.state.traceIdx >= 0;
	      const atEnd = hasTrace ? (this.state.traceIdx >= lastIdx) : true;
	      const hasCode = !!String(sample?.code || '').trim();

	      if (this.el.sampleStep) this.el.sampleStep.disabled = readOnlySample || !hasTrace || atEnd;
	      if (this.el.sampleRun) this.el.sampleRun.disabled = readOnlySample || !hasTrace || atEnd;
	      if (this.el.sampleReset) this.el.sampleReset.disabled = readOnlySample || !hasProgress;
	      if (this.el.sampleCopy) this.el.sampleCopy.disabled = !hasCode;
	    }

	    renderSampleTrace(sample, opts = {}) {
	      if (!this.el.sampleOut || !this.el.varsTable) return;

      // Normal trace mode
      const trace = sample?.trace || [];
      let step;
      if (this.state.traceIdx < 0) {
        const init = sample?.init || { vars: {}, arrays: {} };
        step = { stdout: '', vars: init.vars || {}, arrays: init.arrays || {} };
      } else {
        const idx = clamp(this.state.traceIdx, 0, Math.max(0, trace.length - 1));
        step = trace[idx] || { stdout: '', vars: {} };
      }
      // Output area
      // opts.skipOut: do not touch output (used by "append output" samples)
      if (!opts.skipOut) {
        // Some traces store cumulative stdout, others store per-step stdout.
        // Always render output cumulatively up to the current step.
        const traceArr = Array.isArray(sample?.trace) ? sample.trace : [];
        const upto = clamp(this.state.traceIdx, 0, Math.max(0, traceArr.length - 1));
        const take = traceArr.slice(0, upto + 1);
        const isCumulative = (arr) => {
          for (let i = 1; i < arr.length; i++) {
            const prev = String(arr[i - 1]?.stdout || '');
            const cur = String(arr[i]?.stdout || '');
            if (!cur.startsWith(prev)) return false;
          }
          return true;
        };
        const outText = (this.state.traceIdx < 0) ? '' : (
          isCumulative(take)
            ? String((take[take.length - 1] || {}).stdout || '')
            : take
                .map((x) => {
                  const s = String((x && x.stdout) || '');
                  return s && !s.endsWith('\n') ? `${s}\n` : s;
                })
                .join('')
        );
        this.el.sampleOut.textContent = outText;
        this.el.sampleOut.scrollTop = this.el.sampleOut.scrollHeight;
      }

      // Optional: show step description (trace.at/event/note)
      // Always show step index so users can see progress even if no metadata exists.
      if (this.el.sampleStepInfo) {
        const at = (step && (step.at || step.event || step.note)) ? String(step.at || step.event || step.note) : '';
        const total = Math.max(1, trace.length);
        if (this.state.traceIdx < 0) {
          this.el.sampleStepInfo.textContent = `Step 0/${total}`;
        } else {
          const shownIdx = clamp(this.state.traceIdx, 0, total - 1);
          this.el.sampleStepInfo.textContent = `Step ${shownIdx + 1}/${total}` + (at ? `: ${at}` : '');
        }
	      }
      this.el.varsTable.innerHTML = this.varsToTable(step.vars || {});
      
      // Line highlighting
      if (this.el.sampleCode) {
        const atLabel = (step && (step.at || step.event || step.note)) ? String(step.at || step.event || step.note) : '';
        let lineNo = (step && step.line != null) ? Number(step.line) : -1;
        if (lineNo < 0 && atLabel && this.state.bpMap[atLabel] != null) {
          lineNo = this.state.bpMap[atLabel];
        }

        const wrappers = this.el.sampleCode.querySelectorAll('.code-line-wrapper');
        wrappers.forEach((w, i) => {
          const isActive = (i === lineNo);
          w.classList.toggle('active', isActive);
          if (isActive) w.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });
      }

      this.updateSampleControls(sample, trace);

	    }
    // -------------------------
    // Tabs
    // -------------------------
    setTab(name) {
      const map = {
        slides: { tab: this.el.tabSlides, view: this.el.viewSlides },
        sample: { tab: this.el.tabSample, view: this.el.viewSample },
      };

      for (const k of Object.keys(map)) {
        const isActive = k === name;
        map[k].tab?.classList.toggle('active', isActive);
        map[k].view?.classList.toggle('hidden', !isActive);
      }
      this.stopSamplePlay();
      this.state.activeTab = name;
      this.renderHeroOverview();
    }

    // -------------------------
    // Events
    // -------------------------
initTheme() {
  const saved = (localStorage.getItem('prog1_theme') || '').trim();
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = (saved === 'dark' || saved === 'light') ? saved : (prefersDark ? 'dark' : 'light');
  this.state.ui = this.state.ui || {};
  this.state.ui.theme = theme;
  this.applyTheme(theme);
  this.updateThemeButton();
}

applyTheme(theme) {
  const t = (theme === 'dark') ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem('prog1_theme', t); } catch(_) {}
}

updateThemeButton() {
  const btn = this.el.themeToggle;
  if (!btn) return;
  const t = this.state?.ui?.theme || 'light';
  if (t === 'dark') {
    btn.textContent = '☀️';
    btn.title = 'ライトモードへ';
    btn.setAttribute('aria-label','ライトモードへ');
  } else {
    btn.textContent = '🌙';
    btn.title = 'ダークモードへ';
    btn.setAttribute('aria-label','ダークモードへ');
  }
}

toggleTheme() {
  const cur = this.state?.ui?.theme || 'light';
  const next = (cur === 'dark') ? 'light' : 'dark';
  this.state.ui.theme = next;
  this.applyTheme(next);
  this.updateThemeButton();
  if (this.state.slideMode === 'md') this.renderSlides();
}

	bindEvents() {
	      this.el.heroOpenCurrent?.addEventListener('click', () => {
	        this.setTab('slides');
	        this.scrollSessionTop();
	      });
	      this.el.heroResetProgress?.addEventListener('click', () => {
	        this.selectSession(this.sessions[0]?.id);
	        try {
	          window.scrollTo({ top: 0, behavior: 'smooth' });
	        } catch (_) {}
	      });
	      this.el.heroSessionSelect?.addEventListener('change', (ev) => {
	        const target = (ev && ev.target) ? ev.target : null;
	        const value = String(target && target.value ? target.value : '');
	        if (value) this.selectSession(value);
	      });
	      this.el.heroPrevSession?.addEventListener('click', () => this.selectAdjacentSession(-1));
	      this.el.heroNextSession?.addEventListener('click', () => this.selectAdjacentSession(1));
	      this.el.themeToggle?.addEventListener('click', () => this.toggleTheme());

      // Tabs
      this.el.tabSlides?.addEventListener('click', () => this.setTab('slides'));
      this.el.tabSample?.addEventListener('click', () => this.setTab('sample'));

      // Slides navigation
      this.el.prevSlide?.addEventListener('click', () => {
        this.prevSlide();
      });
      this.el.nextSlide?.addEventListener('click', () => {
        this.nextSlide();
      });

      // Keyboard navigation (slides)
      window.addEventListener('keydown', (ev) => {
        // Only when slides view is visible
        if (this.el.viewSlides?.classList.contains('hidden')) return;
        if (ev.key === 'ArrowLeft') { ev.preventDefault(); this.prevSlide(); }
        if (ev.key === 'ArrowRight') { ev.preventDefault(); this.nextSlide(); }
      });

      // Fullscreen (slides)
      this.el.slideFullscreen?.addEventListener('click', () => this.toggleSlideFullscreen());
      document.addEventListener('fullscreenchange', () => this.onFullscreenChange());


      // Sample selection
      this.el.sampleSelect?.addEventListener('change', () => {
        this.state.traceIdx = -1;
        this.showSample();
      });

      // Sample controls
      this.el.sampleStep?.addEventListener('click', () => this.sampleStep());
      this.el.sampleRun?.addEventListener('click', () => this.sampleRun());
      this.el.sampleReset?.addEventListener('click', () => this.sampleReset());
      this.el.samplePlay?.addEventListener('click', () => this.toggleSamplePlay());
      this.el.sampleCopy?.addEventListener('click', async () => {
        const ok = await copyToClipboard(this.state.currentCode || '');
        toast('sampleCopyMsg', ok ? 'コピーしました' : 'コピーに失敗しました');
      });

    }

    gradeQuiz() {
      // Quiz feature removed
    }
    sampleStep() {
      if (this.isTaskSession(this.state.session)) return;
      const sample = this.getSelectedSample();
      if (!sample) return;

      const trace = sample.trace || [];

      // Append-output mode: each click adds one line to the output area
      if (sample.appendOut) {
        const nextIdx = clamp(this.state.traceIdx + 1, -1, trace.length - 1);
        if (nextIdx >= 0 && nextIdx !== this.state.traceIdx) {
          const s = (trace[nextIdx] && trace[nextIdx].stdout != null) ? String(trace[nextIdx].stdout) : '';
          if (s) {
            // stdout typically already ends with \n
            this.el.sampleOut.textContent = (this.el.sampleOut.textContent || '') + s;
            // keep scrolled to bottom
            this.el.sampleOut.scrollTop = this.el.sampleOut.scrollHeight;
          }
        }
        this.state.traceIdx = nextIdx;
        this.renderSampleTrace(sample, { skipOut: true });
        return;
      }

      this.state.traceIdx = clamp(this.state.traceIdx + 1, -1, trace.length - 1);
      this.renderSampleTrace(sample);
      return (this.state.traceIdx >= trace.length - 1);
    }
    sampleRun() {
      if (this.isTaskSession(this.state.session)) return;
      const sample = this.getSelectedSample();
      if (!sample) return;

      const trace = sample.trace || [];

      // Already at the end -> do nothing (prevents repeated last line appends)
      if (trace.length && this.state.traceIdx >= trace.length - 1) {
        this.renderSampleTrace(sample, { skipOut: true });
        return;
      }

      // Append-output mode: append all remaining lines up to the last step
      if (sample.appendOut) {
        const start = clamp(this.state.traceIdx + 1, 0, Math.max(0, trace.length - 1));
        let buf = '';
        for (let i = start; i < trace.length; i++) {
          const s = (trace[i] && trace[i].stdout != null) ? String(trace[i].stdout) : '';
          if (s) buf += s;
        }
        if (buf) {
          this.el.sampleOut.textContent = (this.el.sampleOut.textContent || '') + buf;
          this.el.sampleOut.scrollTop = this.el.sampleOut.scrollHeight;
        }
        this.state.traceIdx = trace.length - 1;
        this.renderSampleTrace(sample, { skipOut: true });
        return;
      }

      this.state.traceIdx = trace.length - 1;
      this.renderSampleTrace(sample);
    }
    sampleReset() {
      if (this.isTaskSession(this.state.session)) return;
      this.stopSamplePlay();
      const sample = this.getSelectedSample();
      if (!sample) return;

      this.state.traceIdx = -1;
      if (this.el.sampleOut) this.el.sampleOut.textContent = '';
      this.renderSampleTrace(sample);
    }

    toggleSamplePlay() {
      if (this.state.isPlaying) {
        this.stopSamplePlay();
      } else {
        this.startSamplePlay();
      }
    }

    startSamplePlay() {
      if (this.isTaskSession(this.state.session)) return;
      const sample = this.getSelectedSample();
      if (!sample || !sample.trace) return;

      this.state.isPlaying = true;
      if (this.el.samplePlay) this.el.samplePlay.textContent = '停止';
      
      this.state.playInterval = setInterval(() => {
        const atEnd = this.sampleStep();
        if (atEnd) {
          this.stopSamplePlay();
        }
      }, 800); // 0.8s step
    }

    stopSamplePlay() {
      this.state.isPlaying = false;
      if (this.el.samplePlay) this.el.samplePlay.textContent = '自動再生';
      if (this.state.playInterval) {
        clearInterval(this.state.playInterval);
        this.state.playInterval = null;
      }
    }

    // -------------------------

    // =========================
    // Slides fullscreen
    // =========================

    toggleSlideFullscreen() {
      const el = this.el.viewSlides || document.getElementById('viewSlides');
      if (!el) return;

      const isFs = !!document.fullscreenElement;
      if (!isFs) {
        const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (req) {
          try { req.call(el); } catch (e) { console.warn('requestFullscreen failed', e); }
        }
      } else {
        const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
        if (exit) {
          try { exit.call(document); } catch (e) { console.warn('exitFullscreen failed', e); }
        }
      }
      // UI class is synced via onFullscreenChange.
    }

    onFullscreenChange() {
      const el = this.el.viewSlides || document.getElementById('viewSlides');
      if (!el) return;
      const isFs = !!document.fullscreenElement;
      el.classList.toggle('fullscreen', isFs);

      // Button label
      if (this.el.slideFullscreen) this.el.slideFullscreen.textContent = isFs ? '戻る' : '全画面';
    }

    // --- Sim tab removed (kept for backward compatibility)
    setSimUiVisible(_flag) {
      // no-op
    }

  }


  // Boot entry used by webapp/app.js
  const boot = async () => {
    DATA = await ensureDataOrShowError();
    if (!DATA) return;
    new App();
  };

  Prog1.main = Prog1.main || {};
  Prog1.main.boot = boot;
})();
