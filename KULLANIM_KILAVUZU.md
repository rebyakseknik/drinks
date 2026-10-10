# Drinks Yönetim — Kullanım Kılavuzu

> Forum Mersin · Drinks İçecek İşletmesi · Özel Yönetim Uygulaması

---

## İÇİNDEKİLER

1. [İlk Kurulum — Sahip Hesabı Oluşturma](#1-i̇lk-kurulum--sahip-hesabı-oluşturma)
2. [Yönetici Ekleme (Davet Kodu)](#2-yönetici-ekleme-davet-kodu)
3. [Giriş ve Çıkış](#3-giriş-ve-çıkış)
4. [Alt Menüler — Ekran Yapısı](#4-alt-menüler--ekran-yapısı)
5. [Ürün Yönetimi](#5-ürün-yönetimi)
6. [Stok Takibi](#6-stok-takibi)
7. [Depo Hareketleri (Mal Kabul, Sevkiyat, İade, Fire, Sayım)](#7-depo-hareketleri)
8. [Günlük Ciro Kapanışı](#8-günlük-ciro-kapanışı)
9. [Özet Ekranı (Dashboard)](#9-özet-ekranı-dashboard)
10. [Raporlar ve CSV Dışa Aktarma](#10-raporlar-ve-csv-dışa-aktarma)
11. [Ayarlar ve Yönetim](#11-ayarlar-ve-yönetim)
12. [Sık Sorulan Sorular](#12-sık-sorulan-sorular)
13. [Önemli Kurallar ve Uyarılar](#13-önemli-kurallar-ve-uyarılar)

---

## 1. İlk Kurulum — Sahip Hesabı Oluşturma

Uygulama ilk açıldığında henüz hiç hesap yoktur. İlk kaydolan kişi otomatik olarak **"Sahip"** (owner) olur.

**Adımlar:**
1. Uygulamayı açın → "Kayıt Ol" ekranı gelir.
2. **Ad Soyad**, **e-posta** ve **şifre** (en az 8 karakter) girin.
3. **Davet Kodu alanını boş bırakın** — ilk hesap için kod gerekmez.
4. **"Kayıt Ol"** butonuna basın.
5. Hesabınız "Sahip" yetkisiyle oluşturulur ve ana ekrana yönlendirilirsiniz.

⚠️ **Önemli:** İlk kaydı mutlaka işletme sahibi yapmalıdır. İkinci kişi kaydolmaya çalışırsa davet kodu istenir.

---

## 2. Yönetici Ekleme (Davet Kodu)

Sadece Sahip, yeni kullanıcıları sisteme davet edebilir.

**Adımlar:**
1. Alt menüden **"Diğer"** sekmesine gidin.
2. **"Davet Kodları"** menüsüne dokunun.
3. **"Yeni Davet Kodu"** butonuna basın → Sistem 8 haneli bir kod üretir (örnek: BVAA5498).
4. Bu kodu yöneticinize gönderin (mesaj, not, vb.).
5. Yönetici, "Kayıt Ol" ekranında bu kodu **Davet Kodu** alanına yazar ve hesabını oluşturur.
6. Yönetici "Yönetici" (manager) olarak kaydedilir.

**Kod kuralları:**
- Her kod **tek kullanımlıktır** — biri kullandıktan sonra geçersiz olur.
- Kodlar **7 gün** geçerlidir.
- Kullanılmamış kodları Davet Kodları ekranından silebilirsiniz.

---

## 3. Giriş ve Çıkış

### Giriş
1. Uygulamayı açın → "Giriş Yap" ekranı gelir.
2. E-posta ve şifrenizi girin.
3. **"Giriş Yap"** butonuna basın.

### Çıkış
1. **"Diğer"** sekmesine gidin.
2. En altta **"Çıkış Yap"** butonuna basın.
3. Onay verdikten sonra giriş ekranına dönersiniz.

### Şifre Değiştirme
1. **Diğer → Şifre Değiştir** menüsüne gidin.
2. Mevcut şifrenizi ve yeni şifrenizi girin.
3. **"Kaydet"** butonuna basın.

---

## 4. Alt Menüler — Ekran Yapısı

Uygulamanın alt kısmında 5 ana sekme vardır:

| Sekme | Simge | Ne İşe Yarar |
|-------|-------|---------------|
| **Özet** | 📊 | Bugünkü ciro, aylık özet, düşük stok uyarıları, son sevkiyatlar |
| **Stok** | 📦 | Depo stok listesi, ürün arama, düşük stok filtresi |
| **Sevkiyat** | 🚗 | Sevkiyat kayıtları listesi, yeni sevkiyat oluşturma |
| **Ciro** | 📈 | Aylık ciro listesi, günlük kapanış kayıtları |
| **Diğer** | ☰ | Ürünler, raporlar, ayarlar, kullanıcı yönetimi, çıkış |

---

## 5. Ürün Yönetimi

Ürünler, stok ve sevkiyat işlemlerinde kullanılır. Önce ürünleri tanımlamanız gerekir.

### Yeni Ürün Ekleme
1. **Diğer → Ürünler** menüsüne gidin.
2. **"Yeni Ürün"** veya **"+"** butonuna basın.
3. Alanları doldurun:
   - **Ürün Adı:** Örn. "Su 0,5L", "Türk Kahvesi", "Kola"
   - **Kategori:** Örn. "İçecek", "Sıcak İçecek", "Gazlı İçecek"
   - **Temel Birim:** Adet, Gram veya Mililitre
   - **Minimum Stok Eşiği:** Bu sayının altına düşünce uyarı verilir
4. **"Oluştur"** butonuna basın. Ardından başlangıç stoğu ekranı otomatik açılır.

### Başlangıç Stoğu (zorunlu ilk adım)
Her yeni ürün için, depoda o an fiilen sayılan miktarı **bir kez** girmeniz gerekir. Girilmeyen ürünlerde **"Başlangıç stoğu girilmedi"** uyarısı görünür ve **o ürüne hiçbir hareket (mal kabul, sevkiyat vb.) girilemez.**

1. **Stok** sekmesinde ürüne dokunun (yeni ürün oluşturunca bu ekran kendiliğinden açılır).
2. **"Başlangıç Stoğu Gir"** butonuna basın.
3. Depodaki miktarı yazın. Koli içeriği tanımlıysa koli ve adet birlikte girilebilir
   (örn. 24'lük üründe **2 koli + 5 adet** → ekranda "53 adet" görünür). Gramla tutulan ürünlerde
   **kg** ve **g**, mililitreyle tutulanlarda **L** ve **ml** alanları vardır.
4. "Kaydedilecek" satırındaki toplamı kontrol edip **Kaydet**'e basın.

⚠️ Başlangıç stoğunu **Mal Kabul ile girmeyin.** Başlangıç stoğu sonradan değiştirilemez; daha sonra çıkan farklar için **Sayım Düzeltmesi** kullanın.

### Paket Dönüşümleri
Örneğin 1 koli = 24 adet gibi dönüşümler:
1. Ürün detay ekranında **"Paket Dönüşümleri"** bölümüne gidin.
2. Paket adı ("Koli"), dönüşüm faktörü ("24") girin.
3. Hareket ve sayım ekranlarında ürün satırında **koli** ve **adet** kutuları birlikte çıkar; toplam altında gösterilir.
4. Stok listesinde miktar koli karşılığıyla görünür: örn. **"15 koli · 360 adet"**. Koli içeriği tanımlı değilse yalnızca adet gösterilir.

Not: Sonuç temel birimde tam sayı olmalıdır (0,5 adet veya yarım koli girilemez).

---

## 6. Stok Takibi

**Stok** sekmesinde depo envanterinizi görürsünüz.

### Stok Listesi
- Her ürünün adı ve depodaki miktarı görünür: koli tanımlıysa **"15 koli · 360 adet"**, gramla tutulanlar **"2 kg"**, mililitreyle tutulanlar **"1,5 L"**.
- **Turuncu** miktar: stok, minimum eşiğin altında.
- Başlangıç sayımı yapılmamış ürünlerde miktar yerine **"—"** ve **"Başlangıç sayımı yok"** yazar; bu ürünler sıfır stok sayılmaz.
- Filtreler: **Tümü**, **Kritik**, **Sayımı eksik**. Arama kutusuyla ürün arayabilirsiniz.

### Stok Nasıl Hesaplanır?
Stok, tek tek hareketlerden toplanarak hesaplanır:
- **Mal Kabul** ve **Depoya İade** → Stoku artırır (+)
- **Sevkiyat** ve **Fire/Hasar** → Stoku azaltır (−)
- **Sayım Düzeltmesi** → Gerçek sayıma göre fark eklenir veya çıkarılır

⚠️ **Stok "depodaki" stoktur.** Araca veya mağazaya gönderilen ürünler artık depoda sayılmaz. Uygulama araç/mağaza stoğunu takip etmez.

---

## 7. Depo Hareketleri

Beş tip hareket vardır. Her biri bir "belge" olarak kaydedilir.

### Yeni Hareket Oluşturma
1. Ana ekrandaki **Mal Geldi** veya **Sevkiyat Yap** butonuna basın (tür önceden seçili gelir). İade ve fire için **Diğer → İade / Fire**.
2. Gerekirse üstteki düğmelerden **hareket türünü** değiştirin:

| Tip | Açıklama | Stok Etkisi |
|-----|----------|-------------|
| **Mal Kabul** | Tedarikçiden gelen ürünler | + Artırır |
| **Sevkiyat** | Forum veya Doblo'ya gönderim | − Azaltır |
| **Depoya İade** | Geri dönen ürünler | + Artırır |
| **Fire / Hasar** | Kırılan, bozulan ürünler | − Azaltır |
| **Sayım Düzeltmesi** | Fiziksel sayım farkı | Ayrı ekran — aşağıya bakın |

3. **Ürün ekleyin:** "Ürün ara ve ekle…" kutusuna adının birkaç harfini yazıp dokunun.
4. Her satırda depodaki miktar görünür; **koli / adet** (veya kg / g) kutularına miktarı yazın. Sayı klavyesi açılır.
5. Sevkiyat ve fire depodakinden fazlaysa satır kırmızı olur ve örneğin
   **"Yetersiz stok: depoda 16 adet, istenen 20 adet"** yazar; bu durumda kayıt yapılmaz.
6. İsterseniz **not** ekleyin ve alttaki **Kaydet** butonuna basın (klavye açıkken de görünür).

### Sayım Düzeltmesi
Depoda sayım yaptığınızda farkı siz hesaplamazsınız; **bulduğunuz miktarı** girersiniz.

1. **Diğer → Sayım Düzeltmesi** (veya ürün detayında **Sayım Yap**).
2. Ürünü seçin ve **Sayımda bulunan miktar**ı girin.
3. Ekranda özet görünür — örnek:
   - Sistemdeki stok: 2 kg
   - Sayımda bulunan: 1,85 kg
   - Hesaplanan düzeltme: **−150 g**
   - İşlem sonrası stok: 1,85 kg
4. **Düzeltme nedeni**ni yazıp **Düzeltmeyi Kaydet**'e basın.

Siz sayarken başka biri aynı ürüne işlem yaptıysa kayıt yapılmaz; ekranda
**"Siz sayarken stok değişti"** uyarısı çıkar ve özet güncel stokla yeniden hesaplanır.
Kontrol edip tekrar kaydedin.

### Tek Belgede Birden Fazla Ürün
Bir belgede birden fazla ürün ekleyebilirsiniz. Örneğin mal kabul sırasında gelen 10 farklı ürünü tek seferde girebilirsiniz.

### Hareket İptali
Kayıtlı bir hareketi silmek yerine hareket detayında **"İptal Et"** kullanılır. Belge "İptal edildi" olarak işaretlenir, stoğa etkisi tamamen geri alınır ve iz için bir "İptal kaydı" oluşturulur. İptal edilen sevkiyatlar raporlarda sayılmaz.

- Bir belge yalnızca bir kez iptal edilebilir.
- Gelen malın bir kısmı sevk edildiyse o mal kabul iptal edilemez (stok eksiye düşerdi). Bu durumda Sayım Düzeltmesi kullanın.

### Negatif Stok Koruması
Sevkiyat, fire veya eksi sayım düzeltmesi depodaki stoktan fazla olamaz. İki telefondan aynı anda giriş yapılsa bile stok eksiye düşmez.

### Çift Kayıt Koruması
"Kaydet"e bastıktan sonra bağlantı koparsa, aynı ekranda tekrar "Kaydet"e basmak güvenlidir: hareket ikinci kez kaydedilmez.

---

## 8. Günlük Ciro Kapanışı

Her iş günü sonunda toplam nakit ve kart cirosunu kaydedin.

### Yeni Kapanış Girme
1. **Ciro** sekmesine gidin.
2. **"+"** butonuna basın (veya listede **"Kapanış girilmedi"** yazan güne dokunun).
3. **İş Günü** varsayılan olarak bugündür; geçmiş bir günü girmek için ◀ okuyla geri gidin. İleri tarih seçilemez.
4. Alanları doldurun:
   - **Nakit Ciro (₺):** Gün sonundaki net nakit satış tutarı
   - **Kart Ciro (₺):** Gün sonundaki net kart satış tutarı
   - **Not:** İsteğe bağlı açıklama
5. **"Kaydet"** butonuna basın.

Tutar yazarken "1.250,50" veya "1250,50" biçimini kullanabilirsiniz.

### Önemli Kurallar
- **Toplam Ciro = Nakit + Kart.** Başka bir hesaplama yapılmaz.
- Bu tutarlar **iadeler düşüldükten sonraki net rakamlardır**. İadeleri ayrıca girmenize gerek yok.
- Kasa açılış parası, çekim, masraf gibi tutarları dahil etmeyin.
- Her gün için **sadece bir kapanış** girilebilir. Aynı gün tekrar girmeye çalışırsanız hata alırsınız.
- Kapanış girilmemiş günler **"Kapanış girilmedi"** olarak görünür, sıfır gösterilmez. Gerçekten sıfır ciro olan bir gün için **0** girin; listede "Sıfır ciro kaydı" olarak ayrı görünür.
- Tutarlar Türk Lirası (₺) cinsinden, kuruş hassasiyetinde saklanır.

### Düzeltme
Girilen bir kapanışı düzenleyebilirsiniz. Değişiklik denetim kaydına işlenir. İki kişi aynı kapanışı aynı anda düzeltirse ikincisine "Bu kayıt başka biri tarafından güncellendi" uyarısı çıkar; ekranı yenileyip tekrar deneyin.

---

## 9. Özet Ekranı (Ana Ekran)

**Özet** sekmesi uygulamanın ana sayfasıdır.

### Hızlı İşlemler
En üstte üç büyük buton vardır: **Mal Geldi**, **Sevkiyat Yap**, **Ciro Gir**. Her biri doğrudan
ilgili giriş ekranını açar; Mal Geldi ve Sevkiyat Yap'ta tür önceden seçilidir.

### Ciro
- **Bugünkü ciro:** girildiyse tutar, girilmediyse **"Kapanış girilmedi"**. Sıfır ciro girilmiş gün
  "Sıfır ciro olarak kaydedildi" diye ayrıca belirtilir.
- **Bu ay:** toplam ve **kaç günün kaydedildiği**. Ayda hiç kayıt yoksa "0,00 ₺" yerine
  **"Bu ay henüz ciro kaydı yok"** yazar.
- Her iki gün de girilmişse geçen haftanın aynı günüyle karşılaştırma.

### Kritik Stoklar
- Minimum eşiğin altındaki ürünler (koli/kg karşılığıyla).
- Başlangıç sayımı yapılmamış ürün varsa **"X ürünün başlangıç sayımı yok"** uyarısı çıkar;
  bu durumda "tüm stoklar yeterli" denmez.

### Son Hareketler
- Son 6 hareket (mal kabul, sevkiyat, sayım…). Dokunarak ayrıntısını görebilirsiniz.

### Ekranı Yenileme
- Ekranı aşağı çekerek (pull-to-refresh) verileri güncelleyebilirsiniz.

---

## 10. Raporlar ve CSV Dışa Aktarma

**Diğer** sekmesindeki **Raporlar** bölümünden erişilir:

### Ciro Raporu
- Tarih aralığına göre günlük ciro detayları
- Nakit/kart ayrımı

### Sevkiyat Raporu
- Tarih aralığına göre sevkiyat kayıtları
- Ürün bazlı detaylar

### En Çok Sevk Edilen
- Belirli dönemde en çok sevk edilen ürünler sıralaması
- ⚠️ Bu **satış** değil, **sevkiyat miktarıdır**

### CSV Dışa Aktarma
1. **Diğer → Dışa Aktar (CSV)** menüsüne gidin.
2. Rapor tipini ve ayı seçin.
3. **"Dışa Aktar"** butonuna basın. Ciro dosyasında kapanış girilmeyen günler "Kapanış girilmedi" olarak yazılır.
4. Oluşan CSV dosyasını telefonunuzun paylaşım menüsüyle:
   - WhatsApp'tan gönderebilirsiniz
   - E-posta ile paylaşabilirsiniz
   - Google Drive / iCloud'a kaydedebilirsiniz
   - Excel'de açabilirsiniz

---

## 11a. Personel, Vardiyalar ve Giderler

**Diğer → PERSONEL & GİDER** bölümünden erişilir. Sahip ve yöneticiler kullanabilir.

### Personel
- Ad, telefon ve ücret (günlük / haftalık / aylık) girilir.
- Ayrılan personel silinmez, **pasif** yapılır; geçmiş vardiya ve giderleri korunur.

### Vardiyalar
- Ekran haftalık görünür; ok tuşlarıyla haftalar arasında gezilir. Üstte kişi başı gün ve saat toplamı vardır.
- Bir güne vardiya eklemek için günün yanındaki **+**; mevcut vardiyayı değiştirmek veya silmek için vardiyaya dokunun.
- **Hazır Saatler:** Vardiya girerken "Sabah 10–18" gibi düğmelerle saat tek dokunuşla doldurulur.
  Bu düğmeleri değiştirmek için vardiya ekranında **Düzenle**'ye basın: saatleri değiştirebilir,
  yeni hazır saat ekleyebilir veya silebilirsiniz. Değişiklik daha önce girilmiş vardiyaları etkilemez.
- **Geçen haftayı kopyala:** Haftanın üstündeki düğme, bir önceki haftanın vardiyalarını bu haftaya aynı gün ve saatlerle kopyalar.
  Aynı kişinin aynı saatte zaten vardiyası varsa o vardiya atlanır; bu yüzden düğmeye yanlışlıkla iki kez basmak çift kayıt oluşturmaz.
  Pasif personelin vardiyaları kopyalanmaz.
- Aynı kişiye çakışan vardiya girilemez (gece yarısını geçen vardiyalar da dahil); uygulama hangi vardiyayla çakıştığını gösterir.

### Giderler
- Gider türü (personel maaşı, kira, fatura, malzeme, diğer), tutar ve gün girilir. Maaş giderinde personel seçilir.
- Ay özetinde **Ciro − Gider = Kalan** görünür. Ciro yalnızca girilmiş kasa kapanışlarından gelir; kapanışı olmayan günler ayrıca belirtilir.
- ⚠️ **Kalan kâr değildir:** Tedarikçiden alınan mallar gider olarak girilmediyse kalan tutar gerçek kârdan yüksek görünür.
- Bağlantı koparsa "Kaydet"e tekrar basmak güvenlidir; gider iki kez kaydedilmez.

## 11. Ayarlar ve Yönetim

**Diğer** sekmesinin alt bölümlerinde:

### İşletme Bilgileri
- İşletme adı, konum gibi bilgileri düzenleyin.

### Kullanıcılar (Sadece Sahip)
- Kayıtlı kullanıcıları görün.
- Yönetici rolünü değiştirin. Değişiklik o kişinin telefonunda hemen geçerli olur.
- Kullanıcı silin. Silinen kişinin uygulaması otomatik olarak giriş ekranına döner.

### Davet Kodları (Sadece Sahip)
- Yeni davet kodu oluşturun.
- Aktif/kullanılmış kodları görün.
- Kullanılmamış kodları silin.

### İşlem Geçmişi (Audit Log)
- Tüm önemli işlemlerin kaydı: kim, ne zaman, ne yaptı.
- Kullanıcı kaydı, ürün ekleme, stok hareketi, ciro kapanışı gibi tüm işlemler loglanır.

### Şifre Değiştir
- Kendi hesabınızın şifresini değiştirin.

---

## 12. Sık Sorulan Sorular

**S: İki telefon aynı anda kullanabilir mi?**
E: Evet. Sahip ve yönetici farklı telefonlardan aynı verileri görür ve girebilir. Veriler sunucuda saklanır.

**S: İnternet olmadan kullanabilir miyim?**
H: Şu an internet bağlantısı gereklidir. Bağlantı kesilirse "Bağlantı hatası" uyarısı görünür. Tekrar bağlanınca kaydetmeyi deneyebilirsiniz.

**S: Yanlış veri girdim, silebilir miyim?**
E: Stok hareketleri silinmez, bunun yerine "İptal" (ters kayıt) oluşturulur. Böylece geçmiş kayıtlar korunur. Ciro kapanışlarını düzenleyebilirsiniz.

**S: Bu uygulama satışları takip ediyor mu?**
H: Hayır. Bu sürüm (V1) yalnızca **depo stoku**, **sevkiyat** ve **günlük toplam ciro** takip eder. Tek tek ürün satışları, araç stoku veya kâr hesabı yoktur.

**S: "En Çok Sevk Edilen" satış mı gösteriyor?**
H: Hayır. Bu sadece **depodan çıkış (sevkiyat) miktarıdır**, satış değildir.

**S: Verilerin yedeği alınıyor mu?**
E: Veriler bulut sunucuda (PostgreSQL veritabanı) saklanır. CSV dışa aktarma ile verilerinizin kopyasını alabilirsiniz. Sunucu yedeği ayrıca yönetilir.

**S: Aynı güne iki kapanış girebilir miyim?**
H: Hayır. Her iş günü için tek kapanış kaydı olabilir. Hata yaparsanız mevcut kaydı düzenleyin.

**S: Birimler ne anlama geliyor?**
- **Adet:** Şişe, bardak, paket gibi sayılabilir birimler
- **Gram:** Tartılabilen ürünler (çay, kahve, şeker vb.)
- **Mililitre:** Sıvı ürünler
- **Koli/Paket:** Dönüşüm tanımlayarak kullanılır (1 koli = 24 adet gibi)

**S: Sahip kim olabilir?**
Sistemde birden fazla sahip olabilir ama ilk sahip, sisteme ilk kaydolan kişidir. Sahip, diğer kullanıcıları "Sahip" rolüne yükseltebilir.

---

## 13. Önemli Kurallar ve Uyarılar

1. ❌ **İlk kaydı her zaman işletme sahibi yapmalıdır.** İlk kaydolan kişi Sahip yetkisini alır.
2. ❌ **Ciro kapanışına iade ayrıca girmeyin.** Girdiğiniz rakamlar zaten net (iade düşülmüş) olmalıdır.
3. ❌ **Kasa açılış parasını ciro olarak girmeyin.**
4. ❌ **Stok hareketlerini silmeyin** — ters kayıt kullanın.
5. ✅ **Düzenli kapanış girin.** Girilmeyen günler raporda "Kapanış girilmedi" görünür.
6. ✅ **Minimum stok eşiği belirleyin.** Düşük stok uyarısı alabilmek için.
7. ✅ **CSV dışa aktarma ile düzenli yedek alın.**
8. ✅ **Ekranı aşağı çekerek verileri yenileyebilirsiniz.**

---

## Hızlı Başlangıç Özeti

```
1. Sahip kaydı yap (davet kodu boş) ✓
2. Ürünleri tanımla (Diğer → Ürünler → Yeni Ürün)
3. Paket dönüşümlerini ayarla (koli = 24 adet vb.)
4. Her ürün için başlangıç stoğunu gir (Ürün detayı → Başlangıç Stoğu Gir)
5. Günlük işlemleri gir:
   → Mal geldiğinde: Mal Kabul
   → Forum/Doblo'ya gönderirken: Sevkiyat
   → Gün sonunda: Ciro Kapanışı
6. Yönetici ekle (Davet Kodları → Yeni Kod → Gönder)
7. Düzenli olarak CSV raporu al
```

---

*Drinks Yönetim v1 — Forum Mersin*
