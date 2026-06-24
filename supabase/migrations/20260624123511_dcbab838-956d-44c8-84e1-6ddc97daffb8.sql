
CREATE POLICY "company-assets public read" ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'company-assets');
CREATE POLICY "company-assets admin insert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'company-assets' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "company-assets admin update" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'company-assets' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "company-assets admin delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'company-assets' AND public.has_role(auth.uid(),'admin'));
