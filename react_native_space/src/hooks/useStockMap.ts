import { useMemo } from 'react';
import { useWarehouseControllerGetStock } from '@/src/api/generated/api';
import type { WarehouseStockItemDto } from '@/src/api/generated/schemas';
import type { PackageInfo } from '@/src/utils/quantity';

/** Tüm ürünlerin güncel depo stoğu ve koli bilgisi (tek istek). */
export function useStockMap() {
  const query = useWarehouseControllerGetStock({});
  const map = useMemo(
    () => new Map<string, WarehouseStockItemDto>((query.data?.items ?? []).map((i) => [i.productId, i])),
    [query.data],
  );
  return { query, map, items: query.data?.items ?? [] };
}

export function packageOf(item: WarehouseStockItemDto | undefined | null): PackageInfo | null {
  return item?.packageFactor && item.packageName ? { name: item.packageName, factor: item.packageFactor } : null;
}
