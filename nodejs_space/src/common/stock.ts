import { Prisma } from '@prisma/client';

/**
 * Stok kuralları — tek yerde tanımlıdır.
 *
 *   Depo stoğu = başlangıç sayımı + aktif belgelerdeki satır miktarlarının toplamı
 *
 * İptal edilen bir belge "reversed" durumuna alınır ve stoğa katılmaz. İptal için
 * oluşturulan ters kayıt belgesi de denetim izi amacıyla saklanır ve aynı şekilde
 * "reversed" durumundadır; böylece iptal stoğu yalnızca bir kez etkiler.
 */
type Tx = Prisma.TransactionClient;

/** Eşzamanlı işlemlerin aynı ürünün stoğunu aynı anda değiştirmesini engeller. */
export async function lockProducts(
  tx: Tx,
  productIds: string[],
): Promise<void> {
  const ids = [...new Set(productIds)].sort();
  if (ids.length === 0) return;
  await tx.$queryRaw`SELECT id FROM products WHERE id IN (${Prisma.join(ids)}) ORDER BY id FOR UPDATE`;
}

/** Ürünlerin güncel stoğunu hesaplar (transaction içinde, kilitten sonra çağrılmalı). */
export async function currentStocks(
  tx: Tx,
  productIds: string[],
): Promise<Map<string, number>> {
  const ids = [...new Set(productIds)];
  const products = await tx.product.findMany({ where: { id: { in: ids } } });
  const sums = await tx.movementLine.groupBy({
    by: ['productId'],
    where: { productId: { in: ids }, document: { status: 'active' } },
    _sum: { quantity: true },
  });
  const sumMap = new Map(sums.map((s) => [s.productId, s._sum.quantity ?? 0]));
  return new Map(
    products.map((p) => [
      p.id,
      (p.initialCount ?? 0) + (sumMap.get(p.id) ?? 0),
    ]),
  );
}
