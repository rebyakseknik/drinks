import { ApiProperty } from '@nestjs/swagger';

export class WarehouseStockItemDto {
  @ApiProperty() productId: string;
  @ApiProperty() productName: string;
  @ApiProperty() category: string;
  @ApiProperty() baseUnit: string;
  @ApiProperty() currentStock: number;
  @ApiProperty() minStockThreshold: number;
  @ApiProperty() isBelowThreshold: boolean;
  @ApiProperty() hasInitialStock: boolean;
  /** Ürünün koli/paket birimi (en büyük katsayılı güncel dönüşüm). Tanımlı değilse null. */
  @ApiProperty({ nullable: true, type: String }) packageName: string | null;
  @ApiProperty({ nullable: true, type: Number }) packageFactor: number | null;
}

export class WarehouseStockListDto {
  @ApiProperty({ type: () => [WarehouseStockItemDto] }) items: WarehouseStockItemDto[];
}
