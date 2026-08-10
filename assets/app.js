const habits=['Deep work','Sport','Coding','Lecture','Sommeil ≥ 7 h','Méditation','Relations'];
const slug=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

const projects=[
{name:'Lab Zero',type:'current',tag:'Actuel',progress:42,priority:'Haute',next:'Finaliser PWM + mesures',desc:'ESP32 · instrumentation · laboratoire intelligent',notes:'Construire progressivement le socle électronique du Private Intelligent Laboratory :