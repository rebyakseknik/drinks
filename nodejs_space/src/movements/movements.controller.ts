import { Controller, Get, Post, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateMovementDto, ReverseMovementDto, MovementDocumentResponseDto, MovementListResponseDto, ReverseMovementResponseDto } from './dto/movement.dto';

@Controller('api/movements')
@UseGuards(JwtAuthGuard)
export class MovementsController {
  constructor(private movementsService: MovementsService) {}

  @Get()
  async findAll(
    @Query('type') type?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('productId') productId?: string,
    @Query('status') status?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<MovementListResponseDto> {
    return this.movementsService.findAll({ type, from, to, productId, status, page, limit });
  }

  @Post()
  async create(
    @Body() dto: CreateMovementDto,
    @CurrentUser() user: { id: string },
  ): Promise<MovementDocumentResponseDto> {
    return this.movementsService.create(dto, user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MovementDocumentResponseDto> {
    return this.movementsService.findOne(id);
  }

  @Post(':id/reverse')
  async reverse(
    @Param('id') id: string,
    @Body() dto: ReverseMovementDto,
    @CurrentUser() user: { id: string },
  ): Promise<ReverseMovementResponseDto> {
    return this.movementsService.reverse(id, dto, user.id);
  }
}
