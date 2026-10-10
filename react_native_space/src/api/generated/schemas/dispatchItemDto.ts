// @ts-nocheck
import type { DispatchLineDto } from './dispatchLineDto';

export interface DispatchItemDto {
  documentId: string;
  documentDate: string;
  createdByName: string;
  lines: DispatchLineDto[];
}
