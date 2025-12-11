-- Create missions (tasks) table
create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  status text default 'active' check (status in ('active', 'completed', 'failed')),
  priority text default 'normal' check (priority in ('low', 'normal', 'high', 'critical')),
  xp_reward integer default 10,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.missions enable row level security;

-- RLS Policies for missions
create policy "missions_select_own"
  on public.missions for select
  using (auth.uid() = user_id);

create policy "missions_insert_own"
  on public.missions for insert
  with check (auth.uid() = user_id);

create policy "missions_update_own"
  on public.missions for update
  using (auth.uid() = user_id);

create policy "missions_delete_own"
  on public.missions for delete
  using (auth.uid() = user_id);

-- Create index for better query performance
create index if not exists missions_user_id_idx on public.missions(user_id);
create index if not exists missions_status_idx on public.missions(status);
