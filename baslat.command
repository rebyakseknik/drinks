#!/bin/bash
# ============================================================================
#  Drinks Yönetim — Mac'te yerel önizleme
#  Çift tıklayın (veya Terminal'de: bash baslat.command). Durdurmak için: Ctrl + C
#
#  Ne yapar?
#   1. Proje klasörünün içinde geçici bir veritabanı açar (Mac'e PostgreSQL kurmaz)
#   2. Sunucuyu (nodejs_space) çalıştırır
#   3. Mobil uygulamayı (react_native_space) başlatır ve iPhone için QR kod gösterir
#
#  Bu yalnızca DENEME içindir. Girilen veriler yerel-onizleme/.veri klasöründe kalır,
#  canlı sisteme hiçbir şey gitmez. Verileri sıfırlamak için: bash baslat.command --sifirla
# ============================================================================
set -u
cd "$(dirname "$0")" || exit 1
ROOT="$(pwd)"
LOG="$ROOT/yerel-onizleme/kayitlar"
mkdir -p "$LOG"

renk() { printf "\033[1;%sm%s\033[0m\n" "$1" "$2"; }
adim() { echo; renk 35 "▶ $1"; }
hata() { echo; renk 31 "✖ $1"; echo; read -r -p "Kapatmak için Enter'a basın..." _; exit 1; }

# --- Node.js -----------------------------------------------------------------
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" >/dev/null 2>&1
for d in /opt/homebrew/bin /usr/local/bin; do [ -d "$d" ] && PATH="$d:$PATH"; done
export PATH

if ! command -v node >/dev/null 2>&1; then
  hata "Node.js bulunamadı. https://nodejs.org adresinden 'LTS' sürümünü indirip kurun, sonra bu dosyayı tekrar açın."
fi
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 20 ]; then
  hata "Node.js sürümünüz eski ($(node -v)). https://nodejs.org adresinden LTS sürümünü kurun."
fi
renk 32 "✓ Node.js $(node -v)"

# Yarn 4 (proje bununla kilitli) — kurulum gerektirmeden npx ile çalışır
export COREPACK_ENABLE_STRICT=0
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
YARN=(npx --yes -p @yarnpkg/cli-dist@4.13.0 yarn)

# --- Ağ adresi (iPhone bu adresle bağlanır) -----------------------------------
IP=""
if command -v ipconfig >/dev/null 2>&1; then
  for ifc in en0 en1 en2; do IP="$(ipconfig getifaddr "$ifc" 2>/dev/null)"; [ -n "$IP" ] && break; done
fi
[ -z "$IP" ] && IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
[ -z "$IP" ] && hata "Wi-Fi adresi bulunamadı. Mac'in Wi-Fi'ye bağlı olduğundan emin olun."
renk 32 "✓ Mac'in ağ adresi: $IP"

# --- Temizlik: çıkışta her şeyi kapat -------------------------------------------
PIDS=()
kapat() {
  echo; renk 33 "Kapatılıyor..."
  for p in "${PIDS[@]:-}"; do [ -n "$p" ] && kill "$p" 2>/dev/null; done
  sleep 2
  exit 0
}
trap kapat INT TERM

# --- 1. Veritabanı ------------------------------------------------------------------
adim "1/4 Yerel veritabanı hazırlanıyor"
cd "$ROOT/yerel-onizleme" || exit 1
if [ "${1:-}" = "--sifirla" ]; then
  rm -rf .veri && renk 33 "Yerel veriler silindi."
fi
[ -d node_modules/embedded-postgres ] || npm install --no-audit --no-fund >"$LOG/db-kurulum.log" 2>&1 \
  || hata "Veritabanı paketi kurulamadı. Ayrıntı: yerel-onizleme/kayitlar/db-kurulum.log"
node db.mjs >"$LOG/veritabani.log" 2>&1 &
PIDS+=($!)
for _ in $(seq 1 60); do grep -q HAZIR "$LOG/veritabani.log" 2>/dev/null && break; sleep 1; done
grep -q HAZIR "$LOG/veritabani.log" || hata "Veritabanı başlamadı. Ayrıntı: yerel-onizleme/kayitlar/veritabani.log"
renk 32 "✓ Veritabanı çalışıyor"

# --- 2. Sunucu ----------------------------------------------------------------------
adim "2/4 Sunucu hazırlanıyor (ilk seferde birkaç dakika sürebilir)"
cd "$ROOT/nodejs_space" || exit 1
if [ ! -f .env ]; then
  {
    echo "DATABASE_URL=postgresql://drinks:yerel@localhost:5433/drinks_yerel"
    echo "JWT_SECRET=$(node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))')"
    echo "PORT=3000"
  } > .env
  renk 32 "✓ Yerel ayar dosyası (.env) oluşturuldu"
fi
"${YARN[@]}" install >"$LOG/sunucu-kurulum.log" 2>&1 || hata "Sunucu paketleri kurulamadı. Ayrıntı: yerel-onizleme/kayitlar/sunucu-kurulum.log"
npx prisma generate >>"$LOG/sunucu-kurulum.log" 2>&1 || hata "Veritabanı istemcisi üretilemedi. Ayrıntı: yerel-onizleme/kayitlar/sunucu-kurulum.log"
npx prisma db push --skip-generate >>"$LOG/sunucu-kurulum.log" 2>&1 || hata "Tablolar oluşturulamadı. Ayrıntı: yerel-onizleme/kayitlar/sunucu-kurulum.log"
npx prisma db seed >>"$LOG/sunucu-kurulum.log" 2>&1 || true
"${YARN[@]}" build >>"$LOG/sunucu-kurulum.log" 2>&1 || hata "Sunucu derlenemedi. Ayrıntı: yerel-onizleme/kayitlar/sunucu-kurulum.log"

adim "3/4 Sunucu başlatılıyor"
node dist/src/main.js >"$LOG/sunucu.log" 2>&1 &
PIDS+=($!)
for _ in $(seq 1 30); do curl -s -o /dev/null "http://localhost:3000/api-docs" && break; sleep 1; done
curl -s -o /dev/null "http://localhost:3000/api-docs" || hata "Sunucu başlamadı. Ayrıntı: yerel-onizleme/kayitlar/sunucu.log"
renk 32 "✓ Sunucu çalışıyor: http://$IP:3000"

# --- 3. Mobil uygulama ---------------------------------------------------------------
adim "4/4 Mobil uygulama hazırlanıyor"
cd "$ROOT/react_native_space" || exit 1
"${YARN[@]}" install >"$LOG/uygulama-kurulum.log" 2>&1 || hata "Uygulama paketleri kurulamadı. Ayrıntı: yerel-onizleme/kayitlar/uygulama-kurulum.log"

echo
renk 36 "════════════════════════════════════════════════════════════════"
renk 36 " iPhone'da açmak için:"
echo "   1. iPhone, Mac ile AYNI Wi-Fi ağında olsun"
echo "   2. App Store'dan 'Expo Go' uygulamasını indirin"
echo "   3. Birazdan çıkacak QR kodu iPhone KAMERASIYLA okutun"
echo "   4. 'Yerel ağ erişimi' sorulursa İzin Ver deyin"
echo
renk 36 " Mac'te tarayıcıda görmek için: QR çıkınca klavyede  w  tuşuna basın"
renk 36 " Durdurmak için: Ctrl + C"
renk 36 "════════════════════════════════════════════════════════════════"
echo

EXPO_PUBLIC_API_URL="http://$IP:3000" npx expo start --lan
kapat
