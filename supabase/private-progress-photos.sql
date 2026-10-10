-- My Gym Tracker: private progress-photo bucket setup
-- Run in the SQL Editor of the dedicated Supabase project.
-- Photos are accessible only to the authenticated owner whose UID prefixes the object path.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('gym-progress-photos','gym-progress-photos',false,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
set public=false,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];

drop policy if exists "gym_photos_owner_read" on storage.objects;
drop policy if exists "gym_photos_owner_insert" on storage.objects;
drop policy if exists "gym_photos_owner_update" on storage.objects;
drop policy if exists "gym_photos_owner_delete" on storage.objects;

create policy "gym_photos_owner_read" on storage.objects for select to authenticated
using (bucket_id='gym-progress-photos' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "gym_photos_owner_insert" on storage.objects for insert to authenticated
with check (bucket_id='gym-progress-photos' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "gym_photos_owner_update" on storage.objects for update to authenticated
using (bucket_id='gym-progress-photos' and (storage.foldername(name))[1]=(select auth.uid())::text)
with check (bucket_id='gym-progress-photos' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "gym_photos_owner_delete" on storage.objects for delete to authenticated
using (bucket_id='gym-progress-photos' and (storage.foldername(name))[1]=(select auth.uid())::text);
