(() => {
  'use strict';
  const root=document.documentElement,header=document.querySelector('.header-actions');
  if(!header)return;
  const base=new URL('../../../',document.currentScript.src);
  const style=document.createElement('link');style.rel='stylesheet';style.href=new URL('assets/css/core/keyboard-help.css',base).href;document.head.append(style);
  const labels={
    en:{title:'KEYBOARD SHORTCUTS',subtitle:'Navigate SMDZ Studios without reaching for the mouse.',button:'Keyboard shortcuts',close:'Close shortcuts',hint:'Press ? to open this panel.',rows:['Open quick commands','Show keyboard help','Go to Home','Go to Service Status','Go to FAQ','Switch light / dark theme','Close the current dialog'],note:'Press G, release it, then press the destination letter. Shortcuts are disabled while typing.'},
    es:{title:'ATAJOS DE TECLADO',subtitle:'Navega por SMDZ Studios sin utilizar el ratón.',button:'Atajos de teclado',close:'Cerrar atajos',hint:'Pulsa ? para abrir este panel.',rows:['Abrir comandos rápidos','Mostrar ayuda de atajos','Ir a Inicio','Ir a Estado de servicios','Ir a preguntas frecuentes','Cambiar tema claro / oscuro','Cerrar la ventana actual'],note:'Pulsa G, suéltala y después pulsa la letra de destino. Los atajos se desactivan mientras escribes.'},
    fr:{title:'RACCOURCIS CLAVIER',subtitle:'Parcourez SMDZ Studios sans utiliser la souris.',button:'Raccourcis clavier',close:'Fermer les raccourcis',hint:'Appuyez sur ? pour ouvrir ce panneau.',rows:['Ouvrir les commandes rapides','Afficher les raccourcis','Aller à l’accueil','Voir l’état des services','Aller aux questions fréquentes','Changer de thème clair / sombre','Fermer la fenêtre active'],note:'Appuyez sur G, relâchez, puis tapez la lettre de destination. Les raccourcis sont désactivés lors de la saisie.'},
    de:{title:'TASTATURKÜRZEL',subtitle:'Navigiere ohne Maus durch SMDZ Studios.',button:'Tastaturkürzel',close:'Tastaturkürzel schließen',hint:'Drücke ? für diese Übersicht.',rows:['Schnellbefehle öffnen','Tastaturhilfe anzeigen','Zur Startseite','Zum Dienststatus','Zu häufigen Fragen','Helles / dunkles Design wechseln','Aktuelles Fenster schließen'],note:'Drücke G, lasse los und drücke dann den Zielbuchstaben. Beim Tippen sind die Kürzel deaktiviert.'},
    pt:{title:'ATALHOS DE TECLADO',subtitle:'Navega pela SMDZ Studios sem usar o rato.',button:'Atalhos de teclado',close:'Fechar atalhos',hint:'Prime ? para abrir este painel.',rows:['Abrir comandos rápidos','Mostrar ajuda de atalhos','Ir para o início','Ir para o estado dos serviços','Ir para perguntas frequentes','Alternar tema claro / escuro','Fechar a janela atual'],note:'Prime G, larga a tecla e depois prime a letra de destino. Os atalhos não funcionam enquanto escreves.'},
    it:{title:'SCORCIATOIE DA TASTIERA',subtitle:'Naviga in SMDZ Studios senza usare il mouse.',button:'Scorciatoie da tastiera',close:'Chiudi le scorciatoie',hint:'Premi ? per aprire questo pannello.',rows:['Apri i comandi rapidi','Mostra le scorciatoie','Vai alla Home','Vai allo stato dei servizi','Vai alle domande frequenti','Cambia tema chiaro / scuro','Chiudi la finestra attuale'],note:'Premi G, rilascialo e poi premi la lettera di destinazione. Le scorciatoie sono disattivate mentre scrivi.'}
  };
  const lang=()=>Object.hasOwn(labels,root.lang)?root.lang:'en';
  const keySets=[['Ctrl','K'],['?'],['G','H'],['G','S'],['G','F'],['T'],['Esc']];
  const button=document.createElement('button');button.type='button';button.className='btn keyboard-help-trigger';button.id='keyboard-help-trigger';
  button.innerHTML='<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M6 9h2m2 0h2m2 0h2m2 0h.01M6 13h2m2 0h2m2 0h4M8 16h8"/></svg><kbd>?</kbd>';
  button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-keyshortcuts','Shift+Slash');
  header.append(button);
  const dialog=document.createElement('dialog');dialog.className='keyboard-help-dialog';dialog.id='keyboard-help-dialog';dialog.setAttribute('aria-labelledby','keyboard-help-title');
  dialog.innerHTML='<div class="keyboard-help-head"><div><span class="keyboard-help-eyebrow">SMDZ STUDIOS</span><h2 id="keyboard-help-title"></h2></div><button class="keyboard-help-close" type="button" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div><p class="keyboard-help-subtitle"></p><div class="keyboard-help-rows"></div><p class="keyboard-help-note"></p><p class="keyboard-help-hint"></p>';
  document.body.append(dialog);
  let previousFocus=null,closeTimer=0,prefixUntil=0;
  const keys=dialog.querySelector('.keyboard-help-rows');
  function translate(){
    const t=labels[lang()];
    button.setAttribute('aria-label',t.button);button.title=t.button;
    dialog.querySelector('#keyboard-help-title').textContent=t.title;
    dialog.querySelector('.keyboard-help-close').setAttribute('aria-label',t.close);
    dialog.querySelector('.keyboard-help-subtitle').textContent=t.subtitle;
    dialog.querySelector('.keyboard-help-note').textContent=t.note;
    dialog.querySelector('.keyboard-help-hint').textContent=t.hint;
    keys.replaceChildren();
    keySets.forEach((set,i)=>{
      const row=document.createElement('div');row.className='keyboard-help-row';
      const name=document.createElement('span');name.textContent=t.rows[i];
      const codes=document.createElement('div');codes.className='keyboard-help-keys';
      set.forEach(k=>{const key=document.createElement('kbd');key.textContent=k;codes.append(key);});
      row.append(name,codes);keys.append(row);
    });
  }
  function open(){
    if(dialog.open||document.querySelector('dialog[open]'))return;
    previousFocus=document.activeElement;
    translate();dialog.classList.remove('is-closing');dialog.showModal();button.setAttribute('aria-expanded','true');dialog.querySelector('.keyboard-help-close').focus({preventScroll:true});
  }
  function close(){
    if(!dialog.open)return;
    clearTimeout(closeTimer);
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){dialog.close();return;}
    dialog.classList.add('is-closing');closeTimer=setTimeout(()=>{if(dialog.open)dialog.close();},170);
  }
  button.addEventListener('click',open);
  dialog.querySelector('.keyboard-help-close').addEventListener('click',close);
  dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
  dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
  dialog.addEventListener('close',()=>{clearTimeout(closeTimer);dialog.classList.remove('is-closing');button.setAttribute('aria-expanded','false');previousFocus?.isConnected&&previousFocus.focus({preventScroll:true});});
  new MutationObserver(()=>{translate();}).observe(root,{attributes:true,attributeFilter:['lang']});
  translate();
  const inputFocused=target=>!!target?.closest?.('input,textarea,select,[contenteditable=""],[contenteditable="true"],[role="textbox"]');
  document.addEventListener('keydown',e=>{
    if(e.defaultPrevented||e.repeat||e.altKey)return;
    if(e.ctrlKey||e.metaKey)return;
    if(dialog.open){if(e.key==='?'||e.key==='Escape'){e.preventDefault();close();}return;}
    if(document.querySelector('dialog[open]')||inputFocused(e.target))return;
    const key=e.key.toLowerCase();
    if(e.key==='?'){e.preventDefault();prefixUntil=0;open();return;}
    if(key==='g'){prefixUntil=Date.now()+1450;return;}
    if(prefixUntil>Date.now()&&['h','s','f'].includes(key)){
      e.preventDefault();prefixUntil=0;
      const path=key==='h'?'index.html':key==='s'?'status/':'index.html#faq';
      const url=new URL(path,base);
      if(location.href===url.href)return;
      if(key==='f'&&document.getElementById('faq')){document.getElementById('faq').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});location.hash='faq';}
      else location.href=url.href;
      return;
    }
    prefixUntil=0;
    if(key==='t'){const theme=document.getElementById('theme');if(theme){e.preventDefault();theme.click();}}

  });
})();