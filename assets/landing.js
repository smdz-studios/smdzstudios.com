(() => {
  'use strict';
  const root = document.documentElement;
  const theme = document.getElementById('theme');
  const language = document.getElementById('language');
  const options = document.getElementById('language-options');
  const choices = [...options.querySelectorAll('[data-language]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const locales = {
    en: {flag:'gb', name:'English', select:'Select language', light:'Switch to light theme', dark:'Switch to dark theme', title:'Built for Roleplay.', nav:'Main navigation', footer:'Footer navigation', home:'SMDZ Studios home'},
    es: {flag:'es', name:'Español', select:'Seleccionar idioma', light:'Cambiar a tema claro', dark:'Cambiar a tema oscuro', title:'Creado para Roleplay.', nav:'Navegación principal', footer:'Enlaces del pie de página', home:'Inicio de SMDZ Studios'},
    fr: {flag:'fr', name:'Français', select:'Choisir la langue', light:'Passer au thème clair', dark:'Passer au thème sombre', title:'Conçu pour le roleplay.', nav:'Navigation principale', footer:'Navigation de pied de page', home:'Accueil SMDZ Studios'},
    de: {flag:'de', name:'Deutsch', select:'Sprache auswählen', light:'Helles Design aktivieren', dark:'Dunkles Design aktivieren', title:'Für Roleplay entwickelt.', nav:'Hauptnavigation', footer:'Fußzeilennavigation', home:'SMDZ Studios Startseite'}
  };
  const words = [...document.querySelectorAll('[data-es]')].map(node => ({node, en:node.textContent, es:node.dataset.es, fr:node.dataset.fr, de:node.dataset.de}));
  const savedLang = read('smdz-landing-language');
  let lang = Object.hasOwn(locales,savedLang) ? savedLang : 'en';
  function updateControls() {
    const t = locales[lang];
    const dark = root.dataset.theme === 'dark';
    theme.setAttribute('aria-pressed', String(dark));
    theme.setAttribute('aria-label', dark ? t.light : t.dark);
    document.getElementById('current-language').textContent = lang.toUpperCase();
    document.getElementById('current-flag').src = 'assets/flags/' + t.flag + '.svg';
    language.setAttribute('aria-label', t.select + ': ' + t.name);
    choices.forEach(button => button.setAttribute('aria-current', String(button.dataset.language === lang)));
    document.querySelector('.footer-links').setAttribute('aria-label', t.footer);
    document.querySelector('.site-nav').setAttribute('aria-label', t.nav);
    document.querySelector('.brand').setAttribute('aria-label', t.home);
  }
  function applyLanguage() {
    root.lang = lang;
    words.forEach(entry => { entry.node.textContent = entry[lang] ?? entry.en; });
    document.title = 'SMDZ Studios — ' + locales[lang].title;
    updateControls();
    save('smdz-landing-language',lang);
  }
  function toggleLanguages(open, focus = false) {
    options.hidden = !open;
    language.setAttribute('aria-expanded', String(open));
    if (focus) (open ? choices.find(b => b.dataset.language === lang) : language).focus();
  }
  language.addEventListener('click', () => toggleLanguages(options.hidden, options.hidden));
  choices.forEach(button => button.addEventListener('click', () => {
    lang = button.dataset.language;
    applyLanguage();
    toggleLanguages(false, true);
  }));
  document.addEventListener('click', e => { if (!e.target.closest('.language-picker')) toggleLanguages(false); });
  document.querySelector('.language-picker').addEventListener('keydown', e => {
    if (e.key === 'Escape' && !options.hidden) { e.preventDefault(); toggleLanguages(false, true); }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (options.hidden) { toggleLanguages(true, true); return; }
      const index = choices.indexOf(document.activeElement);
      choices[(index + (e.key === 'ArrowDown' ? 1 : -1) + choices.length) % choices.length].focus();
    }
  });
  document.querySelector('.language-picker').addEventListener('focusout', e => {
    if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) toggleLanguages(false);
  });
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('selectstart', e => e.preventDefault());
  document.addEventListener('click', e => {
    const host = e.target.closest('.btn, .language-options button');
    if (!host || reduced.matches || host.disabled) return;
    const rect = host.getBoundingClientRect();
    const effect = document.createElement('span');
    effect.className = 'bl-impact';
    effect.setAttribute('aria-hidden','true');
    host.classList.add('bl-impact-host');
    effect.style.setProperty('--bl-impact-x', e.detail ? `${e.clientX-rect.left}px` : '50%');
    effect.style.setProperty('--bl-impact-y', e.detail ? `${e.clientY-rect.top}px` : '50%');
    host.append(effect);
    effect.addEventListener('animationend', () => effect.remove(), {once:true});
    setTimeout(() => effect.remove(),700);
  }, true);
  let themeBusy = false;
  theme.addEventListener('click', async () => {
    if (themeBusy) return;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const apply = () => { root.dataset.theme = next; save('smdz-bl-theme',next); updateControls(); };
    if (!document.startViewTransition || reduced.matches) { apply(); return; }
    themeBusy = true;
    const rect = theme.getBoundingClientRect();
    const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
    try {
      const transition = document.startViewTransition(apply);
      await transition.ready;
      root.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${radius}px at ${x}px ${y}px)`]}, {duration:630,easing:'cubic-bezier(.22,.61,.36,1)',pseudoElement:'::view-transition-new(root)'});
      await transition.finished;
    } catch { apply(); } finally { themeBusy=false; }
  });
  document.getElementById('year').textContent = new Date().getFullYear();
  applyLanguage();
  // All scroll effects share one frame update; reveal once and stay visible.
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, {threshold: .12});
    root.classList.add('motion-ready');
    reveals.forEach(element => observer.observe(element));
  }
  let queued = false;
  function updateScroll() {
    const offset = Math.max(0, window.scrollY);
    const range = Math.max(1, root.scrollHeight - innerHeight);
    root.style.setProperty('--scroll-progress', Math.min(1, offset / range));
    document.body.style.setProperty('--parallax', reduced.matches ? '0px' : `${Math.min(34, offset * .075)}px`);
    queued = false;
  }
  function queueScroll() { if (!queued) { queued = true; requestAnimationFrame(updateScroll); } }
  addEventListener('scroll', queueScroll, {passive: true});
  addEventListener('resize', queueScroll, {passive: true});
  reduced.addEventListener('change', () => { if (reduced.matches) reveals.forEach(el => el.classList.add('is-visible')); queueScroll(); });
  updateScroll();
})();
