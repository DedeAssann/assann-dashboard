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
  notes text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, project_key)
);

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
