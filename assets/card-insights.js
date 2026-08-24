(()=>{
// Status layer — 24 Aug 2026 evening.
// Only current, actionable information belongs here.

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
  {id:'registration-payment',label:'ENSMA',text:'Dossier d’inscription validé. Frais d’inscription à régler via WebAurion dès que l’accès fonctionne.'},
  {id:'ensma-account',label:'Compte ENSMA',text:'Compte informatique reçu. L’adresse mail ENSMA devient le canal officiel pour toute la scolarité.'},
  {id:'ast-rentree',label:'1 sept. · 13h40',text:'Rentrée admis sur titre : accueil ENSMA, contrôle d’identité, puis réunion en A102 à 14h. Prendre CNI ou passeport.'},
  {id:'supabase-pause',label:'Dashboard',text:'Supabase annonce que le projet assann-dashboard risque d’être mis en pause pour inactivité.'}
];

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function insightHTML(x,isOpportunity=false){const chips=(isOpportunity?x.options:x.tags)||[],chipsLabel=isOpportunity?'Options':'Repères';return `<div class="card-insights"><div class="insight-line"><span class="insight-label">Dernière action</span><strong class="insight-value">${esc(x.last)}</strong></div><div class="insight-line"><span class="insight-label">${isOpportunity?'Repère':'Mesure'}</span><strong class="insight-value">${esc(x.measure)}</strong></div>${chips.length?`<div class="insight-chips-row"><span class="insight-label">${chipsLabel}</span><div class="option-chips">${chips.map(v=>`<span>${esc(v)}</span>`).join('')}</div></div>`:''}</div>`}
function decorateCards(){document.querySelectorAll('.project').forEach(card=>{if(card.querySelector('.card-insights'))return;const name=card.querySelector('h3')?.textContent.trim(),x=projectInsights[name];if(x)card.insertAdjacentHTML('beforeend',insightHTML(x,false))});document.querySelectorAll('.opportunity').forEach(card=>{if(card.querySelector('.card-insights'))return;const name=card.querySelector('h3')?.textContent.trim(),x=opportunityInsights[name];if(x)card.insertAdjacentHTML('beforeend',insightHTML(x,true))})}
function injectCurrentAlerts(){const box=document.getElementById('attentionList');if(!box)return;box.querySelectorAll('[data-current-alert]').forEach(n=>n.remove());currentAlerts.slice().reverse().forEach(a=>box.insertAdjacentHTML('afterbegin',`<div class="node" data-current-alert="${a.id}"><strong>${esc(a.label)}</strong><span>${esc(a.text)}</span></div>`))}
function injectCalendarContext(){const ensmaList=document.getElementById('ensmaEvents');if(ensmaList&&!document.getElementById('astCalendarNotice'))ensmaList.insertAdjacentHTML('beforebegin',`<div id="astCalendarNotice" class="callout" style="margin-bottom:12px"><strong>AST · mardi 1er septembre</strong><span>Accueil à 13h40, contrôle d’identité, réunion A102 à 14h. Le 7 septembre concerne les admis sur concours.</span></div>`);const deadlines=document.getElementById('deadlinesList');if(deadlines&&!deadlines.querySelector('[data-milestone="registration-payment"]'))deadlines.insertAdjacentHTML('afterbegin',`<div class="node" data-milestone="registration-payment"><strong>Dès accès WebAurion</strong><span>Régler les frais d’inscription ENSMA — dossier déjà validé</span></div>`);if(deadlines&&!deadlines.querySelector('[data-milestone="revolut-2027"]'))deadlines.insertAdjacentHTML('beforeend',`<div class="node" data-milestone="revolut-2027"><strong>12 février 2027</strong><span>Revolut — mettre à jour les documents d’identité avant restriction du compte</span></div>`)}
function refreshDecorations(){decorateCards();injectCurrentAlerts();injectCalendarContext()}
const observer=new MutationObserver(()=>refreshDecorations());document.addEventListener('DOMContentLoaded',()=>{refreshDecorations();['projectsGrid','opportunitiesGrid','attentionList','ensmaEvents','deadlinesList'].forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el,{childList:true,subtree:false})})});
})();