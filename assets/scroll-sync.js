(() => {
  'use strict';
  const root=document.documentElement;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const home=!!document.getElementById('home');
  const introTargets=home?[...document.querySelectorAll('.studio-ribbon,.site-header,.hero [data-enter]')]:[];
  const targets=[...document.querySelectorAll('[data-reveal],.status-heading,.status-overview,.status-list-heading,.service-tile,.status-note,.status-bottom,.error-panel,.error-footer')];
  const all=[...new Set([...targets,...introTargets])];
  const introSet=new Set(introTargets);
  let introDone=!home,frame=0,started=false,settleTimer=0;
  const clamp=v=>Math.max(0,Math.min(1,v));
  const ease=v=>v*v*(3-2*v);
  function position(el){let top=0,node=el;while(node){top+=node.offsetTop;node=node.offsetParent;}return top;}
  function update(){
    frame=0;
    if(reduce.matches){root.classList.remove('scroll-synced');all.forEach(el=>{el.removeAttribute('data-scroll-sync');el.classList.remove('scroll-drawing');});return;}
    const y=window.scrollY,h=window.innerHeight;
    const values=all.filter(el=>introDone||!introSet.has(el)).map(el=>{
      const top=position(el)-y,height=el.offsetHeight,bottom=top+height;
      const distance=Math.max(1,Math.min(150,height*.7,h*.22));
      const entering=clamp((h-top)/distance),leaving=clamp(bottom/distance);
      const p=ease(Math.min(entering,leaving));
      const shift=(entering<leaving?1:-1)*(1-p)*18;
      return {el,p,shift};
    });
    root.classList.add('scroll-synced');
    values.forEach(({el,p,shift})=>{
      el.setAttribute('data-scroll-sync','');
      el.style.setProperty('--reveal-opacity',p.toFixed(4));
      el.style.setProperty('--reveal-shift',`${shift.toFixed(2)}px`);
      if(el.id==='studio'||el.id==='custom-work'){
        el.style.setProperty('--reveal-dash',((1-p)*100).toFixed(2));
        el.classList.toggle('scroll-drawing',p<.995);
      }
    });
  }
  function queue(){if(!frame)frame=requestAnimationFrame(update);}
  function settle(){clearTimeout(settleTimer);settleTimer=setTimeout(()=>{introDone=true;queue();},2250);}
  function start(){if(started)return;started=true;queue();if(home){if(root.classList.contains('intro-ready'))settle();else addEventListener('smdz:intro-ready',settle,{once:true});}}
  addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue,{passive:true});addEventListener('pageshow',queue);addEventListener('focusin',queue);
  reduce.addEventListener('change',()=>{if(reduce.matches){clearTimeout(settleTimer);introDone=true;}queue();});
  if('ResizeObserver' in window){const observer=new ResizeObserver(queue);observer.observe(document.body);all.forEach(el=>observer.observe(el));}
  document.fonts?.ready.then(queue);
  new MutationObserver(queue).observe(root,{attributes:true,attributeFilter:['lang']});
  start();
})();
