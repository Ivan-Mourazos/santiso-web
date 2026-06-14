-- U.D. Santiso public web foundation.
-- Non-destructive: does not modify legacy admin tables.
-- Review RLS on underlying sports tables before exposing public views.

BEGIN;

CREATE OR REPLACE FUNCTION public.set_public_web_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.web_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.club_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_gl text NOT NULL,
  title_es text NOT NULL,
  summary_gl text,
  summary_es text,
  body_gl text,
  body_es text,
  hero_image_url text,
  published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.club_honours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season text,
  title_gl text NOT NULL,
  title_es text NOT NULL,
  description_gl text,
  description_es text,
  category text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.public_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_gl text NOT NULL,
  title_es text NOT NULL,
  excerpt_gl text,
  excerpt_es text,
  body_gl text,
  body_es text,
  cover_image_url text,
  published_at timestamptz,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shop_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_gl text NOT NULL,
  name_es text NOT NULL,
  description_gl text,
  description_es text,
  image_urls text[] NOT NULL DEFAULT '{}',
  price_note_gl text,
  price_note_es text,
  whatsapp_number text,
  visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shop_product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.shop_products(id) ON DELETE CASCADE,
  label text NOT NULL,
  available boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  UNIQUE (product_id, label)
);

CREATE INDEX IF NOT EXISTS idx_club_pages_public
  ON public.club_pages (published, sort_order);
CREATE INDEX IF NOT EXISTS idx_club_honours_public
  ON public.club_honours (published, sort_order);
CREATE INDEX IF NOT EXISTS idx_public_posts_feed
  ON public.public_posts (published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_shop_products_public
  ON public.shop_products (visible, sort_order);

DROP TRIGGER IF EXISTS trg_club_pages_updated_at ON public.club_pages;
CREATE TRIGGER trg_club_pages_updated_at
  BEFORE UPDATE ON public.club_pages
  FOR EACH ROW EXECUTE FUNCTION public.set_public_web_updated_at();

DROP TRIGGER IF EXISTS trg_club_honours_updated_at ON public.club_honours;
CREATE TRIGGER trg_club_honours_updated_at
  BEFORE UPDATE ON public.club_honours
  FOR EACH ROW EXECUTE FUNCTION public.set_public_web_updated_at();

DROP TRIGGER IF EXISTS trg_public_posts_updated_at ON public.public_posts;
CREATE TRIGGER trg_public_posts_updated_at
  BEFORE UPDATE ON public.public_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_public_web_updated_at();

DROP TRIGGER IF EXISTS trg_shop_products_updated_at ON public.shop_products;
CREATE TRIGGER trg_shop_products_updated_at
  BEFORE UPDATE ON public.shop_products
  FOR EACH ROW EXECUTE FUNCTION public.set_public_web_updated_at();

ALTER TABLE public.web_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_honours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read web settings" ON public.web_settings;
CREATE POLICY "Public read web settings"
  ON public.web_settings FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public read published club pages" ON public.club_pages;
CREATE POLICY "Public read published club pages"
  ON public.club_pages FOR SELECT TO anon, authenticated
  USING (published);

DROP POLICY IF EXISTS "Public read published honours" ON public.club_honours;
CREATE POLICY "Public read published honours"
  ON public.club_honours FOR SELECT TO anon, authenticated
  USING (published);

DROP POLICY IF EXISTS "Public read published posts" ON public.public_posts;
CREATE POLICY "Public read published posts"
  ON public.public_posts FOR SELECT TO anon, authenticated
  USING (published AND published_at IS NOT NULL AND published_at <= now());

DROP POLICY IF EXISTS "Public read visible products" ON public.shop_products;
CREATE POLICY "Public read visible products"
  ON public.shop_products FOR SELECT TO anon, authenticated
  USING (visible);

DROP POLICY IF EXISTS "Public read visible product variants" ON public.shop_product_variants;
CREATE POLICY "Public read visible product variants"
  ON public.shop_product_variants FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.shop_products product
      WHERE product.id = product_id AND product.visible
    )
  );

-- Safe projection for public match cards. Security invoker respects underlying RLS.
CREATE OR REPLACE VIEW public.public_match_cards
WITH (security_invoker = true)
AS
SELECT
  match.id,
  match.categoria,
  competition.nombre AS competicion,
  match.estado,
  match.fecha,
  match.goles_local,
  match.goles_visitante,
  local_team.nombre AS local_nombre,
  local_team.escudo_url AS local_escudo_url,
  away_team.nombre AS visitante_nombre,
  away_team.escudo_url AS visitante_escudo_url,
  field.nombre AS campo_nombre
FROM public.partidos_liga match
JOIN public.competiciones competition ON competition.id = match.competicion_id
JOIN public.equipos local_team ON local_team.id = match.equipo_local_id
JOIN public.equipos away_team ON away_team.id = match.equipo_visitante_id
LEFT JOIN public.campos_futbol field ON field.id = match.campo_id;

GRANT SELECT ON public.web_settings TO anon, authenticated;
GRANT SELECT ON public.club_pages TO anon, authenticated;
GRANT SELECT ON public.club_honours TO anon, authenticated;
GRANT SELECT ON public.public_posts TO anon, authenticated;
GRANT SELECT ON public.shop_products TO anon, authenticated;
GRANT SELECT ON public.shop_product_variants TO anon, authenticated;
GRANT SELECT ON public.public_match_cards TO anon, authenticated;

COMMIT;
