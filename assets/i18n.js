(function () {
  /* ── inject button styles ─────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '.lang-btn {',
    '  background: transparent;',
    '  border: 1px solid currentColor;',
    '  font-size: 11px;',
    '  letter-spacing: 1.5px;',
    '  padding: 3px 9px;',
    '  cursor: pointer;',
    '  margin-left: 12px;',
    '  margin-top: 14px;',
    '  text-transform: uppercase;',
    '  font-family: inherit;',
    '  transition: opacity .2s;',
    '  opacity: .8;',
    '  display: inline-block;',
    '  vertical-align: middle;',
    '}',
    '.lang-btn:hover { opacity: 1; }',
    '.navbar-inverse .lang-btn {',
    '  color: rgba(255,255,255,.9);',
    '  border-color: rgba(255,255,255,.55);',
    '}',
    '.navbar-default .lang-btn {',
    '  color: rgba(50,50,50,.8);',
    '  border-color: rgba(50,50,50,.4);',
    '}',
    '.lang-btn:focus { outline: none; }',
    '@media (max-width: 767px) {',
    '  .lang-btn { margin: 4px 0 8px 15px; }',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  /* ── core helpers ─────────────────────────────────────── */
  var STORAGE_KEY = 'sry_lang';
  var DEFAULT_LANG = 'ko';

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  function saveLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
  }

  function applyTranslations(lang) {
    var t = window.TRANSLATIONS && window.TRANSLATIONS[lang];
    if (!t) return;

    /* innerHTML targets */
    var htmlEls = document.querySelectorAll('[data-i18n-html]');
    for (var i = 0; i < htmlEls.length; i++) {
      var key = htmlEls[i].getAttribute('data-i18n-html');
      if (t[key] !== undefined) htmlEls[i].innerHTML = t[key];
    }

    /* plain text targets */
    var textEls = document.querySelectorAll('[data-i18n]');
    for (var j = 0; j < textEls.length; j++) {
      var k = textEls[j].getAttribute('data-i18n');
      if (t[k] !== undefined) textEls[j].textContent = t[k];
    }

    /* update <html lang=""> */
    document.documentElement.lang = lang;
  }

  function updateButton(lang) {
    var btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = lang === 'ko' ? 'EN' : 'KR';
  }

  /* ── public toggle (called by onclick) ───────────────── */
  window.toggleLang = function () {
    var next = getLang() === 'ko' ? 'en' : 'ko';
    saveLang(next);
    applyTranslations(next);
    updateButton(next);
  };

  /* ── auto-inject toggle button into every navbar ─────── */
  function injectButton() {
    var navList = document.querySelector('.nav.navbar-nav');
    if (!navList) return;

    /* avoid double-injection */
    if (document.getElementById('lang-toggle')) return;

    var li = document.createElement('li');
    var btn = document.createElement('button');
    btn.id = 'lang-toggle';
    btn.className = 'lang-btn';
    btn.setAttribute('onclick', 'toggleLang()');
    btn.setAttribute('aria-label', 'Toggle language');
    li.appendChild(btn);
    navList.appendChild(li);
  }

  /* ── init ─────────────────────────────────────────────── */
  function init() {
    injectButton();
    var lang = getLang();
    applyTranslations(lang);
    updateButton(lang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
