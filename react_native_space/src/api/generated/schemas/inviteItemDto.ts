// @ts-nocheck
import type { InviteUsedByDto } from './inviteUsedByDto';

export interface InviteItemDto {
  id: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  /** @nullable */
  usedBy: InviteUsedByDto | null;
  isActive: boolean;
}
