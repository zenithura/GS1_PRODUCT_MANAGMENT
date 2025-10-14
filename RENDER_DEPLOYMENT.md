# Render'da Deployment Rehberi

Bu proje Render.com üzerinde kolayca deploy edilebilir.

## 🚀 Hızlı Başlangıç

### 1. GitHub'a Push Edin
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Render'da Yeni Web Service Oluşturun

1. [Render.com](https://render.com) hesabınıza giriş yapın
2. "New +" butonuna tıklayın ve "Web Service" seçin
3. GitHub repository'nizi bağlayın
4. Aşağıdaki ayarları yapın:

#### Temel Ayarlar
- **Name**: `product-management` (veya istediğiniz bir isim)
- **Environment**: `Node`
- **Region**: Size en yakın bölgeyi seçin
- **Branch**: `main` (veya kullandığınız branch)

#### Build & Deploy Ayarları
- **Build Command**: 
  ```
  npm install && npm run build
  ```
- **Start Command**: 
  ```
  npm start
  ```

### 3. Environment Variables Ekleyin

Render dashboard'da "Environment" sekmesine gidin ve şu değişkenleri ekleyin:

```
NODE_ENV=production
SUPABASE_URL=https://jccfkxhupjqfadafxfdi.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjY2ZreGh1cGpxZmFkYWZ4ZmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0Mjg5NzYsImV4cCI6MjA3NjAwNDk3Nn0.kVMJ9JlVy3UIicMjbkpDxRBNEBlVDFF28ozuYxf-uaw
```

⚠️ **Önemli**: Eğer başka environment variable'larınız varsa (database URL, API keys, vb.) onları da eklemeyi unutmayın!

### 4. Deploy Edin

"Create Web Service" butonuna tıklayın. Render otomatik olarak:
- Kodunuzu çekecek
- Dependencies'leri yükleyecek
- Build işlemini yapacak
- Uygulamanızı başlatacak

## 📝 Notlar

### Auto-Deploy
Her `git push` yaptığınızda Render otomatik olarak yeni versiyonu deploy edecektir.

### Logs
Render dashboard'da "Logs" sekmesinden canlı logları görebilirsiniz.

### Custom Domain
Render'ın verdiği URL yerine kendi domain'inizi kullanmak isterseniz, "Settings" > "Custom Domain" bölümünden ekleyebilirsiniz.

### Free Tier Limitleri
- Free tier'da uygulama 15 dakika inaktif kaldıktan sonra uyur
- İlk istek geldiğinde tekrar uyanır (30-60 saniye sürebilir)
- Paid plan'da bu sorun olmaz

## 🔧 Sorun Giderme

### Build Hatası
Eğer build sırasında hata alırsanız:
1. Logs'u kontrol edin
2. `package.json`'daki dependencies'leri kontrol edin
3. Local'de `npm run build` komutunu çalıştırıp test edin

### Runtime Hatası
Eğer uygulama başlamıyorsa:
1. Environment variables'ların doğru ayarlandığından emin olun
2. `PORT` environment variable'ını Render otomatik sağlar, kodda `process.env.PORT` kullanıldığından emin olun
3. Logs'da hata mesajlarını kontrol edin

### Database Bağlantı Sorunu
- Supabase URL ve API key'in doğru olduğundan emin olun
- Supabase dashboard'da connection limitleri kontrol edin

## 📞 Destek

Sorun yaşarsanız:
- Render Documentation: https://render.com/docs
- Supabase Documentation: https://supabase.com/docs
