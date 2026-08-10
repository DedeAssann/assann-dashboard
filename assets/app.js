const habits=['Deep work','Sport','Coding','Lecture','Sommeil ≥ 7 h','Méditation','Relations'];
const projects=[
{name:'Lab Zero',type:'current',tag:'Actuel',progress:42,priority:'Haute',next:'Finaliser PWM + mesures',desc:'ESP32 · instrumentation · laboratoire intelligent'},
{name:'Astrophotography Pipeline',type:'current',tag:'Actuel',progress:35,priority:'Moyenne',next:'Pipeline stacking',desc:'Python · FITS · calibration · visualisation'},
{name:'Finance IA',type:'current',tag:'Actuel',progress:20,priority:'Basse',next:'Reprendre roadmap',desc:'Marchés · IA · paper trading'},
{name:'Boutique bijoux Lily',type:'current',tag:'Actuel',progress:15,priority:'Moyenne',next:'Définir architecture',desc:'Web · design · backend'},
{name:'Stage Toulouse',type:'current',tag:'Actuel',progress:10,priority:'Haute',next:'Construire shortlist',desc:'ONERA · Safran · Airbus · Liebherr'},
{name:'Jarvis / Private Lab',type:'future',tag:'Futur',progress:5,priority:'Moyenne',next:'Architecture générale',desc:'Assistant local · agent ingénierie · automatisation'},
{name:'LabVision',type:'future',tag:'Futur',progress:8,priority:'Moyenne',next:'Plateau motorisé',desc:'Vision · scan 3D · automatisation'},
{name:'Semestre international',type:'future',tag:'Futur',progress:0,priority:'Moyenne',next:'Explorer partenaires',desc:'Mobilité internationale envisagée en 3A'},
{name:'École aérospatiale 2027',type:'future',tag:'Futur',progress:3,priority:'Haute',next:'Veille ESA / VKI',desc:'Propulsion · aérodynamique · spatial'},
{name:'Projection mapping',type:'idea',tag:'Envisagé',progress:0,priority:'Basse',next:'Explorer matériel',desc:'Projection · installation visuelle'},
{name:'Mini-drones 3D scanning',type:'idea',tag:'Envisagé',progress:0,priority:'Basse',next:'Concept',desc:'Drones · vision · reconstruction 3D'}
];
const milestones=[
{date:'25–30 août',name:'Séjour Paris'},
{date:'7 septembre',name:'Accueil ENSMA'},
{date:'18 septembre',name:'Week-end d’intégration'},
{date:'23 septembre',name:'Réunion mobilité internationale'}
];
const ensma=[
{date:'7 sept.',name:'Accueil & présentation EDT',meta:'09:00–11:00 · A102'},
{date:'7 sept.',name:'Rencontre enseignants',meta:'11:00–11:45 · A102'},
{date:'7 sept.',name:'Langues à l’ENSMA',meta:'13:30–15:30'},
{date:'11 sept.',name:'Fresque du climat',meta:'09:30–12:30'},
{date:'18 sept.',name:'Week-end d’intégration',meta:'Jalon ENSMA'},
{date:'23 sept.',name:'Mobilité internationale',meta:'13:45–15:00 · A102'}
];
const opportunities=[
{name:'Stage 1A — Toulouse',desc:'ONERA · Safran Power Units · Airbus · Liebherr',tag:'Priorité'},
{name:'ESA Academy',desc:'Access to Space · Systems Engineering',tag:'Très fort fit'},
{name:'Von Karman Institute',desc:'Propulsion · aérodynamique · hypersonique',tag:'À surveiller'},
{name:'UNITAR / ONU',desc:'Diplomatie scientifique · international',tag:'Exploration'}
];

const pad=n=>String(n).padStart(2,'0');
const dateKey=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const today=new Date();
const todayKey=dateKey(today);
const storageKey='assann-dashboard-habits-v1';
let history=JSON.parse(localStorage.getItem(storageKey)||'{}');
if(!history[todayKey]) history[todayKey]={};
habits.forEach(h=>{if(typeof history[todayKey][h]!=='boolean')history[todayKey][h]=false});
const save=()=>localStorage.setItem(storageKey,JSON.stringify(history));
save();

function mondayOf(d){const x=new Date(d);const day=(x.getDay()+6)%7;x.setDate(x.getDate()-day);x.setHours(0,0,0,0);return x}
function weekDates(){const m=mondayOf(today);return Array.from({length:7},(_,i)=>{const d=new Date(m);d.setDate(m.getDate()+i);return d})}
function completedToday(){return habits.filter(h=>history[todayKey]?.[h]).length}
function pct(n,d){return d?Math.round(n/d*100):0}

function setupTabs(){document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab,.panel').forEach(x=>x.classList.remove('active'));btn.classList.add('active');document.getElementById(btn.dataset.tab).classList.add('active')}))}
function renderHeader(){document.getElementById('todayDate').textContent=today.toLocaleDateString('fr-FR',{day:'numeric',month:'short'});document.getElementById('todayDay').textContent=today.toLocaleDateString('fr-FR',{weekday:'long'});document.getElementById('activeProjectsCount').textContent=projects.filter(p=>p.type==='current').length;document.getElementById('nextMilestoneDate').textContent='25 août';document.getElementById('nextMilestoneName').textContent='Paris';document.getElementById('weekLabel').textContent=`${weekDates()[0].toLocaleDateString('fr-FR',{day:'numeric',month:'short'})} – ${weekDates()[6].toLocaleDateString('fr-FR',{day:'numeric',month:'short'})}`}
function renderWeeklyFocus(){const items=[['Installation / rentrée',70],['Lab Zero',42],['Calendar system',82]];document.getElementById('weeklyFocus').innerHTML=items.map(([n,v])=>`<div class="progress-row"><div class="progress-meta"><span>${n}</span><span>${v}%</span></div><div class="bar"><i style="width:${v}%"></i></div></div>`).join('');document.getElementById('milestonesList').innerHTML=milestones.slice(0,3).map(m=>`<div class="node"><strong>${m.date}</strong><span>${m.name}</span></div>`).join('')}
function renderTodayHabits(){const el=document.getElementById('todayHabits');el.innerHTML=habits.map(h=>`<label class="habit ${history[todayKey][h]?'done':''}"><input type="checkbox" data-habit="${h}" ${history[todayKey][h]?'checked':''}><span>${h}</span></label>`).join('');el.querySelectorAll('input').forEach(i=>i.addEventListener('change',()=>{history[todayKey][i.dataset.habit]=i.checked;save();renderHabits();renderAnalytics()}))}
function renderWeek(){const dates=weekDates();document.getElementById('habitWeekRows').innerHTML=habits.map(h=>`<tr><td>${h}</td>${dates.map(d=>`<td><div class="habit-cell ${history[dateKey(d)]?.[h]?'done':''}"></div></td>`).join('')}</tr>`).join('')}
function renderScores(){const done=completedToday();document.getElementById('habitScore').textContent=`${done}/${habits.length}`;document.getElementById('overviewHabitScore').textContent=`${done}/${habits.length}`;document.getElementById('analyticsHabitScore').textContent=`${pct(done,habits.length)}%`}
function renderHabits(){renderTodayHabits();renderWeek();renderScores()}
function renderProjects(filter='all'){const shown=projects.filter(p=>filter==='all'||p.type===filter);document.getElementById('projectsGrid').innerHTML=shown.map(p=>`<article class="project"><div class="project-head"><div><h3>${p.name}</h3><p>${p.desc}</p></div><span class="badge">${p.tag}</span></div><div class="project-meta"><div><span>Priorité</span>${p.priority}</div><div><span>Prochaine action</span>${p.next}</div></div><div class="progress-meta"><span>Progression</span><span>${p.progress}%</span></div><div class="bar"><i style="width:${p.progress}%"></i></div></article>`).join('')}
function renderCalendar(){document.getElementById('ensmaEvents').innerHTML=ensma.map(e=>`<div class="event"><div class="event-date">${e.date}</div><div><strong>${e.name}</strong><span>${e.meta}</span></div></div>`).join('');document.getElementById('deadlinesList').innerHTML=milestones.map(m=>`<div class="node"><strong>${m.name}</strong><span>${m.date}</span></div>`).join('')}
function renderAnalytics(){const dates=weekDates();let total=0,possible=0;const rows=habits.map(h=>{const done=dates.filter(d=>history[dateKey(d)]?.[h]).length;total+=done;possible+=7;return[h,pct(done,7)]});document.getElementById('habitAnalytics').innerHTML=rows.map(([h,v])=>`<div><div class="progress-meta"><span>${h}</span><span>${v}%</span></div><div class="bar"><i style="width:${v}%"></i></div></div>`).join('');document.getElementById('weeklyCompletion').textContent=`${pct(total,possible)}%`;const avg=Math.round(projects.filter(p=>p.type==='current').reduce((s,p)=>s+p.progress,0)/projects.filter(p=>p.type==='current').length);document.getElementById('projectsAverage').textContent=`${avg}%`;const best=rows.sort((a,b)=>b[1]-a[1])[0];document.getElementById('bestStreak').textContent=best?best[0]:'—';renderScores()}
function renderOpportunities(){document.getElementById('opportunitiesGrid').innerHTML=opportunities.map(o=>`<article class="opportunity"><div class="opportunity-head"><div><h3>${o.name}</h3><p>${o.desc}</p></div><span class="badge">${o.tag}</span></div></article>`).join('')}

setupTabs();renderHeader();renderWeeklyFocus();renderHabits();renderProjects();renderCalendar();renderAnalytics();renderOpportunities();
document.getElementById('projectFilter').addEventListener('change',e=>renderProjects(e.target.value));
