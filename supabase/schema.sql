-- ====================================================================
-- YUME JEWELLERY — SUPABASE DATABASE SCHEMA & INITIAL DATA
-- Copy and run this in Supabase Studio → SQL Editor → New Query → Run
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DROP TABLES IF NEEDED (Clean Setup)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- 3. CATEGORIES TABLE
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS TABLE
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  price NUMERIC(10, 2) NOT NULL,
  compare_at_price NUMERIC(10, 2),
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  track_stock BOOLEAN DEFAULT false,
  stock_quantity INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCT IMAGES TABLE
CREATE TABLE product_images (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDERS TABLE
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  district TEXT NOT NULL DEFAULT 'Dhaka',
  delivery_zone TEXT NOT NULL DEFAULT 'inside_dhaka',
  delivery_charge NUMERIC(10, 2) NOT NULL DEFAULT 80,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'cod',
  payment_number_used TEXT,
  transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDER ITEMS TABLE
CREATE TABLE order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name_snapshot TEXT NOT NULL,
  price_snapshot NUMERIC(10, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  image_snapshot TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SITE SETTINGS TABLE
CREATE TABLE site_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active store items
CREATE POLICY "Public categories are viewable by everyone" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public products are viewable by everyone" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public product images are viewable by everyone" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Public site settings are viewable by everyone" ON site_settings
  FOR SELECT USING (true);

-- Allow order creation from checkout
CREATE POLICY "Public can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view own order by order_number" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Public can insert order items" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view order items" ON order_items
  FOR SELECT USING (true);

-- Allow full access for service_role / authenticated admin
CREATE POLICY "Service role full access categories" ON categories FOR ALL USING (true);
CREATE POLICY "Service role full access products" ON products FOR ALL USING (true);
CREATE POLICY "Service role full access product_images" ON product_images FOR ALL USING (true);
CREATE POLICY "Service role full access orders" ON orders FOR ALL USING (true);
CREATE POLICY "Service role full access order_items" ON order_items FOR ALL USING (true);
CREATE POLICY "Service role full access site_settings" ON site_settings FOR ALL USING (true);

-- ====================================================================
-- INITIAL SEED DATA
-- ====================================================================

-- 1. Categories
INSERT INTO categories (id, name, slug, image_url, sort_order, is_active) VALUES
('cat-earrings', 'Earrings', 'earrings', '/images/sample/cat-earrings.jpg', 1, true),
('cat-necklaces', 'Necklaces', 'necklaces', '/images/sample/cat-necklaces.jpg', 2, true),
('cat-rings', 'Rings', 'rings', '/images/sample/cat-rings.jpg', 3, true),
('cat-bracelets', 'Bracelets', 'bracelets', '/images/sample/cat-bracelets.jpg', 4, true);

-- 2. Products
INSERT INTO products (id, name, slug, description, price, compare_at_price, category_id, track_stock, stock_quantity, is_active, is_featured, created_at) VALUES
('p-01', 'Pearl Cascade Earrings', 'pearl-cascade-earrings', 'Three freshwater pearls fall from a polished gold stud on whisper-fine chains. Light enough for every day, graceful enough for every occasion.', 1450, 1850, 'cat-earrings', false, 0, true, true, NOW()),
('p-02', 'Garnet Heart Pendant', 'garnet-heart-pendant', 'A deep wine-red heart set in a clean gold bezel on a delicate cable chain. A quiet declaration, made to be worn close.', 2250, NULL, 'cat-necklaces', false, 0, true, true, NOW()),
('p-03', 'Pearl Stack Ring Set', 'pearl-stack-ring-set', 'A hammered band crowned with a single pearl, paired with a slim polished ring. Wear them together or let each shine alone.', 1250, NULL, 'cat-rings', false, 0, true, false, NOW()),
('p-04', 'Pearl Station Bracelet', 'pearl-station-bracelet', 'Tiny pearls spaced along a fine gold chain, catching the light with every movement. The everyday bracelet you''ll never take off.', 1650, NULL, 'cat-bracelets', false, 0, true, true, NOW()),
('p-05', 'Classic Gold Hoops', 'classic-gold-hoops', 'Softly rounded, high-polish hoops with a secure hinged clasp. The modern essential that goes from desk to dinner.', 1350, NULL, 'cat-earrings', true, 3, true, true, NOW()),
('p-06', 'Mini Pearl Jhumka', 'mini-pearl-jhumka', 'A contemporary take on the timeless jhumka — a brushed gold dome with a fringe of seed pearls, hung from a delicate open ring.', 1850, 2200, 'cat-earrings', false, 0, true, true, NOW()),
('p-07', 'Freshwater Pearl Strand', 'freshwater-pearl-strand', 'Lustrous hand-knotted freshwater pearls finished with a petite gold clasp. An heirloom-in-the-making for brides and beyond.', 3450, NULL, 'cat-necklaces', false, 0, true, false, NOW()),
('p-08', 'Twisted Wire Bangle', 'twisted-wire-bangle', 'A slender gold bangle with subtle wire twists that reflect the light softly with every wrist motion.', 1950, NULL, 'cat-bracelets', true, 2, true, true, NOW());

-- 3. Product Images
INSERT INTO product_images (id, product_id, url, alt, sort_order) VALUES
('img-01', 'p-01', '/images/sample/cat-earrings.jpg', 'Gold drop earrings with three freshwater pearls on cream paper', 1),
('img-02', 'p-02', '/images/sample/cat-necklaces.jpg', 'Gold chain necklace with a garnet heart pendant on linen', 1),
('img-03', 'p-03', '/images/sample/cat-rings.jpg', 'Two stacked gold rings, one with a pearl, on a cream stone pedestal', 1),
('img-04', 'p-04', '/images/sample/cat-bracelets.jpg', 'Delicate gold chain bracelet with pearl stations on cream silk', 1),
('img-05', 'p-05', '/images/sample/prod-hoops.jpg', 'Pair of chunky polished gold hoop earrings', 1),
('img-06', 'p-06', '/images/sample/prod-jhumka.jpg', 'Modern gold jhumka earrings with pearl fringe beside a dried rose', 1),
('img-07', 'p-07', '/images/sample/prod-pearl-strand.jpg', 'Classic freshwater pearl necklace draped over raw linen', 1),
('img-08', 'p-08', '/images/sample/prod-bangle.jpg', 'Single slim gold twisted wire bangle on textured paper', 1);

-- 4. Initial Site Settings
INSERT INTO site_settings (id, data, updated_at) VALUES (
  'current',
  '{
    "whatsapp_number": "01700000000",
    "bkash_number": "01700000000",
    "nagad_number": "01700000000",
    "delivery_inside_dhaka": 80,
    "delivery_outside_dhaka": 130,
    "free_delivery_threshold": 3000,
    "announcement_text": "Complimentary delivery on orders over ৳3,000 · Cash on Delivery across Bangladesh",
    "hero": {
      "eyebrow": "The Autumn Edit · 2026",
      "title": "Dreamt in gold,\nmade for you.",
      "subtitle": "Delicate, timeless pieces designed to be treasured — from everyday essentials to moments worth remembering.",
      "image_url": "/images/sample/hero-banner.jpg",
      "image_alt": "Gold pearl necklace and pearl stud earrings resting on cream silk",
      "primary_cta": { "label": "Shop the collection", "href": "/shop" },
      "secondary_cta": { "label": "New arrivals", "href": "/shop?sort=newest" }
    },
    "promo_banner": {
      "is_active": false,
      "title": "Festive Season Exclusive Collection",
      "eyebrow": "Special Offer",
      "discount_text": "UP TO 30% OFF",
      "subtitle": "Delicate, handcrafted jewellery pieces. Complimentary gift box packaging & Cash on Delivery.",
      "coupon_code": "YUME2026",
      "cta_text": "Explore Offers",
      "cta_link": "/shop"
    }
  }'::jsonb,
  NOW()
) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();
