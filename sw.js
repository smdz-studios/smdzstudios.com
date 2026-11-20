const BASE=new URL(self.registration.scope);
const PREFIX='smdz-studios-'+BASE.pathname+'-';
const CACHE=PREFIX+'2026-11-20-uptime-maintenance-v1';
const LEGACY=['smdz-studios-2026-11-19-v2','smdz-studios-2026-11-19-v1'];
const SHELL=["maintenance/", "maintenance/index.html", "assets/css/maintenance.css", "assets/js/maintenance.js", "assets/js/maintenance-gate.js", "assets/js/language-menu.js", "./", "discord/", "discord/index.html", "assets/css/discord.css", "assets/js/discord.js", "index.html", "404.html", "status.html", "manifest.webmanifest", "assets/images/background.webp", "assets/images/brush-underline.svg", "assets/js/error.js", "assets/flags/de.svg", "assets/flags/es.svg", "assets/flags/fr.svg", "assets/flags/us.svg", "assets/flags/pt.svg", "assets/flags/it.svg", "assets/images/grain.svg", "assets/icons/icon-maskable.png", "assets/css/immersive.css", "assets/js/immersive.js", "assets/css/landing.css", "assets/css/technologies-layout.css", "assets/js/landing.js", "assets/js/pwa.js", "assets/images/ribbon-tail.svg", "assets/css/smdz-boldline.css", "assets/images/smdz-logo.png", "assets/js/smdz-scrollbars.js", "assets/js/studio-extras.js", "assets/css/upgrade.css", "assets/js/upgrade.js", "assets/css/status.css", "assets/js/status.js", "assets/css/experience-v4.css", "assets/js/experience-v4.js", "assets/config/site-config.js", "assets/css/scroll-sync.css", "assets/js/scroll-sync.js", "favicon.ico", "assets/icons/favicon-16x16.png", "assets/icons/favicon-32x32.png", "assets/icons/apple-touch-icon.png", "assets/icons/android-chrome-192x192.png", "assets/icons/android-chrome-512x512.png", "assets/icons/technologies/lua.svg", "assets/icons/technologies/javascript.svg", "assets/icons/technologies/html5.svg", "assets/icons/technologies/css3.svg", "assets/icons/technologies/react.svg", "assets/icons/technologies/vitejs.svg", "assets/icons/technologies/mysql.svg", "assets/icons/technologies/blender.svg", "assets/icons/technologies/sollumz.png"].map(path=>new URL(path,BASE).href);
const LIVE=new Set(['assets/data/health.json','assets/data/status-config.json'].map(path=>new URL(path,BASE).href));
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL.map(url=>new Request(url,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>(k.startsWith(PREFIX)&&k!==CACHE)||(BASE.pathname==='/'&&LEGACY.includes(k))).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  if(['localhost','127.0.0.1','[::1]','0.0.0.0'].includes(BASE.hostname))return;
  const req=event.request,url=new URL(req.url),clean=new URL(url.pathname,url.origin).href;
  if(req.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname)||LIVE.has(clean))return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).catch(async()=>{const cache=await caches.open(CACHE);return await cache.match(clean)||await cache.match(new URL('404.html',BASE).href);}));return;
  }
  if(clean===new URL('assets/config/site-config.js',BASE).href){
    event.respondWith(fetch(req,{cache:'no-store'}).then(async response=>{if(response.ok){const cache=await caches.open(CACHE);await cache.put(clean,response.clone());}return response;}).catch(async()=>{const cache=await caches.open(CACHE);return await cache.match(clean)||Response.error();}));return;
  }
  if(!SHELL.includes(clean))return;
  if(req.destination==='style'||req.destination==='script'){
    event.respondWith(fetch(req,{cache:'no-cache'}).then(async response=>{if(!response.ok)throw new Error('Asset unavailable');const cache=await caches.open(CACHE);await cache.put(clean,response.clone());return response;}).catch(async()=>{const cache=await caches.open(CACHE);return await cache.match(clean)||Response.error();}));return;
  }
  event.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(clean);return cached||fetch(req);}));
});
