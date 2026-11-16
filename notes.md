**FIXES**

**DISCUSSION POINTS**
**IF THIS SECTION IS BLANK, IGNORE RESPONDING TO THEM IN TERMINAL**

**PARKED**
- **Multi-Tenant Scalability & White-Label Architecture Beyond NAFL**:
  - *Partitioned Multi-Tenancy:* Single PostgreSQL database cluster partitioned by `school_id` with strict Postgres Row Level Security (RLS) policies enforcing complete cross-school isolation.
  - *Dynamic White-Labeling (`SchoolConfig`):* Dynamic branding config per tenant (school crest/logo, primary/accent colors, custom domain/subdomain, curriculum framework: CISCE, CAIE, CBSE, ICSE, IB).
  - *Zero Egress Cloud Storage:* Cloudflare R2 bucket storage for PDF circulars, slide decks, and photos partitioned by `/tenants/{school_id}/` with $0 bandwidth egress overhead.
  - *Zero-Code i18n Localization:* Key-based localization files (`en.json`, `kn.json`, `hi.json`) enabling non-technical school administrators to offer local language support without code changes.

- **Principal Access & Governance Persona**:
  - *School-Wide Authority:* Sole authority to broadcast school-wide emergency circulars and notices with parent compliance/acknowledgement tracking (e.g., "Circular #24: 87% signed").
  - *Escalation Channel:* Direct channel for parent feedback addressed to "Office of the Principal" (fee inquiries, safety, formal appeals).
  - *Teacher Artefact Compliance:* Administrative dashboard to check which class sections have uploaded their monthly curriculum slides by the 1st of each month.
  - *Audit Oversight:* Read-only visibility into teacher-parent remarks and leave logs for dispute resolution.

- **Student vs. Parent Access Evolution Across Grade Tiers**:
  - *Tier 1: Montessori to Grade 4 (Ages 3–9) — Parent-Operated Diary:*
    - Kids do not carry phones; student login is unnecessary.
    - 100% of operational actions (signing circular receipts, leave requests, paying fees, reading teacher remarks) are strictly parent-operated.
  - *Tier 2: Grade 5 to Grade 8 (Ages 10–13) — Transitional / Student Read-Only:*
    - Student login via Admission No. + PIN on family/supervised tablet or laptop.
    - Student sees: Timetable, homework logs, upcoming exam dates, event calendar, media gallery.
    - Parent retains exclusivity: Digitally signing circulars, fee payments, leave applications, and private remarks.
  - *Tier 3: Grade 9 to Grade 12 (Ages 14–18) — Co-Responsible / Independent Student:*
    - Student actions: Submit digital assignments/project links, track personal attendance percentage, receive subject-teacher announcements.
    - Parent actions: Legally binding consent forms (field trips, fee commitments) and required leave approvals to prevent unexcused absences.
