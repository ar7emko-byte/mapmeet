-- =========================================================================
-- MapMeet — avatars storage bucket
-- =========================================================================
-- Creates a public bucket for profile avatars. Storage RLS is scoped so a
-- user can only write files whose top-level folder matches their auth id
-- (e.g. `<user_id>/avatar.png`). Reads are public.
-- =========================================================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Public read.
drop policy if exists "public read on avatars" on storage.objects;
create policy "public read on avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Owner write — a user can only touch files in `avatars/<their-uid>/…`.
drop policy if exists "owner upload own avatar" on storage.objects;
create policy "owner upload own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "owner update own avatar" on storage.objects;
create policy "owner update own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "owner delete own avatar" on storage.objects;
create policy "owner delete own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
