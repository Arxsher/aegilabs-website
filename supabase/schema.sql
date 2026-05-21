create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  email text,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_configs (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null references public.profiles(clerk_user_id) on delete cascade,
  agent_name text not null,
  use_case text not null,
  tools text[] not null default '{}',
  model_preference text not null default 'auto',
  autonomy_level text not null default 'approval_required',
  status text not null default 'draft',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  company text,
  message text,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null references public.profiles(clerk_user_id) on delete cascade,
  agent_config_id uuid references public.agent_configs(id) on delete set null,
  role text not null check (role in ('user', 'agent', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists profiles_clerk_user_id_idx on public.profiles(clerk_user_id);
create index if not exists agent_configs_clerk_user_id_idx on public.agent_configs(clerk_user_id);
create index if not exists chat_messages_clerk_user_id_idx on public.chat_messages(clerk_user_id);
