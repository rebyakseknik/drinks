import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  CreateShiftTemplateDto,
  DeleteShiftTemplateResponseDto,
  ShiftTemplateListResponseDto,
  ShiftTemplateResponseDto,
  UpdateShiftTemplateDto,
} from './dto/shift.dto';

/** İlk açılışta oluşturulan varsayılan hazır saatler (sonra uygulamadan değiştirilebilir). */
const DEFAULTS = [
  { name: 'Sabah', startTime: '10:00', endTime: '18:00' },
  { name: 'Akşam', startTime: '16:00', endTime: '00:00' },
  { name: 'Tam gün', startTime: '10:00', endTime: '22:00' },
];
const MAX_TEMPLATES = 12;

function toDto(t: {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  sortOrder: number;
}): ShiftTemplateResponseDto {
  return {
    id: t.id,
    name: t.name,
    startTime: t.startTime,
    endTime: t.endTime,
    sortOrder: t.sortOrder,
  };
}

@Controller('api/shift-templates')
@UseGuards(JwtAuthGuard)
export class ShiftTemplatesController {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  @Get()
  async findAll(): Promise<ShiftTemplateListResponseDto> {
    const items = await this.prisma.$transaction(async (tx) => {
      // Varsayılanlar yalnızca bir kez eklenir (iki telefon aynı anda açsa bile)
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext('shift-templates-seed'))`;
      const audit = await tx.auditLog.findFirst({
        where: { action: 'shift_templates_seeded' },
      });
      if (!audit) {
        if ((await tx.shiftTemplate.count()) === 0) {
          await tx.shiftTemplate.createMany({
            data: DEFAULTS.map((d, i) => ({ ...d, sortOrder: i })),
          });
        }
        await tx.auditLog.create({
          data: {
            action: 'shift_templates_seeded',
            entityType: 'shift_template',
            entityId: '-',
          },
        });
      }
      return tx.shiftTemplate.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      });
    });
    return { items: items.map(toDto) };
  }

  @Post()
  async create(
    @Body() dto: CreateShiftTemplateDto,
    @CurrentUser() user: { id: string },
  ): Promise<ShiftTemplateResponseDto> {
    if (dto.startTime === dto.endTime)
      throw new BadRequestException('Başlangıç ve bitiş saati aynı olamaz');
    const count = await this.prisma.shiftTemplate.count();
    if (count >= MAX_TEMPLATES)
      throw new BadRequestException(
        `En fazla ${MAX_TEMPLATES} hazır saat eklenebilir`,
      );
    const last = await this.prisma.shiftTemplate.findFirst({
      orderBy: { sortOrder: 'desc' },
    });
    const t = await this.prisma.shiftTemplate.create({
      data: {
        name: dto.name.trim(),
        startTime: dto.startTime,
        endTime: dto.endTime,
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
    });
    await this.audit.log({
      action: 'shift_template_created',
      entityType: 'shift_template',
      entityId: t.id,
      actorId: user.id,
      details: { ...dto },
    });
    return toDto(t);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateShiftTemplateDto,
    @CurrentUser() user: { id: string },
  ): Promise<ShiftTemplateResponseDto> {
    const existing = await this.prisma.shiftTemplate.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Hazır saat bulunamadı');
    const start = dto.startTime ?? existing.startTime;
    const end = dto.endTime ?? existing.endTime;
    if (start === end)
      throw new BadRequestException('Başlangıç ve bitiş saati aynı olamaz');
    if (dto.name !== undefined && !dto.name.trim())
      throw new BadRequestException('Ad boş olamaz');
    const t = await this.prisma.shiftTemplate.update({
      where: { id },
      data: {
        name: dto.name?.trim(),
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
    });
    // Not: Daha önce girilmiş vardiyalar değişmez; yalnızca bundan sonraki seçimler etkilenir.
    await this.audit.log({
      action: 'shift_template_updated',
      entityType: 'shift_template',
      entityId: id,
      actorId: user.id,
      details: { ...dto },
    });
    return toDto(t);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ): Promise<DeleteShiftTemplateResponseDto> {
    const existing = await this.prisma.shiftTemplate.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Hazır saat bulunamadı');
    await this.prisma.shiftTemplate.delete({ where: { id } });
    await this.audit.log({
      action: 'shift_template_deleted',
      entityType: 'shift_template',
      entityId: id,
      actorId: user.id,
      details: { name: existing.name },
    });
    return { success: true };
  }
}
