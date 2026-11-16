# NAFL — Digital School Diary++

> **Project Status:** Planning & Architecture Phase  
> **Target Pilot:** NAFL (National Academy For Learning)  
> **Target Market:** Small and Medium Schools (cost-sensitive, privacy-focused)  
> **Last Updated:** 2026-11-10  

---

## 1. Core Vision & Principles

*Preserved from original requirements:*
1. **Cross-Platform:** Seamless experience across Web, Mobile Web, Android, iOS, and other OS platforms from a unified codebase.
2. **Concept ("School Diary++"):** A modern digital replacement for the physical school diary, facilitating school-to-parent and kid communication.
3. **Privacy & Security:** Cloud-hosted, high-security architecture to protect personal data of children and parents (compliance with child privacy & DPDP guidelines).
4. **Pilot & Scalability:** Initial rollout as a personal investment at NAFL to test, validate, and refine; scalable to other small and medium schools.
5. **Ultra-Low Cost:** Minimal infrastructure/operational cost, designed for lean operations with multi-tenant efficiency.
6. **Zero-Code i18n:** Starts with English, but architected with localization keys from day one so other languages can be added with zero code changes.
7. **Intuitive UI:** Frictionless, user-friendly interface for non-technical parents and busy teachers.

---

## 2. Key Feature Modules (Diary++)

### A. Digital Diary & Homework
- Daily homework and classwork logs posted by teachers by grade/section.
- Photo, PDF, and voice note attachments (e.g., worksheet snapshots).
- Homework completion acknowledgement checkbox for parents.

### B. Circulars, Notices & Acknowledgements
- School-wide, grade-wide, or section-specific announcements.
- **Digital Read Receipts / Acknowledgements:** Proof of parent signature/acknowledgement for field trips, fees, or urgent notices.
- Push notifications, SMS/WhatsApp fallback for critical notices.

### C. Attendance & Leave Requests
- Daily morning roll-call attendance logs.
- Instant automated absence alert to parents.
- In-app leave application workflow (parent submits reason -> class teacher approves/rejects).

### D. Private Remarks & Feedback
- 1-on-1 documented feedback from teachers to parents (academic progress, behavior, appreciation).
- Controlled communication window (protects teachers from 24/7 messaging pressure).

### E. Timetable, Calendar & Events
- Class weekly timetable and subject schedules.
- Academic calendar: exam dates, holidays, sports days, and Parent-Teacher Meetings (PTMs).
- Sync to personal device calendars.

---

## 3. Architecture & Low-Cost Strategy

| Layer | Strategy / Proposal | Rationale |
| :--- | :--- | :--- |
| **Frontend** | **Flutter** OR **React Native (Expo)** | Single codebase supporting iOS, Android, and Web/PWA with near-native performance. |
| **Backend & DB** | **Supabase** (PostgreSQL) or **Firebase** | Generous free tier, built-in Auth, instant real-time sync, and Row Level Security (RLS). |
| **Multi-Tenancy** | Partitioned by `school_id` with strict RLS | Single database cluster serves NAFL and future schools while strictly isolating data. |
| **Storage** | S3-compatible cloud storage (Cloudflare R2 / Supabase Storage) | Zero egress fees (R2) for document/homework attachments keeps bandwidth cost at ~$0. |
| **i18n** | Key-based localization files (`en.json`, `kn.json`, `hi.json`) | Allows non-developers to provide translations without touching app code. |

---

## 4. To Be Decided (TBD)

- [ ] **Tech Stack Decision:** Choose between **React Native (Expo)** vs **Flutter** for the client, and **Supabase** vs **Firebase** for backend.
- [ ] **Communication Policy:** Decide whether to support real-time 2-way chat or strictly structured 1-way notices + teacher remarks (recommended to avoid teacher burnout).
- [ ] **Parent Onboarding Flow:** Bulk CSV upload by school admin (phone number / student admission number) + OTP login vs email invite links.
- [ ] **Deployment Strategy:** Launch as a Progressive Web App (PWA) first for immediate testing, followed by App Store / Google Play submissions.
- [ ] **Push Notification Provider:** Expo Push Notifications / Firebase Cloud Messaging (FCM) vs transactional SMS/WhatsApp for mission-critical alerts.

---

## 5. 🚩 CURRENT STATUS & PROTOTYPE

- **Guiding Architecture:** Responsive Web-First (PWA) + Zero Cost ($0) + Zero Cloud Lock-in + Artefact-First Assimilation (Teachers directly upload existing PDFs/slides with zero re-typing).
- **Working Interactive Prototype:** Built in `web/` with Vite + React + Tailwind CSS.
- **Dev Server:** Running live at `http://localhost:3000` (and `http://192.168.29.70:3000` for mobile phone testing).
- **Assimilated NAFL Mont 1/2 Modules in Prototype:**
  1. **Calendar & Events (Module 5):** Yearly calendar, monthly view, and prominent "Monthly Dress-up & What to Bring" reminder box.
  2. **Monthly Learning Objectives & Theme Deck:** Slide pack assimilation (Community Helpers & Transport, sensorial math, sandpaper letters).
  3. **Circulars & Acknowledgements (Module 2):** PDF notices with 1-tap "Acknowledge & Sign" parent receipts.
  4. **Monthly Moments:** Classroom photo collages & PDF booklets.
  5. **Teacher Control Desk:** 1-step direct upload of existing PDF slides/circulars that immediately renders in parent view.

---

## 6. Development Workflow & Fixes Protocol

When the user says **"updated notes.md"** (or whenever implementing new features/fixes):
1. **Read `notes.md` immediately.**
2. **Execute all items under `**FIXES**`:** Implement the requested code changes directly into the codebase.
3. **Automated Testing & Bug Fixing Loop:**
   - Execute the automated test suite (`python3 web/scripts/auto_test_and_log.py` or `cd web && npm run test && npm run build`).
   - If any automated unit test, integration test, TypeScript compiler check (`tsc`), or Vite bundle check fails, automatically diagnose and fix bugs immediately until 100% green.
   - Verify zero unhandled placeholder `alert()` stubs remain in the codebase.
4. **Log completed fixes and test results into `testing.md`:** Move and document all completed fixes, automated test suite outputs, test cases, and QA status in `testing.md` (which serves as the single source of truth for all testing and completed fixes).
5. **Keep `notes.md` lean:** Maintain strictly `**FIXES**`, `**DISCUSSION POINTS**`, and `**PARKED**` in `notes.md` (no `**DONE**` section). Leave the `**FIXES**` section completely blank after implementation so the user can continue adding new items.
6. **Respond to `**DISCUSSION POINTS**`:** If populated, provide thorough, structured thoughts and architectural options in the terminal response. If blank, ignore.
7. **Preserve `**PARKED**`:** Leave all parked items intact unless explicitly instructed otherwise.
