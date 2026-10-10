import { ApiProperty } from '@nestjs/swagger';

export class InviteUsedByDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
}

export class InviteItemDto {
  @ApiProperty() id: string;
  @ApiProperty() code: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() expiresAt: Date;
  @ApiProperty({ nullable: true, type: () => InviteUsedByDto }) usedBy: InviteUsedByDto | null;
  @ApiProperty() isActive: boolean;
}

export class InviteListResponseDto {
  @ApiProperty({ type: () => [InviteItemDto] }) items: InviteItemDto[];
}

export class InviteCreatedResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() code: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() expiresAt: Date;
}

export class InviteDeleteResponseDto {
  @ApiProperty() success: boolean;
}
