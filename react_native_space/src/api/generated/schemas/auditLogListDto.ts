// @ts-nocheck
import type { AuditLogItemDto } from './auditLogItemDto';

export interface AuditLogListDto {
  items: AuditLogItemDto[];
  total: number;
  page: number;
  totalPages: number;
}
