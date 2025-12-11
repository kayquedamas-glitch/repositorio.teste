-- Create panic protocol logs table
create table if not exists public.panic_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trigger_reason text,
  duration_seconds integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.panic_logs enable row level security;

-- RLS Policies for panic logs
create policy "panic_logs_select_own"
  on public.panic_logs for select
  using (auth.uid() = user_id);

create policy "panic_logs_insert_own"
  on public.panic_logs for insert
  with check (auth.uid() = user_id);

-- Create index for better query performance
create index if not exists panic_logs_user_id_idx on public.panic_logs(user_id);
create index if not exists panic_logs_created_at_idx on public.panic_logs(created_at desc);
