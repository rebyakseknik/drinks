// Yerel önizleme veritabanı: bilgisayara PostgreSQL kurmadan, proje klasörünün içinde çalışır.
// Veriler yerel-onizleme/.veri klasöründe durur. YALNIZCA deneme amaçlıdır.
import EmbeddedPostgres from 'embedded-postgres';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(here, '.veri');
const port = Number(process.env.YEREL_DB_PORT || 5433);

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: 'drinks',
  password: 'yerel',
  port,
  persistent: true,
  onLog: () => {},
});

const fresh = !fs.existsSync(path.join(dataDir, 'PG_VERSION'));
if (fresh) await pg.initialise();
await pg.start();
if (fresh) await pg.createDatabase('drinks_yerel');
console.log(`HAZIR: veritabanı ${port} portunda çalışıyor`);

const stop = async () => {
  try { await pg.stop(); } catch {}
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
setInterval(() => {}, 1 << 30);
