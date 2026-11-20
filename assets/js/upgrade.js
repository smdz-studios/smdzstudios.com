(() => {
  'use strict';
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const ns='http://www.w3.org/2000/svg';
  document.querySelectorAll('#studio,#technologies,#custom-work').forEach(section=>{
    const svg=document.createElementNS(ns,'svg');svg.classList.add('draw-border');svg.setAttribute('aria-hidden','true');
    const rect=document.createElementNS(ns,'rect');rect.setAttribute('pathLength','100');svg.append(rect);section.append(svg);
  });
  document.querySelectorAll('.site-nav .btn,.custom-contact').forEach(btn=>{const span=document.createElement('span');span.className='button-sweep';span.setAttribute('aria-hidden','true');btn.append(span);});
  const logo=document.querySelector('.logo-parallax');
  let count=0,last=0,burst=null,timer=0;
  const activate=()=>{
    const now=performance.now();if(now-last>2200)count=0;last=now;if(++count<5)return;count=0;
    if(reduce.matches)return;
    burst?.remove();clearTimeout(timer);logo.classList.remove('secret-pop');
    const rect=logo.getBoundingClientRect();burst=document.createElement('div');burst.className='secret-burst';burst.setAttribute('aria-hidden','true');burst.style.left=`${rect.left+rect.width/2}px`;burst.style.top=`${rect.top+rect.height/2}px`;
    for(let i=0;i<36;i++){
      const p=document.createElement('i'),a=i*Math.PI*2/36+(Math.random()-.5)*.15,r=80+Math.random()*145;
      p.className='secret-particle '+(i%3===0?'star':i%3===1?'dot':'');
      Object.entries({'--x':`${Math.cos(a)*r}px`,'--y':`${Math.sin(a)*r}px`,'--size':`${5+Math.random()*9}px`,'--spin':`${Math.random()*540-270}deg`,'--duration':`${620+Math.random()*300}ms`,'--color':['#ffcc28','#ffe38b','#f6a922'][i%3]}).forEach(([k,v])=>p.style.setProperty(k,v));burst.append(p);
    }
    document.body.append(burst);requestAnimationFrame(()=>logo.classList.add('secret-pop'));
    timer=setTimeout(()=>{burst?.remove();burst=null;logo.classList.remove('secret-pop');},1050);
  };
  logo?.addEventListener('click',activate);logo?.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();activate();}});
})();
