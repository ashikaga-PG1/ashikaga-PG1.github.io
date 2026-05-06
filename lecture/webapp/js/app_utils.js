// app_utils.js
// Shared utilities (serverless / file:// friendly)

(function () {
  'use strict';

  window.Prog1 = window.Prog1 || {};

  // -----------------------------
  // Utilities
  // -----------------------------
  const $ = (id) => document.getElementById(id);

  const escapeHtml = (str) =>
    String(str ?? '').replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[m]));

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const normalizeDash = (s) => String(s ?? '').replace(/[\u2212\u2010\u2011\u2012\u2013\u2014\uFE63\uFF0D]/g, '-');

  const copyToClipboard = async (text) => {
    const t = String(text ?? '');
    if (!t.trim()) return false;

    // Preferred API
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(t);
        return true;
      }
    } catch (_) {}

    // Fallback
    try {
      const ta = document.createElement('textarea');
      ta.value = t;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch (_) {
      return false;
    }
  };

  const toast = (id, msg, ms = 1500) => {
    const el = $(id);
    if (!el) return;
    el.textContent = msg || '';
    if (msg) window.setTimeout(() => (el.textContent = ''), ms);
  };

  // Read text file in "serverless" environments.
  // 1) Try fetch (works on http(s) and some file:// environments)
  // 2) Fallback to hidden iframe + innerText (works on many file:// setups where fetch is blocked)
  const readTextFile = (path) => new Promise((resolve, reject) => {
    try {
      fetch(path)
        .then((res) => res.text().then((t) => ({ status: res.status, ok: res.ok, text: t })))
        .then(({ ok, status, text }) => {
          if ((ok || status === 0) && (text ?? '').trim().length > 0) {
            resolve(text);
          } else {
            throw new Error('fetch_not_ok');
          }
        })
        .catch(() => {
          // iframe fallback
          try {
            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.left = '-9999px';
            iframe.style.top = '-9999px';
            iframe.style.width = '1px';
            iframe.style.height = '1px';
            iframe.setAttribute('aria-hidden', 'true');
            iframe.src = path;

            iframe.onload = () => {
              try {
                const doc = iframe.contentDocument;
                const text = (doc?.body?.innerText || doc?.body?.textContent || '').trim();
                document.body.removeChild(iframe);
                if (text) resolve(text);
                else reject(new Error('iframe_empty'));
              } catch (e) {
                try { document.body.removeChild(iframe); } catch (_) {}
                reject(e);
              }
            };

            iframe.onerror = () => {
              try { document.body.removeChild(iframe); } catch (_) {}
              reject(new Error('iframe_error'));
            };

            document.body.appendChild(iframe);
          } catch (e) {
            reject(e);
          }
        });
    } catch (e) {
      reject(e);
    }
  });

  window.Prog1.util = {
    $, escapeHtml, clamp, normalizeDash,
    copyToClipboard, toast, readTextFile,
  };
})();
