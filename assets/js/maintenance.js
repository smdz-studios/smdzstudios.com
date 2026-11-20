(() => {
 const root=document.documentElement,el=document.getElementById('maintenance-message');
 const messages=window.SMDZ_SITE_CONFIG?.maintenance?.message;
 function update(){el.textContent=messages?.[root.lang]||messages?.en||'We are working on improvements. Please check back soon.';}
 new MutationObserver(update).observe(root,{attributes:true,attributeFilter:['lang']});update();
})();
