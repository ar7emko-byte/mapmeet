-- =========================================================================
-- MapMeet — initial schema
-- =========================================================================
-- Tables:  profiles, events, participants
-- Security: Row Level Security enforced on every table
-- Realtime: events + participants added to supabase_realtime publication
-- =========================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- -------------------------------------------------------------------------
-- Utility: keep updated_at fresh on every row update
-- -------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- =========================================================================
-- profiles
-- =========================================================================
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text not null unique
                 check (char_length(username) between 3 and 24
                        and username ~ '^[a-zA-Z0-9_\.]+$'),
  display_name text not null
                 check (char_length(display_name) between 1 and 40),
  avatar_url   text,
  created_at   timestamptz not null default timezone('utc', now()),
  updated_at   timestamptz not null default timezone('utc', now())
);

create index if not exists profiles_username_lower_idx
  on public.profiles (lower(username));

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row when a new auth user signs up.
-- The client passes username + display_name through auth.signUp's `options.data`,
-- which lands in raw_user_meta_data.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username',
             'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'display_name',
             coalesce(new.raw_user_meta_data->>'username', 'New user')),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================================
-- events
-- =========================================================================
create table if not exists public.events (
  id                uuid primary key default gen_random_uuid(),
  creator_id        uuid not null references public.profiles(id) on delete cascade,
  title             text not null check (char_length(title) between 1 and 80),
  description       text check (char_length(description) <= 500),
  emoji             text not null check (char_length(emoji) between 1 and 8),
  latitude          double precision not null check (latitude between -90 and 90),
  longitude         double precision not null check (longitude between -180 and 180),
  event_date        date not null,
  event_time        time not null,
  max_participants  integer check (max_participants is null or max_participants > 0),
  visibility        text not null default 'public'
                      check (visibility in ('public', 'private')),
  created_at        timestamptz not null default timezone('utc', now()),
  updated_at        timestamptz not null default timezone('utc', now())
);

create index if not exists events_creator_id_idx    on public.events (creator_id);
create index if not exists events_event_date_idx    on public.events (event_date);
create index if not exists events_created_at_idx    on public.events (created_at desc);
-- Cheap geo prefilter for "nearby" queries; a full PostGIS geog column is
-- deliberately deferred until we outgrow this.
create index if not exists events_lat_lng_idx       on public.events (latitude, longitude);

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- =========================================================================
-- participants
-- =========================================================================
create table if not exists public.participants (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.events(id)   on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  joined_at  timestamptz not null default timezone('utc', now()),
  unique (event_id, user_id)
);

create index if not exists participants_event_id_idx on public.participants (event_id);
create index if not exists participants_user_id_idx  on public.participants (user_id);

-- =========================================================================
-- Row Level Security
-- =========================================================================
alter table public.profiles     enable row level security;
alter table public.events       enable row level security;
alter table public.participants enable row level security;

-- profiles ----------------------------------------------------------------
drop policy if exists "profiles are readable by everyone"        on public.profiles;
drop policy if exists "users can insert their own profile"       on public.profiles;
drop policy if exists "users can update their own profile"       on public.profiles;

create policy "profiles are readable by everyone"
  on public.profiles for select
  using (true);

create policy "users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- events ------------------------------------------------------------------
drop policy if exists "authenticated can read public events"     on public.events;
drop policy if exists "creator can read own private events"      on public.events;
drop policy if exists "authenticated can create own events"      on public.events;
drop policy if exists "creator can update own events"            on public.events;
drop policy if exists "creator can delete own events"            on public.events;

create policy "authenticated can read public events"
  on public.events for select
  to authenticated
  using (visibility = 'public' or creator_id = auth.uid());

create policy "authenticated can create own events"
  on public.events for insert
  to authenticated
  with check (creator_id = auth.uid());

create policy "creator can update own events"
  on public.events for update
  to authenticated
  using (creator_id = auth.uid())
  with check (creator_id = auth.uid());

create policy "creator can delete own events"
  on public.events for delete
  to authenticated
  using (creator_id = auth.uid());

-- participants ------------------------------------------------------------
drop policy if exists "participants are readable by authenticated" on public.participants;
drop policy if exists "users can join events"                      on public.participants;
drop policy if exists "users can leave events"                     on public.participants;

create policy "participants are readable by authenticated"
  on public.participants for select
  to authenticated
  using (true);

create policy "users can join events"
  on public.participants for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "users can leave events"
  on public.participants for delete
  to authenticated
  using (user_id = auth.uid());

-- =========================================================================
-- Realtime
-- =========================================================================
-- Enable row-level change streams for the tables the client subscribes to.
do $$
begin
  if not exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    create publication supabase_realtime;
  end if;
end$$;

alter publication supabase_realtime add table public.events;
alter publication supabase_realtime add table public.participants;
