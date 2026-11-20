(() => {
  'use strict';
  const button=document.getElementById('install-app');
  const base=new URL('../../../',document.currentScript.src);
  const local=['localhost','127.0.0.1','[::1]','0.0.0.0'].includes(location.hostname);
  if(local){
    if('serviceWorker' in navigator)navigator.serviceWorker.getRegistrations().then(async registrations=>{for(const registration of registrations){const worker=registration.active||registration.waiting||registration.installing;if(registration.scope===base.href&&worker&&worker.scriptURL===new URL('sw.js',base).href)await registration.unregister();}if('caches' in window){const prefix='smdz-studios-'+base.pathname+'-';for(const key of await caches.keys())if(key.startsWith(prefix)||(base.pathname==='/'&&['smdz-studios-2026-11-19-v2','smdz-studios-2026-11-19-v1'].includes(key)))await caches.delete(key);}}).catch(()=>{});
    return;
  }
  let prompt=null;
  addEventListener('beforeinstallprompt',e=>{e.preventDefault();prompt=e;if(button)button.hidden=false;});
  addEventListener('appinstalled',()=>{prompt=null;if(button)button.hidden=true;});
  button?.addEventListener('click',async()=>{if(!prompt)return;const event=prompt;prompt=null;button.hidden=true;try{await event.prompt();await event.userChoice;}catch{}});
  if('serviceWorker' in navigator&&isSecureContext)addEventListener('load',()=>navigator.serviceWorker.register(new URL('sw.js',base).href).catch(()=>{}),{once:true});
})();
