# CRM Pro — Sales Intelligence

CRM tinh tế dựng từ bộ thiết kế **`stitch_crm_pro_sales_dashboard`** (Anthropic Claude-inspired design system) và kết nối thẳng với **Supabase**.

- **Stack:** Next.js 15 (App Router) • React 19 • TypeScript • Tailwind CSS v3
- **Backend:** Supabase (Postgres + Auth + RLS) qua `@supabase/ssr`
- **Fonts:** Newsreader (serif headlines) + Inter (body) + Material Symbols Outlined
- **Palette:** Warm parchment `#f5f4ed` + terracotta `#c96442` — không dùng blue-gray lạnh

---

## 1. Cấu trúc thư mục

```
crm-app/
├── .env.example                        # placeholder — copy sang .env.local và điền thật
├── .env.local                          # LOCAL only (gitignored)
├── supabase/migrations/
│   └── 20260417032000_initial_schema.sql
└── src/
    ├── middleware.ts                   # session refresh + route guarding
    ├── app/
    │   ├── layout.tsx, globals.css
    │   ├── login/page.tsx + actions.ts
    │   └── (dashboard)/
    │       ├── layout.tsx              # protected (redirect → /login if no user)
    │       ├── page.tsx                # dashboard — stat cards + recent leads
    │       └── leads/
    │           ├── page.tsx            # full list + search + filter + pagination
    │           ├── actions.ts          # create / update / delete server actions
    │           ├── new/page.tsx
    │           └── [id]/
    │               ├── page.tsx        # details + interaction timeline
    │               ├── edit/page.tsx
    │               └── interactions/actions.ts
    ├── components/
    │   ├── auth/login-form.tsx
    │   ├── layout/{sidebar, topbar, mobile-nav}.tsx
    │   ├── dashboard/{stat-card, recent-leads-table}.tsx
    │   ├── leads/{lead-table, lead-form, lead-filters, lead-pagination,
    │   │         lead-status-badge, delete-lead-button}.tsx
    │   └── interactions/{interaction-timeline, interaction-modal}.tsx
    └── lib/
        ├── supabase/{client, server, middleware}.ts
        ├── types/database.ts
        ├── constants.ts
        └── utils.ts
```

---

## 2. Thiết lập Supabase (một lần duy nhất)

### Bước 1 — Tạo project

1. Truy cập [supabase.com](https://supabase.com) → **New project**.
2. Đặt password cho Postgres, chọn region gần nhất (Singapore/Tokyo cho VN).
3. Đợi ~2 phút cho project ready.

### Bước 2 — Lấy credentials

Vào **Project Settings → API**, copy 3 giá trị sau:

| Biến trong `.env.local`           | Trường trên Supabase   |
| --------------------------------- | ---------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`        | Project URL            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Project API keys → `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY`       | Project API keys → `service_role` (secret — không prefix `NEXT_PUBLIC_`) |

Mở `crm-app/.env.local` và thay placeholder bằng giá trị thật.

### Bước 3 — Chạy migration

1. Mở **SQL Editor** trên Supabase dashboard.
2. Mở file `supabase/migrations/20260417032000_initial_schema.sql` trong repo này.
3. Copy toàn bộ nội dung → paste vào SQL Editor → **Run**.

Kết quả: 3 bảng (`profiles`, `leads`, `interactions`), 3 enums, RLS policies, và trigger tự tạo profile khi signup.

### Bước 4 — Tạo user (1 lần)

App không có UI register → tạo user thủ công trên Supabase Dashboard:

1. **Authentication → Users → Add user → Create new user**
2. Email + password tùy ý, ✅ **bật Auto Confirm User**

### Bước 5 — Seed dữ liệu demo (tùy chọn, giúp CRM nhìn đầy đặn)

Mở **SQL Editor** trên Supabase → paste nội dung file `supabase/seed.sql` → **Run**.

File sẽ tạo:

- **18 leads** trải đều 4 trạng thái (Mới 5 / Đang tư vấn 7 / Đã mua 3 / Từ chối 3) + 6 nguồn
- **28 interactions** (call/chat/meeting/email) với timestamp đa dạng (hôm nay → 30 ngày trước)
- Cập nhật `profiles.full_name` của user seed thành `Văn An Admin`

**Không tạo user** — user phải tồn tại sẵn (bước 4). Nếu email của bạn khác `admin@crmpro.local`, **sửa biến `v_email`** ở đầu file trước khi chạy.

**Idempotent** — chạy lại nhiều lần sẽ xoá toàn bộ leads + interactions cũ của user đó rồi tạo mới.

---

## 3. Chạy local

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) → redirect `/login`. Đăng nhập bằng user đã tạo ở bước 4.

---

## 4. Scripts

| Lệnh              | Mục đích                                 |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Dev server với HMR                       |
| `npm run build`   | Production build                         |
| `npm run start`   | Chạy production build                    |
| `npm run lint`    | ESLint                                   |
| `npm run typecheck` | TypeScript type-only check             |

---

## 5. Feature checklist

- [x] Login (email + password) với redirect theo `?next=`
- [x] Middleware bảo vệ mọi route trừ `/login`, `/auth/*`
- [x] Dashboard — 4 stat cards (Mới / Đang tư vấn / Đã mua / Từ chối) + 5 leads mới nhất
- [x] Leads list — tìm theo tên/SĐT/email, lọc theo status, phân trang 10/page
- [x] Tạo + Sửa + Xoá lead (server actions, revalidate tự động)
- [x] Lead details — profile card, ghi chú, timeline tương tác
- [x] Modal "Thêm ghi chú tương tác" với 4 loại (Call/Chat/Meeting/Email)
- [x] Mobile bottom nav
- [x] RLS — user chỉ thấy/sửa được lead và interaction của chính mình

---

## 6. Security notes

- Mọi secret nằm trong `.env.local` (gitignored theo `.gitignore`).
- Chỉ 2 biến `NEXT_PUBLIC_*` bị phơi ra browser — an toàn vì RLS enforce ở DB.
- `SUPABASE_SERVICE_ROLE_KEY` **chỉ** đọc trong server actions, không bao giờ gửi xuống client.
- RLS policies: `auth.uid() = owner_id` cho tất cả thao tác read/write trên `leads`.

---

## 7. Mở rộng

Các feature gợi ý (không nằm trong scope ban đầu):

- Register UI + email confirmation
- Forgot password flow
- Calendar page (`/calendar`) + Reports page (`/reports`)
- Tags cho lead (table `lead_tags` many-to-many)
- File attachments cho interaction (Supabase Storage)
- Realtime subscription cho interactions trên trang details
- Export CSV / import CSV leads

---

## 8. Nguồn thiết kế

Tất cả UI đều bám sát bộ mockup tại `../stitch_crm_pro_sales_dashboard/`:

| Trang trong app           | Mockup gốc                     |
| ------------------------- | ------------------------------ |
| `/`                       | `crm_dashboard_v2`             |
| `/leads`                  | `leads_list_v2`                |
| `/leads/new`, `/leads/[id]/edit` | `lead_form_v2`          |
| `/leads/[id]`             | `lead_details_v2`              |
| Interaction modal         | `interaction_modal_v2`         |
| Design tokens             | `h_th_ng_thi_t_k_c_a_t_i/DESIGN.md` |
