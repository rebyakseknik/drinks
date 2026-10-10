import { Controller, Post, Get, Put, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto, ChangePasswordDto, AuthResponseDto, MeResponseDto, ChangePasswordResponseDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto): Promise<AuthResponseDto> {
    return this.authService.signup(dto);
  }

  @Post('auth/login')
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Get('auth/me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: { id: string }): Promise<MeResponseDto> {
    return this.authService.me(user.id);
  }

  @Put('auth/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() user: { id: string },
    @Body() dto: ChangePasswordDto,
  ): Promise<ChangePasswordResponseDto> {
    return this.authService.changePassword(user.id, dto);
  }
}
