const CACHE='smdz-studios-2026-11-19-v2';
const SHELL=["/", "/index.html", "/404.html", "/status.html", "/manifest.webmanifest", "/assets/background.webp", "/assets/brush-underline.svg", "/assets/error.js", "/assets/favicon.svg", "/assets/flags/de.svg", "/assets/flags/es.svg", "/assets/flags/fr.svg", "/assets/flags/us.svg", "/assets/flags/pt.svg", "/assets/flags/it.svg", "/assets/grain.svg", "/assets/icon-192.png", "/assets/icon-512.png", "/assets/icon-maskable.png", "/assets/immersive.css", "/assets/immersive.js", "/assets/landing.css", "/assets/landing.js", "/assets/pwa.js", "/assets/ribbon-tail.svg", "/assets/smdz-boldline.css", "/assets/smdz-logo.png", "/assets/smdz-scrollbars.js", "/assets/studio-extras.js", "/assets/upgrade.css", "/assets/upgrade.js", "/assets/status.css", "/assets/status.js"];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('smdz-studios-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  const req=event.request,url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==self.location.origin||url.pathname==='/health.json'||url.pathname==='/status-config.json')return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).catch(async()=>{const cache=await caches.open(CACHE);return await cache.match(url.pathname)||await cache.match('/404.html');}));return;
  }
  if(!SHELL.includes(url.pathname))return;
  event.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(req,{ignoreSearch:true});return cached||fetch(req);}));
});
