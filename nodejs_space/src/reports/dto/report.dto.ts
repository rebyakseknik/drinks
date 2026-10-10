import { ApiProperty } from '@nestjs/swagger';

export class RevenueItemDto {
  @ApiProperty() date: Date;
  @ApiProperty() netCashKurus: number;
  @ApiProperty() netCardKurus: number;
  @ApiProperty() totalRevenueKurus: number;
}

export class RevenueReportDto {
  @ApiProperty({ type: () => [RevenueItemDto] }) items: RevenueItemDto[];
}

export class DispatchLineDto {
  @ApiProperty() productName: string;
  @ApiProperty() quantity: number;
  @ApiProperty() baseUnit: string;
}

export class DispatchItemDto {
  @ApiProperty() documentId: string;
  @ApiProperty() documentDate: Date;
  @ApiProperty() createdByName: string;
  @ApiProperty({ type: () => [DispatchLineDto] }) lines: DispatchLineDto[];
}

export class DispatchReportDto {
  @ApiProperty({ type: () => [DispatchItemDto] }) items: DispatchItemDto[];
}

export class TopDispatchedItemDto {
  @ApiProperty() productId: string;
  @ApiProperty() productName: string;
  @ApiProperty() baseUnit: string;
  @ApiProperty() totalDispatched: number;
}

export class TopDispatchedReportDto {
  @ApiProperty({ type: () => [TopDispatchedItemDto] }) items: TopDispatchedItemDto[];
}
