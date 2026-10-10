# Değişiklikler

## 2. Paket — Hızlı günlük kullanım (10 Ekim 2026)

Mevcut veriler, yetkiler, hareket geçmişi ve çift kayıt koruması korunmuştur. Veritabanı yapısı değişmedi.

- **Ana ekran:** Mal Geldi / Sevkiyat Yap / Ciro Gir butonları; bugünkü ve aylık ciro; kritik stoklar; son hareketler.
- **Kayıtsız ciro ≠ sıfır ciro:** Ayda kayıt yoksa "Bu ay henüz ciro kaydı yok"; kaç gün kaydedildiği gösterilir; sıfır ciro günleri ayrıca işaretlenir.
- **Anlaşılır stok:** "15 koli · 360 adet", "2 kg", "1,5 L". Koli tanımlı değilse varsayım yapılmaz. Sayımı olmayan ürünler "—" ve "Sayımı eksik" filtresiyle ayrılır; bu ürünler varken "tüm stoklar yeterli" denmez.
- **Başlangıç stoğu:** Ürün adı başlıkta; koli + adet, kg + g ile giriş ("2 koli + 5 adet" → 53 adet).
- **Sayım düzeltmesi yeniden tasarlandı:** "Sayımda bulunan miktar" girilir; sistem stoğu, fark ve işlem sonrası stok özeti gösterilir. Kayıt anında stok değişmişse sunucu düzeltmeyi yapmaz (409), ekran güncel stokla yeniden hesaplatır.
- **Hızlı giriş ekranı:** Ürün arama, kompakt satırlar, koli/adet kutuları, sayı klavyesi, klavyenin üstünde kalan Kaydet butonu, satırın yanında "Yetersiz stok: depoda 16 adet, istenen 20 adet".
- **Okunurluk:** Gri yazılar açıldı, en küçük yazı 13 pt, dokunma alanları en az 44–48 pt.
- **Saat:** Hareket saatleri İstanbul saatiyle gösteriliyor (önceden UTC'ydi; gece 00–03 arası önceki güne düşüyordu).
- Sunucu: stok listesine koli bilgisi (`packageName`, `packageFactor`), sayım satırına `expectedStock` eklendi (geriye uyumlu).
- **Abacus uyumluluğu:** Abacus veritabanında kalan eski gizli hesap artık giriş yapamaz ve kullanıcı sayımına girmez (ilk gerçek kayıt yine Sahip olur). Abacus sunucusunun veritabanı motoru ayarı geri eklendi.
- Testler: sunucu 47 test, mobil miktar hesapları 13 test (`yarn test`).

## 1. Düzeltme Paketi (10 Ekim 2026)

Bu paket, ilk incelemede bulunan veri doğruluğu, güvenilirlik ve güvenlik sorunlarını giderir.
Tüm iş kuralları 43 otomatik testle doğrulanmıştır (`nodejs_space/test/drinks.e2e-spec.ts`).
Aynı testler eski kodda çalıştırıldığında 29'u başarısız oluyordu.

## Stok ve depo hareketleri
- **İptal artık stoğu bir kez etkiliyor.** Önceden 10 adetlik mal kabul iptal edilince stok 10 yerine 20 düşüyordu.
- **İptal stoğu eksiye düşüremez.** Sevk edilmiş malın kabulü iptal edilemez.
- **İptal edilen sevkiyatlar** "En Çok Sevk Edilen", sevkiyat raporu ve CSV'de sayılmıyor.
- **İki telefondan aynı anda** yapılan sevkiyatlar stoğu eksiye düşüremez (ürün bazında kilit).
- **Sayım düzeltmesiyle stok azaltılabiliyor** ("Eksik çıktı (−)" seçeneği).
- **Başlangıç stoğu kuralı netleşti:** Başlangıç stoğu girilmeden ürüne hareket girilemez;
  böylece aynı mal iki kez sayılamaz. Yeni ürün oluşturunca başlangıç stoğu ekranı açılır.
- **Paket (koli) seçimi** hareket ekranına eklendi. Katsayı sunucuda doğrulanıyor; "0,5 adet" gibi
  geçersiz miktarlar reddediliyor.
- Aynı belgede aynı ürün iki satırda olursa stok kontrolü toplamına bakıyor.
- İleri tarihli hareket ve sayım tarihinden önceye hareket girilemiyor.

## Çift kayıt
- Bağlantı koptuğunda "Kaydet"e tekrar basmak artık ikinci bir kayıt oluşturmuyor.
- Aynı anda gelen iki aynı istek tek kayıt oluşturuyor ve ikisi de başarılı yanıt alıyor.

## Günlük kapanış
- **Geçmiş bir günün kapanışı** girilebiliyor (◀ ok ile). İleri tarih seçilemiyor.
- Ciro sekmesinde kapanış girilmeyen günler **"Kapanış girilmedi"** olarak görünüyor; dokununca o gün için kapanış açılıyor.
- İki kişinin aynı anda yaptığı düzeltmelerden biri sessizce kaybolmuyor; ikinci kişi uyarı alıyor.
- Aynı güne aynı anda iki kapanış girilirse anlaşılır uyarı veriliyor (önceden "sunucu hatası").
- Saat dilimi hatası giderildi (gece yarısına yakın kayıtlar önceki güne kayabiliyordu).
- **Para girişi:** "12.50" yazılınca 1.250 ₺ kaydediliyordu; düzeltildi.
- Notu silerek kaydetmek artık notu gerçekten siliyor.

## Raporlar ve CSV
- Raporlar ayın son gününü de içeriyor.
- **CSV iPhone'da paylaşılabiliyor** (WhatsApp, E-posta, Dosyalar, iCloud). Ay seçimi eklendi.
- CSV'de hareket türleri Türkçe; ciro dosyasında boş günler "Kapanış girilmedi".
- Eksik/hatalı tarihte "sunucu hatası" yerine anlaşılır uyarı.

## Güvenlik ve yetkiler
- **Abacus'un gizli sahip hesabı ve şifresi koddan tamamen kaldırıldı.**
- Silinen kullanıcının oturumu anında kapanıyor; uygulaması giriş ekranına dönüyor.
- Rol değişikliği (sahip ↔ yönetici) o kişinin telefonunda hemen geçerli oluyor.
- Giriş anahtarı iPhone'da yalnızca şifreli depoda tutuluyor (önceden ikinci bir kopyası açık depodaydı).
- Çıkış yapınca önbellekteki veriler temizleniyor.
- E-posta büyük/küçük harf duyarsız; davet kodları güvenli rastgele üretiliyor (karışan 0/O, 1/I harfleri yok).
- Olmayan kayıtlarda "sunucu hatası" yerine "bulunamadı" uyarısı.

## iPhone
- Hareket ekranındaki rastgele kimlik üretici, iPhone'da çökme riski taşıyan paketten Expo'nun kendi
  aracına (`expo-crypto`) taşındı.
- Uygulama iPhone için hatasız paketleniyor (`expo export --platform ios`).
- Stok listesinde ve ürün detayında başlangıç stoğu girilmemiş ürün "0" yerine "—" gösteriliyor.
- Özet ekranındaki "Son Sevkiyatlar" iptal edilenleri göstermiyor.
- Açılır seçim kutuları iPhone'da tam tekerlek, web ve Android'de düzgün tek satır olarak görünüyor.

## Mac'te deneme
- `baslat.command`: çift tıklayınca veritabanı, sunucu ve uygulama Mac'te açılır; iPhone'da Expo Go ile QR okutularak denenir.

## Taşınabilirlik (Abacus'tan bağımsızlık)
- Sunucunun gerçek paket kilit dosyası (`yarn.lock`) eklendi (önceden Abacus sunucusundaki bir dosyaya işaret ediyordu).
- Abacus'a özel klasör yolları kaldırıldı (Prisma çıktısı, yarn ayarları).
- `start:prod` komutu düzeltildi; sunucu `PORT` değişkenini dikkate alıyor.
- Bozuk seed betiği düzeltildi; seed artık kullanıcı oluşturmuyor ve hiçbir şey silmiyor.
- Prisma 6.7.0 → 6.19.0.

## Bu pakette olmayanlar (sonraki adımlar)
- Uygulama kimlikleri hâlâ `com.abacusai…` — App Store'a kendi adınızla çıkmadan önce değişmeli.
- `eas.json` (iPhone'a kurulabilir sürüm üretmek için) henüz yok.
- Veritabanı geçiş (migration) dosyaları henüz yok; yeni sunucu kurulurken eklenecek.
- Kod stili denetimi (lint) uyarıları temizlenmedi; çoğu yalnızca biçimlendirme.
- Şifre değiştirince diğer cihazlardaki oturumlar kapanmıyor (7 gün geçerli kalıyor).
