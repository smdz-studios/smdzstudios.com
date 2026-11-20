(() => {
  'use strict';
  const trigger=document.getElementById('install-app');
  const base=new URL('../../../',document.currentScript.src);
  const stylesheet=document.createElement('link');
  stylesheet.rel='stylesheet';
  stylesheet.href=new URL('assets/css/core/pwa-install.css',base).href;
  document.head.append(stylesheet);
  const local=['localhost','127.0.0.1','[::1]','0.0.0.0'].includes(location.hostname);
  if(local&&'serviceWorker' in navigator){
    navigator.serviceWorker.getRegistrations().then(async registrations=>{
      for(const registration of registrations){
        const worker=registration.active||registration.waiting||registration.installing;
        if(registration.scope===base.href&&worker&&worker.scriptURL===new URL('sw.js',base).href)await registration.unregister();
      }
      if('caches' in window){
        const prefix='smdz-studios-'+base.pathname+'-';
        for(const key of await caches.keys())if(key.startsWith(prefix)||(base.pathname==='/'&&['smdz-studios-2026-11-19-v2','smdz-studios-2026-11-19-v1'].includes(key)))await caches.delete(key);
      }
    }).catch(()=>{});
  }
  const translations={
    en:{
      kicker:'ABOUT THE APP',title:'SMDZ STUDIOS ON YOUR DEVICE',intro:'Install this website as a lightweight app for quick access, without downloading it from an app store.',
      one:'Open SMDZ Studios from your home screen or desktop.',two:'Enjoy a dedicated app window on supported devices.',three:'Keep your selected language and theme across visits.',
      note:'Live service status, Discord and external links need an internet connection.',later:'NOT NOW',install:'INSTALL APP',understood:'GOT IT',close:'Close installation information',
      manualIOS:'On iPhone or iPad, open this website in Safari, tap Share, then Add to Home Screen.',manualDefault:'To install manually, open your browser menu and look for Install app or Add to Home Screen.',
      manualTitle:'MANUAL INSTALLATION'
    },
    es:{
      kicker:'SOBRE LA APLICACIÓN',title:'SMDZ STUDIOS EN TU DISPOSITIVO',intro:'Instala esta web como aplicación ligera para acceder rápidamente, sin descargarla de una tienda de apps.',
      one:'Accede a SMDZ Studios desde el inicio o escritorio.',two:'Ábrela en una ventana independiente en dispositivos compatibles.',three:'Conserva el idioma y tema que hayas elegido.',
      note:'El estado de los servicios en directo, Discord y los enlaces externos necesitan conexión a Internet.',later:'AHORA NO',install:'INSTALAR APP',understood:'ENTENDIDO',close:'Cerrar información de instalación',
      manualIOS:'En iPhone o iPad, abre esta web en Safari, pulsa Compartir y selecciona Añadir a pantalla de inicio.',manualDefault:'Para instalar manualmente, abre el menú del navegador y busca Instalar aplicación o Añadir a pantalla de inicio.',
      manualTitle:'INSTALACIÓN MANUAL'
    },
    fr:{
      kicker:'À PROPOS DE L’APPLICATION',title:'SMDZ STUDIOS SUR VOTRE APPAREIL',intro:'Installez ce site comme une application légère pour y accéder rapidement, sans passer par une boutique d’applications.',
      one:'Accédez à SMDZ Studios depuis votre écran d’accueil ou bureau.',two:'Ouvrez le site dans une fenêtre dédiée sur les appareils compatibles.',three:'Conservez la langue et le thème choisis.',
      note:'Le statut des services en direct, Discord et les liens externes nécessitent Internet.',later:'PLUS TARD',install:'INSTALLER',understood:'COMPRIS',close:'Fermer les informations d’installation',
      manualIOS:'Sur iPhone ou iPad, ouvrez ce site dans Safari, touchez Partager, puis Sur l’écran d’accueil.',manualDefault:'Pour installer manuellement, ouvrez le menu du navigateur et recherchez Installer l’application ou Ajouter à l’écran d’accueil.',
      manualTitle:'INSTALLATION MANUELLE'
    },
    de:{
      kicker:'ÜBER DIE APP',title:'SMDZ STUDIOS AUF DEINEM GERÄT',intro:'Installiere diese Website als schlanke App für schnellen Zugriff, ohne sie aus einem App-Store herunterzuladen.',
      one:'Starte SMDZ Studios vom Startbildschirm oder Desktop.',two:'Nutze ein eigenes App-Fenster auf unterstützten Geräten.',three:'Deine gewählte Sprache und dein Design bleiben erhalten.',
      note:'Live-Dienststatus, Discord und externe Links benötigen Internet.',later:'SPÄTER',install:'APP INSTALLIEREN',understood:'VERSTANDEN',close:'Installationsinformationen schließen',
      manualIOS:'Öffne die Website auf dem iPhone oder iPad in Safari, tippe auf Teilen und dann auf Zum Home-Bildschirm.',manualDefault:'Öffne zur manuellen Installation das Browsermenü und wähle App installieren oder Zum Startbildschirm hinzufügen.',
      manualTitle:'MANUELLE INSTALLATION'
    },
    pt:{
      kicker:'SOBRE A APLICAÇÃO',title:'SMDZ STUDIOS NO TEU DISPOSITIVO',intro:'Instala este site como uma aplicação leve para acesso rápido, sem o transferires de uma loja de aplicações.',
      one:'Acede à SMDZ Studios a partir do ecrã inicial ou ambiente de trabalho.',two:'Abre-a numa janela independente em dispositivos compatíveis.',three:'Mantém o idioma e o tema escolhidos.',
      note:'O estado dos serviços em direto, o Discord e as ligações externas precisam de Internet.',later:'AGORA NÃO',install:'INSTALAR APLICAÇÃO',understood:'ENTENDIDO',close:'Fechar informações da instalação',
      manualIOS:'No iPhone ou iPad, abre este site no Safari, toca em Partilhar e depois em Adicionar ao ecrã principal.',manualDefault:'Para instalar manualmente, abre o menu do navegador e procura Instalar aplicação ou Adicionar ao ecrã principal.',
      manualTitle:'INSTALAÇÃO MANUAL'
    },
    it:{
      kicker:'INFORMAZIONI SULL’APP',title:'SMDZ STUDIOS SUL TUO DISPOSITIVO',intro:'Installa questo sito come app leggera per accedervi rapidamente, senza scaricarla da uno store.',
      one:'Apri SMDZ Studios dalla schermata Home o dal desktop.',two:'Usa una finestra dedicata sui dispositivi compatibili.',three:'Mantieni la lingua e il tema che hai scelto.',
      note:'Lo stato dei servizi in tempo reale, Discord e i link esterni richiedono Internet.',later:'NON ORA',install:'INSTALLA APP',understood:'HO CAPITO',close:'Chiudi le informazioni sull’installazione',
      manualIOS:'Su iPhone o iPad, apri il sito in Safari, tocca Condividi e poi Aggiungi alla schermata Home.',manualDefault:'Per installare manualmente, apri il menu del browser e cerca Installa app o Aggiungi alla schermata Home.',
      manualTitle:'INSTALLAZIONE MANUALE'
    }
  };
  let pending=null;
  let dialog=null;
  let closing=false;
  const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  const isIOS=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1;
  const current=()=>translations[document.documentElement.lang?.toLowerCase().split('-')[0]]||translations.en;
  function ensureDialog(){
    if(dialog)return;
    dialog=document.createElement('dialog');
    dialog.className='smdz-install-dialog';
    dialog.setAttribute('aria-labelledby','smdz-install-title');
    dialog.setAttribute('aria-describedby','smdz-install-intro');
    dialog.innerHTML=
      '<div class="smdz-install-accent" aria-hidden="true"></div>'+
      '<div class="smdz-install-top"><span class="smdz-install-kicker" data-install-text="kicker"></span>'+
      '<button type="button" class="smdz-install-close" data-install-action="close" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>'+
      '<div class="smdz-install-brand"><img alt="" draggable="false" src="'+new URL('assets/images/smdz-logo.png',base).href+'"></div>'+
      '<h2 id="smdz-install-title" data-install-text="title"></h2>'+
      '<p id="smdz-install-intro" data-install-text="intro"></p>'+
      '<div class="smdz-install-benefits">'+
      '<div><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 17h8M9 7h6v6H9z"/></svg><span data-install-text="one"></span></div>'+
      '<div><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18m-8 5h4"/></svg><span data-install-text="two"></span></div>'+
      '<div><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h10M9 3v2c0 7-3 10-6 12m3-9c1 3 4 6 8 8M15 12h7m-4-3 4 11m-8 0 4-11"/></svg><span data-install-text="three"></span></div>'+
      '</div>'+
      '<p class="smdz-install-note"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-9v1"/></svg><span data-install-text="note"></span></p>'+
      '<div class="smdz-install-manual" hidden><strong data-install-text="manualTitle"></strong><span data-install-manual></span></div>'+
      '<div class="smdz-install-actions"><button class="smdz-install-secondary" type="button" data-install-action="cancel" data-install-text="later"></button><button class="smdz-install-primary" type="button" data-install-action="install"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></svg><span data-install-primary></span></button></div>';
    dialog.addEventListener('click',event=>{
      if(event.target===dialog||event.target.closest('[data-install-action="close"],[data-install-action="cancel"]'))dismiss();
    });
    dialog.addEventListener('cancel',event=>{event.preventDefault();dismiss();});
    dialog.querySelector('[data-install-action="install"]').addEventListener('click',async()=>{
      if(!pending){dismiss();return;}
      const installEvent=pending;
      pending=null;
      closeNow();
      try{await installEvent.prompt();const choice=await installEvent.userChoice;if(choice?.outcome==='accepted'&&trigger)trigger.hidden=true;}
      catch{if(trigger&&!isStandalone())trigger.hidden=false;}
    });
    document.body.append(dialog);
  }
  function translate(){
    if(!dialog)return;
    const t=current();
    dialog.querySelectorAll('[data-install-text]').forEach(node=>{node.textContent=t[node.dataset.installText]||'';});
    dialog.querySelector('[data-install-action="close"]').setAttribute('aria-label',t.close);
    const hasPrompt=!!pending;
    dialog.querySelector('[data-install-primary]').textContent=hasPrompt?t.install:t.understood;
    dialog.querySelector('.smdz-install-manual').hidden=hasPrompt;
    dialog.querySelector('[data-install-manual]').textContent=isIOS()?t.manualIOS:t.manualDefault;
  }
  function closeNow(){
    if(!dialog||!dialog.open)return;
    closing=false;
    dialog.classList.remove('is-closing');
    dialog.close();
  }
  function dismiss(){
    if(!dialog?.open||closing)return;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){closeNow();return;}
    closing=true;
    dialog.classList.add('is-closing');
    setTimeout(closeNow,180);
  }
  if(trigger){
    if(!isStandalone()&&(isSecureContext||local))trigger.hidden=false;
    trigger.addEventListener('click',()=>{ensureDialog();translate();if(!dialog.open){dialog.classList.remove('is-closing');dialog.showModal();dialog.querySelector('[data-install-action="close"]').focus();}});
  }
  new MutationObserver(()=>{if(dialog?.open)translate();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  addEventListener('beforeinstallprompt',event=>{event.preventDefault();pending=event;if(trigger&&!isStandalone())trigger.hidden=false;if(dialog?.open)translate();});
  addEventListener('appinstalled',()=>{pending=null;closeNow();if(trigger)trigger.hidden=true;});
  if(!local&&'serviceWorker' in navigator&&isSecureContext)addEventListener('load',()=>navigator.serviceWorker.register(new URL('sw.js',base).href).catch(()=>{}),{once:true});
})();