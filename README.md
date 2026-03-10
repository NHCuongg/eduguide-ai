# EduGuide AI 🎓

> Nền tảng học tập cá nhân hoá sử dụng AI để tạo lộ trình, quiz và flashcard — xây dựng trên Next.js 16 & React 19.

## ✨ Tính năng nổi bật

### 🤖 AI-Powered Learning
- **Tạo lộ trình tự động** — GPT-4o-mini phân tích profile → chương trình 3 giai đoạn
- **Quiz thông minh** — 5 câu trắc nghiệm tuỳ chỉnh theo chủ đề & trình độ
- **Flashcard AI** — Google Gemini tạo 5-10 thẻ ghi nhớ theo bài học
- **Chat trợ lý** — Hỏi đáp AI theo ngữ cảnh bài học đang xem

### 📊 Dashboard toàn diện
- Sidebar điều hướng với thông tin user từ session
- Pomodoro Timer (đếm giờ tập trung)
- Ghi chú theo chủ đề
- Lịch học tích hợp calendar
- Widget: streak, XP, mục tiêu hàng ngày

### 🎮 Gamification
- Hệ thống **XP & Level** (15 cấp: Novice → Master)
- **Streak** theo dõi chuỗi ngày học liên tiếp
- Bản đồ học tập trực quan (Gamified Map)

### 🔐 Xác thực & Bảo mật
- Đăng nhập bằng email/mật khẩu (bcryptjs)
- OAuth Google & GitHub
- Quên / đặt lại mật khẩu qua email
- Rate limiting cho API AI (5 req/phút)

### 🌐 Landing Page cao cấp
- 16 sections responsive (Hero, Features, Pricing, FAQ, Testimonials...)
- Animation mượt mà (Framer Motion)
- Dark/Light mode
- SEO-optimized

---

## 🛠 Công nghệ

| Phân loại | Công nghệ |
|-----------|-----------|
| **Framework** | Next.js 16.1.1 (App Router, Turbopack) |
| **Frontend** | React 19, TypeScript 5, Tailwind CSS 4 |
| **UI Components** | shadcn/ui (Radix UI), Lucide Icons, Framer Motion |
| **AI** | OpenAI GPT-4o-mini, Google Gemini |
| **Database** | PostgreSQL (Supabase) + Drizzle ORM |
| **Auth** | NextAuth v5 (Credentials + OAuth) |
| **State** | Zustand (persist middleware) |
| **Email** | Resend |
| **Background Jobs** | Inngest |
| **Validation** | Zod |

---

## 📁 Cấu trúc Dự án

```
src/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/[...nextauth]/ # NextAuth endpoints
│   │   ├── generate-roadmap/   # AI roadmap generation
│   │   ├── generate-quiz/      # AI quiz generation
│   │   ├── generate-flashcards/# AI flashcard generation
│   │   └── inngest/            # Background job handler
│   ├── dashboard/              # Dashboard pages
│   │   ├── loading.tsx         # Skeleton loading UI
│   │   └── error.tsx           # Error boundary
│   ├── login/                  # Login page
│   ├── register/               # Register page
│   ├── onboarding/             # Onboarding wizard
│   ├── reset-password/         # Password reset
│   ├── globals.css             # Design system & animations
│   ├── layout.tsx              # Root layout (theme, session)
│   └── page.tsx                # Landing page
├── components/
│   ├── auth/                   # AuthScreen
│   ├── dashboard/              # Dashboard components
│   │   ├── ChatPanel.tsx       # AI chat
│   │   ├── MainContent.tsx     # Main area
│   │   ├── WorkspaceSidebar.tsx# Sidebar
│   │   ├── RightWidgets.tsx    # Right panel widgets
│   │   ├── StudyPlan.tsx       # Study plan view
│   │   ├── flashcards/         # Flashcard components
│   │   ├── quiz/               # Quiz components
│   │   ├── pomodoro/           # Pomodoro timer
│   │   ├── notes/              # Notes
│   │   └── schedule/           # Calendar
│   ├── landing/                # 16 landing page sections
│   ├── onboarding/             # Wizard steps
│   └── ui/                     # shadcn/ui primitives
└── lib/
    ├── db/                     # Drizzle schema & queries
    │   └── schema.ts           # 8 database tables
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

## 🚀 Bắt đầu

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
# Sửa file .env.local với các API keys

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
| `GOOGLE_CLIENT_ID` | Tuỳ chọn | Google OAuth client ID |
| `GITHUB_CLIENT_ID` | Tuỳ chọn | GitHub OAuth client ID |

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

## 📊 Database Schema

| Bảng | Mô tả |
|------|-------|
| `user` | Người dùng (id, name, email, password) |
| `account` | Tài khoản OAuth (Google, GitHub) |
| `session` | Phiên đăng nhập |
| `verificationToken` | Token xác thực email |
| `profile` | Hồ sơ học tập (skill, level, XP, streak) |
| `roadmap` | Lộ trình học (nội dung JSON, trạng thái) |
| `study_module` | Module trong lộ trình |
| `flashcard_deck` | Bộ flashcard theo chủ đề |
| `flashcard` | Thẻ nhớ (mặt trước/sau, trạng thái thành thạo) |

---

## 📄 License

MIT
