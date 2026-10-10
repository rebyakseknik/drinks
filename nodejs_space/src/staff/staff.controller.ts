import { Body, Controller, Get, NotFoundException, Param, ParseBoolPipe, Post, Put, Query, UseGuards, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateStaffDto, StaffListResponseDto, StaffResponseDto, UpdateStaffDto } from './dto/staff.dto';

@Controller('api/staff')
@UseGuards(JwtAuthGuard)
export class StaffController {
  private readonly logger = new Logger(StaffController.name);
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  @Get()
  async findAll(
    @Query('includeInactive', new ParseBoolPipe({ optional: true })) includeInactive?: boolean,
  ): Promise<StaffListResponseDto> {
    const items = await this.prisma.staff.findMany({
      where: includeInactive ? {} : { active: true },
      orderBy: [{ active: 'desc' }, { name: 'asc' }],
    });
    return { items };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<StaffResponseDto> {
    const s = await this.prisma.staff.findUnique({ where: { id } });
    if (!s) throw new NotFoundException('Personel bulunamadı');
    return s;
  }

  @Post()
  async create(@Body() dto: CreateStaffDto, @CurrentUser() user: { id: string }): Promise<StaffResponseDto> {
    const s = await this.prisma.staff.create({
      data: {
        name: dto.name.trim(),
        phone: dto.phone?.trim() || null,
        wagePeriod: dto.wagePeriod ?? 'haftalik',
        wageKurus: dto.wageKurus ?? null,
      },
    });
    await this.audit.log({ action: 'staff_created', entityType: 'staff', entityId: s.id, actorId: user.id, details: { name: s.name } });
    this.logger.log(`Personel eklendi: ${s.name}`);
    return s;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateStaffDto, @CurrentUser() user: { id: string }): Promise<StaffResponseDto> {
    const existing = await this.prisma.staff.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Personel bulunamadı');
    const s = await this.prisma.staff.update({
      where: { id },
      data: {
        name: dto.name?.trim(),
        phone: dto.phone === undefined ? undefined : dto.phone?.trim() || null,
        wagePeriod: dto.wagePeriod,
        wageKurus: dto.wageKurus === undefined ? undefined : dto.wageKurus,
        active: dto.active,
      },
    });
    await this.audit.log({ action: 'staff_updated', entityType: 'staff', entityId: s.id, actorId: user.id, details: { ...dto } });
    return s;
  }
}
