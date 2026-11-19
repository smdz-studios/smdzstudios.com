(() => {
  'use strict';
  const button=document.getElementById('install-app');
  let prompt=null;
  addEventListener('beforeinstallprompt',e=>{e.preventDefault();prompt=e;if(button)button.hidden=false;});
  addEventListener('appinstalled',()=>{prompt=null;if(button)button.hidden=true;});
  button?.addEventListener('click',async()=>{if(!prompt)return;const event=prompt;prompt=null;button.hidden=true;try{await event.prompt();await event.userChoice;}catch{}});
  if('serviceWorker' in navigator&&isSecureContext)addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}),{once:true});
})();
