-- Run once in Supabase SQL Editor.
-- Habit entries are private to the authenticated user via RLS.

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
create policy "Users can read own habits"
on public.habit_entries for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own habits" on public.habit_entries;
create policy "Users can insert own habits"
on public.habit_entries for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own habits" on public.habit_entries;
create policy "Users can update own habits"
on public.habit_entries for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own habits" on public.habit_entries;
create policy "Users can delete own habits"
on public.habit_entries for delete
to authenticated
using ((select auth.uid()) = user_id);
