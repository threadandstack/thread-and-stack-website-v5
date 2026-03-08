
DROP POLICY "Anyone can insert page SEO data" ON public.page_seo;
DROP POLICY "Anyone can update page SEO data" ON public.page_seo;
DROP POLICY "Anyone can delete page SEO data" ON public.page_seo;

CREATE POLICY "Only admins can insert page SEO data" ON public.page_seo
  FOR INSERT TO authenticated
  WITH CHECK (auth.email() IN ('br@brendanrodgers.uk', 'br@threadandstack.com'));

CREATE POLICY "Only admins can update page SEO data" ON public.page_seo
  FOR UPDATE TO authenticated
  USING (auth.email() IN ('br@brendanrodgers.uk', 'br@threadandstack.com'));

CREATE POLICY "Only admins can delete page SEO data" ON public.page_seo
  FOR DELETE TO authenticated
  USING (auth.email() IN ('br@brendanrodgers.uk', 'br@threadandstack.com'));
