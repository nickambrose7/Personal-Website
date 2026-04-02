create extension if not exists "pgcrypto";

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_path text not null,
  parent_comment_id uuid references comments(id) on delete cascade,
  author_name varchar(80) not null,
  author_email varchar(254),
  body text not null,
  is_author boolean not null default false,
  status text not null default 'published' check (status in ('pending', 'published', 'deleted')),
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists comments_post_path_created_at_idx
  on comments (post_path, created_at);

create index if not exists comments_parent_comment_id_idx
  on comments (parent_comment_id);

create index if not exists comments_ip_hash_created_at_idx
  on comments (ip_hash, created_at)
  where ip_hash is not null;

create or replace function set_comments_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists comments_set_updated_at on comments;

create trigger comments_set_updated_at
before update on comments
for each row
execute function set_comments_updated_at();

create table if not exists lead_submissions (
  id uuid primary key default gen_random_uuid(),
  email varchar(254) not null,
  name varchar(80) not null,
  company varchar(120),
  message text not null,
  source_label varchar(80),
  source_path text,
  ip_hash text,
  notification_status text not null default 'pending'
    check (notification_status in ('pending', 'sent', 'failed')),
  notification_error text,
  notified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lead_submissions_created_at_idx
  on lead_submissions (created_at desc);

create index if not exists lead_submissions_ip_hash_created_at_idx
  on lead_submissions (ip_hash, created_at)
  where ip_hash is not null;

create index if not exists lead_submissions_notification_status_idx
  on lead_submissions (notification_status, created_at desc);

create or replace function set_lead_submissions_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists lead_submissions_set_updated_at on lead_submissions;

create trigger lead_submissions_set_updated_at
before update on lead_submissions
for each row
execute function set_lead_submissions_updated_at();
