(() => {
  'use strict';
  const root=document.documentElement;
  const host=document.querySelector('.header-actions');
  const storageKey='smdz-bl-accent';
  const defaultColor='#FFCC28';
  const presets=['#FFCC28','#FF872B','#94EC31','#38BDF8','#A78BFA','#F472B6','#40D9A4','#EF5265'];
  const copy={
    en:{button:'Change accent color',title:'ACCENT COLOR',subtitle:'Make SMDZ Studios yours.',presets:'PRESET COLORS',custom:'CUSTOM COLOR',hex:'HEX CODE',reset:'RESET TO DEFAULT',close:'Close color picker',picker:'Choose a custom color',invalid:'Enter a valid 6-digit HEX color',names:['Yellow','Orange','Lime','Sky blue','Purple','Pink','Mint','Red'],selected:'Selected color'},
    es:{button:'Cambiar color de acento',title:'COLOR DE ACENTO',subtitle:'Personaliza SMDZ Studios.',presets:'COLORES PREDEFINIDOS',custom:'COLOR PERSONALIZADO',hex:'CÓDIGO HEX',reset:'RESTABLECER AMARILLO',close:'Cerrar selector de color',picker:'Elegir un color personalizado',invalid:'Introduce un código HEX válido de 6 dígitos',names:['Amarillo','Naranja','Lima','Azul cielo','Morado','Rosa','Menta','Rojo'],selected:'Color seleccionado'},
    fr:{button:'Changer la couleur d’accent',title:'COULEUR D’ACCENT',subtitle:'Personnalisez SMDZ Studios.',presets:'COULEURS PROPOSÉES',custom:'COULEUR PERSONNALISÉE',hex:'CODE HEX',reset:'RÉTABLIR LE JAUNE',close:'Fermer le sélecteur de couleur',picker:'Choisir une couleur personnalisée',invalid:'Saisissez un code HEX valide à 6 chiffres',names:['Jaune','Orange','Citron vert','Bleu ciel','Violet','Rose','Menthe','Rouge'],selected:'Couleur choisie'},
    de:{button:'Akzentfarbe ändern',title:'AKZENTFARBE',subtitle:'Passe SMDZ Studios an.',presets:'FARBVORLAGEN',custom:'EIGENE FARBE',hex:'HEX-CODE',reset:'GELB WIEDERHERSTELLEN',close:'Farbauswahl schließen',picker:'Eigene Farbe auswählen',invalid:'Gib einen gültigen 6-stelligen HEX-Code ein',names:['Gelb','Orange','Limette','Hellblau','Lila','Rosa','Mint','Rot'],selected:'Ausgewählte Farbe'},
    pt:{button:'Alterar a cor de destaque',title:'COR DE DESTAQUE',subtitle:'Personaliza a SMDZ Studios.',presets:'CORES PREDEFINIDAS',custom:'COR PERSONALIZADA',hex:'CÓDIGO HEX',reset:'REPOR AMARELO ORIGINAL',close:'Fechar seletor de cor',picker:'Escolher cor personalizada',invalid:'Introduz um código HEX válido de 6 dígitos',names:['Amarelo','Laranja','Lima','Azul-céu','Roxo','Rosa','Menta','Vermelho'],selected:'Cor selecionada'},
    it:{button:'Cambia colore principale',title:'COLORE ACCENTO',subtitle:'Personalizza SMDZ Studios.',presets:'COLORI PREDEFINITI',custom:'COLORE PERSONALIZZATO',hex:'CODICE HEX',reset:'RIPRISTINA IL GIALLO',close:'Chiudi selettore colori',picker:'Scegli un colore personalizzato',invalid:'Inserisci un codice HEX valido di 6 cifre',names:['Giallo','Arancione','Lime','Azzurro','Viola','Rosa','Menta','Rosso'],selected:'Colore selezionato'}
  };
  const normalize=value=>{
    if(typeof value!=='string')return null;
    const hex=value.trim().replace(/^#/,'').toUpperCase();
    return /^[0-9A-F]{6}$/.test(hex)?'#'+hex:null;
  };
  const rgb=color=>[1,3,5].map(i=>parseInt(color.slice(i,i+2),16));
  const toHex=color=>'#'+color.map(n=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0')).join('').toUpperCase();
  const mix=(a,b,p)=>toHex(rgb(a).map((n,i)=>n*(1-p)+rgb(b)[i]*p));
  const luminance=color=>{
    const [r,g,b]=rgb(color).map(n=>{const v=n/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});
    return .2126*r+.7152*g+.0722*b;
  };
  const contrast=(a,b)=>{
    const x=luminance(a),y=luminance(b);
    return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
  };
  const readable=(color,background)=>{
    if(contrast(color,background)>=4.5)return color;
    const target=luminance(background)>.25?'#000000':'#FFFFFF';
    for(let step=1;step<=100;step++){
      const next=mix(color,target,step/100);
      if(contrast(next,background)>=4.5)return next;
    }
    return target;
  };

  const alphaKey='smdz-bl-accent-alpha';
  const extra={
    en:['COLOR EDITOR','HUE','ALPHA','QUICK COLORS','APPLY','Saturation and brightness','Saturation','Brightness','SHIFT + ARROWS TO ADJUST · ESC TO CLOSE','Copied!','Select HEX to copy','#RGB, #RRGGBB or #RRGGBBAA'],
    es:['EDITOR DE COLOR','TONO','OPACIDAD','COLORES RÁPIDOS','APLICAR','Saturación y brillo','Saturación','Brillo','MAYÚS + FLECHAS PARA AJUSTAR · ESC PARA CERRAR','¡Copiado!','Selecciona el HEX para copiar','#RGB, #RRGGBB o #RRGGBBAA'],
    fr:['ÉDITEUR DE COULEUR','TEINTE','OPACITÉ','COULEURS RAPIDES','APPLIQUER','Saturation et luminosité','Saturation','Luminosité','MAJ + FLÈCHES POUR AJUSTER · ESC POUR FERMER','Copié !','Sélectionnez le HEX pour copier','#RGB, #RRGGBB ou #RRGGBBAA'],
    de:['FARBEDITOR','FARBTON','DECKKRAFT','SCHNELLFARBEN','ANWENDEN','Sättigung und Helligkeit','Sättigung','Helligkeit','UMSCHALT + PFEILE ZUM ÄNDERN · ESC SCHLIESST','Kopiert!','HEX zum Kopieren auswählen','#RGB, #RRGGBB oder #RRGGBBAA'],
    pt:['EDITOR DE COR','TOM','OPACIDADE','CORES RÁPIDAS','APLICAR','Saturação e brilho','Saturação','Brilho','SHIFT + SETAS PARA AJUSTAR · ESC PARA FECHAR','Copiado!','Seleciona o HEX para copiar','#RGB, #RRGGBB ou #RRGGBBAA'],
    it:['EDITOR COLORE','TONALITÀ','OPACITÀ','COLORI RAPIDI','APPLICA','Saturazione e luminosità','Saturazione','Luminosità','MAIUSC + FRECCE PER REGOLARE · ESC PER CHIUDERE','Copiato!','Seleziona il HEX per copiare','#RGB, #RRGGBB o #RRGGBBAA']
  };
  const language=()=>Object.hasOwn(copy,root.lang)?root.lang:'en';
  const t=()=>copy[language()];
  const x=()=>extra[language()];
  const copyLabel={en:'Copy HEX',es:'Copiar HEX',fr:'Copier le HEX',de:'HEX kopieren',pt:'Copiar HEX',it:'Copia HEX'};
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const read=()=>{try{return normalize(localStorage.getItem(storageKey))}catch{return null}};
  const readAlpha=()=>{try{const value=localStorage.getItem(alphaKey);return value===null?100:clamp(Number(value)||0,0,100)}catch{return 100}};
  let current=read(),opacity=current===null?100:readAlpha();
  let hue=0,saturation=0,brightness=1,button,panel,plane,knob,hueInput,alphaInput,hueOutput,alphaOutput,hexInput,presetHost,result,copyButton,error;
  const rgbToHsv=hex=>{
    const [r,g,b]=rgb(hex).map(n=>n/255),max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;
    let h=0;
    if(d)h=max===r?((g-b)/d)%6:max===g?(b-r)/d+2:(r-g)/d+4;
    return [((h*60)%360+360)%360,max===0?0:d/max,max];
  };
  const hsvToRgb=(h,s,v)=>{
    const f=n=>{const k=(n+h/60)%6;return Math.round((v-v*s*Math.max(Math.min(k,4-k,1),0))*255);};
    return [f(5),f(3),f(1)];
  };
  const chosen=()=>current||defaultColor;
  const save=()=>{try{if(current===null){localStorage.removeItem(storageKey);localStorage.removeItem(alphaKey)}else{localStorage.setItem(storageKey,current);localStorage.setItem(alphaKey,String(opacity))}}catch{}};
  const parseHex=value=>{
    if(typeof value!=='string')return null;
    const v=value.trim().replace(/^#/,'').toUpperCase();
    if(/^[0-9A-F]{3}$/.test(v))return {color:'#'+[...v].map(c=>c+c).join(''),alpha:null};
    if(/^[0-9A-F]{6}$/.test(v))return {color:'#'+v,alpha:null};
    if(/^[0-9A-F]{8}$/.test(v))return {color:'#'+v.slice(0,6),alpha:Math.round(parseInt(v.slice(6),16)*100/255)};
    return null;
  };
  const swatch=()=>{const [r,g,b]=rgb(chosen());return 'rgba('+r+','+g+','+b+','+opacity/100+')'};
  function updateScheme(){
    if(current===null){
      root.dataset.accent='yellow';
      for(const name of ['--bl-accent','--bl-accent-dark','--bl-accent-light','--bl-on-accent'])root.style.removeProperty(name);
      return;
    }
    const dark=root.dataset.theme==='dark',surface=dark?'#313338':'#F2F3F3';
    const visible=mix(surface,current,opacity/100);
    root.dataset.accent='custom';
    root.style.setProperty('--bl-accent',visible);
    root.style.setProperty('--bl-accent-dark',readable(visible,surface));
    root.style.setProperty('--bl-accent-light',mix(visible,dark?'#313338':'#FFFFFF',dark?.78:.85));
    root.style.setProperty('--bl-on-accent',contrast(visible,'#15171A')>=contrast(visible,'#FFFFFF')?'#15171A':'#FFFFFF');
  }
  function render(){
    if(button)button.style.setProperty('--smdz-picker-active',chosen());
    if(!panel)return;
    plane.style.setProperty('--bl-picker-hue',String(Math.round(hue)));
    knob.style.left=(saturation*100)+'%';knob.style.top=((1-brightness)*100)+'%';
    plane.setAttribute('aria-valuenow',String(Math.round(brightness*100)));
    plane.setAttribute('aria-valuetext',x()[6]+' '+Math.round(saturation*100)+'%, '+x()[7]+' '+Math.round(brightness*100)+'%');
    hueInput.value=String(Math.round(hue));alphaInput.value=String(opacity);
    hueOutput.textContent=Math.round(hue)+'°';alphaOutput.textContent=opacity+'%';
    panel.style.setProperty('--picker-opaque',chosen());panel.style.setProperty('--picker-swatch',swatch());
    if(document.activeElement!==hexInput){hexInput.value=chosen();hexInput.setAttribute('aria-invalid','false')}
    [...presetHost.children].forEach((item,i)=>{const active=presets[i]===chosen();item.classList.toggle('is-active',active);item.setAttribute('aria-pressed',String(active))});
  }
  function change(persist=true){
    current=toHex(hsvToRgb(hue,saturation,brightness));
    updateScheme();if(persist)save();render();
  }
  function changeHex(value){
    const parsed=parseHex(value);if(!parsed)return false;
    [hue,saturation,brightness]=rgbToHsv(parsed.color);
    if(parsed.alpha!==null)opacity=parsed.alpha;
    change();return true;
  }
  function reset(){
    current=null;opacity=100;[hue,saturation,brightness]=rgbToHsv(defaultColor);
    updateScheme();save();render();clearError();
  }
  [hue,saturation,brightness]=rgbToHsv(chosen());
  updateScheme();
  if(!host)return;
  const base=new URL('../../../',document.currentScript.src);
  const stylesheet=document.createElement('link');stylesheet.rel='stylesheet';
  stylesheet.href=new URL('assets/css/core/accent-picker.css?v=20261121-boldline-v18',base).href;
  document.head.append(stylesheet);
  const wrapper=document.createElement('div');wrapper.className='smdz-accent-control';
  button=document.createElement('button');button.className='btn smdz-accent-trigger';
  button.id='accent-picker-trigger';button.type='button';
  button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','accent-picker-panel');button.setAttribute('aria-expanded','false');
  button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18h1.6a2 2 0 0 0 1.2-3.6 1.6 1.6 0 0 1 .8-2.9H18A3 3 0 0 0 21 11c0-4.4-4-8-9-8Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="6.8" r="1"/><circle cx="16" cy="8" r="1"/></svg><span class="smdz-accent-dot" aria-hidden="true"></span>';
  wrapper.append(button);host.insertBefore(wrapper,document.getElementById('theme'));
  panel=document.createElement('div');panel.id='accent-picker-panel';panel.className='bl-color-popover smdz-accent-panel';panel.hidden=true;
  panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','false');panel.setAttribute('aria-labelledby','accent-picker-title');panel.setAttribute('data-bl-scroll','');
  panel.innerHTML=[
    '<div class="bl-picker-header smdz-accent-head"><div class="smdz-accent-heading"><span class="smdz-accent-kicker">SMDZ STUDIOS / UI</span><strong id="accent-picker-title"></strong><p class="smdz-accent-description"></p></div><button class="bl-color-dismiss smdz-accent-close" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>',
    '<div class="bl-color-sv" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100"><span class="bl-color-handle"></span></div>',
    '<div class="bl-color-control-line"><span class="bl-color-control-label smdz-accent-hue-label"></span><input class="bl-color-hue" type="range" min="0" max="360" step="1"><output class="bl-hue-value"></output></div>',
    '<div class="bl-color-control-line"><span class="bl-color-control-label smdz-accent-alpha-label"></span><input class="bl-color-alpha" type="range" min="0" max="100" step="1"><output class="bl-alpha-value"></output></div>',
    '<div class="bl-color-edit-line"><span class="bl-color-result" aria-hidden="true"></span><label class="bl-hex-label"><span>HEX</span><input class="bl-color-hex-input" id="accent-hex-input" type="text" maxlength="9" spellcheck="false" autocomplete="off" aria-describedby="accent-hex-error"></label><button class="btn bl-color-copy" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg></button></div>',
    '<p class="smdz-accent-error" id="accent-hex-error" role="status" hidden></p>',
    '<div class="smdz-accent-preset-heading" id="accent-preset-label"></div><div class="bl-color-quick smdz-accent-presets" role="group" aria-labelledby="accent-preset-label"></div>',
    '<div class="bl-picker-footer smdz-accent-footer"><span class="bl-picker-hint smdz-accent-hint"></span><div class="smdz-accent-actions"><button class="btn btn-small smdz-accent-reset" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 2.6-6.4M3 4v6h6"/></svg></button><button class="btn btn-primary btn-small smdz-accent-apply" type="button"></button></div></div>'
  ].join('');
  document.body.append(panel);
  plane=panel.querySelector('.bl-color-sv');knob=panel.querySelector('.bl-color-handle');
  hueInput=panel.querySelector('.bl-color-hue');alphaInput=panel.querySelector('.bl-color-alpha');
  hueOutput=panel.querySelector('.bl-hue-value');alphaOutput=panel.querySelector('.bl-alpha-value');
  hexInput=panel.querySelector('.bl-color-hex-input');presetHost=panel.querySelector('.smdz-accent-presets');
  result=panel.querySelector('.bl-color-result');copyButton=panel.querySelector('.bl-color-copy');error=panel.querySelector('.smdz-accent-error');
  const dismiss=panel.querySelector('.smdz-accent-close'),resetButton=panel.querySelector('.smdz-accent-reset'),applyButton=panel.querySelector('.smdz-accent-apply');
  for(const [i,value] of presets.entries()){
    const item=document.createElement('button');item.type='button';item.style.setProperty('--swatch',value);item.setAttribute('aria-pressed','false');
    item.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';
    item.addEventListener('click',()=>{opacity=100;changeHex(value);clearError()});
    presetHost.append(item);
  }
  function clearError(){error.hidden=true;hexInput.setAttribute('aria-invalid','false')}
  function translate(){
    const words=t(),labels=x();button.setAttribute('aria-label',words.button);button.title=words.button;
    panel.querySelector('#accent-picker-title').textContent=labels[0];
    panel.querySelector('.smdz-accent-description').textContent=words.subtitle;
    panel.querySelector('.smdz-accent-hue-label').textContent=labels[1];panel.querySelector('.smdz-accent-alpha-label').textContent=labels[2];
    panel.querySelector('#accent-preset-label').textContent=labels[3];panel.querySelector('.smdz-accent-hint').textContent=labels[8];
    plane.setAttribute('aria-label',labels[5]);hueInput.setAttribute('aria-label',labels[1]);alphaInput.setAttribute('aria-label',labels[2]);
    hexInput.setAttribute('aria-label',words.hex);dismiss.setAttribute('aria-label',words.close);
    resetButton.setAttribute('aria-label',words.reset);resetButton.title=words.reset;
    applyButton.textContent=labels[4];copyButton.setAttribute('aria-label',copyLabel[language()]);copyButton.title=copyLabel[language()];
    error.textContent=words.invalid+' ('+labels[11]+')';
    [...presetHost.children].forEach((item,i)=>{item.setAttribute('aria-label',words.names[i]+' · '+presets[i]);item.title=words.names[i]});
    render();
  }
  function position(){
    if(panel.hidden)return;
    const anchor=button.getBoundingClientRect(),width=panel.offsetWidth,height=panel.offsetHeight;
    const left=clamp(anchor.right-width,12,Math.max(12,innerWidth-width-12));
    const down=anchor.bottom+10,up=anchor.top-height-10;
    const top=down+height<=innerHeight-12?down:up>=12?up:clamp(down,12,Math.max(12,innerHeight-height-12));
    panel.style.left=left+'px';panel.style.top=top+'px';panel.dataset.side=top<anchor.top?'top':'bottom';
  }
  function close(focus=true){
    if(panel.hidden)return;
    panel.hidden=true;button.setAttribute('aria-expanded','false');clearError();
    if(focus)button.focus({preventScroll:true});
  }
  function open(){
    if(!panel.hidden){close();return}
    translate();panel.hidden=false;button.setAttribute('aria-expanded','true');position();plane.focus({preventScroll:true});
  }
  let pointer=null;
  function setSV(event){
    const rect=plane.getBoundingClientRect();
    saturation=clamp((event.clientX-rect.left)/rect.width,0,1);
    brightness=1-clamp((event.clientY-rect.top)/rect.height,0,1);
    change();clearError();
  }
  plane.addEventListener('pointerdown',event=>{if(event.button!==0)return;event.preventDefault();plane.focus({preventScroll:true});pointer=event.pointerId;plane.setPointerCapture?.(pointer);setSV(event)});
  plane.addEventListener('pointermove',event=>{if(event.pointerId===pointer)setSV(event)});
  for(const type of ['pointerup','pointercancel'])plane.addEventListener(type,event=>{if(event.pointerId===pointer)pointer=null});
  plane.addEventListener('keydown',event=>{
    const step=event.shiftKey?.05:.01;
    if(event.key==='ArrowLeft')saturation=clamp(saturation-step,0,1);
    else if(event.key==='ArrowRight')saturation=clamp(saturation+step,0,1);
    else if(event.key==='ArrowUp')brightness=clamp(brightness+step,0,1);
    else if(event.key==='ArrowDown')brightness=clamp(brightness-step,0,1);
    else return;
    event.preventDefault();change();clearError();
  });
  hueInput.addEventListener('input',()=>{hue=Number(hueInput.value);change();clearError()});
  alphaInput.addEventListener('input',()=>{opacity=Number(alphaInput.value);change();clearError()});
  function acceptHex(){
    if(changeHex(hexInput.value)){clearError();hexInput.value=chosen();return true}
    hexInput.setAttribute('aria-invalid','true');error.hidden=false;return false;
  }
  hexInput.addEventListener('input',()=>{if(parseHex(hexInput.value)){changeHex(hexInput.value);clearError()}});
  hexInput.addEventListener('change',acceptHex);
  hexInput.addEventListener('blur',()=>{if(!parseHex(hexInput.value)){hexInput.value=chosen();clearError()}});
  hexInput.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();if(acceptHex())close()}});
  copyButton.addEventListener('click',async()=>{
    const suffix=opacity===100?'':Math.round(opacity*255/100).toString(16).padStart(2,'0').toUpperCase();
    try{await navigator.clipboard.writeText(chosen()+suffix);copyButton.title=x()[9];copyButton.setAttribute('aria-label',x()[9])}
    catch{hexInput.focus();hexInput.select();copyButton.title=x()[10]}
  });
  button.addEventListener('click',open);dismiss.addEventListener('click',()=>close());applyButton.addEventListener('click',()=>close());resetButton.addEventListener('click',reset);
  document.addEventListener('pointerdown',event=>{if(!panel.hidden&&!panel.contains(event.target)&&!wrapper.contains(event.target))close(false)});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){event.preventDefault();event.stopPropagation();close()}},true);
  addEventListener('resize',position,{passive:true});addEventListener('scroll',position,{passive:true});
  addEventListener('storage',event=>{if(event.key===storageKey||event.key===alphaKey){current=read();opacity=current===null?100:readAlpha();[hue,saturation,brightness]=rgbToHsv(chosen());updateScheme();render()}});
  new MutationObserver(records=>{if(records.some(r=>r.attributeName==='data-theme'))updateScheme();if(records.some(r=>r.attributeName==='lang'))translate()}).observe(root,{attributes:true,attributeFilter:['lang','data-theme']});
  translate();render();

})();
