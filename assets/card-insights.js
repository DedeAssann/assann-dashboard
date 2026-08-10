(()=>{
const projectInsights={
'Lab Zero':{last:'Module PWM v1 en cours de validation',measure:'Phase · électronique / PWM',tags:['ESP32','PWM','Instrumentation']},
'Astrophotography Pipeline':{last:'Architecture raw / précalibré définie',measure:'Pipeline · calibration → stacking → RGB',tags:['Python','FITS','Image processing']},
'Finance IA':{last:'Roadmap à reprendre',measure:'Mode · exploration',tags:['Finance','IA','Paper trading']},
'Boutique bijoux Lily':{last:'Projet ajouté au portefeuille',measure:'Phase · architecture / design',tags:['Web','Frontend','Backend']},
'Stage Toulouse':{last:'Premières entreprises cibles identifiées',measure:'Cibles · 4+',tags:['ONERA','Safran','Airbus','Liebherr']},
'Jarvis / Private Lab':{last:'Concept intégré à Lab Zero',measure:'Phase · architecture future',tags:['Assistant local','Automation']},
'LabVision':{last:'Concept vision / scan 3D défini',measure:'Phase · prototype futur',tags:['Vision','3D','Turntable']},
'Semestre international':{last:'Canada identifié comme piste',measure:'Horizon · 3A',tags:['Canada','Mobilité']},
'École aérospatiale 2027':{last:'ESA et VKI identifiés comme pistes',measure:'Horizon · 2027',tags:['Propulsion','Aérodynamique','Spatial']},
'Projection mapping':{last:'Idée ajoutée au portefeuille',measure:'Phase · exploration',tags:['Projection','Créatif']},
'Mini-drones 3D scanning':{last:'Concept relié à LabVision',measure:'Phase · idée',tags:['Drones','3D scanning']}
};
const opportunityInsights={
'Stage 1A — Toulouse':{last:'Shortlist initiale constituée',measure:'4 options principales',options:['ONERA','Safran Power Units','Airbus','Liebherr-Aerospace']},
'ESA Academy':{last:'Piste retenue pour veille',measure:'Fit · spatial / systèmes',options:['Access to Space','Systems Engineering']},
'Von Karman Institute':{last:'Piste retenue pour veille 2027',measure:'Fit · propulsion / aérodynamique',options:['Propulsion','Aerodynamics','Hypersonics']},
'UNITAR / ONU':{last:'UNITAR identifié comme piste',measure:'Fit · international / réseau',options:['UNITAR','Événements ONU','Diplomatie scientifique']}
};
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function insightHTML(x,isOpportunity=false){
  const chips=(isOpportunity?x.options:x.tags)||[];
  const chipsLabel=isOpportunity?'Options':'Repères';
  return `<div class="card-insights">
    <div class="insight-line"><span class="insight-label">Dernière action</span><strong class="insight-value">${esc(x.last)}</strong></div>
    <div class="insight-line"><span class="insight-label">${isOpportunity?'Repère':'Mesure'}</span><strong class="insight-value">${esc(x.measure)}</strong></div>
    ${chips.length?`<div class="insight-chips-row"><span class="insight-label">${chipsLabel}</span><div class="option-chips">${chips.map(v=>`<span>${esc(v)}</span>`).join('')}</div></div>`:''}
  </div>`
}
function decorate(){document.querySelectorAll('.project').forEach(card=>{if(card.querySelector('.card-insights'))return;const name=card.querySelector('h3')?.textContent.trim(),x=projectInsights[name];if(x)card.insertAdjacentHTML('beforeend',insightHTML(x,false))});document.querySelectorAll('.opportunity').forEach(card=>{if(card.querySelector('.card-insights'))return;const name=card.querySelector('h3')?.textContent.trim(),x=opportunityInsights[name];if(x)card.insertAdjacentHTML('beforeend',insightHTML(x,true))})}
const observer=new MutationObserver(decorate);document.addEventListener('DOMContentLoaded',()=>{decorate();observer.observe(document.getElementById('projectsGrid'),{childList:true});observer.observe(document.getElementById('opportunitiesGrid'),{childList:true})});
})();