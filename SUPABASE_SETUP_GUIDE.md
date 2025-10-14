# Supabase Kurulum Rehberi / Supabase Setup Guide

## 🇹🇷 Türkçe Açıklama

### Adım 1: Supabase Projesine Giriş Yapın
1. [Supabase Dashboard](https://app.supabase.com/) adresine gidin
2. Projenizi seçin veya yeni bir proje oluşturun

### Adım 2: SQL Editor'ı Açın
1. Sol menüden **SQL Editor** seçeneğine tıklayın
2. "New Query" butonuna basın

### Adım 3: SQL Komutlarını Çalıştırın
`supabase-setup.sql` dosyasındaki komutları sırasıyla çalıştırın:

#### 3.1 Products Tablosunu Oluşturun
```sql
-- Bölüm 1: CREATE PRODUCTS TABLE kısmını kopyalayıp çalıştırın
```

#### 3.2 Row Level Security'yi Aktif Edin
```sql
-- Bölüm 2: ENABLE ROW LEVEL SECURITY kısmını çalıştırın
```

#### 3.3 RLS Politikalarını Oluşturun
```sql
-- Bölüm 3: CREATE RLS POLICIES kısmını çalıştırın
```

#### 3.4 Storage Bucket Oluşturun
```sql
-- Bölüm 4: CREATE STORAGE BUCKET kısmını çalıştırın
```

#### 3.5 Storage Politikalarını Oluşturun
```sql
-- Bölüm 5: CREATE STORAGE POLICIES kısmını çalıştırın
```

### Adım 4: Doğrulama
Kurulumun başarılı olduğunu kontrol etmek için:
```sql
-- Bölüm 8: VERIFY SETUP kısmındaki komutları çalıştırın
```

### Adım 5: Test Verisi Ekleyin (Opsiyonel)
```sql
-- Bölüm 9: SAMPLE INSERT kısmını çalıştırın
```

---

## 🇬🇧 English Instructions

### Step 1: Access Your Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project or create a new one

### Step 2: Open SQL Editor
1. Click on **SQL Editor** in the left menu
2. Click "New Query" button

### Step 3: Run SQL Commands
Execute the commands from `supabase-setup.sql` in order:

#### 3.1 Create Products Table
```sql
-- Run Section 1: CREATE PRODUCTS TABLE
```

#### 3.2 Enable Row Level Security
```sql
-- Run Section 2: ENABLE ROW LEVEL SECURITY
```

#### 3.3 Create RLS Policies
```sql
-- Run Section 3: CREATE RLS POLICIES
```

#### 3.4 Create Storage Bucket
```sql
-- Run Section 4: CREATE STORAGE BUCKET
```

#### 3.5 Create Storage Policies
```sql
-- Run Section 5: CREATE STORAGE POLICIES
```

### Step 4: Verify Setup
Check if everything is set up correctly:
```sql
-- Run Section 8: VERIFY SETUP
```

### Step 5: Insert Test Data (Optional)
```sql
-- Run Section 9: SAMPLE INSERT
```

---

## 📋 Tablo Yapısı / Table Structure

### Products Table
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(255) | Primary key, unique identifier |
| gtin | TEXT | GTIN barcode (8, 12, 13, or 14 digits) |
| product_name | TEXT | Product name |
| brand | TEXT | Brand name |
| category | TEXT | Product category |
| description | TEXT | Product description |
| weight | TEXT | Weight or volume |
| origin | TEXT | Country of origin |
| image_url | TEXT | URL to product image in Supabase Storage |
| extra_tables | JSONB | Custom data tables in JSON format |
| created_at | TIMESTAMP | Creation timestamp |

---

## 🔐 Güvenlik Politikaları / Security Policies

### Row Level Security (RLS)
Bu kurulumda **herkese açık** (public) politikalar kullanılıyor. Üretim ortamı için daha kısıtlayıcı politikalar oluşturmalısınız:

This setup uses **public** policies. For production, create more restrictive policies:

```sql
-- Sadece kimlik doğrulaması yapılmış kullanıcılar için
-- For authenticated users only:

DROP POLICY "Allow public insert access to products" ON products;

CREATE POLICY "Allow authenticated insert"
ON products
FOR INSERT
TO authenticated
WITH CHECK (true);
```

---

## 🖼️ Storage Yapılandırması / Storage Configuration

### Product Images Bucket
- **Bucket ID**: `product-images`
- **Public Access**: Yes (görüntüler herkese açık / images are public)
- **Max File Size**: 16MB (uygulama tarafında kontrol edilir / controlled by app)
- **Allowed Formats**: PNG, JPG, JPEG, GIF, WEBP

### Image URL Format
```
https://[your-project].supabase.co/storage/v1/object/public/product-images/[file-name]
```

---

## ⚙️ Environment Variables

Supabase bağlantı bilgilerinizi Replit Secrets'e ekleyin / Add your Supabase connection info to Replit Secrets:

```
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
SUPABASE_URL=https://[your-project].supabase.co
SUPABASE_ANON_KEY=[your-anon-key]
```

Bu bilgileri Supabase Dashboard > Settings > Database'den bulabilirsiniz.
You can find these in Supabase Dashboard > Settings > Database.

---

## 🧪 Test Etme / Testing

### GTIN Format Kontrolü / GTIN Format Check
```sql
-- Valid GTINs
INSERT INTO products (id, gtin, product_name) 
VALUES ('test1', '12345678', 'Test 8 digit');  -- ✅

INSERT INTO products (id, gtin, product_name) 
VALUES ('test2', '123456789012', 'Test 12 digit');  -- ✅

INSERT INTO products (id, gtin, product_name) 
VALUES ('test3', '1234567890123', 'Test 13 digit');  -- ✅

INSERT INTO products (id, gtin, product_name) 
VALUES ('test4', '12345678901234', 'Test 14 digit');  -- ✅

-- Invalid GTIN (will fail)
INSERT INTO products (id, gtin, product_name) 
VALUES ('test5', '123', 'Invalid');  -- ❌
```

### Extra Tables JSON Format
```sql
-- Correct JSON format for extra_tables
UPDATE products 
SET extra_tables = '[
  {
    "title": "Nutrition Facts",
    "rows": [
      {"key": "Calories", "value": "100"},
      {"key": "Protein", "value": "5g"}
    ]
  },
  {
    "title": "Allergens",
    "rows": [
      {"key": "Contains", "value": "Milk, Soy"}
    ]
  }
]'::jsonb
WHERE id = 'your-product-id';
```

---

## 🗑️ Temizleme / Cleanup

Geliştirme sırasında her şeyi sıfırlamak için / To reset everything during development:

```sql
-- ⚠️ DİKKAT: Bu komutlar TÜM VERİLERİ SİLER!
-- ⚠️ WARNING: These commands DELETE ALL DATA!

-- Drop policies
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Allow public insert access to products" ON products;
DROP POLICY IF EXISTS "Allow public update access to products" ON products;
DROP POLICY IF EXISTS "Allow public delete access to products" ON products;

-- Drop table
DROP TABLE IF EXISTS products CASCADE;

-- Delete storage bucket
DELETE FROM storage.buckets WHERE id = 'product-images';
```

---

## 📞 Yardım / Support

Sorun yaşarsanız / If you encounter issues:

1. Supabase Dashboard'da **Table Editor**'ı kontrol edin
2. **Storage** bölümünde bucket'ı doğrulayın
3. **SQL Editor**'da VERIFY SETUP komutlarını çalıştırın
4. Hata mesajlarını Supabase Logs'dan kontrol edin

For more help, check:
- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
