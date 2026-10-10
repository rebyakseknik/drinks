import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @IsString() @IsEnum(['owner', 'manager']) role: string;
}

export class UserItemDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() email: string;
  @ApiProperty() role: string;
  @ApiProperty() createdAt: Date;
}

export class UserListResponseDto {
  @ApiProperty({ type: () => [UserItemDto] }) items: UserItemDto[];
}

export class UserRoleResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() email: string;
  @ApiProperty() role: string;
}

export class DeleteResponseDto {
  @ApiProperty() success: boolean;
}
