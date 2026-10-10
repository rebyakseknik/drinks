import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateBusinessSettingsDto, BusinessSettingsResponseDto } from './dto/settings.dto';

@Controller('api/settings/business')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private prisma: PrismaService) {}

  private async getOrCreate() {
    let settings = await this.prisma.businessSettings.findFirst();
    if (!settings) {
      settings = await this.prisma.businessSettings.create({ data: {} });
    }
    return settings;
  }

  @Get()
  async get(): Promise<BusinessSettingsResponseDto> {
    const s = await this.getOrCreate();
    return { name: s.name, location: s.location };
  }

  @Put()
  async update(@Body() dto: UpdateBusinessSettingsDto): Promise<BusinessSettingsResponseDto> {
    const s = await this.getOrCreate();
    const updated = await this.prisma.businessSettings.update({
      where: { id: s.id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.location !== undefined && { location: dto.location }),
      },
    });
    return { name: updated.name, location: updated.location };
  }
}
