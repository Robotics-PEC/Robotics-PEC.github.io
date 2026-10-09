-- Create questionPapers table
create table "questionPapers" (
  id uuid primary key default uuid_generate_v4(),
  "courseCode" text not null,
  year integer not null,
  type text not null check (type in ('midterm', 'endterm')),
  "filePath" text not null,
  "uploaderId" uuid references public.profiles(id) not null,
  "isVerified" boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table "questionPapers" enable row level security;

-- Policies
-- 1. Select: anyone can view verified papers
create policy "Allow anyone to view verified papers" on "questionPapers"
  for select
  using ("isVerified" = true);

-- 2. Insert: authenticated user can upload, ensuring uploaderId belongs to them
create policy "Authenticated users can insert papers" on "questionPapers"
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = "uploaderId"
      and "userId" = auth.uid()
    )
  );

-- 3. Update/Delete: only admins
create policy "Admins can manage papers" on "questionPapers"
  for all
  to authenticated
  using (public."hasRole"(auth.uid(), 'admin'::text))
  with check (public."hasRole"(auth.uid(), 'admin'::text));

-- 4. Allow user to select their own unverified files
create policy "Uploaders can view own papers" on "questionPapers"
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = "questionPapers"."uploaderId"
        and p."userId" = (select auth.uid())
    )
  );