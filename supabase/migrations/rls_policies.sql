-- Row Level Security (RLS) Policies & Functions

-- 1. Helper Functions
create or replace function get_my_role() returns text as $$
  select coalesce(
    (select role::text from profiles where id = auth.uid()),
    'student'
  );
$$ language sql stable security definer;

create or replace function is_club_admin_of(target_club uuid) returns boolean as $$
  select exists (
    select 1 from club_teams
    where club_id = target_club and user_id = auth.uid()
      and position ilike '%admin%'
  ) or get_my_role() in ('super_admin','department_admin');
$$ language sql stable security definer;

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table clubs enable row level security;
alter table club_members enable row level security;
alter table club_teams enable row level security;
alter table membership_cards enable row level security;
alter table events enable row level security;
alter table event_registrations enable row level security;
alter table attendance enable row level security;
alter table event_feedback enable row level security;
alter table certificates enable row level security;
alter table projects enable row level security;
alter table project_reviews enable row level security;
alter table lms_resources enable row level security;
alter table resource_progress enable row level security;
alter table roadmaps enable row level security;
alter table roadmap_progress enable row level security;
alter table tools_directory enable row level security;
alter table gallery enable row level security;
alter table announcements enable row level security;
alter table notifications enable row level security;
alter table audit_logs enable row level security;

-- PROFILES POLICIES
create policy "Public can view profile summaries" on profiles for select using (true);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);
create policy "Admins can manage profiles" on profiles for all using (get_my_role() in ('super_admin', 'department_admin'));

-- CLUBS POLICIES
create policy "Public can view active clubs" on clubs for select using (status = 'active' or get_my_role() in ('super_admin', 'department_admin'));
create policy "Admins can manage clubs" on clubs for all using (get_my_role() in ('super_admin', 'department_admin'));

-- EVENTS POLICIES
create policy "Public can view published events" on events for select using (status in ('published', 'completed') or is_club_admin_of(club_id) or get_my_role() in ('super_admin', 'department_admin'));
create policy "Club admins manage own events" on events for all using (is_club_admin_of(club_id)) with check (is_club_admin_of(club_id));
create policy "Super admins manage all events" on events for all using (get_my_role() in ('super_admin', 'department_admin'));

-- EVENT REGISTRATIONS
create policy "Users view own registrations" on event_registrations for select using (auth.uid() = user_id or get_my_role() in ('super_admin', 'department_admin'));
create policy "Users register themselves" on event_registrations for insert with check (auth.uid() = user_id);
create policy "Users cancel own registration" on event_registrations for delete using (auth.uid() = user_id);
create policy "Admins manage registrations" on event_registrations for all using (get_my_role() in ('super_admin', 'department_admin'));

-- CERTIFICATES
create policy "Public can verify certificates" on certificates for select using (true);
create policy "Admins create certificates" on certificates for insert with check (get_my_role() in ('super_admin', 'department_admin', 'faculty_coordinator', 'club_admin'));

-- MEMBERSHIP CARDS
create policy "Public can verify membership cards" on membership_cards for select using (true);
create policy "Admins issue membership cards" on membership_cards for all using (get_my_role() in ('super_admin', 'department_admin', 'club_admin'));

-- PROJECTS & REVIEWS
create policy "Public view approved projects" on projects for select using (status = 'approved' or auth.uid() = submitted_by or is_club_admin_of(club_id) or get_my_role() in ('super_admin', 'department_admin', 'faculty_coordinator'));
create policy "Users submit projects" on projects for insert with check (auth.uid() = submitted_by);
create policy "Users update own pending projects" on projects for update using (auth.uid() = submitted_by and status = 'pending');
create policy "Coordinators and admins review projects" on projects for update using (is_club_admin_of(club_id) or get_my_role() in ('super_admin', 'faculty_coordinator', 'department_admin'));

create policy "Public view reviews for approved projects" on project_reviews for select using (true);
create policy "Coordinators and admins write reviews" on project_reviews for insert with check (get_my_role() in ('super_admin', 'faculty_coordinator', 'department_admin', 'club_admin'));

-- LMS & ROADMAPS
create policy "Public view LMS resources" on lms_resources for select using (true);
create policy "Admins manage LMS resources" on lms_resources for all using (get_my_role() in ('super_admin', 'faculty_coordinator', 'club_admin'));

create policy "Users manage own resource progress" on resource_progress for all using (auth.uid() = user_id);
create policy "Public view roadmaps" on roadmaps for select using (true);
create policy "Users manage own roadmap progress" on roadmap_progress for all using (auth.uid() = user_id);
create policy "Public view tools" on tools_directory for select using (true);

-- GALLERY & ANNOUNCEMENTS
create policy "Public view gallery" on gallery for select using (true);
create policy "Admins manage gallery" on gallery for all using (get_my_role() in ('super_admin', 'club_admin', 'faculty_coordinator'));

create policy "Public view published announcements" on announcements for select using (true);
create policy "Admins manage announcements" on announcements for all using (get_my_role() in ('super_admin', 'club_admin', 'faculty_coordinator', 'department_admin'));

-- NOTIFICATIONS & AUDIT LOGS
create policy "Users view own notifications" on notifications for select using (auth.uid() = user_id);
create policy "Users update own notifications" on notifications for update using (auth.uid() = user_id);
create policy "Admins view audit logs" on audit_logs for select using (get_my_role() in ('super_admin', 'department_admin'));
create policy "System can insert audit logs" on audit_logs for insert with check (true);
