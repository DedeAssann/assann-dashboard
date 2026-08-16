-- Run in Supabase SQL Editor. Safe to re-run.
-- All user data is private to the authenticated user via RLS.

create table if not exists public.habit_entries (
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  habit_key text not null,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, entry_date, habit_key)
);
alter table public.habit_entries enable row level security;
revoke all on table public.habit_entries from anon;
grant select, insert, update, delete on table public.habit_entries to authenticated;
drop policy if exists "Users can read own habits" on public.habit_entries;
create policy "Users can read own habits" on public.habit_entries for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Users can insert own habits" on public.habit_entries;
create policy "Users can insert own habits" on public.habit_entries for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Users can update own habits" on public.habit_entries;
create policy "Users can update own habits" on public.habit_entries for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "Users can delete own habits" on public.habit_entries;
create policy "Users can delete own habits" on public.habit_entries for delete to authenticated using ((select auth.uid()) = user_id);

create table if not exists public.project_states (
  user_id uuid not null references auth.users(id) on delete cascade,
  project_key text not null,
  progress integer not null default 0 check (progress between 0 and 100),
  priority text not null default 'Moyenne' check (priority in ('Basse','Moyenne','Haute')),
  next_action text not null default '',
  last_action text not null default '',
  last_action_at date,
  notes text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, project_key)
);
alter table public.project_states add column if not exists last_action text not null default '';
alter table public.project_states add column if not exists last_action_at date;
alter table public.project_states enable row level security;
revoke all on table public.project_states from anon;
grant select, insert, update, delete on table public.project_states to authenticated;
drop policy if exists "Users can read own projects" on public.project_states;
create policy "Users can read own projects" on public.project_states for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Users can insert own projects" on public.project_states;
create policy "Users can insert own projects" on public.project_states for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Users can update own projects" on public.project_states;
create policy "Users can update own projects" on public.project_states for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "Users can delete own projects" on public.project_states;
create policy "Users can delete own projects" on public.project_states for delete to authenticated using ((select auth.uid()) = user_id);

create table if not exists public.opportunity_states (
  user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_key text not null,
  status text not null default 'A explorer',
  priority text not null default 'Moyenne' check (priority in ('Basse','Moyenne','Haute','Tres haute')),
  deadline date,
  next_action text not null default '',
  last_action text not null default '',
  last_action_at date,
  options jsonb not null default '[]'::jsonb,
  source_url text not null default '',
  notes text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, opportunity_key)
);
alter table public.opportunity_states add column if not exists last_action text not null default '';
alter table public.opportunity_states add column if not exists last_action_at date;
alter table public.opportunity_states add column if not exists options jsonb not null default '[]'::jsonb;
alter table public.opportunity_states enable row level security;
revoke all on table public.opportunity_states from anon;
grant select, insert, update, delete on table public.opportunity_states to authenticated;
drop policy if exists "Users can read own opportunities" on public.opportunity_states;
create policy "Users can read own opportunities" on public.opportunity_states for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Users can insert own opportunities" on public.opportunity_states;
create policy "Users can insert own opportunities" on public.opportunity_states for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Users can update own opportunities" on public.opportunity_states;
create policy "Users can update own opportunities" on public.opportunity_states for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "Users can delete own opportunities" on public.opportunity_states;
create policy "Users can delete own opportunities" on public.opportunity_states for delete to authenticated using ((select auth.uid()) = user_id);

create table if not exists public.recipes (
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id text not null,
  name text not null,
  cuisine text not null default '',
  time_minutes integer not null default 0 check (time_minutes >= 0),
  cost_estimate numeric(8,2) not null default 0 check (cost_estimate >= 0),
  difficulty text not null default 'Easy' check (difficulty in ('Easy','Medium','Hard')),
  tags text[] not null default '{}'::text[],
  ingredients text not null default '',
  steps text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);
alter table public.recipes enable row level security;
revoke all on table public.recipes from anon;
grant select, insert, update, delete on table public.recipes to authenticated;
drop policy if exists "Users can read own recipes" on public.recipes;
create policy "Users can read own recipes" on public.recipes for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Users can insert own recipes" on public.recipes;
create policy "Users can insert own recipes" on public.recipes for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Users can update own recipes" on public.recipes;
create policy "Users can update own recipes" on public.recipes for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "Users can delete own recipes" on public.recipes;
create policy "Users can delete own recipes" on public.recipes for delete to authenticated using ((select auth.uid()) = user_id);

create table if not exists public.transactions (
  user_id uuid not null references auth.users(id) on delete cascade,
  transaction_id text not null,
  title text not null,
  transaction_date date not null,
  amount numeric(10,2) not null,
  kind text not null check (kind in ('Needs','Wants','Income')),
  subcategory text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, transaction_id)
);
alter table public.transactions enable row level security;
revoke all on table public.transactions from anon;
grant select, insert, update, delete on table public.transactions to authenticated;
drop policy if exists "Users can read own transactions" on public.transactions;
create policy "Users can read own transactions" on public.transactions for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Users can insert own transactions" on public.transactions;
create policy "Users can insert own transactions" on public.transactions for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Users can update own transactions" on public.transactions;
create policy "Users can update own transactions" on public.transactions for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "Users can delete own transactions" on public.transactions;
create policy "Users can delete own transactions" on public.transactions for delete to authenticated using ((select auth.uid()) = user_id);

create table if not exists public.budget_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  monthly_budget numeric(10,2) not null default 0 check (monthly_budget >= 0),
  updated_at timestamptz not null default now()
);
alter table public.budget_settings enable row level security;
revoke all on table public.budget_settings from anon;
grant select, insert, update, delete on table public.budget_settings to authenticated;
drop policy if exists "Users can read own budget settings" on public.budget_settings;
create policy "Users can read own budget settings" on public.budget_settings for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Users can insert own budget settings" on public.budget_settings;
create policy "Users can insert own budget settings" on public.budget_settings for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Users can update own budget settings" on public.budget_settings;
create policy "Users can update own budget settings" on public.budget_settings for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "Users can delete own budget settings" on public.budget_settings;
create policy "Users can delete own budget settings" on public.budget_settings for delete to authenticated using ((select auth.uid()) = user_id);
