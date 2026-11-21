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
  let current=null,button=null,panel=null,picker=null,hexInput=null,presetHost=null;
  const language=()=>Object.hasOwn(copy,root.lang)?root.lang:'en';
  const read=()=>{try{return normalize(localStorage.getItem(storageKey))}catch{return null}};
  const write=value=>{try{if(value)localStorage.setItem(storageKey,value);else localStorage.removeItem(storageKey)}catch{}};
  function updateScheme(){
    if(!current)return;
    const dark=root.dataset.theme==='dark';
    const surface=dark?'#313338':'#F2F3F3';
    root.dataset.accent='custom';
    root.style.setProperty('--bl-accent',current);
    root.style.setProperty('--bl-accent-dark',readable(current,surface));
    root.style.setProperty('--bl-accent-light',mix(current,dark?'#313338':'#FFFFFF',dark?.78:.85));
    root.style.setProperty('--bl-on-accent',contrast(current,'#15171A')>=contrast(current,'#FFFFFF')?'#15171A':'#FFFFFF');
  }
  function apply(color,persist=true){
    current=normalize(color);
    if(!current)return;
    updateScheme();
    if(persist)write(current);
    renderSelection();
  }
  function reset(persist=true){
    current=null;
    root.dataset.accent='yellow';
    for(const name of ['--bl-accent','--bl-accent-dark','--bl-accent-light','--bl-on-accent'])root.style.removeProperty(name);
    if(persist)write(null);
    renderSelection();
  }
  function renderSelection(){
    const chosen=current||defaultColor;
    if(button)button.style.setProperty('--smdz-picker-active',chosen);
    if(picker)picker.value=chosen.toLowerCase();
    if(hexInput&&document.activeElement!==hexInput){hexInput.value=chosen;hexInput.removeAttribute('aria-invalid');}
    if(presetHost){
      [...presetHost.children].forEach((item,i)=>{
        const active=presets[i]===chosen;
        item.setAttribute('aria-pressed',String(active));
        item.classList.toggle('is-active',active);
      });
    }
  }
  const stored=read();
  if(stored)apply(stored,false);
  else reset(false);
  if(!host)return;
  const base=new URL('../../../',document.currentScript.src);
  const stylesheet=document.createElement('link');
  stylesheet.rel='stylesheet';
  stylesheet.href=new URL('assets/css/core/accent-picker.css',base).href;
  document.head.append(stylesheet);
  const wrapper=document.createElement('div');
  wrapper.className='smdz-accent-control';
  button=document.createElement('button');
  button.className='btn smdz-accent-trigger';
  button.id='accent-picker-trigger';
  button.type='button';
  button.setAttribute('aria-haspopup','dialog');
  button.setAttribute('aria-controls','accent-picker-panel');
  button.setAttribute('aria-expanded','false');
  button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18h1.6a2 2 0 0 0 1.2-3.6 1.6 1.6 0 0 1 .8-2.9H18A3 3 0 0 0 21 11c0-4.4-4-8-9-8Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="6.8" r="1"/><circle cx="16" cy="8" r="1"/></svg><span class="smdz-accent-dot" aria-hidden="true"></span>';
  wrapper.append(button);
  host.insertBefore(wrapper,document.getElementById('theme'));
  panel=document.createElement('div');
  panel.id='accent-picker-panel';
  panel.className='smdz-accent-panel';
  panel.hidden=true;
  panel.setAttribute('role','dialog');
  panel.setAttribute('aria-modal','false');
  panel.setAttribute('aria-labelledby','accent-picker-title');
  panel.innerHTML='<div class="smdz-accent-top"><div><span class="smdz-accent-kicker">SMDZ STUDIOS</span><h2 id="accent-picker-title"></h2></div><button class="smdz-accent-close" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div><p class="smdz-accent-description"></p><label class="smdz-accent-caption" id="accent-preset-label"></label><div class="smdz-accent-presets" role="group" aria-labelledby="accent-preset-label"></div><label class="smdz-accent-caption" for="accent-hex-input" id="accent-custom-label"></label><div class="smdz-accent-fields"><label class="smdz-accent-native" for="accent-native-input"><input id="accent-native-input" type="color" value="#ffcc28"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18h1.6a2 2 0 0 0 1.2-3.6 1.6 1.6 0 0 1 .8-2.9H18A3 3 0 0 0 21 11c0-4.4-4-8-9-8Z"/></svg></label><input class="smdz-accent-hex" id="accent-hex-input" type="text" inputmode="text" maxlength="7" value="#FFCC28" spellcheck="false" autocomplete="off" aria-describedby="accent-picker-error"><label class="smdz-accent-hex-label" for="accent-hex-input">HEX</label></div><span class="smdz-accent-error" id="accent-picker-error" role="status" hidden></span><button class="smdz-accent-reset" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 2.6-6.4M3 4v6h6"/></svg><span></span></button>';
  document.body.append(panel);
  picker=panel.querySelector('#accent-native-input');
  hexInput=panel.querySelector('#accent-hex-input');
  presetHost=panel.querySelector('.smdz-accent-presets');
  const closeButton=panel.querySelector('.smdz-accent-close');
  const resetButton=panel.querySelector('.smdz-accent-reset');
  const error=panel.querySelector('#accent-picker-error');
  for(const [i,color] of presets.entries()){
    const swatch=document.createElement('button');
    swatch.type='button';
    swatch.className='smdz-accent-preset';
    swatch.style.setProperty('--swatch',color);
    swatch.dataset.index=String(i);
    swatch.setAttribute('aria-pressed','false');
    swatch.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';
    swatch.addEventListener('click',()=>{apply(color);error.hidden=true;hexInput.value=color;});
    presetHost.append(swatch);
  }
  function translate(){
    const t=copy[language()];
    button.setAttribute('aria-label',t.button);
    button.title=t.button;
    panel.querySelector('#accent-picker-title').textContent=t.title;
    panel.querySelector('.smdz-accent-description').textContent=t.subtitle;
    panel.querySelector('#accent-preset-label').textContent=t.presets;
    panel.querySelector('#accent-custom-label').textContent=t.custom;
    panel.querySelector('.smdz-accent-hex-label').textContent=t.hex;
    panel.querySelector('.smdz-accent-reset span').textContent=t.reset;
    closeButton.setAttribute('aria-label',t.close);
    picker.setAttribute('aria-label',t.picker);
    hexInput.setAttribute('aria-label',t.hex);
    error.textContent=t.invalid;
    [...presetHost.children].forEach((el,i)=>{el.setAttribute('aria-label',t.names[i]+' · '+presets[i]);});
  }
  function position(){
    if(panel.hidden)return;
    const rect=button.getBoundingClientRect(),w=panel.offsetWidth,h=panel.offsetHeight;
    const x=Math.max(12,Math.min(rect.right-w,innerWidth-w-12));
    const bottom=rect.bottom+12;
    const y=bottom+h>innerHeight-12&&rect.top>h+12?rect.top-h-12:bottom;
    panel.style.left=x+'px';
    panel.style.top=Math.max(12,y)+'px';
  }
  function close(){
    if(panel.hidden)return;
    panel.hidden=true;
    button.setAttribute('aria-expanded','false');
    hexInput.setAttribute('aria-invalid','false');
    error.hidden=true;
    button.focus({preventScroll:true});
  }
  function open(){
    if(!panel.hidden){close();return;}
    translate();
    renderSelection();
    panel.hidden=false;
    button.setAttribute('aria-expanded','true');
    position();
    closeButton.focus({preventScroll:true});
  }
  button.addEventListener('click',open);
  closeButton.addEventListener('click',close);
  resetButton.addEventListener('click',()=>{reset();hexInput.value=defaultColor;error.hidden=true;});
  picker.addEventListener('input',()=>{apply(picker.value);hexInput.value=(current||defaultColor);error.hidden=true;});
  hexInput.addEventListener('input',()=>{
    const color=normalize(hexInput.value);
    hexInput.setAttribute('aria-invalid',String(!color));
    error.hidden=!!color;
    if(color){apply(color);hexInput.value=color;}
  });
  hexInput.addEventListener('blur',()=>{
    if(!normalize(hexInput.value)){hexInput.value=current||defaultColor;error.hidden=true;hexInput.setAttribute('aria-invalid','false');}
  });
  document.addEventListener('pointerdown',event=>{
    if(!panel.hidden&&!panel.contains(event.target)&&!wrapper.contains(event.target))close();
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){event.preventDefault();event.stopPropagation();close();}},true);
  addEventListener('resize',position,{passive:true});
  addEventListener('scroll',position,{passive:true});
  addEventListener('storage',event=>{if(event.key===storageKey){const value=normalize(event.newValue);if(value)apply(value,false);else reset(false);}});
  new MutationObserver(records=>{
    if(records.some(x=>x.attributeName==='data-theme'))updateScheme();
    if(records.some(x=>x.attributeName==='lang'))translate();
  }).observe(root,{attributes:true,attributeFilter:['lang','data-theme']});
  translate();
  renderSelection();
})();