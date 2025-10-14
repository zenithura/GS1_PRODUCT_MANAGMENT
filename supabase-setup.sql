-- =====================================================
-- GS1 Digital Link Generator - Supabase Setup
-- =====================================================
-- Run these commands in Supabase SQL Editor
-- Copy and paste each section separately

-- =====================================================
-- 1. CREATE PRODUCTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(255) PRIMARY KEY,
  gtin TEXT NOT NULL UNIQUE,
  product_name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  description TEXT,
  weight TEXT,
  origin TEXT,
  image_url TEXT,
  extra_tables JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on GTIN for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_gtin ON products(gtin);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- =====================================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. CREATE RLS POLICIES
-- =====================================================

-- Policy: Allow anyone to SELECT (read) all products
-- This makes products publicly readable
CREATE POLICY "Allow public read access to products"
ON products
FOR SELECT
TO public
USING (true);

-- Policy: Allow anyone to INSERT new products
-- This allows creating new products without authentication
CREATE POLICY "Allow public insert access to products"
ON products
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Allow anyone to UPDATE existing products
-- This allows updating products without authentication
CREATE POLICY "Allow public update access to products"
ON products
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Policy: Allow anyone to DELETE products (optional - remove if you don't want this)
CREATE POLICY "Allow public delete access to products"
ON products
FOR DELETE
TO public
USING (true);

-- =====================================================
-- 4. CREATE STORAGE BUCKET FOR PRODUCT IMAGES
-- =====================================================

-- Create a public storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 5. CREATE STORAGE POLICIES
-- =====================================================

-- Policy: Allow anyone to upload images
CREATE POLICY "Allow public upload to product-images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'product-images');

-- Policy: Allow anyone to view/download images
CREATE POLICY "Allow public read access to product-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Policy: Allow anyone to update images
CREATE POLICY "Allow public update to product-images"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- Policy: Allow anyone to delete images (optional - remove if you don't want this)
CREATE POLICY "Allow public delete from product-images"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'product-images');

-- =====================================================
-- 6. OPTIONAL: ADD CONSTRAINTS
-- =====================================================

-- Add constraint to ensure GTIN is valid (8, 12, 13, or 14 digits)
ALTER TABLE products
ADD CONSTRAINT check_gtin_format 
CHECK (gtin ~ '^[0-9]{8}$|^[0-9]{12}$|^[0-9]{13}$|^[0-9]{14}$');

-- =====================================================
-- 7. OPTIONAL: CREATE FUNCTION TO AUTO-GENERATE IDs
-- =====================================================

-- Function to generate unique product IDs
CREATE OR REPLACE FUNCTION generate_product_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
BEGIN
  new_id := 'prod_' || gen_random_uuid()::TEXT;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. VERIFY SETUP
-- =====================================================

-- Check if products table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'products';

-- Check RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'products';

-- Check storage bucket
SELECT * FROM storage.buckets WHERE id = 'product-images';

-- Check storage policies
SELECT * FROM pg_policies WHERE tablename = 'objects';

-- =====================================================
-- 9. SAMPLE INSERT (FOR TESTING)
-- =====================================================

-- Test insert a sample product
INSERT INTO products (
  id, 
  gtin, 
  product_name, 
  brand, 
  category, 
  description,
  weight,
  origin,
  extra_tables
) VALUES (
  'prod_test_001',
  '8499383300123',
  'Premium Organic Coffee Beans',
  'Mountain Peak Coffee',
  'Beverages',
  'Sustainably sourced arabica beans from high-altitude farms in Colombia.',
  '500g',
  'Colombia',
  '[
    {
      "title": "Nutrition Facts",
      "rows": [
        {"key": "Calories", "value": "2 per serving"},
        {"key": "Caffeine", "value": "95mg per cup"}
      ]
    }
  ]'::jsonb
);

-- Verify the insert
SELECT * FROM products WHERE gtin = '8499383300123';

-- =====================================================
-- 10. CLEANUP (IF NEEDED - BE CAREFUL!)
-- =====================================================

-- DANGER: These commands will delete all data!
-- Only use during development/testing

-- Drop all policies
-- DROP POLICY IF EXISTS "Allow public read access to products" ON products;
-- DROP POLICY IF EXISTS "Allow public insert access to products" ON products;
-- DROP POLICY IF EXISTS "Allow public update access to products" ON products;
-- DROP POLICY IF EXISTS "Allow public delete access to products" ON products;

-- Drop table
-- DROP TABLE IF EXISTS products CASCADE;

-- Delete storage bucket (this will delete all images!)
-- DELETE FROM storage.buckets WHERE id = 'product-images';
