-- DIGITwinTHON — Centralized Technical Clubs Management System
-- Comprehensive Schema Migration

-- Enable pgcrypto / uuid-ossp if available
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Enums
do $$ begin
  create type user_role as enum ('student','club_member','club_admin','faculty_coordinator','department_admin','super_admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type club_status as enum ('active','inactive');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type reg_status as enum ('registered','waitlisted','cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type project_status as enum ('pending','approved','rejected');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type card_status as enum ('active','expired','pending_renewal');
exception when duplicate_object then null;
end $$;

-- 1. Profiles (Extends auth.users or standalone fallback)
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  role user_role not null default 'student',
  department text,
  academic_year text,
  photo_url text,
  phone text,
  created_at timestamptz default now()
);

-- 2. Clubs
create table if not exists clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  domain text,
  status club_status default 'active',
  coordinator_id uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 3. Club Members
create table if not exists club_members (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references clubs(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  status text default 'active',
  joined_at timestamptz default now(),
  unique(club_id, user_id)
);

-- 4. Club Teams
create table if not exists club_teams (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references clubs(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  position text not null,
  academic_year text not null,
  tenure_start date,
  tenure_end date,
  approved_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 5. Membership Cards
create table if not exists membership_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  club_id uuid references clubs(id) on delete set null,
  membership_number text unique not null,
  qr_code_url text,
  status card_status default 'active',
  issued_at timestamptz default now(),
  valid_until date
);

-- 6. Events
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references clubs(id) on delete cascade,
  title text not null,
  description text,
  event_type text,
  venue text,
  start_time timestamptz,
  end_time timestamptz,
  capacity int,
  eligibility text,
  registration_deadline timestamptz,
  poster_url text,
  circular_url text,
  status text default 'draft',
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 7. Event Registrations
create table if not exists event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  status reg_status default 'registered',
  registered_at timestamptz default now(),
  unique(event_id, user_id)
);

-- 8. Attendance
create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  checked_in_at timestamptz default now(),
  method text default 'qr',
  marked_by uuid references profiles(id) on delete set null
);

-- 9. Event Feedback
create table if not exists event_feedback (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  rating int check (rating between 1 and 5),
  comments text,
  submitted_at timestamptz default now()
);

-- 10. Certificates
create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete set null,
  user_id uuid references profiles(id) on delete cascade,
  certificate_number text unique not null,
  qr_code_url text,
  file_url text,
  issued_at timestamptz default now()
);

-- 11. Projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references clubs(id) on delete set null,
  title text not null,
  description text,
  domain text,
  tech_stack text[],
  team_members uuid[],
  github_url text,
  demo_url text,
  documentation_url text,
  media_urls text[],
  submitted_by uuid references profiles(id) on delete set null,
  status project_status default 'pending',
  created_at timestamptz default now()
);

-- 12. Project Reviews
create table if not exists project_reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  reviewer_id uuid references profiles(id) on delete set null,
  rating int check (rating between 1 and 10),
  remarks text,
  decision project_status,
  reviewed_at timestamptz default now()
);

-- 13. LMS Resources
create table if not exists lms_resources (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references clubs(id) on delete set null,
  title text not null,
  type text,
  url text,
  domain text,
  technology text,
  difficulty text,
  semester text,
  uploaded_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 14. Resource Progress
create table if not exists resource_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  resource_id uuid references lms_resources(id) on delete cascade,
  bookmarked boolean default false,
  completed boolean default false,
  completed_at timestamptz,
  unique(user_id, resource_id)
);

-- 15. Roadmaps
create table if not exists roadmaps (
  id uuid primary key default gen_random_uuid(),
  technology text not null,
  stage text check (stage in ('beginner','intermediate','advanced')),
  title text not null,
  description text,
  resource_ids uuid[],
  order_index int default 0
);

-- 16. Roadmap Progress
create table if not exists roadmap_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  roadmap_id uuid references roadmaps(id) on delete cascade,
  completed boolean default false,
  completed_at timestamptz,
  unique(user_id, roadmap_id)
);

-- 17. Tools Directory
create table if not exists tools_directory (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  purpose text,
  platform text,
  license text,
  official_link text
);

-- 18. Gallery
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references clubs(id) on delete set null,
  event_id uuid references events(id) on delete set null,
  media_url text not null,
  media_type text default 'image',
  uploaded_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 19. Announcements
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references clubs(id) on delete set null,
  title text not null,
  content text,
  category text,
  important boolean default false,
  publish_at timestamptz default now(),
  expire_at timestamptz,
  created_by uuid references profiles(id) on delete set null
);

-- 20. Notifications
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  message text,
  type text,
  read boolean default false,
  created_at timestamptz default now()
);

-- 21. Audit Logs
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  target_table text,
  target_id uuid,
  details jsonb,
  created_at timestamptz default now()
);
