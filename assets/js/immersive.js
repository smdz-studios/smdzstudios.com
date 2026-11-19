(() => {
  'use strict';
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const camera = document.querySelector('.cinema-camera');
  const tooltip = document.getElementById('boldline-tooltip');
  const exit = document.querySelector('.cinema-exit');
  const dots = [...document.querySelectorAll('.section-dot')];
  const sections = dots.map(dot => document.querySelector(dot.hash));
  const sectionNav = document.querySelector('.section-dots');
  let activeSection = -1;
  const magnets = [...document.querySelectorAll('.site-nav .btn,.custom-contact')];
  const loader = document.querySelector('.cinema-loader');
  let pointer = null, frame = 0, scrollFrame = 0, previous = 0, exitTimer = 0;
  let cameraX = 0, cameraY = 0, activeMagnet = null, tipHost = null, tipTimer = 0;
  const allowed = () => fine.matches && !reduce.matches && !document.hidden && !root.classList.contains('intro-loading');
  const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
  const finish = () => { clearTimeout(window.smdzIntroTimeout); window.smdzIntroRelease(); };
  const onLoaded = async () => {
    if (document.fonts?.ready) { try { await document.fonts.ready; } catch {} }
    finish();
  };
  if (reduce.matches) finish();
  else if (document.readyState === 'complete') onLoaded();
  else window.addEventListener('load',onLoaded,{once:true});
  loader.addEventListener('animationend', e => { if(e.target === loader && e.animationName === 'cinema-open') loader.remove(); });
  function updateSections() {
    scrollFrame = 0;
    const y = innerHeight * .48;
    let best = 0;
    let distance = Infinity;
    sections.forEach((section,i) => {
      const r = section.getBoundingClientRect();
      const d = y < r.top ? r.top-y : y > r.bottom ? y-r.bottom : 0;
      if(d < distance){ distance=d;best=i; }
    });
    if(scrollY > 0 && scrollY + innerHeight >= root.scrollHeight - 8) best = sections.length-1;
    if(best===activeSection)return;
    sectionNav.dataset.direction=best<activeSection?'up':'down';
    dots.forEach((dot,i) => {
      dot.classList.remove('section-arriving');
      if(i===best){ dot.setAttribute('aria-current','location'); if(activeSection!==-1)dot.classList.add('section-arriving'); }
      else dot.removeAttribute('aria-current');
    });
    activeSection=best;
  }
  function queueSections() { if(!scrollFrame) scrollFrame=requestAnimationFrame(updateSections); }
  addEventListener('scroll',queueSections,{passive:true});
  addEventListener('resize',queueSections,{passive:true});
  window.addEventListener('smdz:intro-ready',queueSections);
  updateSections();
  function resetMagnet() {
    if(!activeMagnet) return;
    activeMagnet.classList.remove('is-magnetic');
    activeMagnet.style.removeProperty('--magnet-x');
    activeMagnet.style.removeProperty('--magnet-y');
    activeMagnet=null;
  }
  function updateMagnet() {
    let best=null, nearest=Infinity, dx=0,dy=0;
    if(pointer) magnets.forEach(btn => {
      const x = btn.offsetWidth, y = btn.offsetHeight;
      const matrix = getComputedStyle(btn).transform;
      const m = matrix === 'none' ? null : new DOMMatrixReadOnly(matrix);
      const bounds=btn.getBoundingClientRect();
      const bx=bounds.left+bounds.width/2-(m?.m41||0), by=bounds.top+bounds.height/2-(m?.m42||0);
      const vx=pointer.x-bx,vy=pointer.y-by;
      const dist=Math.hypot(Math.max(0,Math.abs(vx)-x/2),Math.max(0,Math.abs(vy)-y/2));
      if(dist<20 && dist<nearest && bounds.bottom>0 && bounds.top<innerHeight){best=btn;nearest=dist;dx=vx;dy=vy;}
    });
    if(best!==activeMagnet){resetMagnet();activeMagnet=best;}
    if(activeMagnet){
      activeMagnet.classList.add('is-magnetic');
      activeMagnet.style.setProperty('--magnet-x',`${clamp(dx*.115,-7,7).toFixed(2)}px`);
      activeMagnet.style.setProperty('--magnet-y',`${clamp(dy*.16,-6,6).toFixed(2)}px`);
    }
  }
  function tick(now) {
    frame=0;
    if(!allowed()){resetInteractions();return;}
    const dt=previous?Math.min(50,now-previous):16;
    previous=now;
    const b=1-Math.exp(-dt/190);
    const tx=pointer?clamp((pointer.x/innerWidth-.5)*-25,-13,13):0;
    const ty=pointer?clamp((pointer.y/innerHeight-.5)*-20,-10,10):0;
    cameraX+=(tx-cameraX)*b;cameraY+=(ty-cameraY)*b;
    camera.style.setProperty('--camera-x',`${cameraX.toFixed(2)}px`);
    camera.style.setProperty('--camera-y',`${cameraY.toFixed(2)}px`);
    if(pointer){
      if(pointer.dirty){ updateMagnet();pointer.dirty=false; }
    }
    const moving=Math.abs(tx-cameraX)+Math.abs(ty-cameraY)>.05;
    if(moving) frame=requestAnimationFrame(tick);
    else previous=0;
  }
  function schedule() {if(!frame && allowed()) frame=requestAnimationFrame(tick);}
  function clearPointer(){pointer=null;resetMagnet();schedule();hideTip();}
  function resetInteractions(){if(frame)cancelAnimationFrame(frame);frame=0;previous=0;pointer=null;cameraX=0;cameraY=0;camera.style.removeProperty('--camera-x');camera.style.removeProperty('--camera-y');resetMagnet();hideTip();}
  function updatePointer(e) {
    if(e.pointerType!=='mouse'||!allowed())return;
    pointer={x:e.clientX,y:e.clientY,dirty:true};
    schedule();
  }
  addEventListener('pointermove',updatePointer,{passive:true});
  root.addEventListener('pointerleave',clearPointer);
  addEventListener('blur',resetInteractions);
  addEventListener('scroll',()=>{if(pointer){pointer.dirty=true;schedule();}hideTip();},{passive:true});
  addEventListener('resize',()=>{resetMagnet();hideTip();},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)resetInteractions();});
  document.addEventListener('pointerdown',e=>{
    if(!allowed()||e.pointerType!=='mouse'||e.button!==0)return;
    const rays=document.createElement('span');rays.className='cursor-impact-rays';rays.setAttribute('aria-hidden','true');
    rays.style.left=`${e.clientX}px`;rays.style.top=`${e.clientY}px`;
    for(let i=0;i<6;i++){const ray=document.createElement('i');ray.style.setProperty('--ray',i);rays.append(ray);}
    document.body.append(rays);setTimeout(()=>rays.remove(),520);
  },{passive:true});
  const tipText = host => host.getAttribute('aria-label') || host.querySelector('span[data-es]')?.textContent?.trim() || host.textContent.trim();
  const tipSelector = '#language,#theme,.back-top';
  function hideTip(){clearTimeout(tipTimer);tooltip.hidden=true;if(tipHost)tipHost.removeAttribute('aria-describedby');tipHost=null;}
  function showTip(host,keyboard=false) {
    hideTip();if(!keyboard&&!allowed())return;
    tipHost=host;
    tipTimer=setTimeout(()=>{
      if(tipHost!==host || !host.isConnected || root.classList.contains('intro-loading'))return;
      tooltip.textContent=tipText(host);if(!tooltip.textContent)return;
      tooltip.hidden=false;host.setAttribute('aria-describedby',tooltip.id);
      const r=host.getBoundingClientRect(), t=tooltip.getBoundingClientRect();
      const x=clamp(r.left+r.width/2-t.width/2,9,Math.max(9,innerWidth-t.width-9));
      const y=r.top-t.height-10>5?r.top-t.height-10:r.bottom+10;
      tooltip.style.left=`${x}px`;tooltip.style.top=`${clamp(y,5,innerHeight-t.height-5)}px`;
    },keyboard?80:360);
  }
  document.querySelectorAll(tipSelector).forEach(host=>{
    host.addEventListener('pointerenter',()=>showTip(host));host.addEventListener('pointerleave',hideTip);
    host.addEventListener('focus',()=>{if(host.matches(':focus-visible'))showTip(host,true);});host.addEventListener('blur',hideTip);
  });
  function syncTipLabels(){hideTip();document.querySelector('.section-dots').setAttribute('aria-label',({en:'Page sections',es:'Secciones de la página',fr:'Sections de la page',de:'Seitenabschnitte',pt:'Secções da página',it:'Sezioni della pagina'})[root.lang]||'Page sections');}
  new MutationObserver(syncTipLabels).observe(root,{attributes:true,attributeFilter:['lang','data-theme']});
  syncTipLabels();
  document.addEventListener('keydown',e=>{if(e.key==='Escape')hideTip();});
  document.addEventListener('click',e=>{
    hideTip();
    const a=e.target.closest('a[href]');
    if(!a||reduce.matches||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.download)return;
    let url;try{url=new URL(a.href,location.href);}catch{return;}
    if(!/^https?:$/.test(url.protocol)||url.origin===location.origin)return;
    clearTimeout(exitTimer);exit.classList.remove('is-active');void exit.offsetWidth;exit.classList.add('is-active');
    exitTimer=setTimeout(()=>exit.classList.remove('is-active'),650);
    if(a.target!=='_blank'){e.preventDefault();setTimeout(()=>location.assign(url.href),280);}
  });
  function motionChanged(){root.classList.toggle('magnet-ready',fine.matches&&!reduce.matches);if(reduce.matches){finish();exit.classList.remove('is-active');document.querySelectorAll('.cursor-impact-rays').forEach(e=>e.remove());}resetInteractions();}
  reduce.addEventListener('change',motionChanged);fine.addEventListener('change',motionChanged);
  motionChanged();
})();
