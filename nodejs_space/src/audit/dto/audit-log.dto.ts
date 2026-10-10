import { ApiProperty } from '@nestjs/swagger';

export class AuditLogItemDto {
  @ApiProperty() id: string;
  @ApiProperty() action: string;
  @ApiProperty() entityType: string;
  @ApiProperty() entityId: string;
  @ApiProperty({ nullable: true }) actorName: string | null;
  @ApiProperty({ nullable: true }) actorId: string | null;
  @ApiProperty({ nullable: true }) details: string | null;
  @ApiProperty() createdAt: Date;
}

export class AuditLogListDto {
  @ApiProperty({ type: () => [AuditLogItemDto] }) items: AuditLogItemDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() totalPages: number;
}
