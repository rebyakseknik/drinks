# Drinks Yönetim

Forum Mersin alışveriş merkezindeki **Drinks** içecek işletmesi için özel yönetim uygulaması.

> **Dil:** Türkçe (tüm arayüz, hata mesajları, etiketler)  
> **Para birimi:** Türk Lirası (₺), kuruş hassasiyetinde (integer)  
> **Saat dilimi:** Europe/Istanbul

---

## Proje Yapısı

```
drinks_yonetim/
├── nodejs_space/          ← Backend (NestJS + Prisma + PostgreSQL)
│   ├── prisma/
│   │   ├── schema.prisma    ← Veritabanı şeması
│   │   └── seed.ts          ← Başlangıç verisi
│   ├── src/
│   │   ├── main.ts          ← Uygulama giriş noktası
│   │   ├── app.module.ts    ← Kök modül
│   │   ├── auth/            ← Kimlik doğrulama (JWT + bcrypt)
│   │   ├── products/        ← Ürün CRUD + paket dönüşümleri
│   │   ├── movements/       ← Depo hareketleri (atomik belgeler)
│   │   ├── warehouse/       ← Stok hesaplama (ledger tabanlı)
│   │   ├── closings/        ← Günlük ciro kapanışları
│   │   ├── reports/         ← Raporlar + CSV dışa aktarma
│   │   ├── invites/         ← Davet kodu yönetimi
│   │   ├── users/           ← Kullanıcı yönetimi (sadece sahip)
│   │   ├── audit/           ← İşlem geçmişi (audit log)
│   │   ├── settings/        ← İşletme ayarları
│   │   └── prisma/          ← Prisma servis sarmalayıcı
│   ├── swagger.json         ← Otomatik üretilen API şeması
│   └── package.json
├── react_native_space/    ← Frontend (React Native + Expo SDK 54)
│   ├── app/                 ← Expo Router dosya tabanlı yönlendirme
│   │   ├── _layout.tsx      ← Kök layout (AuthProvider, QueryClient)
│   │   ├── index.tsx        ← / roturası (Redirect)
│   │   ├── auth/            ← Giriş / Kayıt ekranları
│   │   ├── tabs/            ← Ana sekmeler (Özet, Stok, Sevkiyat, Ciro, Diğer)
│   │   ├── product/         ← Ürün detay/düzenleme/dönüşüm
│   │   ├── movement/        ← Hareket oluşturma/detay/geçmiş
│   │   ├── closing/         ← Ciro kapanış oluşturma/detay
│   │   ├── report/          ← Raporlar + CSV
│   │   └── settings/        ← Ayarlar
│   ├── src/
│   │   ├── api/
│   │   │   ├── customFetch.ts    ← API istemci yapılandırması (base URL + JWT)
│   │   │   └── generated/        ← Orval ile otomatik üretilen hook'lar (DÜZENLEMEYİN)
│   │   ├── components/       ← Paylaşılan bileşenler
│   │   ├── contexts/         ← AuthContext (JWT token yönetimi)
│   │   └── utils/            ← Tema, format yardımcıları
│   ├── app.json              ← Expo yapılandırması
│   └── package.json
├── KULLANIM_KILAVUZU.md   ← Türkçe kullanım kılavuzu
├── api_design.md          ← API tasarım dökümanı
├── db_design.md           ← Veritabanı tasarım dökümanı
└── ux_design.md           ← UX tasarım dökümanı
```

---

## Teknoloji Yığını

### Backend
| Bileşen | Teknoloji |
|---------|----------|
| Framework | NestJS (TypeScript, strict mode) |
| ORM | Prisma |
| Veritabanı | PostgreSQL |
| Kimlik Doğrulama | JWT + bcryptjs + passport-jwt |
| API Doküman | Swagger (@nestjs/swagger) → `/api-docs` |
| Port | 3000 |

### Frontend
| Bileşen | Teknoloji |
|---------|----------|
| Framework | React Native + Expo SDK 54 |
| Yönlendirme | expo-router (dosya tabanlı) |
| Durum Yönetimi | React Context (auth) + TanStack React Query (API) |
| UI Kütüphanesi | react-native-paper |
| Grafikler | react-native-chart-kit |
| API İstemci | Orval ile otomatik üretim (customFetch üzerinden) |
| Güvenli Depo | expo-secure-store (JWT token) |

---

## Ortam Değişkenleri

### Backend (`nodejs_space/.env`)
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=<rastgele-uzun-değer>      # en az 32 karakter, kimseyle paylaşmayın
PORT=3000                             # isteğe bağlı; barındırma servisi verir
```

### Frontend
`EXPO_PUBLIC_API_URL` ortam değişkeni ile backend URL'si belirlenir. Örnek:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/
```

---

## Mac'te Hızlı Deneme (tek tık)

`baslat.command` dosyasına çift tıklayın (veya Terminal'de `bash baslat.command`).
Mac'e PostgreSQL kurmadan proje klasöründe geçici bir veritabanı açar, sunucuyu başlatır ve
iPhone'da Expo Go ile okutulacak QR kodu gösterir. Gereken tek şey Node.js (LTS).
Veriler `yerel-onizleme/.veri` klasöründe kalır; sıfırlamak için `bash baslat.command --sifirla`.
Bu yalnızca denemedir; canlı sisteme bağlanmaz.

## Yerel Geliştirme Kurulumu

### Önkoşullar
- Node.js >= 18.18
- PostgreSQL veritabanı
- Yarn

### Backend
```bash
cd nodejs_space
yarn install

# .env dosyasını oluşturun (yukarıdaki değişkenleri doldurun)

# Veritabanı şemasını uygula
yarn prisma generate
yarn prisma db push

# Seed (yalnızca işletme ayarlarını oluşturur, hiçbir kaydı silmez)
yarn prisma db seed

# Geliştirme sunucusu
yarn run start:dev       # http://localhost:3000

# Üretim
yarn run build && yarn run start:prod

# Otomatik testler — YALNIZCA adı "test" içeren ayrı bir veritabanında çalışır
# (testler veritabanını sıfırlar; başka bir veritabanında kendini durdurur)
DATABASE_URL=postgresql://.../drinks_test JWT_SECRET=... yarn test:e2e
```

### Frontend
```bash
cd react_native_space
yarn install

# Geliştirme sunucusu
yarn expo start           # http://localhost:8081 (web)
```

---

## Veritabanı Şeması (Özet)

### Tablolar ve İlişkiler

```
users (Kullanıcılar)
  └── role: owner | manager
  └── ilişkiler: invite_codes, products, movements, closings, audit_logs

invite_codes (Davet Kodları)
  └── 8 haneli, tek kullanımlık, 7 gün geçerli
  └── createdBy → users, usedBy → users

products (Ürünler)
  └── baseUnit: adet | gram | mililitre
  └── initialCount/initialDate: başlangıç stoğu
  └── minStockThreshold: minimum stok eşiği

package_conversions (Paket Dönüşümleri)
  └── örn: "Koli" → conversionFactor: 24 (1 koli = 24 adet)
  └── effectiveFrom: geçerlilik tarihi (geçmiş hareketler eski faktörü korur)

movement_documents (Hareket Belgeleri)
  └── type: mal_kabul | sevkiyat | depoya_iade | fire_hasar | sayim_duzeltmesi
  └── status: active | reversed
  └── idempotencyKey: mükerrer önleme
  └── reversalOfId: iptal edilen belge (ters kayıt)

movement_lines (Hareket Satırları)
  └── quantity: temel birim cinsinden miktar
  └── packageName + packageQuantity + conversionFactorUsed: orijinal giriş
  └── reason: sayım düzeltmesi için zorunlu

daily_closings (Günlük Ciro Kapanışları)
  └── businessDate: benzersiz (gün başına bir kayıt)
  └── netCashKurus + netCardKurus: kuruş cinsinden (integer)
  └── totalRevenueKurus = netCashKurus + netCardKurus
  └── version: optimistic locking

business_settings (İşletme Ayarları)
  └── Tekil kayıt: ad, konum

audit_logs (Denetim Kaydı)
  └── action, entityType, entityId, actorId, details (JSON)
```

### Stok Hesaplama Mantığı

Stok, **ledger** (defter) yaklaşımıyla hesaplanır:

```
Depo Stoğu = Başlangıç Sayımı
  + Σ(mal_kabul satırları.quantity)      [aktif belgeler]
  + Σ(depoya_iade satırları.quantity)     [aktif belgeler]
  - Σ(sevkiyat satırları.quantity)        [aktif belgeler]
  - Σ(fire_hasar satırları.quantity)      [aktif belgeler]
  +/- Σ(sayim_duzeltmesi satırları.quantity) [aktif belgeler]
```

⚠️ "reversed" statüsündeki belgeler stok hesabına katılmaz. İptal edilen belge "reversed" olur;
iz için oluşturulan ters kayıt belgesi de "reversed" durumundadır (`reversalOfId` dolu). Böylece
iptal stoğu yalnızca bir kez etkiler. Raporlar yalnızca `status=active` ve `reversalOfId=null` belgeleri sayar.

Kurallar (sunucuda zorunlu):
- Başlangıç sayımı girilmemiş ürüne hareket girilemez; sayım tarihinden önceye hareket girilemez.
- Paket katsayısı sunucuda ürünün tanımlı dönüşümüyle doğrulanır; temel birimde sonuç tam sayı olmalıdır.
- Stok eksiye düşemez (sevkiyat, fire, eksi sayım düzeltmesi ve iptal dahil). Ürün satırları
  `SELECT … FOR UPDATE` ile kilitlenir; eşzamanlı işlemler sırayla uygulanır.
- Sayım düzeltmesinde `packageQuantity` eksi olabilir (stok azaltma); diğer tiplerde artı olmalıdır.
- Günlük kapanış iş günü İstanbul takvimine göredir; ileri tarih kabul edilmez.

---

## API Endpoint'leri

Tüm endpoint'ler `/api/` prefix'i altındadır. Swagger dokümanı: `GET /api-docs`

### Kimlik Doğrulama
| Metod | Yol | Açıklama |
|-------|-----|----------|
| POST | `/api/signup` | Kayıt (ilk kullanıcı = sahip, sonrakiler davet koduyla) |
| POST | `/api/auth/login` | Giriş |
| GET | `/api/auth/me` | Oturum bilgisi |
| PUT | `/api/auth/change-password` | Şifre değiştirme |

### Ürünler
| Metod | Yol | Açıklama |
|-------|-----|----------|
| GET | `/api/products` | Ürün listesi (`?active=true&search=...`) |
| POST | `/api/products` | Yeni ürün |
| GET | `/api/products/:id` | Ürün detayı |
| PUT | `/api/products/:id` | Ürün güncelleme |
| POST | `/api/products/:id/initial-stock` | Başlangıç stoğu girme |
| GET | `/api/products/:id/conversions` | Paket dönüşümleri |
| POST | `/api/products/:id/conversions` | Yeni dönüşüm |
| PUT | `/api/products/:id/conversions/:conversionId` | Dönüşüm güncelleme |

### Depo Hareketleri
| Metod | Yol | Açıklama |
|-------|-----|----------|
| GET | `/api/movements` | Hareket listesi (`?type=sevkiyat&limit=50`) |
| POST | `/api/movements` | Yeni hareket belgesi (atomik, çok satırlı) |
| GET | `/api/movements/:id` | Belge detayı |
| POST | `/api/movements/:id/reverse` | Belge iptali (ters kayıt) |

### Depo Stok
| Metod | Yol | Açıklama |
|-------|-----|----------|
| GET | `/api/warehouse-stock` | Depo stoğu (`?belowThreshold=true&search=...`) |

### Günlük Kapanış
| Metod | Yol | Açıklama |
|-------|-----|----------|
| GET | `/api/closings` | Kapanış listesi (`?from=...&to=...&limit=31`) |
| POST | `/api/closings` | Yeni kapanış |
| GET | `/api/closings/:id` | Kapanış detayı |
| PUT | `/api/closings/:id` | Kapanış düzeltme (version kontrollü) |
| GET | `/api/closings/today` | Bugünkü kapanış |
| GET | `/api/closings/summary` | Aylık özet |
| GET | `/api/closings/comparison` | Geçen hafta karşılaştırması |

### Raporlar
| Metod | Yol | Açıklama |
|-------|-----|----------|
| GET | `/api/reports/revenue` | Ciro raporu |
| GET | `/api/reports/dispatches` | Sevkiyat raporu |
| GET | `/api/reports/top-dispatched` | En çok sevk edilen |
| GET | `/api/reports/export` | CSV dışa aktarma (`?type=revenue&from=...&to=...`) |

### Yönetim (Sadece Sahip)
| Metod | Yol | Açıklama |
|-------|-----|----------|
| GET | `/api/users` | Kullanıcı listesi |
| PUT | `/api/users/:id/role` | Rol değiştir |
| DELETE | `/api/users/:id` | Kullanıcı sil |
| GET | `/api/invites` | Davet kodları |
| POST | `/api/invites` | Yeni davet kodu oluştur |
| DELETE | `/api/invites/:id` | Davet kodu sil |

### Diğer
| Metod | Yol | Açıklama |
|-------|-----|----------|
| GET | `/api/settings/business` | İşletme bilgileri |
| PUT | `/api/settings/business` | İşletme bilgileri güncelle |
| GET | `/api/audit-log` | Denetim kaydı (`?page=1&limit=50`) |

---

## Yetkilendirme Matrisi

| İşlem | Sahip | Yönetici |
|------|:-----:|:---------:|
| Ürün CRUD | ✓ | ✓ |
| Depo hareketi | ✓ | ✓ |
| Ciro kapanışı | ✓ | ✓ |
| Raporlar | ✓ | ✓ |
| Kullanıcı yönetimi | ✓ | ✘ |
| Davet kodu | ✓ | ✘ |
| Rol değiştirme | ✓ | ✘ |

---

## Tasarım Sistemi

### Renkler
```typescript
primary:     '#6B21A8'   // Koyu mor
primaryLight: '#7C3AED'  // Açık mor
accent:      '#D4AF37'   // Altın
accentLight: '#E5C565'   // Açık altın
background:  '#0D0B14'   // Koyu arka plan
surface:     '#1A1726'   // Kart arka planı
text:        '#FFFFFF'   // Ana metin
textSecondary: '#A0A0B0' // İkincil metin
error:       '#EF4444'   // Hata
success:     '#10B981'   // Başarı
warning:     '#F59E0B'   // Uyarı
```

### Ekran Yapısı
```
Alt Sekmeler (Bottom Tabs):
  Özet (dashboard)  →  Ana özet ekranı
  Stok (stock)       →  Depo stok listesi
  Sevkiyat (dispatch) →  Sevkiyat kayıtları
  Ciro (revenue)     →  Aylık ciro listesi
  Diğer (more)       →  Ürünler, raporlar, ayarlar, çıkış
```

---

## Önemli İş Kuralları

1. **Sevkiyat ≠ Satış.** Depodan çıkan ürün, müşteriye satıldı demek değildir.
2. **Negatif stok engellenir.** Depoda olmayan ürün sevk edilemez; iptal ve eksi sayım da stoğu eksiye düşüremez.
3. **Hareketler silinemez.** İptal için ters kayıt oluşturulur.
4. **Gün başına tek kapanış.** Aynı tarihe ikinci kapanış oluşturulamaz.
5. **Para kuruş (int) olarak saklanır.** 1234 = 12,34 ₺
6. **Paket dönüşüm geçmişi korunur.** Eski hareketler orijinal faktörü saklar.
7. **İdempotency key** ile mükerrer belge önlenir.
8. **Optimistic locking** (version) ile eş zamanlı düzenleme çarpışması önlenir.

---

## Claude Code ile Geliştirme Notları

### Kod Stili
- Tüm kullanıcıya görünen metinler **Türkçe** olmalıdır.
- Backend'de her controller metodu DTO döndürmelidir (`Promise<SomeDto>`).
- Frontend'de API çağrıları `src/api/generated/` altındaki hook'lar üzerinden yapılır.
- `src/api/generated/` klasöründeki dosyaları **düzenlemeyin** — otomatik üretilir.
- API değişikliği sonrası `orval` ile yeniden üretin.

### Yeni Endpoint Ekleme
1. `nodejs_space/src/<modul>/` altında controller + service + DTO yazın.
2. Controller metoduna `Promise<YourDto>` dönüş tipi verin.
3. DTO'lardaki her field'a `@ApiProperty()` ekleyin.
4. `prisma/schema.prisma` değiştiyse: `yarn prisma generate && yarn prisma db push`
5. Backend'i `yarn run build` ile derleyin.
6. Frontend API istemcisini Orval ile yeniden üretin.

### Frontend Ekran Ekleme
1. `react_native_space/app/<klasör>/<ekran>.tsx` dosyası oluşturun.
2. `<klasör>/_layout.tsx` içinde Stack.Screen olarak ekleyin.
3. Hook'ları `@/src/api/generated/api`'den import edin.
4. Tema renklerini `@/src/utils/theme`'den kullanın.

### Veritabanı Migration
```bash
# Şemayı değiştirdikten sonra:
yarn prisma generate
yarn prisma db push

# Veya migration oluşturmak için:
yarn prisma migrate dev --name aciklama
```

---

## Gelecek Sürüm (V2) Planı

- [ ] Push bildirimleri (Firebase)
- [ ] Fatura tanıma (OCR / LLM)
- [ ] Sesli veri girişi
- [ ] Ürün bazlı satış takibi
- [ ] Araç (Doblo) stok takibi
- [ ] Mağaza (tezgâh) stok takibi
- [ ] Kâr/zarar hesaplaması
- [ ] Çoklu işletme desteği

---

## Lisans

Özel proje — tüm hakları saklıdır.
