import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ClosingsService } from './closings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateClosingDto, UpdateClosingDto, ClosingResponseDto, ClosingListResponseDto, TodayClosingResponseDto, ClosingSummaryResponseDto, ClosingComparisonResponseDto } from './dto/closing.dto';

@Controller('api/closings')
@UseGuards(JwtAuthGuard)
export class ClosingsController {
  constructor(private closingsService: ClosingsService) {}

  @Get('today')
  async today(): Promise<TodayClosingResponseDto> {
    return this.closingsService.today();
  }

  @Get('summary')
  async summary(@Query('date') date?: string): Promise<ClosingSummaryResponseDto> {
    return this.closingsService.summary(date);
  }

  @Get('comparison')
  async comparison(): Promise<ClosingComparisonResponseDto> {
    return this.closingsService.comparison();
  }

  @Get()
  async findAll(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<ClosingListResponseDto> {
    return this.closingsService.findAll({ from, to, page, limit });
  }

  @Post()
  async create(
    @Body() dto: CreateClosingDto,
    @CurrentUser() user: { id: string },
  ): Promise<ClosingResponseDto> {
    return this.closingsService.create(dto, user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ClosingResponseDto> {
    return this.closingsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateClosingDto,
    @CurrentUser() user: { id: string },
  ): Promise<ClosingResponseDto> {
    return this.closingsService.update(id, dto, user.id);
  }
}
