# Pragati University — Centralized Technical Clubs Management Platform (CSEC & PATHUB)

An autonomous, multi-role campus ecosystem designed for **Pragati University**. Governed by the **Computer Science Executive Council (CSEC)** and **PATHUB Technology Hub**, this platform orchestrates club memberships, hackathon/workshop scheduling, live mobile QR check-in, automated certificate generation, project moderation, and NAAC/NBA accreditation audits.

---

## 🌟 Key Capabilities & Highlights

- **Single Source of Truth & Real-Time Data Sync**: Powered by a centralized reactive `DataService` with cross-tab `BroadcastChannel` synchronization and Supabase Realtime subscriptions. Any registration, check-in, or moderation event instantly propagates across all connected views.
- **5 Autonomous Role-Based Dashboards**:
  - **Student Dashboard**: Digital 3D pass cards, workshop registrations, LMS skill roadmaps, verifiable certificates, and project submissions.
  - **Club Admin Dashboard (Officers)**: Live event attendee rosters, membership status management, flyer generator, and turnout statistics.
  - **Faculty Coordinator Console**: Project review and scoring workflow, event sanctioning, and club performance audits.
  - **Department Admin Console**: Multi-department metrics, NAAC activity comparisons, and resource allocation.
  - **Super Admin Governance**: University-wide analytics, role assignments, and append-only audit trail logs.
- **Live QR Attendance Scanner & Instant Certificate Claims**: High-speed QR barcode validation with instant verifiable PDF certificate issuance and public hash verification (`/verify/[id]`).
- **Accreditation & Analytics Engine**: One-click dynamic PDF and Excel export ledgers for student participation, event turnouts, and club composite rankings.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) & Vanilla CSS Design Tokens
- **Icons & UI**: [Lucide React](https://lucide.dev/), Canvas Confetti
- **Document Generation**: `jspdf`, `xlsx`
- **Database & Sync**: Supabase (PostgreSQL, Realtime, Row-Level Security) & Central Reactive Store

---

## 🛠️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/NAKKA-POOJITHA/clubmanagement.git
cd clubmanagement
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo & Test Credentials

| Role | Email / College ID | Password | Access / Dashboard |
| :--- | :--- | :--- | :--- |
| **Faculty Coordinator** | `faculty@pragati.ac.in` *(or `FACULTY01`)* | `faculty123` | `/dashboard/faculty-coordinator` |
| **Club Admin (Officer)** | `clubadmin@pragati.ac.in` *(or `24A31A05IM`)* | `clubadmin123` | `/dashboard/club-admin` |
| **Student** | `student@pragati.ac.in` *(or `25A31A05ET`)* | `student123` | `/dashboard/student` |
| **Super Admin** | `superadmin@pragati.ac.in` *(or `24A31A05JO`)* | `superadmin123` | `/dashboard/super-admin` |

---

## 📄 License
Governed by Pragati University Computer Science Executive Council (CSEC). All rights reserved.
