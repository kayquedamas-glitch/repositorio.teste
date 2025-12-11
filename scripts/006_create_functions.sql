-- Function to update profile XP and level
create or replace function public.add_xp_to_profile(
  p_user_id uuid,
  p_xp_amount integer
)
returns void
language plpgsql
security definer
as $$
declare
  v_current_xp integer;
  v_new_xp integer;
  v_new_level integer;
  v_new_rank text;
begin
  -- Get current XP
  select xp into v_current_xp
  from public.profiles
  where id = p_user_id;

  -- Calculate new XP
  v_new_xp := v_current_xp + p_xp_amount;
  
  -- Calculate new level (100 XP per level)
  v_new_level := floor(v_new_xp / 100) + 1;
  
  -- Determine rank based on level
  v_new_rank := case
    when v_new_level < 5 then 'Recruta'
    when v_new_level < 10 then 'Soldado'
    when v_new_level < 20 then 'Sargento'
    when v_new_level < 35 then 'Tenente'
    when v_new_level < 50 then 'Capitão'
    when v_new_level < 75 then 'Comandante'
    when v_new_level < 100 then 'General'
    else 'Lenda'
  end;
  
  -- Update profile
  update public.profiles
  set 
    xp = v_new_xp,
    level = v_new_level,
    rank = v_new_rank,
    updated_at = now()
  where id = p_user_id;
end;
$$;

-- Function to complete mission and award XP
create or replace function public.complete_mission(
  p_mission_id uuid
)
returns void
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_xp_reward integer;
begin
  -- Get mission details
  select user_id, xp_reward into v_user_id, v_xp_reward
  from public.missions
  where id = p_mission_id;
  
  -- Update mission status
  update public.missions
  set 
    status = 'completed',
    completed_at = now(),
    updated_at = now()
  where id = p_mission_id;
  
  -- Add XP to profile
  perform public.add_xp_to_profile(v_user_id, v_xp_reward);
end;
$$;
