/**
 * Drinks Yönetim — uçtan uca iş kuralı testleri.
 *
 * ⚠️ Bu testler veritabanını TAMAMEN SİLER. Bu yüzden yalnızca adı "test" içeren bir
 * veritabanında çalışır; başka bir veritabanına bağlanırsa hiçbir şey yapmadan durur.
 *
 * Çalıştırma: DATABASE_URL=postgresql://.../drinks_test JWT_SECRET=... yarn test:e2e
 */
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { PrismaService } from '../src/prisma/prisma.service';
import { addDays, istanbulDay } from '../src/common/dates';

const dbName = (() => {
  try {
    return new URL(process.env.DATABASE_URL ?? '').pathname.replace(/^\//, '');
  } catch {
    return '';
  }
})();
if (!/test/i.test(dbName)) {
  throw new Error(
    `GÜVENLİK: Testler veritabanını siler. Veritabanı adı "test" içermiyor ("${dbName}"). Durduruldu.`,
  );
}

let app: INestApplication;
let prisma: PrismaService;
let OWNER = '';
let MANAGER = '';
let managerId = '';

const http = () => request(app.getHttpServer());
const auth = (t: string) => ({ Authorization: `Bearer ${t}` });
const now = () => new Date().toISOString();

async function stockOf(productId: string, token = OWNER): Promise<number> {
  const r = await http()
    .get('/api/warehouse-stock')
    .set(auth(token))
    .expect(200);
  const item = r.body.items.find(
    (i: { productId: string }) => i.productId === productId,
  );
  return item.currentStock;
}

function movement(
  token: string,
  type: string,
  productId: string,
  qty: number,
  opts: {
    key?: string;
    pkg?: string;
    factor?: number;
    reason?: string;
    date?: string;
  } = {},
) {
  return http()
    .post('/api/movements')
    .set(auth(token))
    .send({
      idempotencyKey: opts.key ?? randomUUID(),
      documentDate: opts.date ?? now(),
      type,
      lines: [
        {
          productId,
          packageName: opts.pkg ?? 'adet',
          packageQuantity: qty,
          conversionFactorUsed: opts.factor ?? 1,
          reason: opts.reason,
        },
      ],
    });
}

async function newProduct(
  name: string,
  initial: number | null,
  baseUnit = 'adet',
): Promise<string> {
  const r = await http()
    .post('/api/products')
    .set(auth(OWNER))
    .send({ name, category: 'Test', baseUnit, minStockThreshold: 5 })
    .expect(201);
  if (initial !== null) {
    await http()
      .post(`/api/products/${r.body.id}/initial-stock`)
      .set(auth(OWNER))
      .send({
        count: initial,
        date: new Date(Date.now() - 60_000).toISOString(),
      })
      .expect(201);
  }
  return r.body.id;
}

beforeAll(async () => {
  const mod = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  app = mod.createNestApplication();
  configureApp(app);
  await app.init();
  prisma = app.get(PrismaService);
  await prisma.$executeRawUnsafe(
    'TRUNCATE users, invite_codes, products, package_conversions, movement_documents, movement_lines, daily_closings, business_settings, audit_logs, staff, shifts, expenses, shift_templates CASCADE',
  );
  // Abacus veritabanlarında bulunan eski gizli hesabı taklit et
  await prisma.user.create({
    data: {
      email: 'abacus-2add5a5c@example.com',
      password: await bcrypt.hash('eski-sifre-123', 4),
      name: 'Test Admin',
      role: 'owner',
    },
  });
});

afterAll(async () => {
  await app.close();
});

describe('Eski Abacus gizli hesabı', () => {
  it('bu hesapla giriş yapılamaz', async () => {
    await http()
      .post('/api/auth/login')
      .send({
        email: 'abacus-2add5a5c@example.com',
        password: 'eski-sifre-123',
      })
      .expect(401);
  });
});

describe('Kayıt ve yetkiler', () => {
  it('ilk kullanıcı davetsiz kaydolur ve Sahip olur', async () => {
    const r = await http()
      .post('/api/signup')
      .send({
        name: 'Sahip',
        email: 'Sahip@Test.local ',
        password: 'Test12345',
      })
      .expect(201);
    // Eski gizli hesap veritabanında olsa bile ilk gerçek kullanıcı Sahip olur
    expect(r.body.user.role).toBe('owner');
    expect(r.body.user.email).toBe('sahip@test.local');
    const users = await http()
      .get('/api/users')
      .set(auth(r.body.token))
      .expect(200);
    expect(users.body.items.map((u: { email: string }) => u.email)).toEqual([
      'sahip@test.local',
    ]);
    OWNER = r.body.token;
  });

  it('ikinci kullanıcı davet kodu olmadan reddedilir', async () => {
    await http()
      .post('/api/signup')
      .send({ name: 'X', email: 'x@test.local', password: 'Test12345' })
      .expect(403);
  });

  it('davet koduyla kayıt Yönetici yapar, kod ikinci kez kullanılamaz', async () => {
    const inv = await http().post('/api/invites').set(auth(OWNER)).expect(201);
    const r = await http()
      .post('/api/signup')
      .send({
        name: 'Yönetici',
        email: 'yon@test.local',
        password: 'Test12345',
        inviteCode: inv.body.code.toLowerCase(),
      })
      .expect(201);
    expect(r.body.user.role).toBe('manager');
    MANAGER = r.body.token;
    managerId = r.body.user.id;
    await http()
      .post('/api/signup')
      .send({
        name: 'Y2',
        email: 'y2@test.local',
        password: 'Test12345',
        inviteCode: inv.body.code,
      })
      .expect(400);
  });

  it('büyük/küçük harf farkıyla aynı e-posta tekrar kaydedilemez, giriş harf duyarsızdır', async () => {
    await http()
      .post('/api/auth/login')
      .send({ email: 'SAHIP@test.local', password: 'Test12345' })
      .expect(201);
  });

  it('yönetici kullanıcı ve davet yönetimine erişemez (403)', async () => {
    await http().get('/api/users').set(auth(MANAGER)).expect(403);
    await http().get('/api/invites').set(auth(MANAGER)).expect(403);
    await http().post('/api/invites').set(auth(MANAGER)).expect(403);
  });

  it('girişsiz istek reddedilir (401)', async () => {
    await http().get('/api/products').expect(401);
  });

  it('olmayan kullanıcı için anlaşılır hata (404)', async () => {
    await http()
      .put(`/api/users/${randomUUID()}/role`)
      .set(auth(OWNER))
      .send({ role: 'manager' })
      .expect(404);
    await http()
      .delete(`/api/users/${randomUUID()}`)
      .set(auth(OWNER))
      .expect(404);
  });

  it('rol değişikliği eski oturumda da hemen geçerli olur', async () => {
    await http()
      .put(`/api/users/${managerId}/role`)
      .send({ role: 'owner' })
      .set(auth(OWNER))
      .expect(200);
    await http().get('/api/users').set(auth(MANAGER)).expect(200);
    await http()
      .put(`/api/users/${managerId}/role`)
      .send({ role: 'manager' })
      .set(auth(OWNER))
      .expect(200);
    await http().get('/api/users').set(auth(MANAGER)).expect(403);
  });
});

describe('Ortak veri ve başlangıç sayımı', () => {
  let P = '';

  it('sahibin eklediği ürünü yönetici görür', async () => {
    P = await newProduct('Su 0,5L', null);
    const r = await http().get('/api/products').set(auth(MANAGER)).expect(200);
    expect(r.body.items.some((i: { id: string }) => i.id === P)).toBe(true);
  });

  it('başlangıç sayımı girilmemiş ürün "girilmedi" işaretlidir ve düşük stok uyarısı vermez', async () => {
    const r = await http()
      .get('/api/warehouse-stock')
      .set(auth(OWNER))
      .expect(200);
    const item = r.body.items.find(
      (i: { productId: string }) => i.productId === P,
    );
    expect(item.hasInitialStock).toBe(false);
    expect(item.isBelowThreshold).toBe(false);
  });

  it('başlangıç sayımı olmadan hiçbir hareket girilemez (mal kabul dahil)', async () => {
    const r1 = await movement(OWNER, 'mal_kabul', P, 24).expect(422);
    expect(r1.body.message).toMatch(/başlangıç stoğu/i);
    await movement(OWNER, 'sevkiyat', P, 1).expect(422);
  });

  it('başlangıç sayımı bir kez girilir, ikincisi reddedilir', async () => {
    await http()
      .post(`/api/products/${P}/initial-stock`)
      .set(auth(OWNER))
      .send({ count: 100, date: new Date(Date.now() - 60_000).toISOString() })
      .expect(201);
    await http()
      .post(`/api/products/${P}/initial-stock`)
      .set(auth(MANAGER))
      .send({ count: 50, date: now() })
      .expect(409);
    expect(await stockOf(P, MANAGER)).toBe(100);
  });

  it('sayım tarihinden önceye hareket girilemez', async () => {
    await movement(OWNER, 'mal_kabul', P, 1, {
      date: new Date(Date.now() - 86400_000).toISOString(),
    }).expect(422);
  });

  it('ileri tarihli başlangıç sayımı ve hareket reddedilir', async () => {
    const X = await newProduct('İleri Tarih', null);
    await http()
      .post(`/api/products/${X}/initial-stock`)
      .set(auth(OWNER))
      .send({ count: 1, date: new Date(Date.now() + 86400_000).toISOString() })
      .expect(400);
    await movement(OWNER, 'mal_kabul', P, 1, {
      date: new Date(Date.now() + 86400_000).toISOString(),
    }).expect(400);
  });
});

describe('Paket dönüşümleri', () => {
  let P = '';
  beforeAll(async () => {
    P = await newProduct('Kola', 0);
    await http()
      .post(`/api/products/${P}/conversions`)
      .set(auth(OWNER))
      .send({
        packageName: 'Koli',
        conversionFactor: 24,
        effectiveFrom: new Date(Date.now() - 1000).toISOString(),
      })
      .expect(201);
  });

  it('2 koli × 24 = 48 adet eklenir; paket adı harf duyarsızdır', async () => {
    await movement(OWNER, 'mal_kabul', P, 2, {
      pkg: 'koli',
      factor: 24,
    }).expect(201);
    expect(await stockOf(P)).toBe(48);
  });

  it('tanımlı olmayan katsayı reddedilir, stok değişmez', async () => {
    await movement(OWNER, 'mal_kabul', P, 1, {
      pkg: 'Koli',
      factor: 999,
    }).expect(400);
    expect(await stockOf(P)).toBe(48);
  });

  it('tanımlı olmayan paket adı reddedilir', async () => {
    await movement(OWNER, 'mal_kabul', P, 1, {
      pkg: 'Kasa',
      factor: 12,
    }).expect(400);
  });

  it('adet cinsinden kesirli miktar reddedilir; tam adete denk gelen kesirli koli kabul edilir', async () => {
    await movement(OWNER, 'mal_kabul', P, 0.5).expect(400);
    await movement(OWNER, 'mal_kabul', P, 0.5, {
      pkg: 'Koli',
      factor: 24,
    }).expect(201); // 12 adet
    expect(await stockOf(P)).toBe(60);
  });

  it('paket adı temel birimle aynı olamaz', async () => {
    await http()
      .post(`/api/products/${P}/conversions`)
      .set(auth(OWNER))
      .send({ packageName: 'adet', conversionFactor: 6, effectiveFrom: now() })
      .expect(400);
  });
});

describe('Negatif stok', () => {
  let P = '';
  beforeAll(async () => {
    P = await newProduct('Ayran', 10);
  });

  it('stoktan fazla sevkiyat ve fire engellenir', async () => {
    await movement(MANAGER, 'sevkiyat', P, 11).expect(422);
    await movement(MANAGER, 'fire_hasar', P, 11).expect(422);
    await movement(MANAGER, 'sevkiyat', P, 10).expect(201);
    expect(await stockOf(P)).toBe(0);
  });

  it('aynı belgede aynı ürün iki satırda olursa toplamı kontrol edilir', async () => {
    await movement(OWNER, 'mal_kabul', P, 5).expect(201);
    const r = await http()
      .post('/api/movements')
      .set(auth(OWNER))
      .send({
        idempotencyKey: randomUUID(),
        documentDate: now(),
        type: 'sevkiyat',
        lines: [
          {
            productId: P,
            packageName: 'adet',
            packageQuantity: 3,
            conversionFactorUsed: 1,
          },
          {
            productId: P,
            packageName: 'adet',
            packageQuantity: 3,
            conversionFactorUsed: 1,
          },
        ],
      });
    expect(r.status).toBe(422);
    expect(await stockOf(P)).toBe(5);
  });

  it('iki telefondan aynı anda yapılan sevkiyatlar stoğu eksiye düşürmez', async () => {
    await movement(OWNER, 'mal_kabul', P, 95).expect(201); // stok 100
    const results = await Promise.all([
      movement(OWNER, 'sevkiyat', P, 60),
      movement(MANAGER, 'sevkiyat', P, 60),
      movement(OWNER, 'sevkiyat', P, 60),
    ]);
    const codes = results.map((r) => r.status).sort();
    expect(codes).toEqual([201, 422, 422]);
    expect(await stockOf(P)).toBe(40);
  });
});

describe('Sayım düzeltmesi', () => {
  let P = '';
  beforeAll(async () => {
    P = await newProduct('Çay', 1000, 'gram');
  });

  it('sebep zorunludur', async () => {
    await movement(OWNER, 'sayim_duzeltmesi', P, -5).expect(400);
    await movement(OWNER, 'sayim_duzeltmesi', P, -5, { reason: '   ' }).expect(
      400,
    );
  });

  it('stok artırılabilir ve azaltılabilir', async () => {
    await movement(OWNER, 'sayim_duzeltmesi', P, 20, {
      reason: 'Sayımda fazla çıktı',
      pkg: 'gram',
    }).expect(201);
    await movement(OWNER, 'sayim_duzeltmesi', P, -50, {
      reason: 'Sayımda eksik',
      pkg: 'gram',
    }).expect(201);
    expect(await stockOf(P)).toBe(970);
  });

  it('sayım düzeltmesi stoğu eksiye düşüremez', async () => {
    await movement(OWNER, 'sayim_duzeltmesi', P, -971, {
      reason: 'x',
      pkg: 'gram',
    }).expect(422);
  });

  it('sayım dışındaki tiplerde eksi miktar reddedilir', async () => {
    await movement(OWNER, 'mal_kabul', P, -5, { pkg: 'gram' }).expect(400);
  });
});

describe('Hareket iptali (ters kayıt)', () => {
  let P = '';
  const from = addDays(istanbulDay(), -1);
  const to = istanbulDay();
  beforeAll(async () => {
    P = await newProduct('Soda', 100);
  });

  it('mal kabul iptali stoğu tam olarak eski haline döndürür', async () => {
    const r = await movement(OWNER, 'mal_kabul', P, 10).expect(201);
    expect(await stockOf(P)).toBe(110);
    const rev = await http()
      .post(`/api/movements/${r.body.id}/reverse`)
      .set(auth(MANAGER))
      .send({})
      .expect(201);
    expect(rev.body.reversalDocument.reversalOfId).toBe(r.body.id);
    expect(await stockOf(P)).toBe(100);
  });

  it('sevkiyat iptali stoğu geri ekler ve raporlardan düşer', async () => {
    const before = await http()
      .get(`/api/reports/top-dispatched?from=${from}&to=${to}`)
      .set(auth(OWNER))
      .expect(200);
    const b =
      before.body.items.find((i: { productId: string }) => i.productId === P)
        ?.totalDispatched ?? 0;
    const r = await movement(OWNER, 'sevkiyat', P, 7).expect(201);
    expect(await stockOf(P)).toBe(93);
    await http()
      .post(`/api/movements/${r.body.id}/reverse`)
      .set(auth(OWNER))
      .send({})
      .expect(201);
    expect(await stockOf(P)).toBe(100);
    const after = await http()
      .get(`/api/reports/top-dispatched?from=${from}&to=${to}`)
      .set(auth(OWNER))
      .expect(200);
    const a =
      after.body.items.find((i: { productId: string }) => i.productId === P)
        ?.totalDispatched ?? 0;
    expect(a).toBe(b);
    const disp = await http()
      .get(`/api/reports/dispatches?from=${from}&to=${to}`)
      .set(auth(OWNER))
      .expect(200);
    expect(
      disp.body.items.some(
        (d: { documentId: string }) => d.documentId === r.body.id,
      ),
    ).toBe(false);
  });

  it('aynı belge iki kez iptal edilemez; eşzamanlı iki iptalden biri kabul edilir', async () => {
    const r = await movement(OWNER, 'mal_kabul', P, 5).expect(201);
    const both = await Promise.all([
      http()
        .post(`/api/movements/${r.body.id}/reverse`)
        .set(auth(OWNER))
        .send({}),
      http()
        .post(`/api/movements/${r.body.id}/reverse`)
        .set(auth(MANAGER))
        .send({}),
    ]);
    expect(both.map((x) => x.status).sort()).toEqual([201, 409]);
    expect(await stockOf(P)).toBe(100);
  });

  it('iptal kaydının kendisi iptal edilemez', async () => {
    const r = await movement(OWNER, 'mal_kabul', P, 5).expect(201);
    const rev = await http()
      .post(`/api/movements/${r.body.id}/reverse`)
      .set(auth(OWNER))
      .send({})
      .expect(201);
    await http()
      .post(`/api/movements/${rev.body.reversalDocument.id}/reverse`)
      .set(auth(OWNER))
      .send({})
      .expect(409);
    expect(await stockOf(P)).toBe(100);
  });

  it('sevk edilmiş malın kabulü iptal edilemez (stok eksiye düşmez)', async () => {
    const C = await newProduct('Limonata', 0);
    const mk = await movement(OWNER, 'mal_kabul', C, 30).expect(201);
    await movement(OWNER, 'sevkiyat', C, 25).expect(201);
    await http()
      .post(`/api/movements/${mk.body.id}/reverse`)
      .set(auth(OWNER))
      .send({})
      .expect(422);
    expect(await stockOf(C)).toBe(5);
  });
});

describe('Çift kayıt koruması', () => {
  let P = '';
  beforeAll(async () => {
    P = await newProduct('Meyve Suyu', 0);
  });

  it('aynı anahtarla tekrar gönderilen belge ikinci kez kaydedilmez', async () => {
    const key = randomUUID();
    const a = await movement(OWNER, 'mal_kabul', P, 3, { key }).expect(201);
    const b = await movement(OWNER, 'mal_kabul', P, 3, { key }).expect(201);
    expect(b.body.id).toBe(a.body.id);
    expect(await stockOf(P)).toBe(3);
  });

  it('aynı anahtarla aynı anda gelen iki istek tek kayıt oluşturur ve ikisi de başarılı yanıt alır', async () => {
    const key = randomUUID();
    const rs = await Promise.all([
      movement(OWNER, 'mal_kabul', P, 3, { key }),
      movement(MANAGER, 'mal_kabul', P, 3, { key }),
    ]);
    expect(rs.map((r) => r.status)).toEqual([201, 201]);
    expect(rs[0].body.id).toBe(rs[1].body.id);
    expect(await stockOf(P)).toBe(6);
  });
});

describe('Günlük kapanış', () => {
  const today = istanbulDay();
  const yesterday = addDays(today, -1);
  let closingId = '';
  let version = 0;

  it('kapanış kaydedilir; toplam = nakit + kart', async () => {
    const r = await http()
      .post('/api/closings')
      .set(auth(OWNER))
      .send({ businessDate: today, netCashKurus: 150000, netCardKurus: 250050 })
      .expect(201);
    expect(r.body.totalRevenueKurus).toBe(400050);
    expect(String(r.body.businessDate).slice(0, 10)).toBe(today);
    closingId = r.body.id;
    version = r.body.version;
  });

  it('aynı güne ikinci kapanış reddedilir; yönetici bugünkü kapanışı görür', async () => {
    await http()
      .post('/api/closings')
      .set(auth(MANAGER))
      .send({ businessDate: today, netCashKurus: 1, netCardKurus: 1 })
      .expect(409);
    const t = await http()
      .get('/api/closings/today')
      .set(auth(MANAGER))
      .expect(200);
    expect(t.body.closing.id).toBe(closingId);
  });

  it('aynı gün için aynı anda iki kapanış: biri kabul, diğeri anlaşılır hata (409)', async () => {
    const rs = await Promise.all([
      http()
        .post('/api/closings')
        .set(auth(OWNER))
        .send({ businessDate: yesterday, netCashKurus: 1, netCardKurus: 1 }),
      http()
        .post('/api/closings')
        .set(auth(MANAGER))
        .send({ businessDate: yesterday, netCashKurus: 2, netCardKurus: 2 }),
    ]);
    expect(rs.map((r) => r.status).sort()).toEqual([201, 409]);
  });

  it('saat dilimi: İstanbul 00:30 doğru güne yazılır; eski uygulamanın gönderdiği biçim de doğru güne düşer', async () => {
    const a = await http()
      .post('/api/closings')
      .set(auth(OWNER))
      .send({
        businessDate: '2026-01-15T00:30:00+03:00',
        netCashKurus: 100,
        netCardKurus: 0,
      })
      .expect(201);
    expect(String(a.body.businessDate).slice(0, 10)).toBe('2026-01-15');
    const b = await http()
      .post('/api/closings')
      .set(auth(OWNER))
      .send({
        businessDate: '2026-01-16T00:00:00.000Z',
        netCashKurus: 100,
        netCardKurus: 0,
      })
      .expect(201);
    expect(String(b.body.businessDate).slice(0, 10)).toBe('2026-01-16');
  });

  it('ileri tarihli kapanış reddedilir', async () => {
    await http()
      .post('/api/closings')
      .set(auth(OWNER))
      .send({
        businessDate: addDays(today, 1),
        netCashKurus: 1,
        netCardKurus: 1,
      })
      .expect(400);
  });

  it('eşzamanlı iki düzeltmeden yalnızca biri kaydedilir', async () => {
    const rs = await Promise.all([
      http()
        .put(`/api/closings/${closingId}`)
        .set(auth(OWNER))
        .send({ netCashKurus: 1000, version }),
      http()
        .put(`/api/closings/${closingId}`)
        .set(auth(MANAGER))
        .send({ netCashKurus: 2000, version }),
    ]);
    expect(rs.map((r) => r.status).sort()).toEqual([200, 409]);
    const c = await http()
      .get(`/api/closings/${closingId}`)
      .set(auth(OWNER))
      .expect(200);
    expect(c.body.version).toBe(version + 1);
    expect(c.body.totalRevenueKurus).toBe(c.body.netCashKurus + 250050);
  });

  it('aylık özet ve ciro raporu doğru toplar; CSV boş günleri "Kapanış girilmedi" olarak yazar', async () => {
    const rep = await http()
      .get(`/api/reports/revenue?from=${yesterday}&to=${today}`)
      .set(auth(OWNER))
      .expect(200);
    expect(rep.body.items).toHaveLength(2);
    const csv = await http()
      .get(
        `/api/reports/export?type=revenue&from=${addDays(today, -3)}&to=${today}`,
      )
      .set(auth(OWNER))
      .expect(200);
    expect(csv.text).toContain('Kapanış girilmedi');
  });

  it('rapor tarihleri eksik veya hatalıysa 500 yerine 400 döner', async () => {
    await http().get('/api/reports/revenue').set(auth(OWNER)).expect(400);
    await http()
      .get('/api/reports/dispatches?from=abc&to=def')
      .set(auth(OWNER))
      .expect(400);
    await http()
      .get(`/api/reports/export?type=x&from=${today}&to=${today}`)
      .set(auth(OWNER))
      .expect(400);
  });
});

describe('Silinen kullanıcı', () => {
  it('silinen kullanıcının oturumu anında geçersiz olur', async () => {
    await http().delete(`/api/users/${managerId}`).set(auth(OWNER)).expect(200);
    await http().get('/api/products').set(auth(MANAGER)).expect(401);
    const P = await newProduct('Son Ürün', 5);
    await movement(MANAGER, 'mal_kabul', P, 1).expect(401);
  });

  it('son sahip kendini silemez', async () => {
    const me = await http().get('/api/auth/me').set(auth(OWNER)).expect(200);
    await http()
      .delete(`/api/users/${me.body.user.id}`)
      .set(auth(OWNER))
      .expect(403);
  });
});

describe('Sayım koruması (beklenen stok)', () => {
  let P = '';
  beforeAll(async () => {
    P = await newProduct('Türk Kahvesi 2', 2000, 'gram');
  });

  it('ekrandaki stok güncelse sayım kaydedilir: 2000 g → sayımda 1850 g', async () => {
    const r = await http()
      .post('/api/movements')
      .set(auth(OWNER))
      .send({
        idempotencyKey: randomUUID(),
        documentDate: now(),
        type: 'sayim_duzeltmesi',
        lines: [
          {
            productId: P,
            packageName: 'gram',
            packageQuantity: -150,
            conversionFactorUsed: 1,
            reason: 'Ay sonu sayımı',
            expectedStock: 2000,
          },
        ],
      });
    expect(r.status).toBe(201);
    expect(r.body.lines[0].quantity).toBe(-150);
    expect(await stockOf(P)).toBe(1850);
  });

  it('arada stok değiştiyse sayım reddedilir (409 STOCK_CHANGED), stok değişmez', async () => {
    await movement(OWNER, 'sevkiyat', P, 100, { pkg: 'gram' }).expect(201); // 1750
    const r = await http()
      .post('/api/movements')
      .set(auth(OWNER))
      .send({
        idempotencyKey: randomUUID(),
        documentDate: now(),
        type: 'sayim_duzeltmesi',
        lines: [
          {
            productId: P,
            packageName: 'gram',
            packageQuantity: -50,
            conversionFactorUsed: 1,
            reason: 'Eski ekranla sayım',
            expectedStock: 1850,
          },
        ],
      });
    expect(r.status).toBe(409);
    expect(r.body.code).toBe('STOCK_CHANGED');
    expect(r.body.currentStock).toBe(1750);
    expect(await stockOf(P)).toBe(1750);
  });
});

describe('Stok listesinde koli bilgisi', () => {
  it('koli tanımlı üründe en güncel/büyük paket döner, tanımsızda null', async () => {
    const A = await newProduct('Su Koli Testi', 360);
    const B = await newProduct('Koli Tanımsız', 10);
    await http()
      .post(`/api/products/${A}/conversions`)
      .set(auth(OWNER))
      .send({
        packageName: 'Koli',
        conversionFactor: 24,
        effectiveFrom: new Date(Date.now() - 1000).toISOString(),
      })
      .expect(201);
    await http()
      .post(`/api/products/${A}/conversions`)
      .set(auth(OWNER))
      .send({
        packageName: 'Paket',
        conversionFactor: 6,
        effectiveFrom: new Date(Date.now() - 1000).toISOString(),
      })
      .expect(201);
    const r = await http()
      .get('/api/warehouse-stock')
      .set(auth(OWNER))
      .expect(200);
    const a = r.body.items.find(
      (i: { productId: string }) => i.productId === A,
    );
    const b = r.body.items.find(
      (i: { productId: string }) => i.productId === B,
    );
    expect([a.packageName, a.packageFactor, a.currentStock]).toEqual([
      'Koli',
      24,
      360,
    ]);
    expect([b.packageName, b.packageFactor]).toEqual([null, null]);
  });
});

describe('Personel, vardiya ve gider', () => {
  let ali = '';
  let ayse = '';
  const today = istanbulDay();
  const mon = (() => {
    const d = new Date(`${today}T00:00:00Z`);
    return addDays(today, -((d.getUTCDay() + 6) % 7));
  })();
  const lastMon = addDays(mon, -7);
  const shift = (
    staffId: string,
    businessDate: string,
    startTime: string,
    endTime: string,
  ) =>
    http()
      .post('/api/shifts')
      .set(auth(OWNER))
      .send({ staffId, businessDate, startTime, endTime });

  let MANAGER2 = '';
  beforeAll(async () => {
    // Önceki bölümde yönetici silindiği için yeni bir yönetici açılır
    const inv = await http().post('/api/invites').set(auth(OWNER)).expect(201);
    MANAGER2 = (
      await http()
        .post('/api/signup')
        .send({
          name: 'Yönetici 2',
          email: 'yon2@test.local',
          password: 'Test12345',
          inviteCode: inv.body.code,
        })
        .expect(201)
    ).body.token;
    ali = (
      await http()
        .post('/api/staff')
        .set(auth(OWNER))
        .send({ name: 'Ali' })
        .expect(201)
    ).body.id;
    ayse = (
      await http()
        .post('/api/staff')
        .set(auth(OWNER))
        .send({ name: 'Ayşe' })
        .expect(201)
    ).body.id;
  });

  it('geçersiz takvim günü reddedilir (31 Şubat), başka güne kaymaz', async () => {
    await shift(ali, '2026-02-31', '09:00', '17:00').expect(400);
    await http()
      .post('/api/expenses')
      .set(auth(OWNER))
      .send({ expenseDate: '2026-02-30', category: 'kira', amountKurus: 100 })
      .expect(400);
    await http()
      .post('/api/closings')
      .set(auth(OWNER))
      .send({ businessDate: '2026-02-31', netCashKurus: 1, netCardKurus: 1 })
      .expect(400);
    await http()
      .get('/api/shifts?from=2026-02-30&to=2026-03-05')
      .set(auth(OWNER))
      .expect(400);
  });

  it('aynı kişiye çakışan vardiya engellenir; gece vardiyası ertesi günle de karşılaştırılır', async () => {
    await shift(ali, lastMon, '22:00', '06:00').expect(201);
    const r = await shift(ali, lastMon, '23:00', '02:00');
    expect(r.status).toBe(409);
    expect(r.body.message).toMatch(/Ali/);
    await shift(ali, addDays(lastMon, 1), '05:00', '08:00').expect(409); // ertesi sabah 06:00'ya kadar dolu
    await shift(ali, addDays(lastMon, 1), '06:00', '10:00').expect(201); // tam bitişte başlamak serbest
    await shift(ayse, lastMon, '23:00', '02:00').expect(201); // başka kişi serbest
  });

  it('vardiya düzenlenirken de çakışma kontrol edilir, kendisiyle çakışmaz', async () => {
    const r = await shift(ayse, addDays(lastMon, 2), '10:00', '18:00').expect(
      201,
    );
    await http()
      .put(`/api/shifts/${r.body.id}`)
      .set(auth(OWNER))
      .send({ startTime: '09:00', endTime: '19:00' })
      .expect(200);
    await shift(ayse, addDays(lastMon, 2), '20:00', '23:00').expect(201);
    await http()
      .put(`/api/shifts/${r.body.id}`)
      .set(auth(OWNER))
      .send({ endTime: '21:00' })
      .expect(409);
  });

  it('geçen haftayı kopyala: vardiyalar 7 gün ileri taşınır; ikinci kez basınca çift kayıt olmaz', async () => {
    const before = await http()
      .get(`/api/shifts?from=${lastMon}&to=${addDays(lastMon, 6)}`)
      .set(auth(OWNER))
      .expect(200);
    const n = before.body.items.length;
    expect(n).toBe(5);
    const r1 = await http()
      .post('/api/shifts/copy-week')
      .set(auth(MANAGER2))
      .send({ fromWeekStart: lastMon, toWeekStart: mon })
      .expect(201);
    expect(r1.body).toMatchObject({ created: n, skipped: 0 });
    const after = await http()
      .get(`/api/shifts?from=${mon}&to=${addDays(mon, 6)}`)
      .set(auth(OWNER))
      .expect(200);
    expect(
      after.body.items
        .map(
          (x: { businessDate: string; startTime: string }) =>
            `${x.businessDate} ${x.startTime}`,
        )
        .sort(),
    ).toEqual(
      before.body.items
        .map(
          (x: { businessDate: string; startTime: string }) =>
            `${addDays(x.businessDate, 7)} ${x.startTime}`,
        )
        .sort(),
    );
    const r2 = await http()
      .post('/api/shifts/copy-week')
      .set(auth(OWNER))
      .send({ fromWeekStart: lastMon, toWeekStart: mon })
      .expect(201);
    expect(r2.body).toMatchObject({ created: 0, skipped: n });
  });

  it('pasif personelin vardiyası kopyalanmaz', async () => {
    const bora = (
      await http()
        .post('/api/staff')
        .set(auth(OWNER))
        .send({ name: 'Bora' })
        .expect(201)
    ).body.id;
    const src = addDays(mon, 14);
    await shift(bora, src, '10:00', '18:00').expect(201);
    await http()
      .put(`/api/staff/${bora}`)
      .set(auth(OWNER))
      .send({ active: false })
      .expect(200);
    const r = await http()
      .post('/api/shifts/copy-week')
      .set(auth(OWNER))
      .send({ fromWeekStart: src, toWeekStart: addDays(src, 7) })
      .expect(201);
    expect(r.body.created).toBe(0);
    expect(r.body.skippedReasons[0]).toMatch(/pasif/);
  });

  it('hazır vardiya saatleri: varsayılanlar gelir, değiştirilebilir, silinen geri gelmez', async () => {
    const l1 = await http()
      .get('/api/shift-templates')
      .set(auth(OWNER))
      .expect(200);
    expect(l1.body.items.map((t: { name: string }) => t.name)).toEqual([
      'Sabah',
      'Akşam',
      'Tam gün',
    ]);
    const sabah = l1.body.items[0].id;
    await http()
      .put(`/api/shift-templates/${sabah}`)
      .set(auth(MANAGER2))
      .send({ startTime: '09:30', endTime: '17:30' })
      .expect(200);
    await http()
      .put(`/api/shift-templates/${sabah}`)
      .set(auth(OWNER))
      .send({ startTime: '09:30', endTime: '09:30' })
      .expect(400);
    await http()
      .post('/api/shift-templates')
      .set(auth(OWNER))
      .send({ name: 'Hafta sonu', startTime: '12:00', endTime: '23:00' })
      .expect(201);
    await http()
      .delete(`/api/shift-templates/${l1.body.items[2].id}`)
      .set(auth(OWNER))
      .expect(200);
    const l2 = await http()
      .get('/api/shift-templates')
      .set(auth(OWNER))
      .expect(200);
    expect(
      l2.body.items.map(
        (t: { name: string; startTime: string }) => `${t.name} ${t.startTime}`,
      ),
    ).toEqual(['Sabah 09:30', 'Akşam 16:00', 'Hafta sonu 12:00']);
  });

  it('aynı anahtarla gönderilen gider bir kez kaydedilir (eşzamanlı dahil)', async () => {
    const key = randomUUID();
    const body = {
      expenseDate: today,
      category: 'fatura',
      amountKurus: 123450,
      idempotencyKey: key,
    };
    const rs = await Promise.all([
      http().post('/api/expenses').set(auth(OWNER)).send(body),
      http().post('/api/expenses').set(auth(OWNER)).send(body),
    ]);
    expect(rs.map((r) => r.status)).toEqual([201, 201]);
    expect(rs[0].body.id).toBe(rs[1].body.id);
    const list = await http()
      .get(`/api/expenses?from=${today}&to=${today}`)
      .set(auth(OWNER))
      .expect(200);
    expect(
      list.body.items.filter(
        (e: { amountKurus: number }) => e.amountKurus === 123450,
      ),
    ).toHaveLength(1);
  });

  it('gider özeti: henüz gelmemiş günler "kapanışı yok" sayılmaz', async () => {
    const t = new Date(`${today}T00:00:00Z`);
    const monthStart = `${today.slice(0, 8)}01`;
    const monthEnd = new Date(
      Date.UTC(t.getUTCFullYear(), t.getUTCMonth() + 1, 0),
    )
      .toISOString()
      .slice(0, 10);
    const r = await http()
      .get(`/api/expenses/summary?from=${monthStart}&to=${monthEnd}`)
      .set(auth(OWNER))
      .expect(200);
    expect(r.body.daysInPeriod).toBe(Number(today.slice(8, 10)));
  });
});
