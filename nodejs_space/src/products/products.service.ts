import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { lockProducts } from '../common/stock';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateProductDto, UpdateProductDto, CreateConversionDto, UpdateConversionDto, SetInitialStockDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async findAll(search?: string, category?: string, active?: boolean) {
    const where: Record<string, unknown> = {};
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (category) where.category = category;
    if (active !== undefined) where.active = active;

    const items = await this.prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
    });
    return { items };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        conversions: { where: { active: true }, orderBy: { effectiveFrom: 'desc' } },
      },
    });
    if (!product) throw new NotFoundException('Ürün bulunamadı');

    return {
      id: product.id,
      name: product.name,
      category: product.category,
      baseUnit: product.baseUnit,
      active: product.active,
      minStockThreshold: product.minStockThreshold,
      initialStock: product.initialCount !== null && product.initialDate
        ? { count: product.initialCount, date: product.initialDate }
        : null,
      conversions: product.conversions.map((c) => ({
        id: c.id,
        productId: c.productId,
        packageName: c.packageName,
        conversionFactor: c.conversionFactor,
        effectiveFrom: c.effectiveFrom,
        active: c.active,
      })),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      createdById: product.createdById,
    };
  }

  async create(dto: CreateProductDto, userId: string) {
    const name = dto.name.trim();
    const existing = await this.prisma.product.findFirst({ where: { name: { equals: name, mode: 'insensitive' } } });
    if (existing) throw new ConflictException('Bu isimde bir ürün zaten mevcut');

    const product = await this.prisma.product.create({
      data: {
        name,
        category: dto.category.trim(),
        baseUnit: dto.baseUnit as 'adet' | 'gram' | 'mililitre',
        minStockThreshold: dto.minStockThreshold ?? 0,
        createdById: userId,
      },
    });

    await this.auditService.log({
      action: 'product_created',
      entityType: 'Product',
      entityId: product.id,
      actorId: userId,
      details: { name: product.name, category: product.category },
    });

    return product;
  }

  async update(id: string, dto: UpdateProductDto, userId: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Ürün bulunamadı');

    if (dto.name !== undefined) dto.name = dto.name.trim();
    if (dto.name === '') throw new BadRequestException('Ürün adı boş olamaz');
    if (dto.name && dto.name !== product.name) {
      const existing = await this.prisma.product.findFirst({
        where: { name: { equals: dto.name, mode: 'insensitive' }, id: { not: id } },
      });
      if (existing) throw new ConflictException('Bu isimde bir ürün zaten mevcut');
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.minStockThreshold !== undefined && { minStockThreshold: dto.minStockThreshold }),
        ...(dto.active !== undefined && { active: dto.active }),
      },
    });

    await this.auditService.log({
      action: 'product_updated',
      entityType: 'Product',
      entityId: id,
      actorId: userId,
      details: dto as Record<string, unknown>,
    });

    return updated;
  }

  async getConversions(productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Ürün bulunamadı');

    const items = await this.prisma.packageConversion.findMany({
      where: { productId },
      orderBy: { effectiveFrom: 'desc' },
    });
    return { items };
  }

  async createConversion(productId: string, dto: CreateConversionDto, userId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Ürün bulunamadı');
    const packageName = dto.packageName.trim();
    if (!packageName) throw new BadRequestException('Paket adı boş olamaz');
    if (packageName.toLocaleLowerCase('tr') === product.baseUnit) {
      throw new BadRequestException('Paket adı ürünün temel birimiyle aynı olamaz');
    }

    const conversion = await this.prisma.packageConversion.create({
      data: {
        productId,
        packageName,
        conversionFactor: dto.conversionFactor,
        effectiveFrom: new Date(dto.effectiveFrom),
      },
    });

    await this.auditService.log({
      action: 'conversion_created',
      entityType: 'PackageConversion',
      entityId: conversion.id,
      actorId: userId,
      details: { productId, packageName: dto.packageName, conversionFactor: dto.conversionFactor },
    });

    return {
      id: conversion.id,
      productId: conversion.productId,
      packageName: conversion.packageName,
      conversionFactor: conversion.conversionFactor,
      effectiveFrom: conversion.effectiveFrom,
      active: conversion.active,
    };
  }

  async updateConversion(productId: string, conversionId: string, dto: UpdateConversionDto, userId: string) {
    const conversion = await this.prisma.packageConversion.findFirst({
      where: { id: conversionId, productId },
    });
    if (!conversion) throw new NotFoundException('Dönüşüm bulunamadı');

    const updated = await this.prisma.packageConversion.update({
      where: { id: conversionId },
      data: {
        ...(dto.packageName !== undefined && { packageName: dto.packageName }),
        ...(dto.conversionFactor !== undefined && { conversionFactor: dto.conversionFactor }),
        ...(dto.effectiveFrom !== undefined && { effectiveFrom: new Date(dto.effectiveFrom) }),
        ...(dto.active !== undefined && { active: dto.active }),
      },
    });

    await this.auditService.log({
      action: 'conversion_updated',
      entityType: 'PackageConversion',
      entityId: conversionId,
      actorId: userId,
      details: dto as Record<string, unknown>,
    });

    return {
      id: updated.id,
      productId: updated.productId,
      packageName: updated.packageName,
      conversionFactor: updated.conversionFactor,
      effectiveFrom: updated.effectiveFrom,
      active: updated.active,
    };
  }

  async setInitialStock(productId: string, dto: SetInitialStockDto, userId: string) {
    const date = new Date(dto.date);
    if (isNaN(date.getTime())) throw new BadRequestException('Geçersiz tarih');
    if (date.getTime() > Date.now() + 5 * 60 * 1000) {
      throw new BadRequestException('Başlangıç sayımı ileri tarihli olamaz');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await lockProducts(tx, [productId]);
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new NotFoundException('Ürün bulunamadı');
      if (product.initialCount !== null) throw new ConflictException('Başlangıç stoğu zaten girilmiş');
      // Sayımdan önce girilmiş hareket varsa sayım onları çift sayar; bu durumda reddedilir.
      const lineCount = await tx.movementLine.count({ where: { productId } });
      if (lineCount > 0) {
        throw new ConflictException(
          'Bu ürüne daha önce hareket girilmiş. Başlangıç stoğu yerine Sayım Düzeltmesi kullanın.',
        );
      }
      return tx.product.update({
        where: { id: productId },
        data: { initialCount: dto.count, initialDate: date },
      });
    });

    await this.auditService.log({
      action: 'initial_stock_set',
      entityType: 'Product',
      entityId: productId,
      actorId: userId,
      details: { count: dto.count, date: dto.date },
    });

    return {
      productId: updated.id,
      initialCount: updated.initialCount!,
      initialDate: updated.initialDate!,
    };
  }
}
