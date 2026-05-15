# EduGuide AI — Tổng hợp Tính năng & Công nghệ

## Tổng quan Kiến trúc

```mermaid
graph TB
    subgraph Client["Giao diện (React 19 + Next.js 16)"]
        LP["Trang chủ<br/>16 sections"]
        OB["Wizard Khởi tạo<br/>4 bước"]
        AUTH["Xác thực<br/>Đăng nhập / Đăng ký / Quên MK"]
        DASH["Dashboard"]
    end

    subgraph DashFeatures["Tính năng Dashboard"]
        CHAT["Chat AI"]
        ROAD["Lộ trình học tập"]
        FLASH["Flashcards AI"]
        QUIZ["Quiz AI"]
        POMO["Pomodoro Timer"]
        NOTES["Ghi chú"]
        GAMIFY["Gamification - XP/Streak"]
        SCHEDULE["Lịch học"]
    end

    subgraph Backend["Backend - Next.js API Routes"]
        API_ROAD["POST /api/generate-roadmap"]
        API_QUIZ["POST /api/generate-quiz"]
        API_FLASH["POST /api/generate-flashcards"]
        API_AUTH["NextAuth /api/auth"]
        API_INN["POST /api/inngest"]
    end

    subgraph AI["Nhà cung cấp AI"]
        OPENAI["OpenAI GPT-4o-mini"]
        GEMINI["Google Gemini"]
    end

    subgraph Infra["Hạ tầng"]
        DB["PostgreSQL - Supabase"]
        RESEND["Resend - Email"]
        INNGEST["Inngest - Background Jobs"]
    end

    DASH --> API_ROAD & API_QUIZ & API_FLASH
    API_ROAD --> OPENAI
    API_QUIZ --> OPENAI
    API_FLASH --> GEMINI
    API_AUTH --> DB
    API_INN --> INNGEST
    INNGEST --> RESEND
    INNGEST --> DB
```

---

## Danh sách Tính năng

### 1. Trang chủ (Landing Page) — 16 sections

| Section | Mô tả |
|---------|-------|
| Navbar | Điều hướng responsive, nút chuyển theme sáng/tối |
| Hero | Animation xoay chủ đề, nút CTA, hiệu ứng particles |
| TrustedBy | Logo đối tác |
| Features | Card tính năng nổi bật |
| HowItWorks | Quy trình hoạt động theo bước |
| VideoSection | Demo sản phẩm |
| TestimonialSection | Đánh giá người dùng |
| PricingSection | Bảng giá theo gói |
| BlogSection | Bài viết blog |
| FAQSection | Câu hỏi thường gặp (Accordion) |
| CTASection | Nút kêu gọi hành động |
| PrivacySection | Chính sách bảo mật |
| Footer | Links, mạng xã hội |
| ScrollToTop | Nút cuộn lên đầu trang |

### 2. Hệ thống Xác thực
- Đăng nhập bằng email + mật khẩu (mã hoá bcryptjs)
- Đăng ký tài khoản với validate email
- Quên / đặt lại mật khẩu qua email
- Gửi email chào mừng tự động khi đăng ký (Inngest → Resend)

### 3. Wizard Khởi tạo (Onboarding) — 4 bước
Thu thập thông tin người dùng để cá nhân hoá chương trình học:

| Bước | Dữ liệu thu thập |
|------|-------------------|
| Bước 1 — Nền tảng | Kỹ năng mục tiêu, trình độ hiện tại |
| Bước 2 — Mục tiêu | Mục tiêu chính (Sự nghiệp/Học thuật/Sở thích), phong cách học |
| Bước 3 — Sở thích | Lĩnh vực quan tâm, loại nội dung ưa thích |
| Bước 4 — Chi tiết | Thời gian dành cho học, deadline, điểm mạnh/yếu |

### 4. Tạo Lộ trình học bằng AI
- **Model:** OpenAI GPT-4o-mini
- **Quy trình:** Dữ liệu onboarding → prompt engineering → JSON có cấu trúc
- **Kết quả:** Tiêu đề khoá học, 3 giai đoạn, mỗi giai đoạn 3-4 module
- **Tính năng:** Rate limiting (5 req/phút), cache 24h, xác thực Zod

### 5. Tạo Quiz bằng AI
- **Model:** OpenAI GPT-4o-mini
- **Kết quả:** 5 câu hỏi trắc nghiệm theo chủ đề
- **Tính năng:** Rate limiting, cache 1h, dữ liệu mock khi lỗi

### 6. Tạo Flashcards bằng AI
- **Model:** Google Gemini
- **Kết quả:** 5-10 flashcard mỗi chủ đề (mặt trước/sau)
- **Tính năng:** Rate limiting, cache 1h, validate bằng Zod

### 7. Dashboard
- **Sidebar** — Điều hướng, thông tin user từ session
- **Nội dung chính** — Công cụ học (Pomodoro, Ghi chú, Flashcard)
- **Chat AI** — Trợ lý AI với gợi ý theo ngữ cảnh
- **Widget phải** — Timer, mục tiêu hàng ngày, streak, CTA
- **Kế hoạch học** — Chương trình học đầy đủ theo giai đoạn
- **Lộ trình** — Hiển thị roadmap trực quan
- **Bản đồ Gamified** — Đường học tập có tiến trình
- **Lịch** — Tích hợp calendar (react-day-picker)

### 8. Hệ thống Gamification
- **XP** — Nhận điểm kinh nghiệm khi hoàn thành bài học
- **Cấp độ** — 15 bậc (Novice → Master)
- **Streak** — Chuỗi ngày hoạt động liên tiếp
- **Lưu trữ** qua Zustand + localStorage

### 9. Công cụ Học tập
- **Pomodoro Timer** — Đếm giờ tập trung, đếm phiên học
- **Ghi chú** — Ghi chú theo chủ đề
- **Flashcard** — Lật thẻ, theo dõi mức độ thành thạo
- **Quiz** — Trắc nghiệm, chấm điểm tự động

### 10. Tác vụ nền (Inngest)
- **Email chào mừng** — Kích hoạt khi đăng ký (`user/signup`)
- **Phát kết quả** — Cập nhật realtime qua Supabase channels

---

## Công nghệ Sử dụng

### Framework & Ngôn ngữ

| Công nghệ | Phiên bản | Vai trò |
|-----------|-----------|---------|
| **Next.js** | 16.1.1 | Full-stack React framework (App Router, Turbopack) |
| **React** | 19.2.3 | Thư viện giao diện |
| **TypeScript** | 5.x | An toàn kiểu dữ liệu |
| **Tailwind CSS** | 4.x | CSS utility-first |

### Giao diện (UI)

| Công nghệ | Vai trò |
|-----------|---------|
| **shadcn/ui** (Radix UI) | Component accessible (Dialog, Accordion, Popover...) |
| **Lucide React** | Thư viện icon |
| **Framer Motion** | Animation chuyển trang, micro-interactions |
| **Sonner** | Thông báo toast |
| **react-day-picker** | Calendar/date picker |

### Trí tuệ Nhân tạo (AI)

| Công nghệ | Model | Sử dụng cho |
|-----------|-------|-------------|
| **OpenAI** | GPT-4o-mini | Tạo lộ trình, tạo quiz, chat |
| **Google Generative AI** | Gemini | Tạo flashcard |

### Cơ sở Dữ liệu

| Công nghệ | Vai trò |
|-----------|---------|
| **PostgreSQL** (Supabase) | Database chính |
| **Drizzle ORM** | Query builder type-safe |
| **Drizzle Kit** | Migration (`db:generate`, `db:push`, `db:studio`) |

### Xác thực & Bảo mật

| Công nghệ | Vai trò |
|-----------|---------|
| **NextAuth v5** | Framework xác thực (Credentials + OAuth) |
| **bcryptjs** | Mã hoá mật khẩu |
| **Zod** | Validate dữ liệu runtime |

### Quản lý Trạng thái

| Công nghệ | Vai trò |
|-----------|---------|
| **Zustand** | State client-side (wizard, gamification, notes, pomodoro) |
| Zustand `persist` | Lưu trạng thái vào localStorage |

### Dịch vụ Backend

| Công nghệ | Vai trò |
|-----------|---------|
| **Inngest** | Xử lý tác vụ nền |
| **Resend** | Gửi email giao dịch |
| **Supabase** | PostgreSQL + realtime channels |

---

## Sơ đồ Cơ sở Dữ liệu (8 bảng)

| Bảng | Mô tả | Quan hệ |
|------|-------|---------|
| `user` | Người dùng (id, name, email, password) | Gốc |
| `account` | Tài khoản liên kết (NextAuth) | → user |
| `session` | Phiên đăng nhập | → user |
| `verificationToken` | Token xác thực email | — |
| `profile` | Hồ sơ học tập (skill, level, XP, streak) | → user |
| `roadmap` | Lộ trình học (content JSON, trạng thái) | → user |
| `study_module` | Module trong lộ trình (tiến trình hoàn thành) | → roadmap |
| `flashcard_deck` | Bộ flashcard theo chủ đề | → user |
| `flashcard` | Thẻ flashcard (mặt trước/sau, trạng thái) | → flashcard_deck |

---

## API Endpoints

| Method | Endpoint | Auth | AI Model | Rate Limit | Cache |
|--------|----------|------|----------|------------|-------|
| POST | `/api/generate-roadmap` | ✅ | GPT-4o-mini | 5/phút | 24h |
| POST | `/api/generate-quiz` | ❌ | GPT-4o-mini | 5/phút | 1h |
| POST | `/api/generate-flashcards` | ❌ | Gemini | 5/phút | 1h |
| ALL | `/api/auth/[...nextauth]` | — | — | — | — |
| POST | `/api/inngest` | — | — | — | — |

---

## Cấu trúc Dự án

```
src/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/[...nextauth]/ # NextAuth endpoints
│   │   ├── generate-roadmap/   # Tạo lộ trình AI
│   │   ├── generate-quiz/      # Tạo quiz AI
│   │   ├── generate-flashcards/# Tạo flashcard AI
│   │   └── inngest/            # Background job handler
│   ├── dashboard/              # Trang dashboard
│   │   ├── loading.tsx         # Skeleton loading UI
│   │   └── error.tsx           # Error boundary
│   ├── login/                  # Trang đăng nhập
│   ├── register/               # Trang đăng ký
│   ├── onboarding/             # Wizard khởi tạo
│   ├── reset-password/         # Đặt lại mật khẩu
│   ├── globals.css             # Design system & animations
│   ├── layout.tsx              # Root layout (theme, session)
│   └── page.tsx                # Trang chủ
├── components/
│   ├── auth/                   # AuthScreen
│   ├── dashboard/              # Dashboard components
│   │   ├── ChatPanel.tsx       # Chat AI
│   │   ├── MainContent.tsx     # Nội dung chính
│   │   ├── WorkspaceSidebar.tsx# Sidebar
│   │   ├── RightWidgets.tsx    # Widget phải
│   │   ├── StudyPlan.tsx       # Kế hoạch học
│   │   ├── flashcards/         # Flashcard components
│   │   ├── quiz/               # Quiz components
│   │   ├── pomodoro/           # Pomodoro timer
│   │   ├── notes/              # Ghi chú
│   │   └── schedule/           # Lịch
│   ├── landing/                # 16 landing page sections
│   ├── onboarding/             # Wizard steps
│   └── ui/                     # shadcn/ui primitives
└── lib/
    ├── db/                     # Drizzle schema & queries
    │   └── schema.ts           # 8 bảng database
    ├── inngest/                # Background job definitions
    ├── store.ts                # Zustand wizard store
    ├── useGamificationStore.ts # XP/Level/Streak store
    ├── usePomodoroStore.ts     # Pomodoro timer store
    ├── useNotesStore.ts        # Notes store
    ├── cache.ts                # In-memory TTL cache
    ├── rate-limit.ts           # Sliding window rate limiter
    ├── env.ts                  # Zod env validation
    ├── openai.ts               # OpenAI client
    ├── gemini.ts               # Gemini client
    ├── resend.ts               # Resend email client
    └── supabase.ts             # Supabase client
```

---

## Bắt đầu

### Yêu cầu
- Node.js 18+
- PostgreSQL (hoặc Supabase)
- API keys: OpenAI, Google Gemini, Resend

### Cài đặt

```bash
# Clone repo
git clone <repo-url>
cd pet-manager

# Cài dependencies
npm install

# Cấu hình biến môi trường
cp .env.example .env.local

# Khởi tạo database
npm run db:push

# Chạy development server
npm run dev
```

### Biến môi trường

| Biến | Bắt buộc | Mô tả |
|------|----------|-------|
| `AUTH_SECRET` | ✅ | Secret cho NextAuth |
| `OPENAI_API_KEY` | Tuỳ chọn | API key OpenAI (roadmap, quiz) |
| `GEMINI_API_KEY` | Tuỳ chọn | API key Google Gemini (flashcards) |
| `NEXT_PUBLIC_SUPABASE_URL` | Tuỳ chọn | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tuỳ chọn | Supabase anon key |
| `RESEND_API_KEY` | Tuỳ chọn | Resend API key (email) |

### Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Start production
npm run db:push    # Push schema to database
npm run db:studio  # Open Drizzle Studio
npm run lint       # Run ESLint
```

---

## Triển khai bằng Docker

Toàn bộ stack (Next.js app + PostgreSQL 15 + schema khởi tạo từ `init.sql`) được đóng gói sẵn trong `docker-compose.yml`. Hai script tiện lợi nằm trong `scripts/`:

| Hệ điều hành | Lệnh deploy nhanh |
|--------------|-------------------|
| Ubuntu / Debian / macOS | `bash scripts/deploy.sh` |
| Windows (PowerShell) | `powershell -ExecutionPolicy Bypass -File scripts/deploy.ps1` |

Script sẽ:
1. Kiểm tra Docker daemon đang chạy.
2. Tự sao chép `.env.example → .env` (nếu chưa có) và sinh `AUTH_SECRET` ngẫu nhiên.
3. `docker compose build` rồi `up -d`.
4. Đợi `pet-manager-db` và `pet-manager-app` báo *healthy* qua endpoint `/api/health`.
5. In URL truy cập (mặc định http://localhost:3002).

### Lệnh phụ trợ

```bash
# Linux / macOS
bash scripts/deploy.sh up      # Build + chạy (mặc định)
bash scripts/deploy.sh fresh   # Xoá volume DB + build lại sạch
bash scripts/deploy.sh logs    # Tail log compose
bash scripts/deploy.sh down    # Dừng container, giữ dữ liệu
bash scripts/deploy.sh status  # Xem trạng thái dịch vụ

# Windows
powershell -ExecutionPolicy Bypass -File scripts/deploy.ps1 -Command fresh
powershell -ExecutionPolicy Bypass -File scripts/deploy.ps1 -Command logs
powershell -ExecutionPolicy Bypass -File scripts/deploy.ps1 -Command down
```

### Cổng và biến mặc định

| Biến | Mặc định | Ghi chú |
|------|----------|---------|
| `APP_PORT` | `3002` | Cổng public của app trên host |
| `POSTGRES_PORT` | `5433` | Cổng Postgres trên host |
| `DATABASE_URL` | `postgresql://postgres:postgres@postgres:5432/petmanager` | Dùng hostname `postgres` trong network compose |
| `AUTH_SECRET` | sinh tự động | Đặt giá trị riêng cho production |
| `OPENROUTER_API_KEY` | trống | Cần để gọi LLM (roadmap / quiz / flashcards) |
| `RESEND_API_KEY` | `re_dummy` | Để mock email log vào console |

> ⚠️ Trước khi deploy production: đổi `POSTGRES_PASSWORD`, đặt `AUTH_SECRET` mạnh, cung cấp `OPENROUTER_API_KEY` & `RESEND_API_KEY` thật, đổi `NEXTAUTH_URL` về domain công khai và đứng sau reverse-proxy có HTTPS.

### Cài Docker nhanh

- **Ubuntu 22.04+**: `sudo apt update && sudo apt install -y docker.io docker-compose-plugin && sudo systemctl enable --now docker && sudo usermod -aG docker $USER` (logout/login lại để nhận group).
- **Windows**: cài [Docker Desktop](https://www.docker.com/products/docker-desktop/) và bật WSL 2 backend.
- **macOS**: cài [Docker Desktop](https://www.docker.com/products/docker-desktop/) (đã hỗ trợ Apple Silicon).

---

## License

MIT
