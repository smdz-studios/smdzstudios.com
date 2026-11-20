(() => {
  'use strict';
  const root=document.documentElement,button=document.getElementById('refresh-status'),stamp=document.getElementById('status-time');
  const services=[{key:'landing',name:'SMDZ Studios'},{key:'store',name:{en:'Tebex Store',es:'Tienda Tebex',fr:'Boutique Tebex',de:'Tebex-Shop',pt:'Loja Tebex',it:'Negozio Tebex'}},{key:'docs',name:{en:'Documentation',es:'Documentación',fr:'Documentation',de:'Dokumentation',pt:'Documentação',it:'Documentazione'}},{key:'discord',name:'Discord'}];
  const states=new Map(services.map(({key})=>[key,'unknown']));
  const copy={en:['Checking','Reachable','Unverified','Check failed','Last checked','Checking services…'],es:['Comprobando','Accesible','Sin verificar','Comprobación fallida','Última comprobación','Comprobando servicios…'],fr:['Vérification','Accessible','Non vérifié','Échec de vérification','Dernière vérification','Vérification des services…'],de:['Wird geprüft','Erreichbar','Nicht geprüft','Prüfung fehlgeschlagen','Letzte Prüfung','Dienste werden geprüft…'],pt:['A verificar','Acessível','Não verificado','Falha na verificação','Última verificação','A verificar serviços…'],it:['Verifica in corso','Raggiungibile','Non verificato','Verifica non riuscita','Ultima verifica','Verifica dei servizi…']};
  const keys={checking:0,up:1,unknown:2,failed:3};
  let last=null,busy=false;
  const chartKeys=['up','unknown','failed','checking'];
  function render(){
    const lang=root.lang in copy?root.lang:'en',t=copy[lang],total=services.length,counts={up:0,unknown:0,failed:0,checking:0};
    services.forEach(({key})=>{const state=states.get(key);counts[Object.hasOwn(counts,state)?state:'unknown']++;});
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
  let history=null,period=30,loadFailed=false;
  const historyPanel=document.getElementById('uptime-history'),historyRows=document.getElementById('uptime-rows'),incidentList=document.getElementById('uptime-incidents');
  const labels={
    en:['Uptime history','30 days','90 days','Measured availability','Average response time','Recent incidents','No incidents observed in this period','No measurements yet','History unavailable','No recent measurement','Failed check detected','Recovery observed','No data','samples','Unknown','UTC days · availability among conclusive checks; missing checks are not counted. Scheduled checks may be delayed.','Website maintenance is enabled.','No recovery observed','Latency (ms)'],
    es:['Historial de disponibilidad','30 días','90 días','Disponibilidad medida','Tiempo medio de respuesta','Incidencias recientes','No se han observado incidencias en este período','Todavía no hay mediciones','Historial no disponible','Sin medición reciente','Fallo detectado','Recuperación observada','Sin datos','mediciones','Sin verificar','Días UTC · disponibilidad entre comprobaciones concluyentes; las ausentes no cuentan. Las comprobaciones pueden retrasarse.','El mantenimiento de la web está activado.','Sin recuperación observada','Latencia (ms)'],
    fr:['Historique de disponibilité','30 jours','90 jours','Disponibilité mesurée','Temps de réponse moyen','Incidents récents','Aucun incident observé sur cette période','Pas encore de mesures','Historique indisponible','Pas de mesure récente','Échec détecté','Rétablissement observé','Aucune donnée','mesures','Non vérifié','Jours UTC · disponibilité parmi les vérifications concluantes ; les absences sont exclues. Les vérifications peuvent être retardées.','La maintenance du site est activée.','Aucun rétablissement observé','Latence (ms)'],
    de:['Verfügbarkeitsverlauf','30 Tage','90 Tage','Gemessene Verfügbarkeit','Mittlere Antwortzeit','Letzte Vorfälle','Keine Vorfälle in diesem Zeitraum beobachtet','Noch keine Messungen','Verlauf nicht verfügbar','Keine aktuelle Messung','Fehler erkannt','Wiederherstellung beobachtet','Keine Daten','Messungen','Ungeprüft','UTC-Tage · Verfügbarkeit aus eindeutigen Prüfungen; fehlende Prüfungen werden nicht gezählt. Prüfungen können sich verzögern.','Die Website befindet sich in Wartung.','Keine Wiederherstellung beobachtet','Latenz (ms)'],
    pt:['Histórico de disponibilidade','30 dias','90 dias','Disponibilidade medida','Tempo médio de resposta','Incidentes recentes','Nenhum incidente observado neste período','Ainda não existem medições','Histórico indisponível','Sem medição recente','Falha detetada','Recuperação observada','Sem dados','medições','Não verificado','Dias UTC · disponibilidade entre verificações conclusivas; as ausentes não contam. As verificações podem atrasar-se.','A manutenção do site está ativa.','Sem recuperação observada','Latência (ms)'],
    it:['Storico disponibilità','30 giorni','90 giorni','Disponibilità misurata','Tempo medio di risposta','Incidenti recenti','Nessun incidente osservato nel periodo','Nessuna misurazione','Storico non disponibile','Nessuna misurazione recente','Errore rilevato','Ripristino osservato','Nessun dato','misurazioni','Non verificato','Giorni UTC · disponibilità tra verifiche conclusive; quelle mancanti non contano. Le verifiche possono subire ritardi.','La manutenzione del sito è attiva.','Nessun ripristino osservato','Latenza (ms)']};
  const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
  function drawHistory(){
    const lang=root.lang in labels?root.lang:'en',t=labels[lang],now=Math.floor(Date.now()/1000),end=Math.floor(now/86400)*86400,start=end-(period-1)*86400;
    const pct=new Intl.NumberFormat(lang,{style:'percent',maximumFractionDigits:2}),num=new Intl.NumberFormat(lang),dayFormat=new Intl.DateTimeFormat(lang,{month:'short',day:'numeric',timeZone:'UTC'}),dateFormat=new Intl.DateTimeFormat(lang,{dateStyle:'medium',timeStyle:'short'});
    historyPanel.querySelectorAll('[data-uptime-label]').forEach(el=>el.textContent=t[Number(el.dataset.uptimeLabel)]);
    historyPanel.querySelectorAll('[data-period]').forEach(el=>el.setAttribute('aria-pressed',String(Number(el.dataset.period)===period)));
    const note=document.getElementById('uptime-empty');note.textContent=loadFailed?t[8]:!history?t[7]:now-history.updated>45*60?t[9]:'';note.hidden=!note.textContent;
    document.getElementById('maintenance-status').hidden=window.SMDZ_SITE_CONFIG?.maintenance?.enabled!==true;
    historyRows.replaceChildren();incidentList.replaceChildren();let incidents=[],any=false;
    for(const service of services){
      const key=service.key,name=typeof service.name==='string'?service.name:service.name[lang],all=history?.services?.[key]||[],samples=all.filter(x=>x[0]>=start&&x[0]<=now),known=samples.filter(x=>x[1]==='up'||x[1]==='failed'),success=known.filter(x=>x[1]==='up');any ||= samples.length>0;
      const line=make('article','uptime-service'),head=make('div','uptime-service-head'),nameNode=make('h3','',name),summary=make('div','uptime-summary');
      summary.append(make('span','',t[3]),make('strong','',known.length?pct.format(success.length/known.length):'—'),make('span','',`${num.format(known.length)}/${num.format(samples.length)} ${t[13]}`),make('span','',`${t[4]}: ${success.length?num.format(Math.round(success.reduce((a,x)=>a+x[2],0)/success.length))+' ms':'—'}`));const identity=make('div','uptime-service-identity'),state=states.get(key)||'unknown',indicator=make('span','uptime-current',copy[lang][keys[state]]);indicator.dataset.state=state;identity.append(nameNode,indicator);head.append(identity,summary);line.append(head);
      const days=Array.from({length:period},()=>[]);for(const x of samples){const i=Math.floor((x[0]-start)/86400);if(days[i])days[i].push(x);}
      const bars=make('div','uptime-bars');bars.style.setProperty('--days',period);bars.setAttribute('role','img');bars.setAttribute('aria-label',`${name}: ${t[3]} ${known.length?pct.format(success.length/known.length):t[12]}`);
      days.forEach((day,i)=>{const up=day.filter(x=>x[1]==='up').length,fail=day.filter(x=>x[1]==='failed').length,unknown=day.length-up-fail,bar=make('span','uptime-day');bar.dataset.state=fail?(up?'mixed':'failed'):up?(unknown?'partial':'up'):unknown?'unknown':'empty';bar.title=`${dayFormat.format(new Date((start+i*86400)*1000))} · ${up+fail?pct.format(up/(up+fail)):t[12]} · ${day.length} ${t[13]}`;bars.append(bar);});line.append(bars);
      const axis=make('div','uptime-axis');axis.append(make('span','',dayFormat.format(new Date(start*1000))),make('span','',dayFormat.format(new Date(end*1000))));line.append(axis);
      const daily=days.map(day=>{const a=day.filter(x=>x[1]==='up');return a.length?a.reduce((sum,x)=>sum+x[2],0)/a.length:null;});
      const max=Math.max(1,...daily.filter(x=>x!==null)),svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 300 45');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('class','uptime-latency');svg.setAttribute('role','img');svg.setAttribute('aria-label',t[18]);line.append(make('span','uptime-axis',t[18]));
      let path='',connected=false;daily.forEach((val,i)=>{if(val===null){connected=false;return;}const x=2+i*296/Math.max(1,period-1),y=42-val/max*38;path+=`${connected?'L':'M'}${x.toFixed(2)} ${y.toFixed(2)} `;connected=true;const dot=document.createElementNS(svg.namespaceURI,'circle');dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('r','1.5');svg.append(dot);});const trace=document.createElementNS(svg.namespaceURI,'path');trace.setAttribute('d',path);svg.prepend(trace);line.append(svg);historyRows.append(line);
      let open=null;for(const x of all){if(x[1]==='failed'&&!open){open={name,start:x[0],end:null};}else if(x[1]==='up'&&open){open.end=x[0];if(open.end>=start)incidents.push(open);open=null;}}if(open&&samples.length)incidents.push(open);
    }
    incidents.sort((a,b)=>b.start-a.start);if(!incidents.length)incidentList.append(make('p','uptime-note',any?t[6]:t[7]));else incidents.slice(0,12).forEach(item=>{const li=make('div','uptime-incident');li.append(make('strong','',item.name),make('span','',`${t[10]}: ${dateFormat.format(new Date(item.start*1000))}`),make('span','',item.end?`${t[11]}: ${dateFormat.format(new Date(item.end*1000))}`:t[17]));incidentList.append(li);});
  }
  function validData(data){return data?.version===1&&Number.isFinite(data.updated)&&data.services&&services.every(({key})=>Array.isArray(data.services[key])&&data.services[key].every(x=>Array.isArray(x)&&Number.isFinite(x[0])&&['up','failed','unknown'].includes(x[1])&&Number.isFinite(x[2])));}
  async function refresh(){if(busy)return;busy=true;button.disabled=true;services.forEach(({key})=>states.set(key,'checking'));render();drawHistory();loadFailed=false;try{const url=window.SMDZ_SITE_CONFIG?.uptimeDataUrl;if(!url)throw Error();const res=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(10000)});if(res.status===404){history=null;last=null;}else if(!res.ok)throw Error();if(res.status===404){loadFailed=false;}else{const data=await res.json();if(!validData(data))throw Error();history=data;last=new Date(data.updated*1000);}}catch{loadFailed=true;}const now=Date.now()/1000;services.forEach(({key})=>{const sample=history?.services?.[key]?.at(-1);states.set(key,sample&&now-sample[0]<=45*60?sample[1]:'unknown');});busy=false;button.disabled=false;render();drawHistory();}
  historyPanel.querySelectorAll('[data-period]').forEach(el=>el.addEventListener('click',()=>{period=Number(el.dataset.period);drawHistory();}));
  new MutationObserver(()=>{render();drawHistory();}).observe(root,{attributes:true,attributeFilter:['lang']});button.addEventListener('click',refresh);drawHistory();refresh();setInterval(()=>{if(!document.hidden)refresh();},60000);
})();
