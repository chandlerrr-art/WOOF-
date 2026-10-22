create table if not exists public.rescue_reports (
  id text primary key check (id ~ '^RES-[A-Z0-9-]{8,64}$'),
  city_id text not null check (city_id in ('bengaluru', 'delhi', 'mumbai', 'pune', 'chennai')),
  title text not null check (char_length(title) <= 160),
  species text not null check (char_length(species) <= 100),
  urgency text not null check (urgency in ('critical', 'severe', 'moderate')),
  status text not null default 'broadcasted'
    check (status in ('reported', 'broadcasted', 'connected', 'help-arrived', 'at-facility', 'resolved')),
  location text not null check (char_length(location) <= 300),
  lat double precision check (lat between -90 and 90),
  lng double precision check (lng between -180 and 180),
  landmark text not null check (char_length(landmark) <= 300),
  notes text not null default '' check (char_length(notes) <= 3000),
  photo text,
  connected_responder jsonb,
  connected_user_id uuid references auth.users(id) on delete set null,
  nearest_facility jsonb,
  timeline jsonb not null default '[]'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.report_contacts (
  report_id text primary key references public.rescue_reports(id) on delete cascade,
  reported_by text not null check (char_length(reported_by) <= 120),
  reporter_phone text not null check (char_length(reporter_phone) <= 40)
);

alter table public.rescue_reports enable row level security;
alter table public.report_contacts enable row level security;

revoke all on public.rescue_reports from anon, authenticated;
grant select (
  id, city_id, title, species, urgency, status, location, lat, lng,
  landmark, notes, photo, connected_responder, nearest_facility, timeline,
  created_at, updated_at
) on public.rescue_reports to anon, authenticated;
revoke all on public.report_contacts from anon, authenticated;
grant select on public.report_contacts to authenticated;

drop policy if exists "Reports are publicly readable" on public.rescue_reports;
create policy "Reports are publicly readable"
  on public.rescue_reports for select
  to anon, authenticated
  using (true);

create or replace function public.can_read_report_contact(target_report_id text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.rescue_reports as report
    where report.id = target_report_id
      and (
        report.connected_user_id = auth.uid()
        or report.created_by = auth.uid()
      )
  );
$$;

revoke all on function public.can_read_report_contact(text) from public, anon;
grant execute on function public.can_read_report_contact(text) to authenticated;

drop policy if exists "Claimed responders can read report contacts" on public.report_contacts;
create policy "Claimed responders can read report contacts"
  on public.report_contacts for select
  to authenticated
  using (public.can_read_report_contact(report_id));

create or replace function public.create_rescue_report(report_data jsonb, contact_data jsonb)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_id text := report_data ->> 'id';
begin
  insert into public.rescue_reports (
    id, city_id, title, species, urgency, status, location, lat, lng,
    landmark, notes, photo, nearest_facility, timeline, created_by
  ) values (
    new_id,
    report_data ->> 'city_id',
    report_data ->> 'title',
    report_data ->> 'species',
    report_data ->> 'urgency',
    'broadcasted',
    report_data ->> 'location',
    nullif(report_data ->> 'lat', '')::double precision,
    nullif(report_data ->> 'lng', '')::double precision,
    report_data ->> 'landmark',
    coalesce(report_data ->> 'notes', ''),
    report_data ->> 'photo',
    report_data -> 'nearest_facility',
    jsonb_build_array(
      jsonb_build_object(
        'time', to_char(now() at time zone 'UTC', 'HH12:MI AM'),
        'event', 'SOS broadcast logged by citizen finder',
        'actor', 'Citizen reporter'
      ),
      jsonb_build_object(
        'time', to_char(now() at time zone 'UTC', 'HH12:MI AM'),
        'event', 'Shared to the city volunteer rescue grid',
        'actor', 'WOOF Connector'
      )
    ),
    auth.uid()
  );

  insert into public.report_contacts (report_id, reported_by, reporter_phone)
  values (new_id, contact_data ->> 'reported_by', contact_data ->> 'reporter_phone');

  return new_id;
end;
$$;

create or replace function public.claim_rescue_report(report_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  responder_name text := coalesce(
    nullif(auth.jwt() -> 'user_metadata' ->> 'display_name', ''),
    'Community responder'
  );
  updated_count integer;
begin
  if auth.uid() is null then
    raise exception 'Sign in to claim a rescue report.';
  end if;

  update public.rescue_reports
  set status = 'connected',
      connected_user_id = auth.uid(),
      connected_responder = jsonb_build_object(
        'name', responder_name,
        'role', 'Community responder (not independently verified)',
        'phone', null,
        'eta', 'Contact the reporter for an ETA',
        'action', 'Claimed by a WOOF account'
      ),
      timeline = jsonb_build_array(jsonb_build_object(
        'time', to_char(now() at time zone 'UTC', 'HH12:MI AM'),
        'event', 'Rescue report claimed by a community responder',
        'actor', responder_name
      )) || timeline,
      updated_at = now()
  where id = report_id
    and status in ('reported', 'broadcasted');

  get diagnostics updated_count = row_count;
  if updated_count = 0 then
    raise exception 'This report is no longer available to claim.';
  end if;
end;
$$;

create or replace function public.advance_rescue_report(report_id text, next_status text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  responder_name text := coalesce(
    nullif(auth.jwt() -> 'user_metadata' ->> 'display_name', ''),
    'Community responder'
  );
  updated_count integer;
begin
  if auth.uid() is null then
    raise exception 'Sign in to update a rescue report.';
  end if;

  if next_status not in ('broadcasted', 'connected', 'help-arrived', 'at-facility', 'resolved') then
    raise exception 'Invalid rescue report status.';
  end if;

  update public.rescue_reports
  set status = next_status,
      timeline = jsonb_build_array(jsonb_build_object(
        'time', to_char(now() at time zone 'UTC', 'HH12:MI AM'),
        'event', 'Status updated to ' || upper(next_status),
        'actor', responder_name
      )) || timeline,
      updated_at = now()
  where id = report_id
    and connected_user_id = auth.uid()
    and status <> 'resolved'
    and case status
      when 'reported' then next_status = 'broadcasted'
      when 'broadcasted' then next_status = 'connected'
      when 'connected' then next_status = 'help-arrived'
      when 'help-arrived' then next_status = 'at-facility'
      when 'at-facility' then next_status = 'resolved'
      else false
    end;

  get diagnostics updated_count = row_count;
  if updated_count = 0 then
    raise exception 'Only the assigned responder can advance this report to its next status.';
  end if;
end;
$$;

revoke all on function public.create_rescue_report(jsonb, jsonb) from public;
grant execute on function public.create_rescue_report(jsonb, jsonb) to anon, authenticated;
revoke all on function public.claim_rescue_report(text) from public, anon;
grant execute on function public.claim_rescue_report(text) to authenticated;
revoke all on function public.advance_rescue_report(text, text) from public, anon;
grant execute on function public.advance_rescue_report(text, text) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('report-photos', 'report-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view rescue report photos" on storage.objects;
create policy "Public can view rescue report photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'report-photos');

drop policy if exists "Public can upload rescue report photos" on storage.objects;
create policy "Public can upload rescue report photos"
  on storage.objects for insert
  to anon, authenticated
  with check (
    bucket_id = 'report-photos'
    and name ~* '^[0-9a-f-]{36}\.(jpg|jpeg|png|webp)$'
  );

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'rescue_reports'
  ) then
    alter publication supabase_realtime add table public.rescue_reports;
  end if;
end;
$$;
