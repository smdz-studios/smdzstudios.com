(() => {
  'use strict';
  const section=document.getElementById('faq');
  if(!section)return;
  const list=section.querySelector('#faq-list');
  if(!list)return;
  section.querySelectorAll('.faq-controls, .faq-empty').forEach(element=>element.remove());
  const icon='<svg class="faq-toggle-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  const root=document.documentElement;
  const entries=[
    {id:'studio',text:{
      en:['What is SMDZ Studios?','An independent development studio creating systems, interfaces and game assets for GTA V and Red Dead Redemption 2 communities, primarily through FiveM and RedM.'],
      es:['¿Qué es SMDZ Studios?','Un estudio independiente que desarrolla sistemas, interfaces y assets para comunidades de GTA V y Red Dead Redemption 2, principalmente mediante FiveM y RedM.'],
      fr:['Qu’est-ce que SMDZ Studios ?','Un studio indépendant créant des systèmes, interfaces et assets de jeu pour les communautés GTA V et Red Dead Redemption 2, principalement via FiveM et RedM.'],
      de:['Was ist SMDZ Studios?','Ein unabhängiges Entwicklungsstudio für Systeme, Oberflächen und Spiel-Assets für GTA V und Red Dead Redemption 2, hauptsächlich über FiveM und RedM.'],
      pt:['O que é a SMDZ Studios?','Um estúdio independente que desenvolve sistemas, interfaces e assets para comunidades de GTA V e Red Dead Redemption 2, sobretudo através do FiveM e RedM.'],
      it:['Che cos’è SMDZ Studios?','Uno studio indipendente che crea sistemi, interfacce e asset per le community di GTA V e Red Dead Redemption 2, principalmente attraverso FiveM e RedM.']
    }},
    {id:'compatibility',text:{
      en:['Which frameworks and servers are supported?','Compatibility depends on the specific project. Check each product page and its documentation for the supported frameworks and requirements.'],
      es:['¿Qué frameworks y servidores son compatibles?','La compatibilidad depende de cada proyecto. Consulta la ficha de cada producto y su documentación para conocer los frameworks y requisitos compatibles.'],
      fr:['Quels frameworks et serveurs sont compatibles ?','La compatibilité dépend du projet. Consultez la page du produit et sa documentation pour connaître les frameworks et prérequis pris en charge.'],
      de:['Welche Frameworks und Server werden unterstützt?','Die Kompatibilität hängt vom jeweiligen Projekt ab. Unterstützte Frameworks und Anforderungen stehen auf der Produktseite und in der Dokumentation.'],
      pt:['Que frameworks e servidores são compatíveis?','A compatibilidade depende de cada projeto. Consulta a página de cada produto e a respetiva documentação para conhecer os frameworks e requisitos.'],
      it:['Quali framework e server sono compatibili?','La compatibilità dipende dal progetto. Controlla la pagina di ogni prodotto e la documentazione per i framework e i requisiti supportati.']
    },href:'https://docs.smdz-studios.com/',link:{en:'Read documentation',es:'Ver documentación',fr:'Lire la documentation',de:'Dokumentation öffnen',pt:'Ver documentação',it:'Leggi la documentazione'}},
    {id:'custom',text:{
      en:['Can I request a custom project?','Yes. Send a brief description through our Discord support channel. Availability is displayed on this website; scope, pricing and delivery terms are discussed individually.'],
      es:['¿Puedo solicitar un proyecto personalizado?','Sí. Envía una breve descripción a través del soporte de Discord. La disponibilidad aparece en esta web; el alcance, precio y condiciones se acuerdan individualmente.'],
      fr:['Puis-je demander un projet sur mesure ?','Oui. Décrivez votre idée sur notre Discord de support. La disponibilité figure sur ce site ; le périmètre, le prix et les conditions sont définis au cas par cas.'],
      de:['Kann ich ein individuelles Projekt anfragen?','Ja. Beschreibe deine Idee im Discord-Support. Die Verfügbarkeit steht auf dieser Website; Umfang, Preis und Bedingungen werden einzeln vereinbart.'],
      pt:['Posso pedir um projeto personalizado?','Sim. Envia uma breve descrição pelo suporte do Discord. A disponibilidade está neste site; o âmbito, o preço e as condições são acordados individualmente.'],
      it:['Posso richiedere un progetto personalizzato?','Sì. Descrivi brevemente la tua idea tramite il supporto Discord. La disponibilità è indicata qui; ambito, prezzo e condizioni sono concordati individualmente.']
    },href:'./discord/',link:{en:'Contact support',es:'Contactar con soporte',fr:'Contacter le support',de:'Support kontaktieren',pt:'Contactar o suporte',it:'Contatta il supporto'}},
    {id:'installation',text:{
      en:['Where can I find installation instructions?','Setup guides, configuration instructions and other technical information are available in the documentation for each product.'],
      es:['¿Dónde encuentro las instrucciones de instalación?','Las guías de instalación, configuración y demás información técnica están disponibles en la documentación de cada producto.'],
      fr:['Où trouver les instructions d’installation ?','Les guides d’installation, de configuration et les informations techniques se trouvent dans la documentation de chaque produit.'],
      de:['Wo finde ich Installationsanleitungen?','Installations- und Konfigurationsanleitungen sowie weitere technische Informationen stehen in der jeweiligen Produktdokumentation.'],
      pt:['Onde encontro as instruções de instalação?','Os guias de instalação, configuração e outras informações técnicas estão disponíveis na documentação de cada produto.'],
      it:['Dove trovo le istruzioni di installazione?','Le guide di installazione, configurazione e le informazioni tecniche sono disponibili nella documentazione di ogni prodotto.']
    },href:'https://docs.smdz-studios.com/',link:{en:'Open docs',es:'Abrir documentación',fr:'Ouvrir la documentation',de:'Dokumentation öffnen',pt:'Abrir documentação',it:'Apri la documentazione'}},
    {id:'support',text:{
      en:['How do I contact support?','Visit our Discord community and open a support ticket. Include the product name, a description of the issue and any relevant error messages.'],
      es:['¿Cómo contacto con soporte?','Entra en nuestra comunidad de Discord y abre un ticket. Indica el nombre del producto, qué ocurre y los mensajes de error relevantes.'],
      fr:['Comment contacter le support ?','Rejoignez notre communauté Discord et ouvrez un ticket. Indiquez le produit, le problème rencontré et les éventuels messages d’erreur.'],
      de:['Wie erreiche ich den Support?','Tritt unserem Discord bei und öffne ein Support-Ticket. Nenne das Produkt, beschreibe das Problem und füge relevante Fehlermeldungen bei.'],
      pt:['Como contacto o suporte?','Entra na nossa comunidade Discord e abre um ticket. Indica o nome do produto, descreve o problema e inclui mensagens de erro relevantes.'],
      it:['Come contatto l’assistenza?','Entra nella nostra community Discord e apri un ticket. Indica il prodotto, descrivi il problema e allega eventuali messaggi di errore.']
    },href:'./discord/',link:{en:'Open Discord',es:'Abrir Discord',fr:'Ouvrir Discord',de:'Discord öffnen',pt:'Abrir Discord',it:'Apri Discord'}},
    {id:'licenses',text:{
      en:['Where can I check licenses and terms?','Please read the product information and our legal terms before purchasing or commissioning work. Different products may have different distribution conditions.'],
      es:['¿Dónde consulto las licencias y condiciones?','Revisa la información de cada producto y las condiciones legales antes de comprar o encargar un trabajo. Las condiciones de distribución pueden variar según el producto.'],
      fr:['Où consulter les licences et conditions ?','Lisez les informations du produit et nos conditions légales avant tout achat ou commande. Les modalités de distribution peuvent varier selon le produit.'],
      de:['Wo stehen Lizenz- und Nutzungsbedingungen?','Lies vor einem Kauf oder Auftrag die Produktinformationen und rechtlichen Bedingungen. Die Vertriebsbedingungen können je nach Produkt variieren.'],
      pt:['Onde posso consultar licenças e condições?','Lê as informações do produto e as condições legais antes de comprar ou encomendar um trabalho. As condições de distribuição podem variar consoante o produto.'],
      it:['Dove posso consultare licenze e condizioni?','Leggi le informazioni del prodotto e le condizioni legali prima di acquistare o commissionare un lavoro. Le condizioni di distribuzione possono variare.']
    },href:'https://smdz-studios.tebex.io/legal',link:{en:'Legal information',es:'Información legal',fr:'Informations légales',de:'Rechtliche Informationen',pt:'Informações legais',it:'Informazioni legali'}},
    {id:'status',text:{
      en:['Where can I see service availability?','The service monitor shows recorded checks for our website and connected services. Tebex reflects its official platform status rather than the availability of our individual store.'],
      es:['¿Dónde puedo consultar el estado de los servicios?','El monitor muestra comprobaciones registradas de nuestra web y servicios conectados. Tebex refleja el estado oficial de su plataforma, no el de nuestra tienda individual.'],
      fr:['Où consulter la disponibilité des services ?','Le moniteur affiche les vérifications de notre site et des services associés. Tebex indique le statut officiel de sa plateforme, pas celui de notre boutique.'],
      de:['Wo sehe ich den Dienststatus?','Der Monitor zeigt Messungen unserer Website und verbundener Dienste. Tebex zeigt den offiziellen Plattformstatus, nicht den Status unseres einzelnen Shops.'],
      pt:['Onde vejo a disponibilidade dos serviços?','O monitor mostra verificações registadas do nosso site e dos serviços associados. O Tebex apresenta o estado oficial da plataforma, não da nossa loja individual.'],
      it:['Dove vedo lo stato dei servizi?','Il monitor mostra le verifiche registrate del sito e dei servizi collegati. Tebex indica lo stato ufficiale della piattaforma, non del nostro singolo negozio.']
    },href:'./status/',link:{en:'Service status',es:'Estado de servicios',fr:'État des services',de:'Dienststatus',pt:'Estado dos serviços',it:'Stato dei servizi'}},
    {id:'settings',text:{
      en:['Can I change the language or appearance?','Yes. Use the controls at the top of the site to select one of six languages or switch between dark and light modes. Your choice is saved in this browser.'],
      es:['¿Puedo cambiar el idioma o la apariencia?','Sí. Usa los controles superiores para elegir uno de los seis idiomas o cambiar entre modo oscuro y claro. Tus preferencias se guardan en este navegador.'],
      fr:['Puis-je changer la langue ou l’apparence ?','Oui. Utilisez les commandes en haut du site pour choisir parmi six langues ou passer du thème sombre au thème clair. Vos préférences sont enregistrées.'],
      de:['Kann ich Sprache oder Design ändern?','Ja. Über die Bedienelemente oben kannst du zwischen sechs Sprachen und hellem oder dunklem Design wählen. Deine Auswahl wird im Browser gespeichert.'],
      pt:['Posso mudar o idioma ou a aparência?','Sim. Usa os controlos no topo para escolher um dos seis idiomas ou alternar entre os modos claro e escuro. As preferências ficam guardadas no navegador.'],
      it:['Posso cambiare lingua o aspetto?','Sì. Usa i controlli in alto per scegliere una delle sei lingue o passare dal tema chiaro a quello scuro. Le preferenze vengono salvate nel browser.']
    }}
  ];
  const base=new URL('../../../',document.currentScript.src);
  const opened=new Set();
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const animations=new WeakMap();
  function expandItem(details,body,expand){
    const running=animations.get(details);
    const startHeight=details.getBoundingClientRect().height;
    if(running){running.cancel();animations.delete(details);}
    body.getAnimations?.().forEach(animation=>animation.cancel());
    if(expand)details.open=true;
    if(reduce.matches||!details.animate){
      details.open=expand;
      details.style.removeProperty('overflow');
      return;
    }
    const endHeight=expand?details.querySelector('summary').offsetHeight+body.offsetHeight:details.querySelector('summary').offsetHeight;
    const duration=expand?340:280;
    details.style.overflow='hidden';
    const animation=details.animate([{height:startHeight+'px'},{height:endHeight+'px'}],{duration,easing:'cubic-bezier(.22,.77,.25,1)',fill:'both'});
    animations.set(details,animation);
    body.animate([{opacity:expand?0:1,transform:expand?'translateY(-8px)':'translateY(0)'},{opacity:expand?1:0,transform:expand?'translateY(0)':'translateY(-8px)'}],{duration,easing:'ease-out'});
    animation.onfinish=()=>{
      if(animations.get(details)!==animation)return;
      details.open=expand;
      details.style.removeProperty('overflow');
      animation.cancel();
      animations.delete(details);
    };
  }

  const current=()=>['en','es','fr','de','pt','it'].includes(root.lang)?root.lang:'en';
  function render(){
    const lang=current();
    const fragment=document.createDocumentFragment();
    for(const entry of entries){
      const [question,answer]=entry.text[lang];
      const details=document.createElement('details');details.className='faq-item';details.dataset.id=entry.id;details.open=opened.has(entry.id);
      const summary=document.createElement('summary');summary.className='faq-question';
      const title=document.createElement('span');title.textContent=question;
      summary.append(title);summary.insertAdjacentHTML('beforeend',icon);
      const body=document.createElement('div');body.className='faq-answer';
      const para=document.createElement('p');para.textContent=answer;body.append(para);
      if(entry.href){
        const link=document.createElement('a');link.className='faq-inline-link';link.href=new URL(entry.href,base).href;link.textContent=entry.link[lang];if(/^https?:\/\//.test(entry.href)){link.target='_blank';link.rel='noopener noreferrer';}
        link.insertAdjacentHTML('beforeend','<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 17 17 7M7 7h10v10"/></svg>');body.append(link);
      }
      details.append(summary,body);
      summary.addEventListener('click',event=>{
        event.preventDefault();
        const expand=!opened.has(entry.id);
        if(expand)opened.add(entry.id);else opened.delete(entry.id);
        expandItem(details,body,expand);
      });
      fragment.append(details);
    }
    list.replaceChildren(fragment);
  }
  new MutationObserver(render).observe(root,{attributes:true,attributeFilter:['lang']});
  render();
})();