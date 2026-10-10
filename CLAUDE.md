# CLAUDE.md — Claude Code Proje Rehberi

Bu dosya, Claude Code'un projeyi anlaması için hazırlanmıştır.

---

## Proje: Drinks Yönetim

Forum Mersin'deki Drinks içecek işletmesi için özel yönetim uygulaması.

- **Tüm UI metinleri Türkçedir.** Yeni eklenen her metin, hata mesajı, placeholder, buton etiketi Türkçe olmalıdır.
- **Para birimi:** Türk Lirası (₺). Tutarlar kuruş cinsinden integer saklanır (1234 = 12,34 ₺).
- **Saat dilimi:** Europe/Istanbul

## Komutlar

### Backend (nodejs_space/)
```bash
yarn install                  # Bağımlılıkları kur
yarn run start:dev            # Geliştirme sunucusu (port 3000)
yarn run build                # Prod derleme (dist/)
yarn prisma generate          # Prisma istemci üret
yarn prisma db push           # Şemayı veritabanına uygula
yarn prisma migrate dev       # Migration oluştur
yarn prisma db seed           # Başlangıç verisi yükle
yarn test:e2e                 # E2E testleri çalıştır
```

### Frontend (react_native_space/)
```bash
yarn install                  # Bağımlılıkları kur
yarn expo start               # Geliştirme sunucusu (web: 8081)
yarn expo install <paket>     # Expo uyumlu paket ekle (sürüm belirtme!)
npx tsc --noEmit              # TypeScript kontrolü
```

## Mimari Kurallar

### Backend
- **Her controller metodu** bir DTO döndürmelidir: `Promise<SomeResponseDto>`
- **DTO'larda** her field'a `@ApiProperty()` ekleyin (Swagger için).
- **Yeni tablo:** `prisma/schema.prisma`'ya ekle → `prisma generate` → `prisma db push`
- **Auth:** JWT + passport-jwt. Her korumalı endpoint'te `@UseGuards(JwtAuthGuard)` kullanın.
- **Sahip-özel:** `@UseGuards(JwtAuthGuard, OwnerGuard)` kullanın.
- **Audit:** Önemli işlemlerde `this.auditService.log(...)` çağırın.
- **Hareket iptali:** Silmek yerine `reversed` status'e alıp ters belge oluşturun.

### Frontend
- **API çağrıları:** Sadece `src/api/generated/api` hook'larını kullanın. Ham `fetch`/`axios` yazmayın.
- **`src/api/generated/`** klasörünü **düzenlemeyin** — Orval tarafından üzerine yazılır.
- **Tema:** `src/utils/theme.ts` dosyasındaki `COLORS`, `SPACING`, `RADIUS` kullanın.
- **Yönlendirme:** expo-router dosya tabanlı. Her klasörde `_layout.tsx` gerekli.
- **Auth akışı:** `AuthContext` üzerinden. Login/signup sonrası `router.push` YAPMAYIN — layout guard'lar (`<Redirect>`) otomatik yönlendirir.

### Sistem Hesabı
- `src/auth/system-account.ts` içinde tanımlı dahili test hesabı vardır.
- Kullanıcı sayma işlemlerinde `REAL_USER_FILTER` ile dışlanır.
- Bu hesabı kullanıcı arayüzünde göstermeyin.

## Veri Kuralları (KRİTİK)

1. **Sevkiyat ≠ Satış.** Depodan çıkan ürün = müşteriye satıldı demek değildir.
2. **Uygulama şunları BİLMEZ:** Araç/mağaza stoğu, ürün bazlı satış, kâr, saatlik ciro.
3. **"En Çok Sevk Edilen"** raporu sevkiyat miktarıdır, satış değildir — etikette belirtin.
4. **Kapanış girilmeyen günler** için sıfır değil **"Kapanış girilmedi"** gösterin.
5. **Başlangıç stoğu girilmemiş ürünlerde** sıfır değil **"Başlangıç stoğu girilmedi"** gösterin.

## Dosya Yapısı (Kısa)

```
nodejs_space/src/
  auth/          → JWT kimlik doğrulama, signup, login
  products/      → Ürün CRUD + paket dönüşümleri
  movements/     → Depo hareketleri (atomik belge + satırlar)
  warehouse/     → Stok hesaplama (ledger tabanlı)
  closings/      → Günlük ciro kapanışı (optimistic locking)
  reports/       → Raporlar + CSV dışa aktarma
  invites/       → Davet kodu (8 hane, tek kullanım, 7 gün)
  users/         → Kullanıcı yönetimi (sadece sahip)
  audit/         → İşlem geçmişi
  settings/      → İşletme ayarları
  prisma/        → PrismaService (singleton)

react_native_space/app/
  tabs/          → Ana sekmeler: Özet, Stok, Sevkiyat, Ciro, Diğer
  auth/          → Giriş, Kayıt
  product/       → Ürün detay, düzenleme, dönüşüm, başlangıç stok
  movement/      → Hareket oluşturma, detay, geçmiş
  closing/       → Kapanış oluşturma, detay
  report/        → Ciro, sevkiyat, top-dispatched, CSV
  settings/      → Kullanıcılar, davet kodları, işletme, şifre, audit

react_native_space/src/
  api/customFetch.ts       → Base URL + JWT token ekleme
  api/generated/           → Orval üretimi (DÜZENLEMEYİN)
  contexts/AuthContext.tsx → Auth durumu (login, signup, logout)
  utils/theme.ts           → Renkler, aralıklar, köşeler
  utils/format.ts          → Para formatlama, tarih, birim etiketleri
  components/              → Card, GradientButton, EmptyState, LoadingScreen
```

## Orval Kod Üretimi

Backend API değiştikten sonra frontend hook'larını güncellemek için:

```bash
# 1. Backend'i derle ve swagger.json üret
cd nodejs_space
yarn run build
node dist/src/dump-swagger.js

# 2. Frontend hook'larını üret
cd ../react_native_space
npx orval --config orval.config.ts
```

## Auth Akışı

1. İlk kaydolan → otomatik **owner** (dahili test hesabı sayılmaz)
2. Sonrakiler → **invite code** gerekli (sahip oluşturur)
3. JWT token → `expo-secure-store`'da saklanır
4. Her API isteği → `Authorization: Bearer <token>` (customFetch ekler)
5. Layout guard'lar: `auth/_layout.tsx` (isAuthenticated → tabs'e redirect), `tabs/_layout.tsx` (!isAuthenticated → login'e redirect)

## Test Senaryoları

- [ ] İlk kullanıcı davet kodsuz kaydolabilmeli (sahip olur)
- [ ] İkinci kullanıcı kodsuz reddedilmeli
- [ ] Geçerli davet koduyla kayıt (yönetici olur)
- [ ] Kullanılmış kod tekrar kullanılamaz
- [ ] Negatif stoka düşürecek sevkiyat engellenmeli
- [ ] Aynı güne iki kapanış oluşturulamaz
- [ ] Yönetici kullanıcı yönetimine erişemez (403)
- [ ] Optimistic locking: eş zamanlı kapanış düzenleme çarpışması
- [ ] İdempotency key ile aynı hareket iki kez kaydedilmez
- [ ] Paket dönüşümü doğru çalışır (1 koli = 24 adet)
