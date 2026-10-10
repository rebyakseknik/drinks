# API Specification — Drinks Yönetim

Base URL: `/api`
All dates in ISO8601. All money values in kuruş (integer). Timezone: Europe/Istanbul for business dates.

---

## Authentication

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/signup | {email: string (required), password: string (required), name: string (required), inviteCode: string (optional)} | {token: string, user: {id: UUID, email: string, name: string, role: string}} | No |
| POST | /api/auth/login | {email: string (required), password: string (required)} | {token: string, user: {id: UUID, email: string, name: string, role: string}} | No |
| GET | /api/auth/me | — | {user: {id: UUID, email: string, name: string, role: string, createdAt: ISO8601}} | Bearer |
| PUT | /api/auth/change-password | {currentPassword: string (required), newPassword: string (required)} | {success: boolean} | Bearer |

**Signup logic**:
- If no users exist in DB → first user becomes `owner`, inviteCode ignored.
- If users exist and inviteCode provided → validate code, create user as `manager`, mark code as used.
- If users exist and no inviteCode → reject with 403.

---

## Products

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/products | query: ?search=string&category=string&active=boolean | {items: Product[]} | Bearer |
| POST | /api/products | {name: string (required), category: string (required), baseUnit: string (required, enum: adet/gram/mililitre), minStockThreshold: integer (optional, default 0)} | {id: UUID, name: string, category: string, baseUnit: string, active: boolean, minStockThreshold: integer, createdAt: ISO8601, createdById: UUID} | Bearer |
| GET | /api/products/:id | — | {id: UUID, name: string, category: string, baseUnit: string, active: boolean, minStockThreshold: integer, initialStock: {count: integer, date: ISO8601} | null, conversions: PackageConversion[], createdAt: ISO8601, updatedAt: ISO8601, createdById: UUID} | Bearer |
| PUT | /api/products/:id | {name: string (optional), category: string (optional), minStockThreshold: integer (optional), active: boolean (optional)} | {id: UUID, name: string, category: string, baseUnit: string, active: boolean, minStockThreshold: integer, updatedAt: ISO8601} | Bearer |

**PackageConversion** shape: `{id: UUID, productId: UUID, packageName: string, conversionFactor: integer, effectiveFrom: ISO8601, active: boolean}`

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/products/:id/conversions | — | {items: PackageConversion[]} | Bearer |
| POST | /api/products/:id/conversions | {packageName: string (required), conversionFactor: integer (required), effectiveFrom: ISO8601 (required)} | PackageConversion | Bearer |
| PUT | /api/products/:id/conversions/:conversionId | {packageName: string (optional), conversionFactor: integer (optional), effectiveFrom: ISO8601 (optional), active: boolean (optional)} | PackageConversion | Bearer |
| POST | /api/products/:id/initial-stock | {count: integer (required), date: ISO8601 (required)} | {productId: UUID, initialCount: integer, initialDate: ISO8601} | Bearer |

**Initial stock**: returns 409 if already set.

---

## Warehouse Movements

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/movements | query: ?type=string&from=ISO8601&to=ISO8601&productId=UUID&status=string&page=integer&limit=integer | {items: MovementDocument[], total: integer, page: integer, totalPages: integer} | Bearer |
| POST | /api/movements | {idempotencyKey: UUID (required), documentDate: ISO8601 (required), type: string (required, enum: mal_kabul/sevkiyat/depoya_iade/fire_hasar/sayim_duzeltmesi), notes: string (optional), lines: MovementLineInput[] (required, min 1)} | MovementDocument | Bearer |
| GET | /api/movements/:id | — | MovementDocument | Bearer |
| POST | /api/movements/:id/reverse | {notes: string (optional)} | {reversalDocument: MovementDocument} | Bearer |

**MovementLineInput**: `{productId: UUID (required), packageName: string (required), packageQuantity: number (required), conversionFactorUsed: integer (required), notes: string (optional), reason: string (optional, required for sayim_duzeltmesi)}`

**MovementDocument** response shape:
```
{
  id: UUID,
  documentDate: ISO8601,
  type: string,
  notes: string | null,
  status: string (active/reversed),
  reversalOfId: UUID | null,
  replacementOfId: UUID | null,
  createdBy: {id: UUID, name: string},
  createdAt: ISO8601,
  lines: MovementLine[]
}
```

**MovementLine** response shape:
```
{
  id: UUID,
  productId: UUID,
  productName: string,
  quantity: integer (base units, signed: positive for additions, negative for subtractions),
  packageName: string,
  packageQuantity: number,
  conversionFactorUsed: integer,
  notes: string | null,
  reason: string | null
}
```

**POST /api/movements validation**:
- Duplicate idempotencyKey → return existing document (200).
- For subtraction types: check each product's current stock ≥ quantity. Return 422 with per-line errors if negative stock would result.
- Atomic: all lines saved or none.
- `quantity` in base units = `packageQuantity × conversionFactorUsed`. Backend computes and stores.

---

## Warehouse Stock

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/warehouse-stock | query: ?search=string&belowThreshold=boolean | {items: WarehouseStockItem[]} | Bearer |

**WarehouseStockItem**:
```
{
  productId: UUID,
  productName: string,
  category: string,
  baseUnit: string,
  currentStock: integer,
  minStockThreshold: integer,
  isBelowThreshold: boolean,
  hasInitialStock: boolean
}
```

Calculated as: initialStock + sum(movement lines by type sign).

---

## Daily Closings

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/closings | query: ?from=ISO8601&to=ISO8601&page=integer&limit=integer | {items: DailyClosing[], total: integer, page: integer, totalPages: integer} | Bearer |
| POST | /api/closings | {businessDate: ISO8601 (required), netCashKurus: integer (required), netCardKurus: integer (required), notes: string (optional)} | DailyClosing | Bearer |
| GET | /api/closings/:id | — | DailyClosing | Bearer |
| PUT | /api/closings/:id | {netCashKurus: integer (optional), netCardKurus: integer (optional), notes: string (optional), version: integer (required)} | DailyClosing | Bearer |
| GET | /api/closings/today | — | {closing: DailyClosing | null} | Bearer |
| GET | /api/closings/summary | query: ?period=month&date=ISO8601 | {totalRevenueKurus: integer, totalCashKurus: integer, totalCardKurus: integer, daysRecorded: integer, daysInPeriod: integer} | Bearer |
| GET | /api/closings/comparison | — | {today: {date: ISO8601, totalRevenueKurus: integer} | null, lastWeek: {date: ISO8601, totalRevenueKurus: integer} | null, changePercent: number | null} | Bearer |

**DailyClosing** response shape:
```
{
  id: UUID,
  businessDate: ISO8601,
  netCashKurus: integer,
  netCardKurus: integer,
  totalRevenueKurus: integer,
  notes: string | null,
  version: integer,
  createdBy: {id: UUID, name: string},
  updatedBy: {id: UUID, name: string} | null,
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

**POST validation**: 409 if businessDate already has a closing.
**PUT validation**: 409 if version mismatch (optimistic locking).

---

## Reports

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/reports/revenue | query: ?from=ISO8601 (required)&to=ISO8601 (required) | {items: {date: ISO8601, netCashKurus: integer, netCardKurus: integer, totalRevenueKurus: integer}[]} | Bearer |
| GET | /api/reports/dispatches | query: ?from=ISO8601 (required)&to=ISO8601 (required) | {items: {documentId: UUID, documentDate: ISO8601, createdByName: string, lines: {productName: string, quantity: integer, baseUnit: string}[]}[]} | Bearer |
| GET | /api/reports/top-dispatched | query: ?from=ISO8601 (required)&to=ISO8601 (required)&limit=integer (optional, default 10) | {items: {productId: UUID, productName: string, baseUnit: string, totalDispatched: integer}[]} | Bearer |
| GET | /api/reports/export | query: ?type=string (required, enum: revenue/movements/dispatches)&from=ISO8601 (required)&to=ISO8601 (required) | CSV file (Content-Type: text/csv, Content-Disposition: attachment) | Bearer |

---

## Settings

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/settings/business | — | {name: string, location: string} | Bearer |
| PUT | /api/settings/business | {name: string (optional), location: string (optional)} | {name: string, location: string} | Bearer |

---

## User Management (Owner Only)

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/users | — | {items: {id: UUID, name: string, email: string, role: string, createdAt: ISO8601}[]} | Bearer (owner) |
| PUT | /api/users/:id/role | {role: string (required, enum: owner/manager)} | {id: UUID, name: string, email: string, role: string} | Bearer (owner) |
| DELETE | /api/users/:id | — | {success: boolean} | Bearer (owner) |

**Validation**: Owner cannot delete/demote self. Cannot delete last owner.

---

## Invite Codes (Owner Only)

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/invites | — | {id: UUID, code: string, createdAt: ISO8601, expiresAt: ISO8601} | Bearer (owner) |
| GET | /api/invites | — | {items: {id: UUID, code: string, createdAt: ISO8601, expiresAt: ISO8601, usedBy: {id: UUID, name: string} | null, isActive: boolean}[]} | Bearer (owner) |
| DELETE | /api/invites/:id | — | {success: boolean} | Bearer (owner) |

Invite codes: 8-char alphanumeric, expire in 7 days, single use.

---

## Audit Log

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/audit-log | query: ?page=integer&limit=integer | {items: {id: UUID, action: string, entityType: string, entityId: UUID, actorName: string, actorId: UUID, details: string | null, createdAt: ISO8601}[], total: integer, page: integer, totalPages: integer} | Bearer |

Audit log entries created automatically for: movement creation/reversal, closing creation/update, product changes, user role changes, invite generation/revocation.
