create extension if not exists pgcrypto;

create table if not exists public.memes (
  id text primary key,
  title text not null,
  description text not null default '',
  emoji text not null default '??',
  category text not null default '????',
  source_platform text not null default '????',
  source_url text not null default '',
  source_name text not null default '',
  heat_value bigint not null default 0,
  heat_status text not null default 'new',
  origin text not null default '',
  examples jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  status text not null default 'approved',
  submitter text not null default '',
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_refreshed_at timestamptz,
  reject_reason text not null default '',
  cross_platform integer,
  cross_platform_list jsonb,
  raw_stats jsonb
);

create index if not exists memes_status_idx on public.memes(status);
create index if not exists memes_category_idx on public.memes(category);
create index if not exists memes_heat_idx on public.memes(heat_value desc);
create index if not exists memes_created_idx on public.memes(created_at desc);

alter table public.memes enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'memes' and policyname = 'public read approved memes') then
    create policy "public read approved memes" on public.memes
      for select using (status = 'approved');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'memes' and policyname = 'authenticated full access') then
    create policy "authenticated full access" on public.memes
      for all to authenticated using (true) with check (true);
  end if;
end $$;
