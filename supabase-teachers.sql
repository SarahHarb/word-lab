-- ===== برنامج وورد — إضافة المدرّسين (تشغيل مرة واحدة) =====
-- الصقي هذا الملف كاملًا في Supabase: SQL Editor ← New query ← Run
-- آمن: لا يحذف أي شعبة أو طالب أو تقدّم.

-- 1) جدول المدرّسين
create table if not exists teachers (email text primary key, name text default '', created_at timestamptz default now());
alter table teachers enable row level security;

-- 2) كل شعبة لها صاحب (إيميل المدرّس).
alter table sections add column if not exists owner text;
-- سارة حرب: مسؤولة الموقع (أدمن) ومدرّسة الشعبتين الحاليتين 38 و 53
insert into admins(email) values ('p9396@ppu.edu.ps') on conflict do nothing;
insert into teachers(email,name) values ('p9396@ppu.edu.ps','سارة حرب') on conflict (email) do update set name = excluded.name;
update sections set owner = 'p9396@ppu.edu.ps' where name in ('38','53') or owner is null;
-- كل من في شعبة «المدرسون» يصبح مدرّسًا (يضيف شعبه وطلابه)
insert into teachers(email,name)
  select lower(st.email), coalesce(st.name,'') from students st join sections se on se.id = st.section_id
  where trim(se.name) in ('المدرسون','المدرّسون','المدرسين') and lower(st.email) <> 'p9396@ppu.edu.ps'
on conflict (email) do nothing;

-- 3) دوال الصلاحيات
create or replace function is_teacher() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from teachers where email = my_email()) or exists(select 1 from admins where email = my_email()) $$;
create or replace function owns_section(sid uuid) returns boolean language sql stable security definer set search_path=public as $$
  select is_admin() or exists(select 1 from sections where id = sid and owner = my_email()) $$;
create or replace function owns_student(sem text) returns boolean language sql stable security definer set search_path=public as $$
  select is_admin() or exists(select 1 from students s join sections c on c.id = s.section_id where s.email = sem and c.owner = my_email()) $$;

-- 4) السياسات
drop policy if exists t_sel on teachers; create policy t_sel on teachers for select to authenticated using (is_admin() or email = my_email());
drop policy if exists t_all on teachers; create policy t_all on teachers for all    to authenticated using (is_admin()) with check (is_admin());

drop policy if exists s_sel on sections; create policy s_sel on sections for select to authenticated using (is_admin() or owner = my_email() or is_student());
drop policy if exists s_all on sections;
drop policy if exists s_ins on sections; create policy s_ins on sections for insert to authenticated with check (is_admin() or (is_teacher() and owner = my_email()));
drop policy if exists s_upd on sections; create policy s_upd on sections for update to authenticated using (is_admin() or owner = my_email()) with check (is_admin() or owner = my_email());
drop policy if exists s_del on sections; create policy s_del on sections for delete to authenticated using (is_admin() or owner = my_email());

drop policy if exists st_sel on students; create policy st_sel on students for select to authenticated using (is_admin() or email = my_email() or owns_section(section_id));
drop policy if exists st_all on students;
drop policy if exists st_ins on students; create policy st_ins on students for insert to authenticated with check (owns_section(section_id));
drop policy if exists st_upd on students; create policy st_upd on students for update to authenticated using (owns_section(section_id)) with check (owns_section(section_id));
drop policy if exists st_del on students; create policy st_del on students for delete to authenticated using (owns_section(section_id));

drop policy if exists p_sel on progress; create policy p_sel on progress for select to authenticated using (is_admin() or email = my_email() or owns_student(email));
