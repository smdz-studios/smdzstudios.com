(() => {
  'use strict';
  const root=document.documentElement,button=document.getElementById('refresh-status'),stamp=document.getElementById('status-time');
  const rows=[...document.querySelectorAll('[data-service]')];
  const copy={en:['Checking','Reachable','Unverified','Check failed','Last checked','Checking services…'],es:['Comprobando','Accesible','Sin verificar','Comprobación fallida','Última comprobación','Comprobando servicios…'],fr:['Vérification','Accessible','Non vérifié','Échec de vérification','Dernière vérification','Vérification des services…'],de:['Wird geprüft','Erreichbar','Nicht geprüft','Prüfung fehlgeschlagen','Letzte Prüfung','Dienste werden geprüft…'],pt:['A verificar','Acessível','Não verificado','Falha na verificação','Última verificação','A verificar serviços…'],it:['Verifica in corso','Raggiungibile','Non verificato','Verifica non riuscita','Ultima verifica','Verifica dei servizi…']};
  const keys={checking:0,up:1,unknown:2,failed:3};
  let last=null,busy=false;
  const chartKeys=['up','unknown','failed','checking'];
  function render(){
    const lang=root.lang in copy?root.lang:'en',t=copy[lang],total=rows.length,counts={up:0,unknown:0,failed:0,checking:0};
    rows.forEach(row=>{const el=row.querySelector('.service-indicator'),state=Object.hasOwn(counts,el.dataset.state)?el.dataset.state:'unknown';counts[state]++;el.querySelector('.state-label').textContent=t[keys[state]];});
    const format=new Intl.NumberFormat(lang,{style:'percent',maximumFractionDigits:1});
    let offset=0;
    for(const key of chartKeys){
      const count=counts[key],fraction=total?count/total:0,segment=document.querySelector(`[data-segment="${key}"]`);
      document.getElementById('metric-'+key).textContent=String(count);
      document.getElementById('percent-'+key).textContent=format.format(fraction);
      const length=fraction*100;
      segment.setAttribute('stroke-dasharray',`${length} ${100-length}`);
      segment.setAttribute('stroke-dashoffset',String(-offset));
      segment.style.opacity=count?1:0;
      offset+=length;
    }
    document.querySelector('.status-legend-row[data-metric="checking"]').hidden=!counts.checking;
    document.getElementById('metric-total').textContent=String(total);
    stamp.textContent=busy?t[5]:last?`${t[4]}: ${new Intl.DateTimeFormat(lang,{dateStyle:'short',timeStyle:'medium'}).format(last)}`:'—';
  }
  function set(row,state){row.querySelector('.service-indicator').dataset.state=state;render();}
  async function check(row,url){
    if(!url){set(row,'unknown');return;}
    let endpoint;try{endpoint=new URL(url,document.baseURI);if(!['http:','https:'].includes(endpoint.protocol))throw Error();}catch{set(row,'unknown');return;}
    const same=endpoint.origin===location.origin,controller=new AbortController(),timer=setTimeout(()=>controller.abort(),6500);
    try{const res=await fetch(endpoint.href,{cache:'no-store',mode:'cors',credentials:same?'same-origin':'omit',signal:controller.signal});if(same&&endpoint.pathname===new URL('./assets/data/health.json',document.baseURI).pathname){const json=await res.json();set(row,res.ok&&json.status==='ok'?'up':'failed');}else set(row,res.ok?'up':'failed');}catch{set(row,same?'failed':'unknown');}finally{clearTimeout(timer);}
  }
  async function refresh(){if(busy)return;busy=true;button.disabled=true;rows.forEach(row=>row.querySelector('.service-indicator').dataset.state='checking');render();let config={landing:'./assets/data/health.json'};try{const res=await fetch('./assets/data/status-config.json',{cache:'no-store',signal:AbortSignal.timeout(5000)});if(res.ok)config=await res.json();}catch{}await Promise.all(rows.map(row=>check(row,config[row.dataset.service])));last=new Date();busy=false;button.disabled=false;render();}
  new MutationObserver(render).observe(root,{attributes:true,attributeFilter:['lang']});button.addEventListener('click',refresh);refresh();
})();
