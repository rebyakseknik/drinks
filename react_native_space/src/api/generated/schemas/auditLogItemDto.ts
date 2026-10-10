// @ts-nocheck

export interface AuditLogItemDto {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  /** @nullable */
  actorName: string | null;
  /** @nullable */
  actorId: string | null;
  /** @nullable */
  details: string | null;
  createdAt: string;
}
