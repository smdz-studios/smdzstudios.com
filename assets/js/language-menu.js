(() => {
  const root=document.documentElement;
  let timer=0;
  window.smdzToggleLanguageMenu=(options,button,open,focusTarget)=>{
    const wasOpen=button.getAttribute('aria-expanded')==='true';
    if(!open&&(options.hidden||options.classList.contains('menu-closing')))return;
    clearTimeout(timer);
    button.setAttribute('aria-expanded',String(open));
    if(open){options.hidden=false;options.inert=false;options.classList.remove('menu-closing');if(!wasOpen){options.classList.remove('menu-opening');void options.offsetWidth;options.classList.add('menu-opening');}focusTarget?.focus();}
    else {focusTarget?.focus();if(options.contains(document.activeElement))button.focus();options.inert=true;options.classList.remove('menu-opening');if(root.dataset.siteMotion==='reduce'||matchMedia('(prefers-reduced-motion: reduce)').matches){options.hidden=true;options.classList.remove('menu-closing');return;}options.classList.add('menu-closing');timer=setTimeout(()=>{options.hidden=true;options.classList.remove('menu-closing');},180);}
  };
})();
