import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

const normalizeEmail = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class SignupDto {
  @Transform(normalizeEmail) @IsEmail() @IsNotEmpty() email: string;
  @IsString() @IsNotEmpty() @MinLength(8) password: string;
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsOptional() inviteCode?: string;
}

export class LoginDto {
  @Transform(normalizeEmail) @IsEmail() @IsNotEmpty() email: string;
  @IsString() @IsNotEmpty() password: string;
}

export class ChangePasswordDto {
  @IsString() @IsNotEmpty() currentPassword: string;
  @IsString() @IsNotEmpty() @MinLength(8) newPassword: string;
}

export class UserInfoDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() name: string;
  @ApiProperty() role: string;
  @ApiProperty({ nullable: true }) createdAt?: Date;
}

export class AuthResponseDto {
  @ApiProperty() token: string;
  @ApiProperty({ type: () => UserInfoDto }) user: UserInfoDto;
}

export class MeResponseDto {
  @ApiProperty({ type: () => UserInfoDto }) user: UserInfoDto;
}

export class ChangePasswordResponseDto {
  @ApiProperty() success: boolean;
}
