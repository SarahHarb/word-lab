-- ===== برنامج وورد — قاعدة البيانات (Supabase) =====
-- الصقي هذا الملف كاملًا في: SQL Editor ← New query ← Run
-- مهم: غيّري TEACHER_EMAIL@gmail.com في آخر الملف إلى إيميلك.

create table if not exists admins   (email text primary key);
create table if not exists sections (id uuid primary key default gen_random_uuid(), name text not null, unlocked text[] not null default '{}', created_at timestamptz default now());
create table if not exists students (email text primary key, name text default '', section_id uuid references sections(id) on delete set null);
create table if not exists progress (email text primary key, name text default '', section_id uuid, done jsonb not null default '{}', last timestamptz default now());

create or replace function my_email() returns text language sql stable as $$ select lower(coalesce(auth.jwt()->>'email','')) $$;
create or replace function is_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from admins where email = my_email()) $$;
create or replace function is_student() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from students where email = my_email()) $$;

alter table admins   enable row level security;
alter table sections enable row level security;
alter table students enable row level security;
alter table progress enable row level security;

drop policy if exists a_sel on admins;   create policy a_sel on admins   for select to authenticated using (email = my_email() or is_admin());
drop policy if exists s_sel on sections; create policy s_sel on sections for select to authenticated using (is_admin() or is_student());
drop policy if exists s_all on sections; create policy s_all on sections for all    to authenticated using (is_admin()) with check (is_admin());
drop policy if exists st_sel on students; create policy st_sel on students for select to authenticated using (is_admin() or email = my_email());
drop policy if exists st_all on students; create policy st_all on students for all    to authenticated using (is_admin()) with check (is_admin());
drop policy if exists p_sel on progress; create policy p_sel on progress for select to authenticated using (is_admin() or email = my_email());
drop policy if exists p_ins on progress; create policy p_ins on progress for insert to authenticated with check (email = my_email() and is_student());
drop policy if exists p_upd on progress; create policy p_upd on progress for update to authenticated using (email = my_email()) with check (email = my_email() and is_student());

-- إيميل المعلّمة (الأدمن):
insert into admins(email) values (lower('TEACHER_EMAIL@gmail.com')) on conflict do nothing;
alter table students add column if not exists extra uuid[] not null default '{}';
