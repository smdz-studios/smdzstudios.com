(() => {
  'use strict';
  const root = document.documentElement;
  const clock = document.getElementById('madrid-time');
  const zone = document.getElementById('madrid-zone');
  const period=document.getElementById('madrid-period');
  const periodCopy={en:['Day in Madrid','Night in Madrid'],es:['Día en Madrid','Noche en Madrid'],fr:['Jour à Madrid','Nuit à Madrid'],de:['Tag in Madrid','Nacht in Madrid'],pt:['Dia em Madrid','Noite em Madrid'],it:['Giorno a Madrid','Notte a Madrid']};
  const dayIcon='<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>';
  const nightIcon='<path d="M20.9 13.35A9 9 0 0 1 10.65 3.1 9 9 0 1 0 20.9 13.35Z"/>';
  function isDaylight(date){
    const rad=Math.PI/180, day=(date.getTime()-Date.UTC(date.getUTCFullYear(),0,1))/86400000;
    const gamma=2*Math.PI/365*(day-.5);
    const equation=229.18*(.000075+.001868*Math.cos(gamma)-.032077*Math.sin(gamma)-.014615*Math.cos(2*gamma)-.040849*Math.sin(2*gamma));
    const decl=.006918-.399912*Math.cos(gamma)+.070257*Math.sin(gamma)-.006758*Math.cos(2*gamma)+.000907*Math.sin(2*gamma)-.002697*Math.cos(3*gamma)+.00148*Math.sin(3*gamma);
    const solarMinutes=((date.getUTCHours()*60+date.getUTCMinutes()+date.getUTCSeconds()/60+equation+4*(-3.7038))%1440+1440)%1440;
    const latitude=40.4168*rad, angle=(solarMinutes/4-180)*rad;
    const altitude=Math.asin(Math.sin(latitude)*Math.sin(decl)+Math.cos(latitude)*Math.cos(decl)*Math.cos(angle));
    return altitude>=-.833*rad;
  }
  let clockFormat, zoneFormat, clockLang, clockTimer;
  function updateClock() {
    clearTimeout(clockTimer);
    const lang = root.lang || 'en';
    if (clockLang !== lang) {
      clockLang = lang;
      clockFormat = new Intl.DateTimeFormat('en-GB', {timeZone:'Europe/Madrid', hour:'2-digit', minute:'2-digit', second:'2-digit', hourCycle:'h23'});
      zoneFormat = new Intl.DateTimeFormat(lang, {timeZone:'Europe/Madrid', timeZoneName:'short', hour:'2-digit'});
    }
    const now = new Date();
    clock.textContent = clockFormat.format(now);
    clock.dateTime = now.toISOString();
    if(period){const day=isDaylight(now),name=day?'day':'night';if(period.dataset.period!==name){period.dataset.period=name;period.innerHTML=day?dayIcon:nightIcon;}period.setAttribute('aria-label',(periodCopy[lang]||periodCopy.en)[day?0:1]);}
    const offset = zoneFormat.formatToParts(now).find(part => part.type === 'timeZoneName');
    zone.textContent = 'Europe/Madrid' + (offset ? ' · ' + offset.value : '');
    if (!document.hidden) clockTimer = setTimeout(updateClock, 1000 - now.getMilliseconds() + 12);
  }
  new MutationObserver(updateClock).observe(root, {attributes:true, attributeFilter:['lang']});
  document.addEventListener('visibilitychange', updateClock);
  updateClock();
  const canvas = document.getElementById('ambient-particles');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let width = 0, height = 0, frame = 0, last = 0, elapsed = 0, particles = [];
  let mouse = null;
  const random = (min,max) => min + Math.random()*(max-min);
  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width*dpr);
    canvas.height = Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count = Math.max(12,Math.min(38,Math.round(width*height/40000)));
    particles = Array.from({length:count}, (_, i) => {
      const side = i%2 === 0;
      return {x:random(side ? .025 : .66,side ? .34 : .975)*width,y:random(.04,.97)*height,size:random(1.3,3.6),opacity:random(.19,.53),phase:random(0,6.28),speed:random(.19,.42),kind:i%3,rx:0,ry:0};
    });
  }
  function draw(now) {
    frame = 0;
    if (reduce.matches || document.hidden) return;
    const dt = last ? Math.min(.05,(now-last)/1000) : 0;
    last = now;
    elapsed += dt;
    ctx.clearRect(0,0,width,height);
    const dark = root.dataset.theme === 'dark';
    ctx.strokeStyle = dark ? '#ffcc28' : '#9b7000';
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = 1.25;
    ctx.lineCap = 'round';
    particles.forEach(p => {
      const x = p.x + Math.sin(elapsed*p.speed+p.phase)*16;
      const y = p.y + Math.cos(elapsed*p.speed*.85+p.phase)*22;
      let tx = 0, ty = 0;
      if (mouse && fine.matches) {
        const dx=x-mouse.x, dy=y-mouse.y, d=Math.hypot(dx,dy);
        if (d>0 && d<165) { const amount=(1-d/165)*38; tx=dx/d*amount; ty=dy/d*amount; }
      }
      const smoothing = 1-Math.exp(-dt*6);
      p.rx += (tx-p.rx)*smoothing;
      p.ry += (ty-p.ry)*smoothing;
      ctx.save();
      ctx.translate(x+p.rx,y+p.ry);
      ctx.globalAlpha=p.opacity*(.78+.22*Math.sin(elapsed*.8+p.phase));
      const s=p.size;
      ctx.beginPath();
      if (p.kind===0) { ctx.moveTo(-s,0);ctx.lineTo(s,0);ctx.moveTo(0,-s);ctx.lineTo(0,s);ctx.stroke(); }
      else if (p.kind===1) { ctx.moveTo(0,-s*1.3);ctx.lineTo(s,0);ctx.lineTo(0,s*1.3);ctx.lineTo(-s,0);ctx.closePath();ctx.stroke(); }
      else { ctx.arc(0,0,s*.56,0,Math.PI*2);ctx.fill(); }
      ctx.restore();
    });
    frame=requestAnimationFrame(draw);
  }
  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame=0;last=0;
    if (reduce.matches || document.hidden) { ctx.clearRect(0,0,width,height); return; }
    resize();
    frame=requestAnimationFrame(draw);
  }
  addEventListener('resize',sync,{passive:true});
  addEventListener('pointermove', e => { if(e.pointerType==='mouse' && fine.matches) mouse={x:e.clientX,y:e.clientY}; },{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>{mouse=null;});
  addEventListener('blur',()=>{mouse=null;});
  document.addEventListener('visibilitychange',sync);
  reduce.addEventListener('change',sync);
  sync();
})();
