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
4. **"Oluştur"** butonuna basın.

### Başlangıç Stoğu
Her yeni ürün için depoda ne kadar olduğunu girmezseniz **"Başlangıç stoğu girilmedi"** uyarısı görünür. Stoku ayarlamak için:
1. **Diğer → Yeni Hareket** menüsünden **"Mal Kabul"** veya **"Sayım Düzeltmesi"** seçin.
2. İlgili ürünü ekleyin ve miktarı girin.

### Paket Dönüşümleri
Örneğin 1 koli = 24 adet gibi dönüşümler:
1. Ürün detay ekranında **"Paket Dönüşümleri"** bölümüne gidin.
2. Paket adı ("Koli"), dönüşüm faktörü ("24") girin.
3. Hareket girerken "Koli" seçebilirsiniz — sistem otomatik çarpar.

---

## 6. Stok Takibi

**Stok** sekmesinde depo envanterinizi görürsünüz.

### Stok Listesi
- Her ürünün adı, mevcut stoku ve birimi görünür.
- **Kırmızı** gösterge: Stok, minimum eşiğin altında.
- Üstteki arama kutusuna yazarak ürün arayabilirsiniz.
- **"Düşük Stok"** filtresiyle sadece kritik ürünleri görebilirsiniz.

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
1. **Diğer → Yeni Hareket** menüsüne gidin (veya **Sevkiyat** sekmesinden "Yeni Sevkiyat" butonuna basın).
2. **Hareket tipini** seçin:

| Tip | Açıklama | Stok Etkisi |
|-----|----------|-------------|
| **Mal Kabul** | Tedarikçiden gelen ürünler | + Artırır |
| **Sevkiyat** | Forum veya Doblo'ya gönderim | − Azaltır |
| **Depoya İade** | Geri dönen ürünler | + Artırır |
| **Fire / Hasar** | Kırılan, bozulan ürünler | − Azaltır |
| **Sayım Düzeltmesi** | Fiziksel sayım farkı | +/− Düzeltir |

3. **Ürün ekleyin:** Listeden ürün seçin → satır eklenir.
4. Her satırda:
   - **Birim seçin:** Adet, Koli, vb.
   - **Miktar girin:** Rakam klavyesiyle
   - **Sayım Düzeltmesi** için: **Neden** yazmanız zorunludur.
5. İsterseniz genel bir **not** ekleyin.
6. **"Kaydet"** butonuna basın.

### Tek Belgede Birden Fazla Ürün
Bir belgede birden fazla ürün ekleyebilirsiniz. Örneğin mal kabul sırasında gelen 10 farklı ürünü tek seferde girebilirsiniz.

### Hareket İptali
Kayıtlı bir hareketi silmek yerine **"İptal (Ters Kayıt)"** oluşturulur. Bu şekilde geçmiş kayıtlar korunur ve denetim izi bozulmaz.

### Negatif Stok Koruması
Sevkiyat veya fire girerken depodaki stoktan fazla miktar giremezsiniz. Sistem uyarı verir.

---

## 8. Günlük Ciro Kapanışı

Her iş günü sonunda toplam nakit ve kart cirosunu kaydedin.

### Yeni Kapanış Girme
1. **Ciro** sekmesine gidin.
2. **"Günlük Kapanış"** veya **"+"** butonuna basın.
3. Alanları doldurun:
   - **Nakit Ciro (₺):** Gün sonundaki net nakit satış tutarı
   - **Kart Ciro (₺):** Gün sonundaki net kart satış tutarı
   - **Not:** İsteğe bağlı açıklama
4. **"Kaydet"** butonuna basın.

### Önemli Kurallar
- **Toplam Ciro = Nakit + Kart.** Başka bir hesaplama yapılmaz.
- Bu tutarlar **iadeler düşüldükten sonraki net rakamlardır**. İadeleri ayrıca girmenize gerek yok.
- Kasa açılış parası, çekim, masraf gibi tutarları dahil etmeyin.
- Her gün için **sadece bir kapanış** girilebilir. Aynı gün tekrar girmeye çalışırsanız hata alırsınız.
- Kapanış girilmemiş günler **"Kapanış girilmedi"** olarak görünür, sıfır gösterilmez.
- Tutarlar Türk Lirası (₺) cinsinden, kuruş hassasiyetinde saklanır.

### Düzeltme
Girilen bir kapanışı düzenleyebilirsiniz. Değişiklik denetim kaydına işlenir.

---

## 9. Özet Ekranı (Dashboard)

**Özet** sekmesi uygulamanın ana sayfasıdır. Burada şunları görürsünüz:

### Bugünkü Ciro
- Bugüne ait kapanış girildiyse nakit, kart ve toplam ciro gösterilir.
- Girilmediyse **"Kapanış girilmedi"** uyarısı görünür.

### Aylık Ciro Özeti
- Bu ayın toplam ciro tutarı (nakit + kart)
- Kaç gün kapanış girildiği

### Geçen Hafta Karşılaştırması
- Bugünle geçen haftanın aynı gününü karşılaştırır.
- Örneğin bugün Çarşamba ise geçen Çarşamba'nın cirosuyla kıyaslar.
- Her iki gün de girilmişse farkı gösterir.

### Düşük Stok Uyarıları
- Minimum eşiğin altındaki ürünler kırmızı olarak listelenir.
- Dokunarak ürün detayına gidebilirsiniz.

### Son Sevkiyatlar
- En son 5 sevkiyat kaydı özetlenir.

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
2. Rapor tipini ve tarih aralığını seçin.
3. **"Dışa Aktar"** butonuna basın.
4. Oluşan CSV dosyasını telefonunuzun paylaşım menüsüyle:
   - WhatsApp'tan gönderebilirsiniz
   - E-posta ile paylaşabilirsiniz
   - Google Drive / iCloud'a kaydedebilirsiniz
   - Excel'de açabilirsiniz

---

## 11. Ayarlar ve Yönetim

**Diğer** sekmesinin alt bölümlerinde:

### İşletme Bilgileri
- İşletme adı, konum gibi bilgileri düzenleyin.

### Kullanıcılar (Sadece Sahip)
- Kayıtlı kullanıcıları görün.
- Yönetici rolünü değiştirin.
- Kullanıcı silin.

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
4. Başlangıç stok sayımı gir (Yeni Hareket → Mal Kabul)
5. Günlük işlemleri gir:
   → Mal geldiğinde: Mal Kabul
   → Forum/Doblo'ya gönderirken: Sevkiyat
   → Gün sonunda: Ciro Kapanışı
6. Yönetici ekle (Davet Kodları → Yeni Kod → Gönder)
7. Düzenli olarak CSV raporu al
```

---

*Drinks Yönetim v1 — Forum Mersin*
