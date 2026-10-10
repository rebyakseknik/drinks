# Database Schema — Drinks Yönetim

PostgreSQL with Prisma ORM. All UUIDs auto-generated. All timestamps in UTC (application converts to Europe/Istanbul for business dates).

---

## Entities

### User
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| email | String | Unique, required |
| password | String | bcrypt hashed, required |
| name | String | Required |
| role | String | Required, enum: `owner` / `manager`, default `manager` |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

Indexes: `email` (unique)

---

### Product
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| name | String | Required |
| category | String | Required |
| baseUnit | String | Required, enum: `adet` / `gram` / `mililitre` |
| active | Boolean | Default true |
| minStockThreshold | Integer | Default 0 |
| initialCount | Integer | Nullable (null = not yet entered) |
| initialDate | DateTime | Nullable |
| createdById | UUID | FK → User.id, ON DELETE SET NULL, nullable |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

Indexes: `category`, `active`, `createdById`

Relations: `createdBy → User`

---

### PackageConversion
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| productId | UUID | FK → Product.id, ON DELETE CASCADE, required |
| packageName | String | Required (e.g. "koli", "kilogram") |
| conversionFactor | Integer | Required (how many base units per package) |
| effectiveFrom | DateTime | Required |
| active | Boolean | Default true |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

Indexes: `productId`, `(productId, packageName, effectiveFrom)` unique

Relations: `product → Product`

---

### MovementDocument
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| idempotencyKey | UUID | Unique, required |
| documentDate | DateTime | Required (business date) |
| type | String | Required, enum: `mal_kabul` / `sevkiyat` / `depoya_iade` / `fire_hasar` / `sayim_duzeltmesi` |
| notes | String | Nullable |
| status | String | Required, enum: `active` / `reversed`, default `active` |
| reversalOfId | UUID | FK → MovementDocument.id, nullable, ON DELETE SET NULL |
| replacementOfId | UUID | FK → MovementDocument.id, nullable, ON DELETE SET NULL |
| createdById | UUID | FK → User.id, ON DELETE SET NULL, nullable |
| createdAt | DateTime | Auto |

Indexes: `idempotencyKey` (unique), `documentDate`, `type`, `status`, `createdById`, `reversalOfId`

Relations: `createdBy → User`, `reversalOf → MovementDocument`, `replacementOf → MovementDocument`, `lines → MovementLine[]`

---

### MovementLine
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| documentId | UUID | FK → MovementDocument.id, ON DELETE CASCADE, required |
| productId | UUID | FK → Product.id, ON DELETE RESTRICT, required |
| quantity | Integer | Required (signed: positive for stock additions, negative for subtractions) |
| packageName | String | Required |
| packageQuantity | Float | Required (what user entered) |
| conversionFactorUsed | Integer | Required (snapshot at time of entry) |
| notes | String | Nullable |
| reason | String | Nullable (required for sayim_duzeltmesi) |
| createdAt | DateTime | Auto |

Indexes: `documentId`, `productId`, `(documentId, productId)`

Relations: `document → MovementDocument`, `product → Product`

---

### DailyClosing
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| businessDate | DateTime | Unique, required (date only, stored as start-of-day UTC) |
| netCashKurus | Integer | Required |
| netCardKurus | Integer | Required |
| totalRevenueKurus | Integer | Required (computed = netCashKurus + netCardKurus, stored for query efficiency) |
| notes | String | Nullable |
| version | Integer | Required, default 1 (optimistic locking) |
| createdById | UUID | FK → User.id, ON DELETE SET NULL, nullable |
| updatedById | UUID | FK → User.id, ON DELETE SET NULL, nullable |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

Indexes: `businessDate` (unique), `createdById`

Relations: `createdBy → User`, `updatedBy → User`

---

### BusinessSettings
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| name | String | Default "Drinks" |
| location | String | Default "Forum Mersin" |
| updatedAt | DateTime | Auto |

Singleton row — application ensures only one row exists.

---

### InviteCode
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| code | String | Unique, required (8-char alphanumeric) |
| createdById | UUID | FK → User.id, ON DELETE CASCADE, required |
| usedById | UUID | FK → User.id, ON DELETE SET NULL, nullable |
| expiresAt | DateTime | Required (createdAt + 7 days) |
| isActive | Boolean | Default true (set false on use or revocation) |
| createdAt | DateTime | Auto |

Indexes: `code` (unique), `createdById`, `isActive`

Relations: `createdBy → User`, `usedBy → User`

---

### AuditLog
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| action | String | Required (e.g. "movement_created", "closing_updated", "user_role_changed", "invite_generated") |
| entityType | String | Required (e.g. "MovementDocument", "DailyClosing", "Product", "User", "InviteCode") |
| entityId | UUID | Required |
| actorId | UUID | FK → User.id, ON DELETE SET NULL, nullable |
| details | String | Nullable (JSON string with change details) |
| createdAt | DateTime | Auto |

Indexes: `actorId`, `entityType`, `createdAt`, `(entityType, entityId)`

Relations: `actor → User`

---

## Stock Calculation Query

Current stock for a product = `Product.initialCount` (or 0 if null) + `SUM(MovementLine.quantity)` where `MovementLine.document.status = 'active'` and `MovementLine.productId = product.id`.

The `quantity` field on MovementLine is already signed:
- Positive for: `mal_kabul`, `depoya_iade`, positive `sayim_duzeltmesi`
- Negative for: `sevkiyat`, `fire_hasar`, negative `sayim_duzeltmesi`

The backend computes the sign at creation time based on document type and stores the signed value.

---

## Key Constraints & Rules

1. **No cascading user deletes to business data**: User deletion (revoke access) sets `createdById`/`updatedById`/`actorId` to NULL via ON DELETE SET NULL. Business data (products, movements, closings) is preserved.
2. **Product deletion restricted**: ON DELETE RESTRICT on MovementLine.productId prevents deleting products with movement history. Use soft-delete (active=false) instead.
3. **Optimistic locking on DailyClosing**: UPDATE must include `WHERE version = :expectedVersion`. Increment version on success. Return 409 on mismatch.
4. **Idempotency on movements**: UNIQUE constraint on `idempotencyKey`. On duplicate, return existing document.
5. **Atomic movement creation**: Use database transaction for creating MovementDocument + all MovementLines + stock validation.
6. **Business date uniqueness on closings**: UNIQUE constraint on `businessDate` prevents duplicate daily records.
