(()=>{
// Daily project milestone update — 11 Aug 2026.
// This small layer keeps the dashboard data easy to update without rewriting app-v2.js.
const todayUpdateKey='assann-project-update-2026-08-11-labzero-labvision';

function applyTodayUpdate(){
  if(typeof projects==='undefined') return;
  const labZero=projects.find(p=>p.name==='Lab Zero');
  const labVision=projects.find(p=>p.name==='LabVision');

  if(labZero){
    Object.assign(labZero,{
      progress:68,
      priority:'Haute',
      next:'Session 7 — I²C → puis OLED et périphériques numériques',
      desc:'LabCore modulaire · ESP32 · capteurs → traitement → actionneurs',
      notes:`ÉTAT — 11 AOÛT 2026\nSessions 0 à 6 terminées. Session 5 PWM et Session 6 Servo validées expérimentalement et documentées.\n\nCAP FRANCHI\nMigration Arduino IDE → VS Code / PlatformIO terminée. Architecture C++ modulaire adoptée avec séparation .h (interface), .cpp (implémentation) et main.cpp (orchestration).\n\nLABCORE VALIDÉ\n✓ LED\n✓ Button\n✓ AnalogInput\n✓ PWMOutput\n✓ ServoOutput\n\nSYSTÈMES COMPOSÉS VALIDÉS\nPotentiomètre → ADC → AnalogInput → map() → PWMOutput → LED.\nPotentiomètre → ADC → AnalogInput → map() 20–160° → ServoOutput → SG90.\nServo testé également en séquence non bloquante avec millis().\n\nWORKFLOW\nAssann : compréhension, décisions et expérimentation.\nChatGPT : concepts, architecture, explications et revue.\nCodex local : code, fichiers, build, upload et exécution. Tout code Codex doit rester commenté et pédagogique.\n\nPROCHAINE ÉTAPE\nSession 7 — I²C, puis OLED et périphériques numériques.\n\nPOINT DE VIGILANCE\nLe disque C: était saturé. Les caches/builds PlatformIO ont été nettoyés sans toucher aux fichiers personnels, mais l’espace disponible reste très faible et devra être traité prochainement.`
    });
  }

  if(labVision){
    Object.assign(labVision,{
      type:'current',
      tag:'Actuel',
      progress:12,
      priority:'Haute',
      next:'Définir LabVision v1 : architecture, matériel actuel et premier prototype',
      desc:'Vision · plateau motorisé · photogrammétrie · reconstruction 3D',
      notes:`BIFURCATION ACTIVE — 11 AOÛT 2026\nLabVision devient le prochain chantier actif pendant que Lab Zero marque une pause après les Sessions 0–6.\n\nOBJECTIF V1\nDéfinir une première version réalisable avec le matériel et les compétences actuels, puis construire progressivement vers :\n• acquisition d’images ;\n• plateau motorisé ;\n• photogrammétrie / stéréo ;\n• reconstruction 3D ;\n• automatisation ;\n• extension future vers des systèmes de scan plus grands / drones.\n\nPROCHAINE ACTION\nDéfinir précisément l’architecture LabVision v1, les composants disponibles, les composants manquants et un premier démonstrateur minimal.`
    });
  }

  if(typeof saveProjects==='function') saveProjects();
  localStorage.setItem(todayUpdateKey,'1');
}

// Apply the milestone as the current source of truth for this dashboard revision.
applyTodayUpdate();

const projectInsights={
'Lab Zero':{last:'Sessions 5 PWM + 6 Servo terminées et documentées',measure:'LabCore · Sessions 0–6 ✓',tags:['PlatformIO','C++ modulaire','PWM','Servo','ESP32']},
'Astrophotography Pipeline':{last:'Architecture raw / précalibré définie',measure:'Pipeline · calibration → stacking → RGB',tags:['Python','FITS','Image processing']},
'Finance IA':{last:'Roadmap à reprendre',measure:'Mode · exploration',tags:['Finance','IA','Paper trading']},
'Boutique bijoux Lily':{last:'Projet ajouté au portefeuille',measure:'Phase · architecture / design',tags:['Web','Frontend','Backend']},
'Stage Toulouse':{last:'Stratégie 1A structurée et jalons ENSMA identifiés',measure:'Objectif · été 2027',tags:['Toulouse','Aérospatial','Réseau']},
'Jarvis / Private Lab':{last:'Concept intégré à Lab Origin',measure:'Phase · architecture future',tags:['Assistant local','Automation']},
'LabVision':{last:'Bifurcation décidée après validation de LabCore 0–6',measure:'NEXT · définir LabVision v1',tags:['Vision','3D','Turntable','Photogrammétrie']},
'Semestre international':{last:'Canada identifié comme piste',measure:'Horizon · 3A',tags:['Canada','Mobilité']},
'École aérospatiale 2027':{last:'Radar recentré sur programmes réellement éligibles',measure:'Horizon · 2027',tags:['Propulsion','Aérodynamique','Recherche']},
'Projection mapping':{last:'Idée ajoutée au portefeuille',measure:'Phase · exploration',tags:['Projection','Créatif']},
'Mini-drones 3D scanning':{last:'Concept relié à LabVision',measure:'Phase · idée',tags:['Drones','3D scanning']}
};

const opportunityInsights={
'Stage 1A — Toulouse':{last:'Timeline août → printemps structurée',measure:'Cibles · industrie aéro/spatial',options:['Airbus','ONERA','Safran','Liebherr','ATR','TAS','CNES']},
'EPFL E3 — Excellence in Engineering':{last:'Ajouté au radar prioritaire',measure:'Fit · recherche ingénierie',options:['Fluid mechanics','Controls','Energy','Space']},
'CERN Summer Student Programme':{last:'Ajouté au radar prioritaire',measure:'Fit · physique + ingénierie',options:['Instrumentation','Computing','Research']},
'ETH Zürich SSRF':{last:'Ouverture 2027 à surveiller',measure:'Fit · robotics / ML / systems',options:['Robotics','ML','Visual computing']},
'LEAPS Leiden / ESA':{last:'Éligibilité internationale identifiée',measure:'Fit · astrophysique / spatial',options:['Astrophysics','ESA projects','Research']},
'CERN openlab Summer Student':{last:'Ajouté comme piste computing',measure:'Fit · IA / data / scientific computing',options:['Computing','AI','Data']},
'ESTACA CFD Summer Program':{last:'Conservé sous condition de financement',measure:'Fit · CFD / aérodynamique',options:['CFD','ANSYS Fluent','Partner rate']},
'Les Houches — WE-Heraeus Winter School 2027':{last:'Piste hiver retenue',measure:'14–19 fév. 2027',options:['Fluid mechanics','Mixing','Simulation']},
'UNITAR — Global Youth Scholars':{last:'Piste UNITAR prioritaire',measure:'Gratuit sur édition précédente',options:['SDGs','Youth','Geneva']},
'UNITAR — Diplomacy 4.0':{last:'Ajouté à la watchlist',measure:'Fit · tech + diplomatie',options:['AI','Cybersecurity','Science diplomacy']},
'UNITAR — Science Policy & Diplomatic Practice':{last:'Conservé sous condition de coût',measure:'Fit · science diplomacy',options:['Space','Energy','AI','Engineering diplomacy']},
'UNITAR — Free Events & Conferences':{last:'Radar opportuniste',measure:'Règle · gratuit / faible coût',options:['Conferences','Webinars','Geneva']}
};

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function insightHTML(x,isOpportunity=false){const chips=(isOpportunity?x.options:x.tags)||[],chipsLabel=isOpportunity?'Options':'Repères';return `<div class="card-insights"><div class="insight-line"><span class="insight-label">Dernière action</span><strong class="insight-value">${esc(x.last)}</strong></div><div class="insight-line"><span class="insight-label">${isOpportunity?'Repère':'Mesure'}</span><strong class="insight-value">${esc(x.measure)}</strong></div>${chips.length?`<div class="insight-chips-row"><span class="insight-label">${chipsLabel}</span><div class="option-chips">${chips.map(v=>`<span>${esc(v)}</span>`).join('')}</div></div>`:''}</div>`}
function decorate(){document.querySelectorAll('.project').forEach(card=>{if(card.querySelector('.card-insights'))return;const name=card.querySelector('h3')?.textContent.trim(),x=projectInsights[name];if(x)card.insertAdjacentHTML('beforeend',insightHTML(x,false))});document.querySelectorAll('.opportunity').forEach(card=>{if(card.querySelector('.card-insights'))return;const name=card.querySelector('h3')?.textContent.trim(),x=opportunityInsights[name];if(x)card.insertAdjacentHTML('beforeend',insightHTML(x,true))})}
function refresh(){if(typeof renderProjects==='function')renderProjects(document.getElementById('projectFilter')?.value||'all');if(typeof renderOverview==='function')renderOverview();if(typeof renderAnalytics==='function')renderAnalytics();setTimeout(decorate,0)}

const observer=new MutationObserver(decorate);
document.addEventListener('DOMContentLoaded',()=>{refresh();decorate();observer.observe(document.getElementById('projectsGrid'),{childList:true});observer.observe(document.getElementById('opportunitiesGrid'),{childList:true})});
})();