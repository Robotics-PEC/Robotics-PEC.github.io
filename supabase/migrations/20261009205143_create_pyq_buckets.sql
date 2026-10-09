-- Create unverifiedPapers bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'unverifiedPapers',
  'unverifiedPapers',
  false,
  52428800,
  NULL
);

-- Create verifiedPapers bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'verifiedPapers',
  'verifiedPapers',
  true,
  52428800,
  NULL
);

CREATE POLICY "Owner or admin can select unverified papers" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'unverifiedPapers'
    AND (owner_id = (select auth.uid()::text)
         OR public."hasRole"((select auth.uid()), 'admin'::text))
  );

CREATE POLICY "Owner or admin can delete unverified papers" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'unverifiedPapers'
    AND (owner_id = (select auth.uid()::text)
         OR public."hasRole"((select auth.uid()), 'admin'::text))
  );