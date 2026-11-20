(() => {
  const base=new URL('../../../',document.currentScript.src),path=location.pathname;
  const maintenance=new URL('maintenance/',base),home=new URL('index.html',base);
  function route(){const active=window.SMDZ_SITE_CONFIG?.maintenance?.enabled===true;
    const isMaintenance=path===maintenance.pathname||path===maintenance.pathname+'index.html';
    const isStatus=['status.html','status','status/','status/index.html'].some(route=>path===new URL(route,base).pathname);
    if(active&&isStatus)addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('.status-support,.studio-footer a[href$="discord/"]').forEach(a=>a.href='https://discord.gg/6HPcHR4N8m');});
    if(active&&!isMaintenance&&!isStatus){document.documentElement.style.visibility='hidden';location.replace(maintenance.href);}
    if(!active&&isMaintenance&&window.SMDZ_SITE_CONFIG){document.documentElement.style.visibility='hidden';location.replace(home.href);}
  }
  route();addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
})();
