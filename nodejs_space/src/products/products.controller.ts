import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, ParseBoolPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import {
  CreateProductDto, UpdateProductDto, CreateConversionDto, UpdateConversionDto, SetInitialStockDto,
  ProductResponseDto, ProductDetailResponseDto, ProductListResponseDto,
  ConversionResponseDto, ConversionListResponseDto, InitialStockResponseDto,
} from './dto/product.dto';

@Controller('api/products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('active', new ParseBoolPipe({ optional: true })) active?: boolean,
  ): Promise<ProductListResponseDto> {
    return this.productsService.findAll(search, category, active);
  }

  @Post()
  async create(
    @Body() dto: CreateProductDto,
    @CurrentUser() user: { id: string },
  ): Promise<ProductResponseDto> {
    return this.productsService.create(dto, user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductDetailResponseDto> {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: { id: string },
  ): Promise<ProductResponseDto> {
    return this.productsService.update(id, dto, user.id);
  }

  @Get(':id/conversions')
  async getConversions(@Param('id') id: string): Promise<ConversionListResponseDto> {
    return this.productsService.getConversions(id);
  }

  @Post(':id/conversions')
  async createConversion(
    @Param('id') id: string,
    @Body() dto: CreateConversionDto,
    @CurrentUser() user: { id: string },
  ): Promise<ConversionResponseDto> {
    return this.productsService.createConversion(id, dto, user.id);
  }

  @Put(':id/conversions/:conversionId')
  async updateConversion(
    @Param('id') id: string,
    @Param('conversionId') conversionId: string,
    @Body() dto: UpdateConversionDto,
    @CurrentUser() user: { id: string },
  ): Promise<ConversionResponseDto> {
    return this.productsService.updateConversion(id, conversionId, dto, user.id);
  }

  @Post(':id/initial-stock')
  async setInitialStock(
    @Param('id') id: string,
    @Body() dto: SetInitialStockDto,
    @CurrentUser() user: { id: string },
  ): Promise<InitialStockResponseDto> {
    return this.productsService.setInitialStock(id, dto, user.id);
  }
}
