(() => {
  const cfg = window.ASSANN_SUPABASE;
  const sdk = window.supabase;
  const STORAGE = {
    habits: 'assann-habits-v1',
  };
  const HABITS = ['Deep work', 'Sport', 'Coding', 'Lecture', 'Sommeil ≥ 7 h', 'Méditation', 'Relations'];
  const HABIT_ALIASES = {'Sommeil >= 7 h': 'Sommeil ≥ 7 h', Meditation: 'Méditation'};
  const state = {user: null, busy: false, mode: 'login'};

  function elements() {
    return {
      gate: document.getElementById('authGate'), app: document.querySelector('.app-shell'),
      pill: document.getElementById('cloudStatus'), form: document.getElementById('authForm'),
      email: document.getElementById('authEmail'), password: document.getElementById('authPassword'),
      button: document.getElementById('authButton'), logout: document.getElementById('logoutButton'),
      topLogout: document.getElementById('topLogoutButton'), message: document.getElementById('authMessage'),
      loginMode: document.getElementById('loginMode'), signupMode: document.getElementById('signupMode'),
    };
  }
  function setMessage(text, error = false) {const {message} = elements(); if (!message) return; message.textContent = text || ''; message.classList.toggle('error', error)}
  function localDate(date = new Date()) {return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}
  function readLocal(key) {try {return JSON.parse(localStorage.getItem(key)) || {}} catch {return {}}}
  function writeLocal(key, value) {localStorage.setItem(key, JSON.stringify(value))}
  function dispatch(name, detail) {window.dispatchEvent(new CustomEvent(name, {detail}))}
  function canonicalHabit(value) {return HABIT_ALIASES[value] || value}

  function migrateLocalHabitNames() {
    const history = readLocal(STORAGE.habits);
    for (const day of Object.values(history)) {
      for (const [oldName, newName] of Object.entries(HABIT_ALIASES)) {
        if (oldName in day) {day[newName] = Boolean(day[newName] || day[oldName]); delete day[oldName]}
      }
    }
    writeLocal(STORAGE.habits, history);
  }

  if (!cfg?.url || !cfg?.publishableKey || !sdk?.createClient) {
    document.addEventListener('DOMContentLoaded', () => setMessage('Configuration Supabase indisponible. Recharge la page ou réessaie plus tard.', true));
    return;
  }

  const client = sdk.createClient(cfg.url, cfg.publishableKey, {auth:{persistSession:true, autoRefreshToken:true, detectSessionInUrl:true}});

  function setMode(mode) {state.mode=mode; const {loginMode,signupMode,button,password}=elements(); loginMode?.classList.toggle('active',mode==='login'); signupMode?.classList.toggle('active',mode==='signup'); if(button)button.textContent=mode==='login'?'Se connecter':'Créer le compte'; if(password)password.autocomplete=mode==='login'?'current-password':'new-password'; setMessage(mode==='login'?'Connexion par e-mail et mot de passe.':'Création du compte.')}
  function renderAuth() {const {gate,app,pill,form,topLogout,loginMode,signupMode}=elements(); const signed=Boolean(state.user); if(gate)gate.hidden=signed; if(app)app.hidden=!signed; if(pill)pill.innerHTML=signed?`<span class="status-dot"></span>Profil · ${state.user.email}`:'<span class="status-dot offline"></span>Connexion requise'; if(form)form.hidden=signed; if(topLogout)topLogout.hidden=!signed; if(loginMode)loginMode.hidden=signed; if(signupMode)signupMode.hidden=signed; if(!signed)setMode(state.mode); dispatch('assann:auth-state',{signedIn:signed,user:state.user})}
  async function optional(label, fn) {try {return await fn()} catch(error) {console.error(`${label}:`, error); return null}}

  async function pullHabits() {
    if (!state.user) return [];
    const from = new Date(); from.setDate(from.getDate()-120);
    const {data,error}=await client.from('habit_entries').select('entry_date,habit_key,completed,updated_at').gte('entry_date',localDate(from)).order('entry_date');
    if(error)throw error;
    const history=readLocal(STORAGE.habits);
    for(const row of data||[]){const key=canonicalHabit(row.habit_key); history[row.entry_date]||={}; history[row.entry_date][key]=Boolean(history[row.entry_date][key]||row.completed)}
    writeLocal(STORAGE.habits,history); dispatch('assann:habits-synced',data||[]); return data||[];
  }
  async function seedMissingToday() {
    if(!state.user)return;
    const day=localDate(); const history=readLocal(STORAGE.habits); const local=history[day]||{};
    const {data,error}=await client.from('habit_entries').select('habit_key').eq('entry_date',day); if(error)throw error;
    const remote=new Set((data||[]).map(r=>canonicalHabit(r.habit_key)));
    const rows=HABITS.filter(h=>!remote.has(h)).map(h=>({user_id:state.user.id,entry_date:day,habit_key:h,completed:Boolean(local[h]),updated_at:new Date().toISOString()}));
    if(rows.length){const result=await client.from('habit_entries').insert(rows); if(result.error)throw result.error}
  }
  async function saveHabit(habitKey,completed,entryDate=localDate()) {if(!state.user)return{cloud:false}; const {error}=await client.from('habit_entries').upsert({user_id:state.user.id,entry_date:entryDate,habit_key:canonicalHabit(habitKey),completed:Boolean(completed),updated_at:new Date().toISOString()},{onConflict:'user_id,entry_date,habit_key'}); if(error)throw error; return{cloud:true}}

  const projectToDb=p=>({user_id:state.user.id,project_id:p.key,name:p.name,type:p.type||'idea',tag:p.tag||'',description:p.desc||'',progress:+p.progress||0,priority:p.priority||'Moyenne',next_action:p.next||'',notes:p.notes||'',archived:Boolean(p.archived),metadata:{},updated_at:new Date().toISOString()});
  async function pullProfileProjects() {if(!state.user)return[]; let {data,error}=await client.from('profile_projects').select('*').order('updated_at',{ascending:false}); if(error)throw error; if(!data?.length){const seeds=(window.AssannSeed?.projects||[]).map(p=>({...p})); const legacy=await optional('legacy projects',async()=>{const r=await client.from('project_states').select('*'); if(r.error)throw r.error; return r.data||[]})||[]; for(const row of legacy){const p=seeds.find(x=>x.key===row.project_key); if(p)Object.assign(p,{progress:+row.progress,priority:row.priority,next:row.next_action,notes:row.notes})} if(seeds.length){const inserted=await client.from('profile_projects').upsert(seeds.map(projectToDb),{onConflict:'user_id,project_id'}).select('*'); if(inserted.error)throw inserted.error; data=inserted.data||[]}} dispatch('assann:profile-projects-synced',data||[]); return data||[]}
  async function saveProfileProject(p) {if(!state.user)return{cloud:false}; const {error}=await client.from('profile_projects').upsert(projectToDb(p),{onConflict:'user_id,project_id'}); if(error)throw error; return{cloud:true}}

  const opportunityToDb=o=>({user_id:state.user.id,opportunity_id:o.key,name:o.name,organization:o.desc||'',status:o.status||'A explorer',priority:o.priority||'Moyenne',deadline:o.deadline||null,source_url:o.url||'',next_action:o.next||'',notes:o.notes||'',options:o.options||[],archived:Boolean(o.archived),metadata:{category:o.category||'space',tag:o.tag||''},updated_at:new Date().toISOString()});
  async function pullProfileOpportunities() {if(!state.user)return[]; let {data,error}=await client.from('profile_opportunities').select('*').order('updated_at',{ascending:false}); if(error)throw error; if(!data?.length){const seeds=(window.AssannSeed?.opportunities||[]).map(o=>({...o})); const legacy=await optional('legacy opportunities',async()=>{const r=await client.from('opportunity_states').select('*'); if(r.error)throw r.error; return r.data||[]})||[]; for(const row of legacy){const o=seeds.find(x=>x.key===row.opportunity_key); if(o)Object.assign(o,{status:row.status,priority:row.priority,deadline:row.deadline||'',next:row.next_action,url:row.source_url,notes:row.notes})} if(seeds.length){const inserted=await client.from('profile_opportunities').upsert(seeds.map(opportunityToDb),{onConflict:'user_id,opportunity_id'}).select('*'); if(inserted.error)throw inserted.error; data=inserted.data||[]}} dispatch('assann:profile-opportunities-synced',data||[]); return data||[]}
  async function saveProfileOpportunity(o) {if(!state.user)return{cloud:false}; const {error}=await client.from('profile_opportunities').upsert(opportunityToDb(o),{onConflict:'user_id,opportunity_id'}); if(error)throw error; return{cloud:true}}
  async function pullProfileCalendar() {if(!state.user)return[]; const {data,error}=await client.from('profile_calendar_events').select('*').gte('ends_at',new Date().toISOString()).order('starts_at'); if(error)throw error; dispatch('assann:profile-calendar-synced',data||[]); return data||[]}

  async function pullRecipes(){if(!state.user)return[];const{data,error}=await client.from('recipes').select('recipe_id,name,cuisine,time_minutes,cost_estimate,difficulty,tags,ingredients,steps,updated_at').order('updated_at',{ascending:false});if(error)throw error;const rows=(data||[]).map(r=>({id:r.recipe_id,name:r.name,cuisine:r.cuisine||'',time:r.time_minutes||0,cost:r.cost_estimate||0,difficulty:r.difficulty||'Easy',tags:r.tags||[],view:(r.tags||[]).includes('protein')?'protein':(r.tags||[]).includes('budget')?'budget':(r.time_minutes||99)<=20?'quick':'all',ingredients:r.ingredients||'',steps:r.steps||''}));dispatch('assann:recipes-synced',rows);return rows}
  async function saveRecipe(r){if(!state.user)return{cloud:false};const{error}=await client.from('recipes').upsert({user_id:state.user.id,recipe_id:r.id,name:r.name,cuisine:r.cuisine||'',time_minutes:r.time||0,cost_estimate:r.cost||0,difficulty:r.difficulty||'Easy',tags:r.tags||[],ingredients:r.ingredients||'',steps:r.steps||'',updated_at:new Date().toISOString()},{onConflict:'user_id,recipe_id'});if(error)throw error;return{cloud:true}}
  async function pullTransactions(){if(!state.user)return[];const from=localDate(new Date(new Date().getFullYear(),new Date().getMonth(),1));const{data,error}=await client.from('transactions').select('transaction_id,title,transaction_date,amount,kind,subcategory,updated_at').gte('transaction_date',from).order('transaction_date',{ascending:false});if(error)throw error;const rows=(data||[]).map(t=>({id:t.transaction_id,title:t.title,date:t.transaction_date,amount:+t.amount,kind:t.kind,subcategory:t.subcategory||''}));dispatch('assann:transactions-synced',rows);return rows}
  async function saveTransaction(t){if(!state.user)return{cloud:false};const{error}=await client.from('transactions').upsert({user_id:state.user.id,transaction_id:t.id,title:t.title,transaction_date:t.date,amount:t.amount,kind:t.kind,subcategory:t.subcategory||'',updated_at:new Date().toISOString()},{onConflict:'user_id,transaction_id'});if(error)throw error;return{cloud:true}}
  async function pullBudgetSettings(){if(!state.user)return null;const{data,error}=await client.from('budget_settings').select('monthly_budget').eq('user_id',state.user.id).maybeSingle();if(error)throw error;if(data){const settings={monthlyBudget:+data.monthly_budget||0};dispatch('assann:budget-synced',settings);return settings}return null}
  async function saveBudgetSettings(settings){if(!state.user)return{cloud:false};const{error}=await client.from('budget_settings').upsert({user_id:state.user.id,monthly_budget:settings.monthlyBudget||0,updated_at:new Date().toISOString()},{onConflict:'user_id'});if(error)throw error;return{cloud:true}}

  async function syncAfterLogin(){setMessage('Synchronisation...'); try{migrateLocalHabitNames(); await pullHabits(); await seedMissingToday(); await pullHabits(); const tasks=[['projets',pullProfileProjects],['opportunités',pullProfileOpportunities],['calendrier privé',pullProfileCalendar],['recettes',pullRecipes],['transactions',pullTransactions],['budget',pullBudgetSettings]]; const failures=[]; for(const [label,fn] of tasks){try{await fn()}catch(error){failures.push(label);console.error(label,error)}} setMessage(failures.length?`Connecté, mais synchronisation incomplète : ${failures.join(', ')}.`:'Synchronisation cloud active.',Boolean(failures.length))}catch(error){console.error(error);setMessage(`Synchronisation des habitudes impossible : ${error.message||'erreur inconnue'}.`,true)}}
  async function initialise(){const{data:{session},error}=await client.auth.getSession();if(error)throw error;state.user=session?.user||null;renderAuth();if(state.user)await syncAfterLogin()}
  async function login(email,password){const{error}=await client.auth.signInWithPassword({email,password});if(error)throw error}
  async function signup(email,password){const redirectTo=`${window.location.origin}${window.location.pathname}`;const{data,error}=await client.auth.signUp({email,password,options:{emailRedirectTo:redirectTo}});if(error)throw error;if(!data.session)setMessage('Compte créé. Confirme ton e-mail, puis connecte-toi.')}

  document.addEventListener('DOMContentLoaded',()=>{const{form,email,password,button,topLogout,loginMode,signupMode}=elements();const signOut=async()=>{await client.auth.signOut({scope:'local'});state.user=null;renderAuth();setMessage('Déconnecté de cet appareil.')};loginMode?.addEventListener('click',()=>setMode('login'));signupMode?.addEventListener('click',()=>setMode('signup'));form?.addEventListener('submit',async event=>{event.preventDefault();if(state.busy||!email?.value||!password?.value)return;if(password.value.length<8){setMessage('Utilise un mot de passe d’au moins 8 caractères.',true);return}state.busy=true;button.disabled=true;setMessage(state.mode==='login'?'Connexion...':'Création du compte...');try{state.mode==='login'?await login(email.value.trim(),password.value):await signup(email.value.trim(),password.value)}catch(error){setMessage(error.message||'Authentification impossible.',true)}finally{state.busy=false;button.disabled=false}});topLogout?.addEventListener('click',signOut);initialise().catch(error=>setMessage(error.message||'Initialisation impossible.',true))});
  client.auth.onAuthStateChange((_event,session)=>{const previous=state.user?.id;state.user=session?.user||null;renderAuth();if(state.user&&state.user.id!==previous)setTimeout(syncAfterLogin,0)});
  window.AssannCloud={isSignedIn:()=>Boolean(state.user),currentUser:()=>state.user,saveHabit:(h,c,d)=>optional('save habit',()=>saveHabit(h,c,d)),refreshHabits:pullHabits,saveProfileProject:p=>optional('save project',()=>saveProfileProject(p)),pullProfileProjects,saveProfileOpportunity:o=>optional('save opportunity',()=>saveProfileOpportunity(o)),pullProfileOpportunities,pullProfileCalendar,saveRecipe:r=>optional('save recipe',()=>saveRecipe(r)),pullRecipes,saveTransaction:t=>optional('save transaction',()=>saveTransaction(t)),pullTransactions,saveBudgetSettings:s=>optional('save budget',()=>saveBudgetSettings(s)),pullBudgetSettings};
})();
