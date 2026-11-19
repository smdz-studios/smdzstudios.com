(() => {
  'use strict';
  const root = document.documentElement;
  const theme = document.getElementById('theme');
  const language = document.getElementById('language');
  const options = document.getElementById('language-options');
  const choices = [...options.querySelectorAll('[data-language]')];
  const copy = [...document.querySelectorAll('[data-es]')].map(node=>({node,en:node.textContent,es:node.dataset.es,fr:node.dataset.fr,de:node.dataset.de,pt:node.dataset.pt,it:node.dataset.it}));
  const locales = {en:['us','Select language','Switch to light theme','Switch to dark theme'],es:['es','Seleccionar idioma','Cambiar a tema claro','Cambiar a tema oscuro'],fr:['fr','Choisir la langue','Passer au thème clair','Passer au thème sombre'],de:['de','Sprache auswählen','Helles Design aktivieren','Dunkles Design aktivieren'],pt:['pt','Selecionar idioma','Mudar para tema claro','Mudar para tema escuro'],it:['it','Seleziona lingua','Passa al tema chiaro','Passa al tema scuro']};
  const read = key=>{try{return localStorage.getItem(key)}catch{return null}};
  const save = (key,value)=>{try{localStorage.setItem(key,value)}catch{}};
  const stored=read('smdz-landing-language');
  const detected=(navigator.languages?.length?navigator.languages:[navigator.language]).map(value=>String(value).toLowerCase().split(/[-_]/)[0]).find(value=>Object.hasOwn(locales,value));
  let lang=Object.hasOwn(locales,stored)?stored:detected||'en';
  save('smdz-landing-language',lang);
  function update() {
    root.lang=lang;
    if(document.querySelector('.status-page')||document.getElementById('refresh-status'))document.title=({en:'Service status',es:'Estado de servicios',fr:'État des services',de:'Dienststatus',pt:'Estado dos serviços',it:'Stato dei servizi'})[lang]+' | SMDZ Studios';
    copy.forEach(entry=>{entry.node.textContent=entry[lang]??entry.en});
    const [flag, label, light, dark]=locales[lang];
    const active=root.dataset.theme==='dark';
    document.getElementById('current-flag').src=new URL(flag+'.svg',document.getElementById('current-flag').src).href;
    document.getElementById('current-language').textContent=lang.toUpperCase();
    language.setAttribute('aria-label',label);
    theme.setAttribute('aria-label',active?light:dark);
    theme.setAttribute('aria-pressed',String(active));
    choices.forEach(button=>button.setAttribute('aria-current',String(button.dataset.language===lang)));
  }
  function toggle(open,focus=false) {options.hidden=!open;language.setAttribute('aria-expanded',String(open));if(focus)(open?choices.find(b=>b.dataset.language===lang):language).focus();}
  language.addEventListener('click',()=>toggle(options.hidden,options.hidden));
  choices.forEach(button=>button.addEventListener('click',()=>{const next=button.dataset.language;toggle(false,true);if(next===lang){save('smdz-landing-language',lang);return;}const change=()=>{lang=next;save('smdz-landing-language',lang);update();};if(window.smdzLanguageChange)window.smdzLanguageChange(change);else change();}));
  document.addEventListener('click',e=>{if(!e.target.closest('.language-picker'))toggle(false)});
  document.querySelector('.language-picker').addEventListener('keydown',e=>{if(e.key==='Escape'){toggle(false,true)}else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(options.hidden){toggle(true,true);return}const index=choices.indexOf(document.activeElement);choices[(index+(e.key==='ArrowDown'?1:-1)+choices.length)%choices.length].focus()}});
  document.querySelector('.language-picker').addEventListener('focusout',e=>{if(e.relatedTarget&&!e.currentTarget.contains(e.relatedTarget))toggle(false)});
  theme.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';save('smdz-bl-theme',root.dataset.theme);update()});
  document.addEventListener('dragstart',e=>e.preventDefault());
  document.addEventListener('selectstart',e=>{if(!e.target.closest('input,textarea'))e.preventDefault();});
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  motion.addEventListener('change',()=>{root.dataset.siteMotion=motion.matches?'reduce':'full'});
  function syncPreferences(){const savedTheme=read('smdz-bl-theme'),savedLanguage=read('smdz-landing-language');if(savedTheme==='light'||savedTheme==='dark')root.dataset.theme=savedTheme;if(Object.hasOwn(locales,savedLanguage))lang=savedLanguage;update();}
  window.addEventListener('storage',event=>{if(event.key===null||event.key==='smdz-bl-theme'||event.key==='smdz-landing-language')syncPreferences();});
  window.addEventListener('pageshow',event=>{if(event.persisted)syncPreferences();});
  update();
})();
