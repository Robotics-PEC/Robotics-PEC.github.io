CREATE POLICY "Anyone can select verified papers" ON storage.objects
  FOR SELECT TO public
  USING (
    bucket_id = 'verifiedPapers'
  );

CREATE POLICY "Owner or admin can delete verified papers" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'verifiedPapers'
    AND (owner_id = (select auth.uid()::text)
         OR public."hasRole"((select auth.uid()), 'admin'::text))
  );