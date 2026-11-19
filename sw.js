const BASE=new URL(self.registration.scope);
const PREFIX='smdz-studios-'+BASE.pathname+'-';
const CACHE=PREFIX+'2026-11-19-favicons-preferences-v2';
const LEGACY=['smdz-studios-2026-11-19-v2','smdz-studios-2026-11-19-v1'];
const SHELL=["./", "index.html", "404.html", "status.html", "manifest.webmanifest", "assets/background.webp", "assets/brush-underline.svg", "assets/error.js", "assets/flags/de.svg", "assets/flags/es.svg", "assets/flags/fr.svg", "assets/flags/us.svg", "assets/flags/pt.svg", "assets/flags/it.svg", "assets/grain.svg", "assets/icon-maskable.png", "assets/immersive.css", "assets/immersive.js", "assets/landing.css", "assets/landing.js", "assets/pwa.js", "assets/ribbon-tail.svg", "assets/smdz-boldline.css", "assets/smdz-logo.png", "assets/smdz-scrollbars.js", "assets/studio-extras.js", "assets/upgrade.css", "assets/upgrade.js", "assets/status.css", "assets/status.js", "assets/experience-v4.css", "assets/experience-v4.js", "assets/site-config.js", "assets/scroll-sync.css", "assets/scroll-sync.js", "favicon.ico", "favicon-16x16.png", "favicon-32x32.png", "apple-touch-icon.png", "android-chrome-192x192.png", "android-chrome-512x512.png"].map(path=>new URL(path,BASE).href);
const LIVE=new Set(['health.json','status-config.json'].map(path=>new URL(path,BASE).href));
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL.map(url=>new Request(url,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>(k.startsWith(PREFIX)&&k!==CACHE)||(BASE.pathname==='/'&&LEGACY.includes(k))).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  if(['localhost','127.0.0.1','[::1]','0.0.0.0'].includes(BASE.hostname))return;
  const req=event.request,url=new URL(req.url),clean=new URL(url.pathname,url.origin).href;
  if(req.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname)||LIVE.has(clean))return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).catch(async()=>{const cache=await caches.open(CACHE);return await cache.match(clean)||await cache.match(new URL('404.html',BASE).href);}));return;
  }
  if(clean===new URL('assets/site-config.js',BASE).href){
    event.respondWith(fetch(req,{cache:'no-store'}).then(async response=>{if(response.ok){const cache=await caches.open(CACHE);await cache.put(clean,response.clone());}return response;}).catch(async()=>{const cache=await caches.open(CACHE);return await cache.match(clean)||Response.error();}));return;
  }
  if(!SHELL.includes(clean))return;
  event.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(clean);return cached||fetch(req);}));
});
