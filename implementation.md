# MEDORA: Web Platform Prototype Implementation Plan

> **Product**: MEDORA (Understand Your Medicine, in Your Language)  
> **Proposed By**: Jamil Muhammad Abdullahi, CTO, Chosen Technologies  
> **Author**: RahinatuHumaiza Hassan  
> **Date**: 18 September 2026 | **Version**: 1.0 (Prototype Scope)  
> **Platform**: Web-Facing Platform First (Next.js + TypeScript + Tailwind CSS)

---

## User Review Required

> [!IMPORTANT]
> **Safety Guardrail & Refusal Integrity**: The core loop (Upload $\rightarrow$ OCR $\rightarrow$ Match $\rightarrow$ Constrained LLM Explanation) **MUST NEVER** invent results or hallucinate medicine names when match confidence is low. Diagnostic, dosage, or authenticity questions must trigger automatic refusal.
> 
> **Clinical Content Accuracy**: All Hausa translations and simplified clinical text for the 5–10 seed medicines must be verified against source documentation. Machine translation alone is not permitted for clinical content.

> [!WARNING]
> **Transient Storage Policy**: Images uploaded by users are processed transiently in memory or short-lived storage and discarded immediately after processing to maintain strict privacy.

---

## High-Level Architecture & Track Breakdown

```mermaid
flowchart TD
    User([User Browser]) -->|1. Upload Package Photo| UploadBox[Frontend Component]
    UploadBox -->|2. POST /api/ocr| API_OCR[OCR API Route]
    API_OCR -->|3. Extract Text| VisionAPI[Cloud Vision / Azure OCR]
    VisionAPI -->|4. Extracted Fields| API_Identify[Identify Route / Matcher]
    API_Identify -->|5. Exact/Fuzzy Query| SupabaseDB[(Verified Medicine DB)]
    SupabaseDB -->|6. Verified Record| API_Identify
    API_Identify -->|7. Confidence Check| Decision{Match Confidence >= Threshold?}
    Decision -->|No| Refusal[Low-Confidence Refusal Response]
    Decision -->|Yes| API_Explain[Explain Route / LLM Client]
    API_Explain -->|8. Constrained Prompt| LLM[OpenAI / Anthropic API]
    LLM -->|9. Hausa / English Explanation| ResultCard[Bilingual Result Card]
    Refusal --> ResultCard
    ResultCard -->|10. Display with Disclaimer| User
```

The implementation is structured across **4 Parallel Tracks**:
- **Track A — Frontend & UI Shell (Design Agent & Senior Programmer)**: UI components, responsive layout, drag-and-drop upload, bilingual i18n, `ResultCard`, accessibility.
- **Track B — Core Logic & Backend APIs (Senior Programmer)**: API routes (`/api/ocr`, `/api/identify`, `/api/explain`), OCR parser (`lib/ocr.ts`), fuzzy matcher (`lib/matcher.ts`), constrained LLM prompt handler (`lib/ai.ts`).
- **Track C — Database & Seed Data (Senior Programmer)**: Supabase/Postgres schema, seed data for 5–10 verified medicines, admin CRUD utility.
- **Track D — Quality Assurance & Adversarial Testing (Lead QA Engineer)**: Verification of requirements, OCR parsing accuracy tests, low-confidence refusal tests, LLM constraint validation, 3G/4G performance audits, `QA_report.md` logging.

---

## Phase Breakdown & Execution Plan

### Phase 0: Foundations & Project Setup (Days 1 – 2)

#### Proposed Changes
- **Track A (Frontend)**: Initialize Next.js (App Router), TypeScript, and Tailwind CSS. Setup root layout, meta tags, basic CSS tokens, and bilingual i18n structure (`lib/i18n.ts` and locale JSONs).
- **Track B (Backend)**: Setup API route structure (`src/app/api/*`), create environment configuration (`.env.example`), configure Vercel deployment pipeline.
- **Track C (Data)**: Initialize Supabase/Postgres project. Define schema for `medicines` and `scan_logs` tables. Populate seed data for 5–10 verified medicines in English & pre-reviewed Hausa.
- **Track D (QA)**: Initialize `QA_report.md`. Establish test suite framework and test dataset of 20+ real medicine package images (high quality, blurry, angled, non-medicine).

#### Verification Plan & Test Cases
- **Automated Tests**:
  - `npm run build` cleanly without TypeScript or linting errors.
  - Verify seed database migration scripts execute idempotently.
- **QA Verification**:
  - Verify i18n dictionary fallback (Hausa/English default toggle).
  - Verify Vercel staging deployment reachable via HTTPS URL.

#### Exit & Success Criteria (Phase 0)
- [ ] Next.js + TypeScript + Tailwind boilerplate deployed to Vercel staging URL.
- [ ] Database schema live on Supabase with 5–10 verified seed records.
- [ ] `.env.example` documented with OCR and LLM key placeholders.
- [ ] `QA_report.md` initialized with baseline setup sign-off.

---

### Phase 1: Core Upload and OCR Pipeline (Days 3 – 5)

#### Proposed Changes
- **Track A (Frontend)**: `UploadBox.tsx` component supporting file picker and drag-and-drop for JPEG/PNG (max 5MB). Image preview display before processing. Client-side file validation (reject non-image / oversized files).
- **Track B (Backend)**: `src/app/api/ocr/route.ts` API route. `lib/ocr.ts` wrapper integrating Google Cloud Vision API / Azure Computer Vision. Transient image hand-off without long-term storage. Debug view option for extracted raw text.
- **Track D (QA)**: Adversarial testing of upload handler with corrupt files, 10MB+ images, PDFs, non-image files, and blurred packaging scans.

#### Verification Plan & Test Cases
- **Automated Tests**:
  - Unit tests for image validation helpers (valid MIME types, byte limits).
  - Mock integration tests for `lib/ocr.ts` parsing raw Vision response into candidate text strings.
- **Adversarial QA Tests**:
  - Upload corrupt/malformed image files $\rightarrow$ Assert 400 bad request with clear user message.
  - Upload extremely large images (15MB+) $\rightarrow$ Assert client-side rejection before network transfer.
  - Upload glare-heavy packaging $\rightarrow$ Audit extracted text accuracy log in `QA_report.md`.

#### Exit & Success Criteria (Phase 1)
- [ ] Image upload UI supports drag-and-drop and file selection smoothly on desktop and mobile browsers.
- [ ] `/api/ocr` accepts image payload, calls OCR service, and extracts candidate brand name, generic name, strength, and manufacturer.
- [ ] Transient storage validated: uploaded photo memory freed immediately post-extraction.
- [ ] QA pass documented in `QA_report.md` with 0 critical bugs on file handling.

---

### Phase 2: Matching & Verified Response (Days 6 – 8)

#### Proposed Changes
- **Track A (Frontend)**: `ResultCard.tsx` component displaying verified medicine record: Brand Name, Generic Name, Strength, Dosage Form, Manufacturer, NAFDAC Number, Common Uses, Important Warnings, Common Side Effects, and Prominent Disclaimer.
- **Track B (Backend)**: `lib/matcher.ts` (exact and fuzzy matching algorithm on extracted text against database). `src/app/api/identify/route.ts` (returns verified match or low-confidence status). `lib/ai.ts` & `src/app/api/explain/route.ts` (LLM constrained prompt for Hausa/English simplification without hallucination).
- **Track D (QA)**: Extensive matching threshold verification, prompt drift / hallucination testing, i18n persistence verification in `localStorage`.

#### Verification Plan & Test Cases
- **Matching & Refusal Tests**:
  - Scan package of seed medicine $\rightarrow$ Match confidence $\ge 70\% \rightarrow$ Return verified DB record.
  - Scan unverified medicine or obscure bottle $\rightarrow$ Match confidence $< 70\% \rightarrow$ Return "Cannot identify confidently" message. MUST NOT guess.
- **Constrained LLM Tests**:
  - Send verified record to `/api/explain` $\rightarrow$ Confirm output strictly rephrases DB content. Assert NO new medical claims, dosage recommendations, or diagnostic advice are added.
- **Bilingual & i18n Tests**:
  - Switch language toggle to Hausa $\rightarrow$ Results re-render in verified Hausa. Choice persists in `localStorage` across page reload.

#### Exit & Success Criteria (Phase 2)
- [ ] Matching engine achieves $\ge 70\%$ identification accuracy on in-database seed medicines.
- [ ] Low-confidence match (<70%) cleanly triggers refusal message without inventing results.
- [ ] LLM output is 100% constrained to rephrasing verified source text in Hausa or English.
- [ ] Prominent safety disclaimer displayed on every scan result card.

---

### Phase 3: Safety, Polish & Validation Prep (Days 9 – 12)

#### Proposed Changes
- **Track A (Frontend)**: Polish visual hierarchy, responsive layout audit for low-end mobile devices (Chrome Android, Safari iOS), accessible font sizing, loading state spinners, and high-contrast badges for NAFDAC status.
- **Track B (Backend)**: Simple event logging table (`scan_logs`) to track scan success/fail rate, language preference, and match confidence scores. Rate-limiting on public API endpoints.
- **Track C (Data)**: Admin script / simple route for adding or editing medicine database records. Pharmacist & Hausa language reviewer sign-off on seed content.
- **Track D (QA)**: End-to-end performance testing on throttled 3G/4G networks (target <15s total response time). Full accessibility audit (WCAG AA). Complete regression pass logged in `QA_report.md`.

#### Verification Plan & Test Cases
- **Performance Audit**:
  - Throttled 3G network simulation (1.6 Mbps down, 750 kbps up) with a 1.5MB image $\rightarrow$ Complete upload + OCR + match + explain loop in $< 15$ seconds.
- **Refusal Guardrail Audit**:
  - User submits Q&A prompt asking for dosage advice $\rightarrow$ Refuse with safety disclaimer.
- **Browser Compatibility**:
  - Verify full functionality on Android Chrome, iOS Safari, and Desktop Chrome/Firefox.

#### Exit & Success Criteria (Phase 3)
- [ ] End-to-end response time under 15 seconds on 3G/4G network connection.
- [ ] All 5–10 seed medicine records reviewed and approved by Hausa language & healthcare reviewer.
- [ ] System event logging operational (scan success rate, language, confidence score).
- [ ] QA sign-off in `QA_report.md` confirming 0 open blocker or critical defects.

---

### Phase 4: User Testing & Decision Gate (Days 13 – 16+)

#### Proposed Changes
- Deploy public staging URL on Vercel with HTTPS.
- Conduct controlled user testing cohort (20 to 50 Hausa & English speaking participants in Northern Nigeria / Kano).
- Measure prototype success metrics:
  1. Successful identification rate ($\ge 70\%$).
  2. User comprehension self-report ($\ge 60\%$).
  3. Hausa vs. English preference distribution.
  4. Refusal and low-confidence rate tracking.
- Decision gate review for proceeding to native Flutter client planning.

---

## Detailed Track & Role Matrix

| Task Area | Primary Role | Secondary / Review Role | Code Artifacts |
| :--- | :--- | :--- | :--- |
| **UI Components & Layout** | Design Agent | Senior Programmer | `src/components/*`, `src/app/page.tsx` |
| **OCR & Matching Logic** | Senior Programmer | Analyst (Spec review) | `src/lib/ocr.ts`, `src/lib/matcher.ts` |
| **Constrained LLM Prompts** | Senior Programmer | Lead QA (Hallucination test) | `src/lib/ai.ts`, `src/app/api/explain/route.ts` |
| **Database & Seed Data** | Senior Programmer | Language/Health Reviewer | `supabase/*`, `src/lib/db.ts` |
| **i18n Localization** | Design Agent & Programmer | Language Reviewer | `src/lib/i18n.ts`, `public/locales/*` |
| **Adversarial QA & Audits** | Lead QA Engineer | CTO / Product Head | `QA_report.md` |

---

## Overall Prototype Success Metrics Summary

| Metric | Target | Measurement Method |
| :--- | :--- | :--- |
| **Successful Identification Rate** | $\ge 70\%$ on in-database medicines | Manual review of scan test set |
| **User Comprehension Improvement** | $\ge 60\%$ self-reported improvement | Post-use survey (20–50 users) |
| **Hausa vs English Preference** | Recorded per session | Analytics log (`scan_logs`) |
| **Low-Confidence Refusal Rate** | Tracked; 0 forced guesses | System analytics logs |
| **End-to-End Latency** | $< 15$ seconds on 3G/4G for 1–2 MB images | Network profiling & logs |
| **Time to Working Prototype** | Within 2 weeks from kickoff | Milestone & phase tracking |
