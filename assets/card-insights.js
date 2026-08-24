(()=>{
// Status layer — 24 Aug 2026.
// Keeps current operational information visible without rewriting the main app.

const projectInsights={
  'Lab Zero':{last:'Sessions 0–6 terminées ; socle LabCore validé',measure:'NEXT · Session 7 / I²C',tags:['PlatformIO','ESP32','PWM','Servo']},
  'LabVision':{last:'Projet actif après la bifurcation depuis Lab Zero',measure:'NEXT · protocole capture + plateau',tags:['Vision','3D','Photogrammétrie','COLMAP']},
  'Astrophotography Pipeline':{last:'Pipeline FITS disponible comme base réutilisable',measure:'Potentiel · Exoplanet Watch',tags:['Python','FITS','Image processing']},
  'Stage Toulouse':{last:'Objectif 1A maintenu ; préparation progressive du profil',measure:'Horizon · été 2027',tags:['Toulouse','Aérospatial','Réseau']},
  'Finance IA':{last:'Mis en veille pour réduire la charge mentale',measure:'Pas de charge hebdo',tags:['Finance','IA']},
  'Boutique bijoux Lily':{last:'Projet mis de côté par décision de Lily',measure:'Archive · non prioritaire',tags:['Ne pas planifier']},
  'Jarvis / Private Lab':{last:'Concept futur de Lab Origin',measure:'Horizon · après socle Lab',tags:['Automation','Assistant local']},
  'Semestre international':{last:'Mobilité 3A à préparer plus tard',measure:'Horizon · 3A',tags:['International','Mobilité']}
};

const opportunityInsights={
  'NASA Exoplanet Watch':{last:'Piste NASA la plus accessible immédiatement',measure:'Démarrage libre',options:['Python','Light curves','Citizen science']},
  'NASA Space Apps Challenge 2026':{last:'À garder dans le radar automne 2026',measure:'Hackathon · équipe',options:['NASA','Data','Prototype']},
  'UNOOSA Space4Youth':{last:'Surveillance automatisée activée',measure:'ONU · spatial',options:['UNOOSA','Youth','Space']},
  'UN Volunteers · technical missions':{last:'Ne retenir que les missions techniques pertinentes',measure:'Radar opportuniste',options:['Data','Tech','Remote']},
  'UNITAR Global Youth Scholars':{last:'Surveiller uniquement cohorte gratuite / bon ROI',measure:'UNITAR',options:['Youth','International','SDGs']},
  'Stage 1A Toulouse':{last:'Rentrée imminente : priorité au cadre ENSMA avant candidatures',measure:'Objectif · été 2027',options:['Airbus','ONERA','Safran','Liebherr']},
  'EPFL E3':{last:'Piste recherche conservée sans urgence immédiate',measure:'Research 2027',options:['Fluid mechanics','Controls','Space']}
};

const currentAlerts=[
  {id:'ast-rentree',label:'1 sept.',text:'Rentrée ENSMA — admis sur titre confirmée par Mme Delaune'},
  {id:'return-poitiers',label:'À sécuriser',text:'Retour Paris → Poitiers du 30 août : aucun billet retour retrouvé dans les mails/calendrier'},
  {id:'supabase-pause',label:'Dashboard',text:'Supabase annonce que le projet assann-dashboard risque d’être mis en pause pour inactivité'},
  {id:'notilus-cnrs',label:'À vérifier',text:'NOTILUS CNRS signale une mission terminée sans état de frais déclaré'}
];

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function insightHTML(x,isOpportunity=false){const chips=(isOpportunity?x.options:x.tags)||[],chipsLabel=isOpportunity?'Options':'Repères';return `<div class="card-insights"><div class="insight-line"><span class="insight-label">Dernière action</span><strong class="insight-value">${esc(x.last)}</strong></div><div class="insight-line"><span class="insight-label">${isOpportunity?'Repère':'Mesure'}</span><strong class="insight-value">${esc(x.measure)}</strong></div>${chips.length?`<div class="insight-chips-row"><span class="insight-label">${chipsLabel}</span><div class="option-chips">${chips.map(v=>`<span>${esc(v)}</span>`).join('')}</div></div>`:''}</div>`}

function decorateCards(){
  document.querySelectorAll('.project').forEach(card=>{
    if(card.querySelector('.card-insights'))return;
    const name=card.querySelector('h3')?.textContent.trim(),x=projectInsights[name];
    if(x)card.insertAdjacentHTML('beforeend',insightHTML(x,false));
  });
  document.querySelectorAll('.opportunity').forEach(card=>{
    if(card.querySelector('.card-insights'))return;
    const name=card.querySelector('h3')?.textContent.trim(),x=opportunityInsights[name];
    if(x)card.insertAdjacentHTML('beforeend',insightHTML(x,true));
  });
}

function injectCurrentAlerts(){
  const box=document.getElementById('attentionList');
  if(!box)return;
  currentAlerts.slice(0,4).reverse().forEach(a=>{
    if(box.querySelector(`[data-current-alert="${a.id}"]`))return;
    box.insertAdjacentHTML('afterbegin',`<div class="node" data-current-alert="${a.id}"><strong>${esc(a.label)}</strong><span>${esc(a.text)}</span></div>`);
  });
}

function injectCalendarContext(){
  const ensmaList=document.getElementById('ensmaEvents');
  if(ensmaList && !document.getElementById('astCalendarNotice')){
    ensmaList.insertAdjacentHTML('beforebegin',`<div id="astCalendarNotice" class="callout" style="margin-bottom:12px"><strong>AST · rentrée confirmée</strong><span>Tu es attendu le 1er septembre. Le miroir Aurion affiche l’accueil général du 7 septembre pour les autres 1A.</span></div>`);
  }
  const deadlines=document.getElementById('deadlinesList');
  if(deadlines && !deadlines.querySelector('[data-milestone="ast-2026"]')){
    deadlines.insertAdjacentHTML('afterbegin',`<div class="node" data-milestone="ast-2026"><strong>1 septembre</strong><span>Rentrée ENSMA — admis sur titre (confirmée par la scolarité)</span></div>`);
  }
  if(deadlines && !deadlines.querySelector('[data-milestone="revolut-2027"]')){
    deadlines.insertAdjacentHTML('beforeend',`<div class="node" data-milestone="revolut-2027"><strong>12 février 2027</strong><span>Revolut — mettre à jour les documents d’identité avant restriction du compte</span></div>`);
  }
}

function refreshDecorations(){decorateCards();injectCurrentAlerts();injectCalendarContext()}

const observer=new MutationObserver(()=>refreshDecorations());
document.addEventListener('DOMContentLoaded',()=>{
  refreshDecorations();
  ['projectsGrid','opportunitiesGrid','attentionList','ensmaEvents','deadlinesList'].forEach(id=>{
    const el=document.getElementById(id);if(el)observer.observe(el,{childList:true,subtree:false});
  });
});
})();