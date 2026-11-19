(function(){
  'use strict';
  if (window.SMDZBoldlineScrollbars) return;
  const targets = new Map();
  const supported = !!(window.PointerEvent && window.requestAnimationFrame && window.ResizeObserver);
  if (!supported) return;
  const minThumb = 36;
  let frame = 0, pendingScan = false, counter = 0;
  const isHidden = node => !!(node.closest('[hidden]') || getComputedStyle(node).visibility==='hidden');
  const rootElement = document.scrollingElement || document.documentElement;
  const railLabels={en:["Vertical scroll","Horizontal scroll"],es:["Desplazamiento vertical","Desplazamiento horizontal"],fr:["Défilement vertical","Défilement horizontal"],de:["Vertikaler Bildlauf","Horizontaler Bildlauf"],pt:["Deslocamento vertical","Deslocamento horizontal"],it:["Scorrimento verticale","Scorrimento orizzontale"]};
  const railLabel=axis=>(railLabels[document.documentElement.lang]||railLabels.en)[axis==='y'?0:1];
  function createRail(axis, element, root){
    const track = document.createElement('div');
    const thumb = document.createElement('div');
    track.className = 'bl-sb-track bl-sb-'+axis;
    track.setAttribute('role','scrollbar');
    track.setAttribute('aria-label',railLabel(axis));
    track.setAttribute('aria-orientation',axis==='y'?'vertical':'horizontal');
    track.setAttribute('aria-valuemin','0');
    track.setAttribute('aria-valuenow','0');
    track.setAttribute('aria-valuemax','0');
    track.tabIndex = -1;
    track.style.display='none';
    thumb.className='bl-sb-thumb';
    track.appendChild(thumb);
    document.body.appendChild(track);
    const id = root ? 'bl-scroll-document' : element.id || ('bl-scroll-region-'+(++counter));
    if (!root && !element.id) element.id=id;
    if (root && !document.getElementById(id)){

      (document.querySelector('.app-root') || document.body).id=id;
    }
    track.setAttribute('aria-controls',id);
    const state = {element, root, axis, track, thumb, shown:false, size:0, travel:0, max:0, origin:0, pointer:-1};
    const value = () => root ? (axis==='y'?window.scrollY:window.scrollX) : (axis==='y'?element.scrollTop:element.scrollLeft);
    const scrollTo = next => {
      if (root){
        if(axis==='y') window.scrollTo({top:next,behavior:'instant'});
        else window.scrollTo({left:next,behavior:'instant'});
      } else if(axis==='y') element.scrollTop=next;
      else element.scrollLeft=next;
      schedule();
    };
    track.addEventListener('pointerdown',event=>{
      if(event.button!==0)return;
      if(thumb.contains(event.target))return;
      event.preventDefault();
      const rect=track.getBoundingClientRect();
      const pos=axis==='y'?event.clientY-rect.top:event.clientX-rect.left;
      scrollTo(((pos-state.size/2)/Math.max(1,state.travel))*state.max);
      track.focus({preventScroll:true});
    });
    thumb.addEventListener('pointerdown',event=>{
      if(event.button!==0)return;
      event.preventDefault();event.stopPropagation();
      state.pointer=event.pointerId;
      state.origin=axis==='y'?event.clientY:event.clientX;
      state.start=value();
      thumb.setPointerCapture(event.pointerId);
      track.classList.add('bl-sb-grabbing');
    });
    thumb.addEventListener('pointermove',event=>{
      if(state.pointer!==event.pointerId)return;
      const delta=(axis==='y'?event.clientY:event.clientX)-state.origin;
      scrollTo(state.start+delta/Math.max(1,state.travel)*state.max);
    });
    function endDrag(event){
      if(state.pointer!==event.pointerId)return;
      state.pointer=-1;
      track.classList.remove('bl-sb-grabbing');
    }
    thumb.addEventListener('pointerup',endDrag);
    thumb.addEventListener('pointercancel',endDrag);
    thumb.addEventListener('lostpointercapture',endDrag);
    track.addEventListener('wheel',event=>{
      if(!state.shown)return;
      event.preventDefault();
      const delta=axis==='y'?(event.deltaY||event.deltaX):(event.deltaX||event.deltaY);
      scrollTo(value()+delta);
    },{passive:false});
    track.addEventListener('keydown',event=>{
      const step=40, view=axis==='y'?(root?innerHeight:element.clientHeight):(root?innerWidth:element.clientWidth);
      let offset;
      if(event.key==='Home') offset=0;
      else if(event.key==='End') offset=state.max;
      else if(event.key==='PageDown') offset=value()+view*.85;
      else if(event.key==='PageUp') offset=value()-view*.85;
      else if(event.key===(axis==='y'?'ArrowDown':'ArrowRight')) offset=value()+step;
      else if(event.key===(axis==='y'?'ArrowUp':'ArrowLeft')) offset=value()-step;
      else return;
      event.preventDefault();scrollTo(offset);
    });
    return state;
  }
  function add(element, axes='auto'){
    if (!element || targets.has(element)) return;
    const root=element===window || element===document || element===rootElement;
    const el=root?rootElement:element;
    if(!root)el.classList.add('bl-sb-native-hide');
    const states=[];
    if(axes==='auto'||axes.includes('y')) states.push(createRail('y',el,root));
    if((axes==='auto'&&!root)||axes.includes('x')) states.push(createRail('x',el,root));
    targets.set(element,states);
    if(!root){el.addEventListener('scroll',schedule,{passive:true}); observer.observe(el);}
    schedule();
  }
  const observer = new ResizeObserver(schedule);
  function paintRail(state){
    const {element:el,root,axis,track,thumb}=state;
    const modal = !!document.querySelector('.overlay:not([hidden]), #detailsDrawer:not([hidden]), #confirmOverlay:not([hidden])');
    const rect=root?{top:0,bottom:innerHeight,left:0,right:innerWidth,width:innerWidth,height:innerHeight}:el.getBoundingClientRect();


    const crossOffscreen = !root && (axis==='x'
      ? (rect.bottom<=0 || rect.top>=innerHeight)
      : (rect.right<=0 || rect.left>=innerWidth));
    const invisible=!root&&(isHidden(el)||rect.width<=0||rect.height<=0||crossOffscreen);
    const blocked=root&&(modal||document.body.style.overflow==='hidden');
    const client=axis==='y'?(root?innerHeight:el.clientHeight):(root?innerWidth:el.clientWidth);
    const full=axis==='y'?el.scrollHeight:el.scrollWidth;
    const max=Math.max(0,full-client);
    const y=axis==='y';
    const start=Math.max(6,(y?rect.top:rect.left)+6);
    const end=Math.min(y?innerHeight-6:innerWidth-6,(y?rect.bottom:rect.right)-6);
    const length=end-start;
    const needed=max>2 && length>45 && !invisible && !blocked;
    if(!needed){track.style.display='none';track.tabIndex=-1;state.shown=false;return;}
    state.shown=true;
    track.style.display='block';track.tabIndex=0;
    track.style.top=y?start+'px':Math.min(innerHeight-22,rect.bottom-22)+'px';
    track.style.left=y?Math.min(innerWidth-22,Math.max(3,rect.right-22))+'px':start+'px';
    if(y){track.style.height=length+'px'; track.style.width='16px';}
    else {track.style.width=length+'px';track.style.height='16px';}
    const trackSize=length-6;
    const thumbSize=Math.min(trackSize,Math.max(minThumb,trackSize*client/full));
    state.size=thumbSize;
    state.travel=Math.max(0,trackSize-thumbSize);
    state.max=max;
    const scrollPos=root?(y?window.scrollY:window.scrollX):(y?el.scrollTop:el.scrollLeft);
    const offset=Math.max(0,Math.min(state.travel,scrollPos/max*state.travel));
    if(y){thumb.style.height=thumbSize+'px';thumb.style.width='100%';thumb.style.transform='translate3d(0,'+offset+'px,0)';}
    else {thumb.style.width=thumbSize+'px';thumb.style.height='100%';thumb.style.transform='translate3d('+offset+'px,0,0)';}
    track.setAttribute('aria-valuenow',String(Math.round(scrollPos)));
    track.setAttribute('aria-valuemax',String(Math.round(max)));
  }
  function refresh(){frame=0;targets.forEach(states=>states.forEach(state=>{state.track.setAttribute('aria-label',railLabel(state.axis));paintRail(state);}));}
  const languageObserver=new MutationObserver(schedule);
  languageObserver.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  function schedule(){if(!frame)frame=requestAnimationFrame(refresh);}
  const selectors='[data-bl-scroll],.dialog-body,#detailsDrawer,.bl-select-menu,.bl-date-calendar,textarea.field';
  function scan(){
    pendingScan=false;
    document.querySelectorAll(selectors).forEach(el=>{
      if(el.classList.contains('bl-sb-track'))return;
      add(el,'auto');
    });
    schedule();
  }
  function scheduleScan(){
    if(pendingScan)return;
    pendingScan=true;
    requestAnimationFrame(scan);
  }
  function destroy(){
    mutation.disconnect();observer.disconnect();languageObserver.disconnect();
    targets.forEach(states=>states.forEach(s=>s.track.remove()));
    targets.clear();
    document.documentElement.classList.remove('bl-scrollbars-on');
  }
  const mutation=new MutationObserver(records=>{
    let requiresScan=false;
    for(const rec of records){
      if(rec.type==='attributes'){if(rec.attributeName==='hidden') schedule();continue;}
      if(rec.addedNodes.length||rec.removedNodes.length){requiresScan=true;break;}
    }
    if(requiresScan)scheduleScan();
  });
  function init(){
    document.documentElement.classList.add('bl-scrollbars-on');
    add(window,'y');
    scan();

    mutation.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
    window.addEventListener('resize',schedule,{passive:true});
    window.addEventListener('scroll',schedule,{passive:true});
    document.addEventListener('transitionend',schedule,{passive:true});
    observer.observe(document.documentElement);
    observer.observe(document.body);
  }
  window.SMDZBoldlineScrollbars={add,refresh:schedule,destroy};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
