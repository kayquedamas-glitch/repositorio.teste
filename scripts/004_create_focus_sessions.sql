-- Create focus sessions table for tracking focus mode usage
create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  duration_minutes integer not null,
  completed boolean default false,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ended_at timestamp with time zone
);

-- Enable RLS
alter table public.focus_sessions enable row level security;

-- RLS Policies for focus sessions
create policy "focus_sessions_select_own"
  on public.focus_sessions for select
  using (auth.uid() = user_id);

create policy "focus_sessions_insert_own"
  on public.focus_sessions for insert
  with check (auth.uid() = user_id);

create policy "focus_sessions_update_own"
  on public.focus_sessions for update
  using (auth.uid() = user_id);

-- Create index for better query performance
create index if not exists focus_sessions_user_id_idx on public.focus_sessions(user_id);
create index if not exists focus_sessions_started_at_idx on public.focus_sessions(started_at desc);
