(() => {
  'use strict';
  const root=document.documentElement;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const home=!!document.getElementById('home');
  const introTargets=home?[...document.querySelectorAll('.studio-ribbon,.site-header,.hero [data-enter]')]:[];
  const panels=[...document.querySelectorAll('[data-reveal],.status-heading,.status-overview,.status-list-heading,.service-row,.status-bottom,.error-panel,.error-footer')];
  const groups=['.studio-intro > *','.studio-disciplines > h3,.discipline-row','.tech-heading,.tech-group h3,.tech-item','.custom-body > *','.custom-art','.footer-brand-block,.footer-column,.footer-bottom','.status-heading-copy > *','.status-toolbar,.status-ring,.status-legend-row','.service-copy,.service-bottom','.error-panel > *'];
  const detailTargets=[...new Set(groups.flatMap(selector=>[...document.querySelectorAll(selector)]))];
  const details=new Set(detailTargets);
  const stages=new Map();
  document.querySelectorAll('.studio-intro,.studio-disciplines,.tech-list,.custom-body').forEach(group=>{
    [...group.children].filter(el=>details.has(el)).forEach((el,i)=>stages.set(el,Math.min(i,4)*12));
  });
  const all=[...new Set([...panels,...introTargets,...detailTargets])];
  const introSet=new Set(introTargets);
  let introDone=!home,frame=0,started=false,settleTimer=0;
  const clamp=v=>Math.max(0,Math.min(1,v));
  const ease=v=>v*v*(3-2*v);
  function position(el){let top=0,node=el;while(node){top+=node.offsetTop;node=node.offsetParent;}return top;}
  function update(){
    frame=0;
    if(reduce.matches){root.classList.remove('scroll-synced');all.forEach(el=>{el.removeAttribute('data-scroll-sync');el.classList.remove('scroll-drawing');});return;}
    const y=window.scrollY,h=window.innerHeight,max=Math.max(0,root.scrollHeight-h);
    const values=all.filter(el=>(introDone||!introSet.has(el))&&el.offsetHeight>0).map(el=>{
      const top=position(el)-y,height=el.offsetHeight,bottom=top+height,detail=details.has(el);
      const distance=Math.max(1,Math.min(detail?100:205,height*(detail ? .85 : .74),h*.28));
      const stagger=Math.min(stages.get(el)||0,height*.35,Math.max(0,(h-height)/3));
      const entering=clamp((h-top-stagger)/distance),leaving=clamp((bottom-stagger)/distance);
      const direction=entering<leaving?1:-1;
      let p=ease(Math.min(entering,leaving));
      if((y<=1||y>=max-1)&&top>=-1&&bottom<=h+1)p=1;
      return {el,p,direction,detail};
    });
    root.classList.add('scroll-synced');
    values.forEach(({el,p,direction,detail})=>{
      const hidden=1-p;
      el.setAttribute('data-scroll-sync',detail?'detail':'panel');
      el.style.setProperty('--reveal-opacity',p.toFixed(4));
      el.style.setProperty('--reveal-shift',`${(direction*hidden*(detail?28:23)).toFixed(2)}px`);
      el.style.setProperty('--reveal-scale',(1-hidden*(detail ? .065 : .025)).toFixed(4));
      el.style.setProperty('--reveal-tilt',`${(direction*hidden*(detail ? .9 : .35)).toFixed(3)}deg`);
      if(el.id==='studio'||el.id==='technologies'||el.id==='custom-work'){
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
  new MutationObserver(queue).observe(root,{attributes:true,attributeFilter:['lang','data-theme']});
  start();
})();
