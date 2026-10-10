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
}

export class WarehouseStockListDto {
  @ApiProperty({ type: () => [WarehouseStockItemDto] }) items: WarehouseStockItemDto[];
}
