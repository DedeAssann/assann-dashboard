(() => {
  const cfg = window.ASSANN_SUPABASE;
  const sdk = window.supabase;
  if (!cfg?.url || !cfg?.publishableKey || !sdk?.createClient) return;

  const client = sdk.createClient(cfg.url, cfg.publishableKey);
  const habits = ['Deep work','Sport','Coding','Lecture','Sommeil ≥ 7 h','Méditation','Relations'];
  const storageKey = 'assann-habits-v1';
  const state = { user: null, busy: false };

  const localDate = (date = new Date()) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  function authEls() {
    return {
      pill: document.getElementById('cloudStatus'),
      form: document.getElementById('authForm'),
      email: document.getElementById('authEmail'),
      button: document.getElementById('authButton'),
      logout: document.getElementById('logoutButton'),
      message: document.getElementById('authMessage')
    };
  }

  function setMessage(text, error = false) {
    const { message } = authEls();
    if (!message) return;
    message.textContent = text || '';
    message.classList.toggle('error', error);
  }

  function renderAuth() {
    const { pill, form, logout } = authEls();
    if (state.user) {
      if (pill) pill.innerHTML = `<span class="status-dot"></span>Cloud sync · ${state.user.email}`;
      if (form) form.hidden = true;
      if (logout) logout.hidden = false;
    } else {
      if (pill) pill.innerHTML = '<span class="status-dot offline"></span>Habits · local uniquement';
      if (form) form.hidden = false;
      if (logout) logout.hidden = true;
    }
  }

  function readLocal() {
    try { return JSON.parse(localStorage.getItem(storageKey)) || {}; }
    catch { return {}; }
  }

  function writeLocal(data) {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  async function pullRecent() {
    if (!state.user) return;
    const from = new Date();
    from.setDate(from.getDate() - 120);
    const { data, error } = await client
      .from('habit_entries')
      .select('entry_date,habit_key,completed')
      .gte('entry_date', localDate(from))
      .order('entry_date');
    if (error) throw error;

    const local = readLocal();
    for (const row of data || []) {
      local[row.entry_date] ||= {};
      local[row.entry_date][row.habit_key] = !!row.completed;
    }
    writeLocal(local);
    window.dispatchEvent(new CustomEvent('assann:habits-synced'));
  }

  async function pushEntry(habitKey, completed, entryDate = localDate()) {
    if (!state.user) return;
    const { error } = await client.from('habit_entries').upsert({
      user_id: state.user.id,
      entry_date: entryDate,
      habit_key: habitKey,
      completed: !!completed,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,entry_date,habit_key' });
    if (error) throw error;
  }

  async function migrateTodayLocal() {
    if (!state.user) return;
    const local = readLocal();
    const today = localDate();
    const todayState = local[today] || {};
    const rows = habits.map(habit => ({
      user_id: state.user.id,
      entry_date: today,
      habit_key: habit,
      completed: !!todayState[habit],
      updated_at: new Date().toISOString()
    }));
    const { error } = await client.from('habit_entries').upsert(rows, { onConflict: 'user_id,entry_date,habit_key' });
    if (error) throw error;
  }

  async function signIn(email) {
    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    if (error) throw error;
    setMessage('Lien de connexion envoyé. Vérifie ta boîte mail.');
  }

  async function initialise() {
    const { data: { session } } = await client.auth.getSession();
    state.user = session?.user || null;
    renderAuth();
    if (state.user) {
      try {
        await migrateTodayLocal();
        await pullRecent();
        setMessage('Synchronisation cloud active.');
      } catch (error) {
        console.error(error);
        setMessage('Connecté, mais la table Supabase/RLS doit être configurée.', true);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const { form, email, button, logout } = authEls();
    form?.addEventListener('submit', async event => {
      event.preventDefault();
      if (state.busy || !email?.value) return;
      state.busy = true;
      button.disabled = true;
      try { await signIn(email.value.trim()); }
      catch (error) { setMessage(error.message || 'Connexion impossible.', true); }
      finally { state.busy = false; button.disabled = false; }
    });
    logout?.addEventListener('click', async () => {
      await client.auth.signOut();
      state.user = null;
      renderAuth();
      setMessage('Déconnecté du cloud. Les données locales restent disponibles.');
    });
    initialise().catch(console.error);
  });

  client.auth.onAuthStateChange((_event, session) => {
    state.user = session?.user || null;
    renderAuth();
    if (state.user) setTimeout(() => initialise().catch(console.error), 0);
  });

  window.AssannCloud = {
    isSignedIn: () => !!state.user,
    saveHabit: async (habitKey, completed, entryDate) => {
      try { await pushEntry(habitKey, completed, entryDate); }
      catch (error) { console.error('Habit cloud sync failed:', error); }
    },
    refreshHabits: pullRecent
  };
})();
