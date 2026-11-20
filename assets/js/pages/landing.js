(() => {
  'use strict';
  const root = document.documentElement;
  const theme = document.getElementById('theme');
  const language = document.getElementById('language');
  const options = document.getElementById('language-options');
  const choices = [...options.querySelectorAll('[data-language]')];
  const heroTitle = document.getElementById('hero-title');
  const heroTitleLine = document.getElementById('hero-title-line');
  let heroTypingToken = 0;
  const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const isReduced = () => systemMotion.matches;
  root.dataset.siteMotion = isReduced() ? 'reduce' : 'full';
  const locales = {
    en: {flag:'us', name:'English', select:'Select language', light:'Switch to light theme', dark:'Switch to dark theme', title:'Built for Roleplay.', nav:'Main navigation', footer:'Footer navigation', home:'SMDZ Studios home', logo:"SMDZ Studios logo"},
    es: {flag:'es', name:'Español', select:'Seleccionar idioma', light:'Cambiar a tema claro', dark:'Cambiar a tema oscuro', title:'Creado para Roleplay.', nav:'Navegación principal', footer:'Enlaces del pie de página', home:'Inicio de SMDZ Studios', logo:"Logotipo de SMDZ Studios"},
    fr: {flag:'fr', name:'Français', select:'Choisir la langue', light:'Passer au thème clair', dark:'Passer au thème sombre', title:'Conçu pour le roleplay.', nav:'Navigation principale', footer:'Navigation de pied de page', home:'Accueil SMDZ Studios', logo:"Logo de SMDZ Studios"},
    de: {flag:'de', name:'Deutsch', select:'Sprache auswählen', light:'Helles Design aktivieren', dark:'Dunkles Design aktivieren', title:'Für Roleplay entwickelt.', nav:'Hauptnavigation', footer:'Fußzeilennavigation', home:'SMDZ Studios Startseite', logo:"SMDZ Studios Logo"},
    pt: {flag:'pt', name:'Português', select:'Selecionar idioma', light:'Mudar para tema claro', dark:'Mudar para tema escuro', title:'Criado para Roleplay.', nav:'Navegação principal', footer:'Navegação do rodapé', home:'Início da SMDZ Studios', logo:"Logótipo da SMDZ Studios"},
    it: {flag:'it', name:'Italiano', select:'Seleziona lingua', light:'Passa al tema chiaro', dark:'Passa al tema scuro', title:'Creato per il Roleplay.', nav:'Navigazione principale', footer:'Navigazione del piè di pagina', home:'Home di SMDZ Studios', logo:"Logo di SMDZ Studios"}
  };
  const words = [...document.querySelectorAll('[data-es]')].map(node => ({node, en:node.textContent, es:node.dataset.es, fr:node.dataset.fr, de:node.dataset.de, pt:node.dataset.pt, it:node.dataset.it}));
  const ribbon = document.querySelector('.studio-ribbon');
  const ribbonLabels = {en:'Studio values',es:'Valores del estudio',fr:'Valeurs du studio',de:'Werte des Studios',pt:'Valores do estúdio',it:'Valori dello studio'};
  function updateRibbon() { ribbon.setAttribute('aria-label', ribbonLabels[lang]); }
  if ('IntersectionObserver' in window) {
    const ribbonObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => ribbon.classList.toggle('is-offscreen', !entry.isIntersecting));
    });
    ribbonObserver.observe(ribbon);
  }
  const savedLang = read('smdz-landing-language');
  const detectedLang = (navigator.languages?.length ? navigator.languages : [navigator.language]).map(value => String(value).toLowerCase().split(/[-_]/)[0]).find(value => Object.hasOwn(locales,value));
  let lang = Object.hasOwn(locales,savedLang) ? savedLang : detectedLang || 'en';
  save('smdz-landing-language',lang);
  const heroPhrases = [{"en":["Built for ","Roleplay"],"es":["Creado para ","Roleplay"],"fr":["Conçu pour le ","roleplay"],"de":["Entwickelt für ","Roleplay"],"pt":["Criado para ","Roleplay"],"it":["Creato per il ","Roleplay"]},{"en":["Designed for ","immersion"],"es":["Diseñado para la ","inmersión"],"fr":["Conçu pour ","l’immersion"],"de":["Gestaltet für ","Immersion"],"pt":["Concebido para a ","imersão"],"it":["Progettato per ","l’immersione"]},{"en":["Where ideas become ","reality"],"es":["Donde las ideas se hacen ","realidad"],"fr":["Quand les idées deviennent ","réalité"],"de":["Wo Ideen Wirklichkeit ","werden"],"pt":["Onde as ideias se tornam ","realidade"],"it":["Dove le idee diventano ","realtà"]},{"en":["Create your own ","world"],"es":["Crea tu propio ","mundo"],"fr":["Crée ton propre ","monde"],"de":["Erschaffe deine eigene ","Welt"],"pt":["Cria o teu próprio ","mundo"],"it":["Crea il tuo ","mondo"]},{"en":["Beyond the ","ordinary"],"es":["Más allá de lo ","habitual"],"fr":["Au-delà de ","l’ordinaire"],"de":["Mehr als der ","Standard"],"pt":["Para além do ","habitual"],"it":["Oltre ","l’ordinario"]},{"en":["Every detail ","matters"],"es":["Cada detalle ","importa"],"fr":["Chaque détail ","compte"],"de":["Jedes Detail ","zählt"],"pt":["Cada detalhe ","conta"],"it":["Ogni dettaglio ","conta"]},{"en":["Code meets ","creativity"],"es":["Código y ","creatividad"],"fr":["Le code rencontre la ","créativité"],"de":["Code trifft ","Kreativität"],"pt":["Código e ","criatividade"],"it":["Codice e ","creatività"]},{"en":["New ways to ","play"],"es":["Nuevas formas de ","jugar"],"fr":["De nouvelles façons de ","jouer"],"de":["Neue Wege zu ","spielen"],"pt":["Novas formas de ","jogar"],"it":["Nuovi modi di ","giocare"]},{"en":["Made for your ","server"],"es":["Creado para tu ","servidor"],"fr":["Créé pour ton ","serveur"],"de":["Gemacht für deinen ","Server"],"pt":["Criado para o teu ","servidor"],"it":["Creato per il tuo ","server"]},{"en":["Turn imagination into ","gameplay"],"es":["Transforma ideas en ","experiencias"],"fr":["Transforme tes idées en ","expériences"],"de":["Mach aus Ideen ","Spielerlebnisse"],"pt":["Transforma ideias em ","experiências"],"it":["Trasforma le idee in ","esperienze"]}];
  const previousPhrase = read('smdz-last-hero-phrase');
  const phrasePool = heroPhrases.map((_,i)=>i).filter(i=>String(i)!==previousPhrase);
  const phraseIndex = phrasePool[Math.floor(Math.random()*phrasePool.length)];
  save('smdz-last-hero-phrase',String(phraseIndex));
  function getHeroTitleText() { return heroPhrases[phraseIndex][lang].join('')+'.'; }
  function createHeroTitleMarkup() {
    const [before,word]=heroPhrases[phraseIndex][lang];
    return `${before}<span class="roleplay-word">${word}</span>.`;
  }
  function animateHeroTitle(delay = 0) {
    const text = getHeroTitleText();
    const token = ++heroTypingToken;
    heroTitle.setAttribute('aria-label', text);
    heroTitle.classList.remove('is-complete');
    if (isReduced()) {
      heroTitleLine.innerHTML = createHeroTitleMarkup(text);
      heroTitle.classList.add('is-complete');
      return;
    }
    if (root.classList.contains('intro-loading')) return;
    heroTitleLine.textContent = '';
    const step = Math.max(20, Math.min(45, 540 / Math.max(1, text.length)));
    let index = 0;
    function write() {
      if (token !== heroTypingToken) return;
      heroTitleLine.textContent = text.slice(0, index);
      if (index < text.length) {
        index += 1;
        setTimeout(write, step);
      } else {
        heroTitleLine.innerHTML = createHeroTitleMarkup(text);
        heroTitle.classList.add('is-complete');
      }
    }
    if (delay) setTimeout(write, delay); else write();
  }
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
    document.querySelector('.logo-parallax').setAttribute('aria-label', t.logo);
    document.querySelector('.hero-logo').alt=t.logo;
    document.querySelector('.studio-footer a[aria-label]').setAttribute('aria-label', t.home);
  }
  function applyLanguage(instantTitle = false) {
    root.lang = lang;
    words.forEach(entry => { entry.node.textContent = entry[lang] ?? entry.en; });
    const seo = {en:['FiveM & RedM Development',"SMDZ Studios is an independent development studio specializing in systems and assets for Grand Theft Auto V and Red Dead Redemption 2, through FiveM and RedM.",'en_US'],es:['Desarrollo FiveM y RedM',"SMDZ Studios es un estudio independiente especializado en el desarrollo de sistemas y assets para Grand Theft Auto V y Red Dead Redemption 2, a través de FiveM y RedM.",'es_ES'],fr:['Développement FiveM et RedM',"SMDZ Studios est un studio indépendant spécialisé dans le développement de systèmes et d’assets pour Grand Theft Auto V et Red Dead Redemption 2, via FiveM et RedM.",'fr_FR'],de:['FiveM- und RedM-Entwicklung',"SMDZ Studios ist ein unabhängiges Entwicklungsstudio für Systeme und Assets für Grand Theft Auto V und Red Dead Redemption 2, über FiveM und RedM.",'de_DE'],pt:['Desenvolvimento FiveM e RedM',"A SMDZ Studios é um estúdio independente especializado no desenvolvimento de sistemas e assets para Grand Theft Auto V e Red Dead Redemption 2, através do FiveM e do RedM.",'pt_PT'],it:['Sviluppo FiveM e RedM',"SMDZ Studios è uno studio indipendente specializzato nello sviluppo di sistemi e asset per Grand Theft Auto V e Red Dead Redemption 2, attraverso FiveM e RedM.",'it_IT']}[lang];
    document.title = 'SMDZ Studios | ' + seo[0];
    document.querySelector('meta[name="description"]').content = seo[1];
    document.querySelector('meta[property="og:title"]').content = document.title;
    document.querySelector('meta[property="og:description"]').content = seo[1];
    document.querySelector('meta[property="og:locale"]').content = seo[2];
    document.querySelector('meta[name="twitter:title"]').content = document.title;
    document.querySelector('meta[name="twitter:description"]').content = seo[1];
    if (instantTitle && !root.classList.contains('intro-loading')) { ++heroTypingToken; const title = getHeroTitleText(); heroTitle.setAttribute('aria-label', title); heroTitleLine.innerHTML = createHeroTitleMarkup(title); heroTitle.classList.add('is-complete'); } else animateHeroTitle();
    updateControls();
    updateRibbon();
    document.querySelector('.section-dots')?.setAttribute('aria-label',({en:'Page sections',es:'Secciones de la página',fr:'Sections de la page',de:'Seitenabschnitte',pt:'Secções da página',it:'Sezioni della pagina'})[lang]);
  }
  function toggleLanguages(open, focus = false) {
    window.smdzToggleLanguageMenu(options,language,open,focus?(open?choices.find(b=>b.dataset.language===lang):language):null);
  }
  language.addEventListener('click', () => toggleLanguages(language.getAttribute('aria-expanded')!=='true', language.getAttribute('aria-expanded')!=='true'));
  choices.forEach(button => button.addEventListener('click', () => {
    const next = button.dataset.language;
    toggleLanguages(false, true);
    if (next === lang) { save('smdz-landing-language',lang); return; }
    const change = () => { lang = next; save('smdz-landing-language',lang); applyLanguage(true); };
    if (window.smdzLanguageChange) window.smdzLanguageChange(change); else change();
  }));
  document.addEventListener('click', e => { if (!e.target.closest('.language-picker')) toggleLanguages(false); });
  document.querySelector('.language-picker').addEventListener('keydown', e => {
    if (e.key === 'Escape' && language.getAttribute('aria-expanded')==='true') { e.preventDefault(); toggleLanguages(false, true); }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (language.getAttribute('aria-expanded')!=='true') { toggleLanguages(true, true); return; }
      const index = choices.indexOf(document.activeElement);
      choices[(index + (e.key === 'ArrowDown' ? 1 : -1) + choices.length) % choices.length].focus();
    }
  });
  document.querySelector('.language-picker').addEventListener('focusout', e => {
    if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) toggleLanguages(false);
  });
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('selectstart', e => { if (!e.target.closest('input,textarea')) e.preventDefault(); });
  function showImpact(e, keyboard = false) {
    if (isReduced()) return;
    const host = e.target.closest('.btn, .language-options button');
    if (host?.disabled) return;
    if (host) {
      const rect = host.getBoundingClientRect();
      const x = keyboard ? rect.width / 2 : e.clientX - rect.left;
      const y = keyboard ? rect.height / 2 : e.clientY - rect.top;
      const effect = document.createElement('span');
      effect.className = 'bl-impact';
      effect.setAttribute('aria-hidden','true');
      host.classList.add('bl-impact-host');
      effect.style.setProperty('--bl-impact-x', `${x}px`);
      effect.style.setProperty('--bl-impact-y', `${y}px`);
      effect.style.setProperty('--impact-size', `${Math.ceil(2 * Math.hypot(Math.max(x, rect.width-x), Math.max(y, rect.height-y)))}px`);
      host.append(effect);
      effect.addEventListener('animationend', () => effect.remove(), {once:true});
      setTimeout(() => effect.remove(),700);
    } else if (!keyboard) {
      const pulse = document.createElement('span');
      pulse.className = 'landing-click-pulse';
      pulse.setAttribute('aria-hidden','true');
      pulse.style.setProperty('--pulse-x', `${e.clientX}px`);
      pulse.style.setProperty('--pulse-y', `${e.clientY}px`);
      document.body.append(pulse);
      pulse.addEventListener('animationend', () => pulse.remove(), {once:true});
      setTimeout(() => pulse.remove(),650);
    }
  }
  document.addEventListener('pointerdown', e => {
    if (e.isPrimary && e.button === 0) showImpact(e);
  }, {capture:true, passive:true});
  document.addEventListener('click', e => {
    if (e.detail === 0) showImpact(e, true);
  }, true);
  let themeBusy = false;
  theme.addEventListener('click', async () => {
    if (themeBusy) return;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const apply = () => { root.dataset.theme = next; save('smdz-bl-theme',next); updateControls(); };
    if (!document.startViewTransition || isReduced()) { apply(); return; }
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
  window.addEventListener('smdz:intro-ready', () => animateHeroTitle(560), {once:true});
  applyLanguage();
  function syncPreferences() {
    const savedTheme=read('smdz-bl-theme'),savedLanguage=read('smdz-landing-language');
    if (savedTheme==='light'||savedTheme==='dark') root.dataset.theme=savedTheme;
    if (Object.hasOwn(locales,savedLanguage)&&savedLanguage!==lang) { lang=savedLanguage; applyLanguage(true); }
    else updateControls();
  }
  window.addEventListener('storage',event=>{if(event.key===null||event.key==='smdz-bl-theme'||event.key==='smdz-landing-language')syncPreferences();});
  window.addEventListener('pageshow',event=>{if(event.persisted)syncPreferences();});

  let queued = false;
  function updateScroll() {
    const offset = Math.max(0, window.scrollY);
    const range = Math.max(1, root.scrollHeight - innerHeight);
    root.style.setProperty('--scroll-progress', Math.min(1, offset / range));
    document.body.style.setProperty('--parallax', isReduced() ? '0px' : `${Math.min(34, offset * .075)}px`);
    queued = false;
  }
  function queueScroll() { if (!queued) { queued = true; requestAnimationFrame(updateScroll); } }
  addEventListener('scroll', queueScroll, {passive: true});
  addEventListener('resize', queueScroll, {passive: true});
  updateScroll();
  const logoSurface = document.querySelector('.logo-parallax');
  const finePointer = matchMedia('(any-hover: hover) and (any-pointer: fine)');
  let logoFrame = 0;
  let logoPointer = null;
  function resetLogo() {
    if (logoFrame) cancelAnimationFrame(logoFrame);
    logoFrame = 0;
    logoPointer = null;
    logoSurface.classList.remove('is-tilting');
    for (const key of ['x', 'y', 'z', 'rx', 'ry']) logoSurface.style.removeProperty('--logo-' + key);
  }
  function updateLogo() {
    logoFrame = 0;
    if (!logoPointer || isReduced() || !finePointer.matches) { resetLogo(); return; }
    const rect = logoSurface.getBoundingClientRect();
    if (!rect.width || !rect.height) { resetLogo(); return; }
    const clamp = value => Math.max(-1, Math.min(1, value));
    const x = clamp((logoPointer.x - rect.left) / rect.width * 2 - 1);
    const y = clamp((logoPointer.y - rect.top) / rect.height * 2 - 1);
    logoSurface.classList.add('is-tilting');
    logoSurface.style.setProperty('--logo-x', `${(x * 7).toFixed(2)}px`);
    logoSurface.style.setProperty('--logo-y', `${(y * 7).toFixed(2)}px`);
    logoSurface.style.setProperty('--logo-z', '18px');
    logoSurface.style.setProperty('--logo-rx', `${(-y * 12).toFixed(2)}deg`);
    logoSurface.style.setProperty('--logo-ry', `${(x * 12).toFixed(2)}deg`);
  }
  function trackLogo(event) {
    if (event.pointerType !== 'mouse' || isReduced() || !finePointer.matches) return;
    logoPointer = { x: event.clientX, y: event.clientY };
    if (!logoFrame) logoFrame = requestAnimationFrame(updateLogo);
  }
  logoSurface.addEventListener('pointerenter', trackLogo, {passive: true});
  logoSurface.addEventListener('pointermove', trackLogo, {passive: true});
  logoSurface.addEventListener('pointerleave', resetLogo);
  logoSurface.addEventListener('pointercancel', resetLogo);
  addEventListener('blur', resetLogo);
  addEventListener('scroll', resetLogo, {passive: true});
  function applyMotion() {
    const off = isReduced();
    root.dataset.siteMotion = off ? 'reduce' : 'full';
    if (off) {
      animateHeroTitle();
      document.querySelectorAll('.bl-impact, .landing-click-pulse').forEach(el => el.remove());
    }
    updateControls();
    resetLogo();
    updateScroll();
  }
  systemMotion.addEventListener('change', applyMotion);
  finePointer.addEventListener('change', resetLogo);
})();
