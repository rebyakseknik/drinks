# UX Specification — Drinks Yönetim

All user-facing text in Turkish. Currency: TRY (₺). Timezone: Europe/Istanbul.

---

## Screens

### 1. Auth Screens

#### 1a. Giriş (Login) — `app/auth/login.tsx`
- **Purpose**: Email/password login.
- **UI Elements**:
  - App logo/title "Drinks Yönetim" centered top
  - Email input (floating label "E-posta", keyboard type email)
  - Password input (floating label "Şifre", secure entry, eye toggle)
  - "Giriş Yap" gradient button (primary purple→gold)
  - "Hesabınız yok mu? Kayıt Ol" text link below
- **Actions**: Submit → calls login; on success AuthProvider state updates, layout switches to authenticated tabs. Tap "Kayıt Ol" → push signup screen.
- **Validation**: Both fields required, email format check. Error shake on invalid.

#### 1b. Kayıt Ol (Signup) — `app/auth/signup.tsx`
- **Purpose**: First owner setup OR manager registration with invite code.
- **UI Elements**:
  - "Drinks Yönetim" title
  - Name input ("Ad Soyad")
  - Email input ("E-posta")
  - Password input ("Şifre", min 8 chars)
  - Password confirm input ("Şifre Tekrar")
  - Invite code input ("Davet Kodu", optional — helper text: "İlk kullanıcıysanız boş bırakın")
  - "Kayıt Ol" gradient button
  - "Zaten hesabınız var mı? Giriş Yap" text link
- **Actions**: Submit → calls signup; on success AuthProvider state updates, layout switches to authenticated tabs. Tap "Giriş Yap" → pop back to login.
- **Validation**: All fields required except invite code. Password match check. Error messages in Turkish.

### 2. Authenticated Tabs

#### 2a. Özet (Dashboard) — `app/tabs/dashboard.tsx`
- **Purpose**: Business overview at a glance.
- **Layout** (scrollable):
  - **Bugünkü Ciro** card: shows today's net revenue (₺) or "Kapanış girilmedi" placeholder. Cash/card breakdown below if exists. Tap → navigates to closing detail/entry.
  - **Geçen Hafta Karşılaştırma** card: same weekday last week comparison with percentage change arrow (green up / red down). Shows "Veri yok" if either closing missing.
  - **Aylık Ciro** card: month-to-date total with cash/card split. Mini bar chart (last 7 days).
  - **Düşük Stok Uyarıları** section: list of products below minStockThreshold. Each row: product name, current stock (base unit), threshold. Orange warning icon. If none: "Tüm stoklar yeterli" message.
  - **Son Sevkiyatlar** section: last 5 dispatch documents. Each row: date, line count, first 2 product names truncated. Tap → push movement detail.
  - **En Çok Sevk Edilen** mini-list: top 3 dispatched products this month by quantity, explicitly labelled "Sevkiyat Miktarı".
- **Pull-to-refresh**: reloads all dashboard data.

#### 2b. Stok (Warehouse Stock) — `app/tabs/stock.tsx`
- **Purpose**: View current warehouse stock levels.
- **UI Elements**:
  - Search bar at top ("Ürün ara...")
  - Filter chips: "Tümü", "Düşük Stok", by category
  - FlashList of products. Each row:
    - Product name, category badge
    - Current stock in base unit (bold) with unit label (adet/g/ml)
    - Stock bar indicator (green/yellow/red based on threshold)
    - If initial stock not entered: "Başlangıç stoğu girilmedi" warning badge
  - FAB button "+" → push add product screen
- **Actions**: Tap product → push product detail. Tap FAB → push add product. Pull-to-refresh.

#### 2c. Sevkiyat (Dispatch) — `app/tabs/dispatch.tsx`
- **Purpose**: Quick access to create dispatch documents and view recent dispatches.
- **UI Elements**:
  - "Yeni Sevkiyat" prominent button at top
  - Date filter row (today / this week / custom range)
  - FlashList of dispatch movement documents. Each row:
    - Document date, line count summary (e.g. "5 ürün")
    - Status badge (active / reversed)
    - First 3 product names as chips
    - Creator name, timestamp
  - Empty state: "Henüz sevkiyat kaydı yok"
- **Actions**: Tap "Yeni Sevkiyat" → push new movement screen (pre-selected type: sevkiyat). Tap row → push movement detail.

#### 2d. Ciro (Revenue) — `app/tabs/revenue.tsx`
- **Purpose**: Daily closing records and revenue overview.
- **UI Elements**:
  - Month selector (< Ocak 2025 >) at top
  - Bar chart: daily revenue for selected month (stacked cash/card)
  - Summary row below chart: total, cash total, card total for month
  - Calendar-style list or FlashList of days:
    - Each row: date (weekday name), total revenue (₺), cash/card split
    - Missing days: "Kapanış girilmedi" in muted text, tap to enter
    - Entered days: amounts shown, tap to view/edit
  - FAB "+" → push new closing entry
- **Actions**: Tap day → push closing detail/edit. Tap FAB → push new closing (defaults to today).

#### 2e. Diğer (More/Settings) — `app/tabs/more.tsx`
- **Purpose**: Settings, user management, reports, audit log.
- **UI Elements** (scrollable menu list):
  - **Ürün Yönetimi** section:
    - "Ürünler" → push product list management screen
  - **Raporlar** section:
    - "Ciro Raporu" → push revenue report
    - "Sevkiyat Raporu" → push dispatch report
    - "En Çok Sevk Edilen" → push top dispatched report
    - "Dışa Aktar (CSV)" → push export screen
  - **Depo İşlemleri** section:
    - "Stok Hareketleri" → push movement history
    - "Yeni Hareket" → push new movement
  - **İşletme** section:
    - "İşletme Bilgileri" → push business settings
  - **Yönetim** section (owner only, hidden for managers):
    - "Kullanıcılar" → push user management
    - "Davet Kodları" → push invite management
  - **Denetim** section:
    - "İşlem Geçmişi" → push audit log
  - **Hesap** section:
    - "Şifre Değiştir" → push change password
    - "Çıkış Yap" button (red text) → confirms, calls logout, AuthProvider state updates, layout switches to auth screens

### 3. Detail / Form Screens (outside tabs)

#### 3a. Ürün Detay — `app/product/[id]/index.tsx`
- **Purpose**: View/edit product details, conversions, initial stock.
- **Sections**:
  - Product info: name, category, baseUnit, active toggle, minStockThreshold
  - "Düzenle" button → push edit screen
  - **Paket Dönüşümleri** list: packageName, conversionFactor, effectiveFrom, active. "Yeni Dönüşüm Ekle" button.
  - **Başlangıç Stoğu**: current initial stock value or "Girilmedi" with "Gir" button
  - **Stok Özeti**: current calculated stock

#### 3b. Ürün Düzenle — `app/product/[id]/edit.tsx`
- **Purpose**: Edit product fields.
- **Fields**: name, category (text or dropdown of existing categories), baseUnit (disabled after creation), minStockThreshold (numeric keyboard), active toggle.
- **Actions**: "Kaydet" → PUT product. "İptal" → pop.

#### 3c. Yeni Ürün — `app/product/new.tsx`
- **Purpose**: Create new product.
- **Fields**: name (required), category (required, autocomplete from existing), baseUnit (picker: adet/gram/mililitre), minStockThreshold (numeric, default 0), active (default true).
- **Actions**: "Oluştur" → POST product → push to product detail.

#### 3d. Dönüşüm Ekle/Düzenle — `app/product/[id]/conversion.tsx`
- **Purpose**: Add or edit package conversion.
- **Fields**: packageName (e.g. "koli", "kilogram"), conversionFactor (numeric keyboard, "1 koli = ? adet"), effectiveFrom (date picker), active toggle.
- **Actions**: "Kaydet" → POST or PUT conversion.

#### 3e. Başlangıç Stoğu Gir — `app/product/[id]/initial-stock.tsx`
- **Purpose**: Set initial warehouse stock for a product.
- **Fields**: initialCount (numeric keyboard, in base units), initialDate (date picker).
- **Note**: Can only be set once. Shows confirmation dialog.
- **Actions**: "Kaydet" → POST initial stock.

#### 3f. Yeni Hareket (New Movement) — `app/movement/new.tsx`
- **Purpose**: Create a movement document with multiple lines.
- **UI Elements**:
  - Type picker: mal_kabul, sevkiyat, depoya_iade, fire_hasar, sayim_duzeltmesi (Turkish labels: "Mal Kabul", "Sevkiyat", "Depoya İade", "Fire/Hasar", "Sayım Düzeltmesi")
  - Business date picker (defaults to today)
  - Notes field (optional)
  - **Lines section**:
    - "Ürün Ekle" button → opens product search bottom sheet
    - Each line card:
      - Product name (from search selection)
      - Package picker (from product's active conversions, or base unit)
      - Package quantity input (numeric keyboard)
      - Calculated base unit quantity shown (packageQty × conversionFactor)
      - Line notes (optional)
      - Delete line (X) button
    - For sayim_duzeltmesi: additional "Sebep" (reason) field per line
  - Idempotency: generate client-side UUID as idempotency key
  - "Kaydet" button (disabled until ≥1 line added)
- **Validation**: Prevent negative stock on subtraction types (show inline error per line). All quantities > 0.
- **Actions**: "Kaydet" → POST movement document atomically. On success → push movement detail.

#### 3g. Hareket Detay — `app/movement/[id]/index.tsx`
- **Purpose**: View movement document details.
- **UI Elements**:
  - Header: type badge, date, status (active/reversed), creator name, timestamp
  - If reversed: "İptal Edildi" red badge, link to reversal document
  - If replacement: link to replacement document
  - Lines list: product name, package info, quantity in base units, line notes
  - Notes section
  - **Actions** (if active): "İptal Et" button → confirmation dialog → POST reverse. Optional "Düzeltme Yap" → creates reversal + opens new movement form pre-filled as replacement.

#### 3h. Hareket Geçmişi — `app/movement/history.tsx`
- **Purpose**: Browse all movement documents with filters.
- **Filters**: date range, type multi-select, product search
- **List**: FlashList of documents, same row format as dispatch tab but all types.

#### 3i. Kapanış Detay/Düzenle — `app/closing/[id]/index.tsx`
- **Purpose**: View or edit a daily closing record.
- **Fields**: businessDate (read-only), netCash (₺, numeric keyboard), netCard (₺, numeric keyboard), computed total, notes.
- **Display**: Turkish number formatting (1.234,56 ₺). Input accepts decimal with comma.
- **Edit mode**: "Düzenle" button enables fields. "Kaydet" → PUT with version for optimistic locking. On conflict: show "Bu kayıt başka biri tarafından güncellendi. Lütfen yenileyin." error.

#### 3j. Yeni Kapanış — `app/closing/new.tsx`
- **Purpose**: Enter daily closing for a date.
- **Fields**: businessDate (date picker, default today, must not have existing closing), netCash (₺), netCard (₺), notes.
- **Validation**: Both amounts ≥ 0. Duplicate date check (show error if exists with link to edit).
- **Actions**: "Kaydet" → POST closing.

#### 3k. Ciro Raporu — `app/report/revenue.tsx`
- **Purpose**: Revenue report with charts.
- **UI**: Date range picker. Bar chart (daily revenue, stacked cash/card). Summary stats below. "CSV İndir" button.

#### 3l. Sevkiyat Raporu — `app/report/dispatches.tsx`
- **Purpose**: Dispatch report filtered by date.
- **UI**: Date range picker. List of dispatches with product breakdown. "CSV İndir" button.

#### 3m. En Çok Sevk Edilen — `app/report/top-dispatched.tsx`
- **Purpose**: Top dispatched products report.
- **UI**: Date range picker. Ranked list: product name, total dispatched quantity (base units), bar visualization. Labelled "Sevkiyat Miktarı".

#### 3n. Dışa Aktar — `app/report/export.tsx`
- **Purpose**: CSV export screen.
- **UI**: Export type picker (Ciro / Stok Hareketleri / Sevkiyatlar). Date range. "Dışa Aktar" button → generates CSV via API → opens share sheet.

#### 3o. İşletme Bilgileri — `app/settings/business.tsx`
- **Purpose**: Edit business name and location.
- **Fields**: name, location (text inputs). "Kaydet" button.

#### 3p. Kullanıcı Yönetimi — `app/settings/users.tsx` (owner only)
- **Purpose**: List users, change roles, revoke access.
- **UI**: List of users with name, email, role badge (Sahip/Yönetici). Each row: role change dropdown (owner only for non-self), "Erişimi Kaldır" delete button with confirmation.

#### 3q. Davet Kodları — `app/settings/invites.tsx` (owner only)
- **Purpose**: Generate and manage invite codes.
- **UI**: "Yeni Davet Kodu Oluştur" button. List of active codes with creation date, usage status. "İptal Et" button per code. Copy code to clipboard action.

#### 3r. Şifre Değiştir — `app/settings/change-password.tsx`
- **Purpose**: Change own password.
- **Fields**: current password, new password, confirm new password. "Değiştir" button.

#### 3s. İşlem Geçmişi (Audit Log) — `app/settings/audit-log.tsx`
- **Purpose**: View recent activity.
- **UI**: FlashList of audit entries. Each row: action description, actor name, timestamp. Paginated.

---

## File Structure

```
app/
  _layout.tsx              — Root layout: AuthProvider wrapper, font loading, splash
  auth/
    _layout.tsx            — If authenticated → <Redirect href="/tabs/dashboard" />; else <Stack>
    login.tsx
    signup.tsx
  tabs/
    _layout.tsx            — If not authenticated → <Redirect href="/auth/login" />; else <Tabs> with 5 tabs
    dashboard.tsx          — Özet tab
    stock.tsx              — Stok tab
    dispatch.tsx           — Sevkiyat tab
    revenue.tsx            — Ciro tab
    more.tsx               — Diğer tab
  product/
    new.tsx
    [id]/
      index.tsx
      edit.tsx
      conversion.tsx
      initial-stock.tsx
  movement/
    new.tsx
    history.tsx
    [id]/
      index.tsx
  closing/
    new.tsx
    [id]/
      index.tsx
  report/
    revenue.tsx
    dispatches.tsx
    top-dispatched.tsx
    export.tsx
  settings/
    business.tsx
    users.tsx
    invites.tsx
    change-password.tsx
    audit-log.tsx
```

---

## Navigation

- **Unauthenticated**: Stack navigator under `auth/` — login (initial), signup.
- **Authenticated**: Bottom tabs with 5 tabs:
  - Özet (dashboard icon), Stok (warehouse icon), Sevkiyat (truck icon), Ciro (chart icon), Diğer (menu/settings icon)
- **Auth guards**: `tabs/_layout.tsx` redirects to `/auth/login` if not authenticated. `auth/_layout.tsx` redirects to `/tabs/dashboard` if authenticated.
- **Owner-only guards**: User management and invite screens check `user.role === 'owner'` before rendering; show access denied or hide navigation items for managers.
- All detail/form screens are stack-pushed from tabs, outside the tabs folder.

---

## Design Direction

- **Theme**: Dark mode. Background: #0D0B14 (deep purple-black). Surface cards: #1A1726 with subtle border #2A2640.
- **Color palette**: Primary: #7C3AED (purple). Accent: #D4A843 (gold). Error: #EF4444. Success: #10B981. Warning: #F59E0B.
- **Color application**: Gradient buttons [#7C3AED, #D4A843]. Tab bar active icon: gold. Cards with glass effect (translucent #1A1726 at 80% opacity). Status badges use semantic colors.
- **Typography**: Display/Heading: "Outfit" (Google Font). Body: "DM Sans" (Google Font). Scale: Display 32px → Heading 22px → Body 16px → Caption 13px.
- **Backgrounds**: Layered gradient from #0D0B14 to #151222. Cards with frosted glass effect.
- **Turkish number formatting**: Use dot as thousands separator, comma as decimal (1.234,56 ₺).
- **Numeric inputs**: Use numeric keyboard type. Accept comma as decimal separator for money fields. Convert to kuruş integers internally.

---

## Animation & Motion

- Screen transitions: slide-right for push, slide-left for pop, fade for tab switches.
- Button press: scale 0.97 spring + haptic (skip web).
- List items: staggered fade-in on load.
- Loading: skeleton shimmer for cards and lists.
- Pull-to-refresh with custom indicator.
- Bottom sheets for product search: multi-snap with backdrop blur.
- Chart animations: bars grow from zero on mount.
- Respect reduced motion preferences.

---

## Component Standards

- All buttons: gradient fill (purple→gold), press animation, loading spinner state, disabled opacity.
- Inputs: floating labels in Turkish, focus border animation (gold), error shake with red border, validation messages below.
- Cards: rounded 16px, glass effect background, subtle shadow.
- Product search: bottom sheet with search input, FlashList of products, tap to select.
- Money display: custom component that formats kuruş integer to "1.234,56 ₺".
- Empty states: illustration + descriptive Turkish text + action button.
- Error states: retry button with error message.
- Spacing: 8pt grid. Border radius: sm:8, md:12, lg:16, xl:24.
- Accessibility: contrast ≥ 4.5:1, touch targets 44pt+, accessible labels in Turkish.
