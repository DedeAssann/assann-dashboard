(()=>{
// Status layer — 25 Sep 2026.\n// Only current, actionable information belongs here.
// Only current, actionable information belongs here.

const projectInsights={
  'Lab Zero':{last:'Sessions 0–6 terminées ; socle LabCore validé',measure:'NEXT · Session 7 / I²C',tags:['PlatformIO','ESP32','PWM','Servo']},
  'LabVision':{last:'Projet actif après la bifurcation depuis Lab Zero',measure:'NEXT · protocole capture + plateau',tags:['Vision','3D','Photogrammétrie','COLMAP']},
  'Astrophotography Pipeline':{last:'Pipeline FITS disponible comme base réutilisable',measure:'Potentiel · Exoplanet Watch',tags:['Python','FITS','Image processing']},
  'Stage Toulouse':{last:'Recherche relancée · Toulouse prioritaire sans fermer les belles opportunités externes',measure:'NEXT · CV + shortlist + Forum Entreprises 15 oct.',tags:['Toulouse','Airbus','ONERA','Safran','Liebherr','CERN']},
  'Finance IA':{last:'Mis en veille pour réduire la charge mentale',measure:'Pas de charge hebdo',tags:['Finance','IA']},
  'Boutique bijoux Lily':{last:'Projet mis de côté par décision de Lily',measure:'Archive · non prioritaire',tags:['Ne pas planifier']},
  'Jarvis / Private Lab':{last:'Concept futur de Lab Origin',measure:'Horizon · après socle Lab',tags:['Automation','Assistant local']},
  'Semestre international':{last:'Présentation RI suivie · schémas S4/S5/S5B/DD identifiés',measure:'Deadlines · 6 nov. IIT Chicago/GE4 · 4 déc. autres destinations',tags:['Laura Montois','RI','S4/S5','Double diplôme']}
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
  {id:'forum-entreprises',label:'15 oct. · Forum Entreprises',text:'Priorité stage 1A : venir avec CV à jour, pitch de 30 s et shortlist Toulouse (Airbus, ONERA, Safran, Liebherr, Thales/CNES selon présence).'},
  {id:'stage-2027',label:'Stage été 2027',text:'Recherche relancée. Toulouse reste prioritaire, sans fermer CERN ni les grands labos/instituts si une offre compatible apparaît.'},
  {id:'mobility-iit-ge4',label:'6 nov. · Mobilité',text:'Deadline IIT Chicago / GE4. Toute demande de mobilité ou de bourse passe par le service Relations Internationales.'},
  {id:'mobility-all',label:'4 déc. · Mobilité',text:'Deadline S5/S5B/double diplôme/candidature libre pour toutes les autres destinations.'}
];

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function insightHTML(x,isOpportunity=false){const chips=(isOpportunity?x.options:x.tags)||[],chipsLabel=isOpportunity?'Options':'Repères';return `<div class="card-insights"><div class="insight-line"><span class="insight-label">Dernière action</span><strong class="insight-value">${esc(x.last)}</strong></div><div class="insight-line"><span class="insight-label">${isOpportunity?'Repère':'Mesure'}</span><strong class="insight-value">${esc(x.measure)}</strong></div>${chips.length?`<div class="insight-chips-row"><span class="insight-label">${chipsLabel}</span><div class="option-chips">${chips.map(v=>`<span>${esc(v)}</span>`).join('')}</div></div>`:''}</div>`}
function decorateCards(){document.querySelectorAll('.project').forEach(card=>{if(card.querySelector('.card-insights'))return;const name=card.querySelector('h3')?.textContent.trim(),x=projectInsights[name];if(x)card.insertAdjacentHTML('beforeend',insightHTML(x,false))});document.querySelectorAll('.opportunity').forEach(card=>{if(card.querySelector('.card-insights'))return;const name=card.querySelector('h3')?.textContent.trim(),x=opportunityInsights[name];if(x)card.insertAdjacentHTML('beforeend',insightHTML(x,true))})}
function injectCurrentAlerts(){const box=document.getElementById('attentionList');if(!box)return;box.querySelectorAll('[data-current-alert]').forEach(n=>n.remove());currentAlerts.slice().reverse().forEach(a=>box.insertAdjacentHTML('afterbegin',`<div class="node" data-current-alert="${a.id}"><strong>${esc(a.label)}</strong><span>${esc(a.text)}</span></div>`))}
function injectCalendarContext(){
  const ensmaList=document.getElementById('ensmaEvents');
  if(ensmaList&&!document.getElementById('riCalendarNotice'))ensmaList.insertAdjacentHTML('beforebegin',`<div id="riCalendarNotice" class="callout" style="margin-bottom:12px"><strong>Relations Internationales</strong><span>Contact : Laura Montois · laura.montois@isae-ensma.fr. Les aides/bourses internationales passent par le service RI.</span></div>`);
  const deadlines=document.getElementById('deadlinesList');
  const items=[
    ['forum-entreprises','15 octobre 2026','Forum Entreprises ENSMA — préparer CV, pitch et shortlist stage Toulouse'],
    ['sup-aero','20 octobre 2026','Événement / visite ISAE-SUPAERO — horaire à confirmer'],
    ['iit-ge4','6 novembre 2026','Mobilité — deadline IIT Chicago / GE4'],
    ['tedx','28 novembre 2026','TEDxPoitiers à l’ISAE-ENSMA — thème « Over the Rainbow »'],
    ['mobility-all','4 décembre 2026','Mobilité — deadline toutes autres destinations S5/S5B/DD/candidature libre'],
    ['mobility-s4','30 juin 2027','Mobilité S4 — deadline de candidature']
  ];
  items.forEach(([id,date,text])=>{if(deadlines&&!deadlines.querySelector(`[data-milestone="${id}"]`))deadlines.insertAdjacentHTML('beforeend',`<div class="node" data-milestone="${id}"><strong>${date}</strong><span>${text}</span></div>`)});
}
function refreshDecorations(){decorateCards();injectCurrentAlerts();injectCalendarContext()}
const observer=new MutationObserver(()=>refreshDecorations());document.addEventListener('DOMContentLoaded',()=>{refreshDecorations();['projectsGrid','opportunitiesGrid','attentionList','ensmaEvents','deadlinesList'].forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el,{childList:true,subtree:false})})});
})();