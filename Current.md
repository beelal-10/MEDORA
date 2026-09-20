# MEDORA: Current Implementation Status

**Project**: MEDORA (Understand Your Medicine, in Your Language)  
**Author / Proposed By**: Jamil Muhammad Abdullahi, CTO, Chosen Technologies  
**Date**: 2026-09-20  
**Version**: 1.0 (Prototype Scope - Web Platform)

---

## Implemented Features Matrix

| Feature Area | Component / Module | Status | Description |
| :--- | :--- | :--- | :--- |
| **Bilingual i18n System** | [`src/lib/i18n.ts`](file:///c:/Users/admin/Desktop/MEDORA/src/lib/i18n.ts), [`LanguageToggle.tsx`](file:///c:/Users/admin/Desktop/MEDORA/src/components/LanguageToggle.tsx) | **COMPLETED** | Complete Hausa (`ha`) and English (`en`) UI strings, dictionary lookup helper, and interactive language toggle component. |
| **Image Upload Box** | [`UploadBox.tsx`](file:///c:/Users/admin/Desktop/MEDORA/src/components/UploadBox.tsx) | **COMPLETED** | Drag-and-drop & file picker upload component, image preview, 5MB file size validation, MIME type validation, and loading step indicator. |
| **OCR Text Processing** | [`src/lib/ocr.ts`](file:///c:/Users/admin/Desktop/MEDORA/src/lib/ocr.ts), [`/api/ocr/route.ts`](file:///c:/Users/admin/Desktop/MEDORA/src/app/api/ocr/route.ts) | **COMPLETED** | Google Cloud Vision API integration wrapper with fallback mock text parser for development testing. |
| **Verified Medicine Database** | [`src/lib/db.ts`](file:///c:/Users/admin/Desktop/MEDORA/src/lib/db.ts), [`seed-medicines.json`](file:///c:/Users/admin/Desktop/MEDORA/src/data/seed-medicines.json) | **COMPLETED** | 5 verified seed medicines (Paracetamol, Coartem, Amoxil, Glucophage, Ibuprofen) with brand, generic, NAFDAC numbers, and verified Hausa/English clinical text. |
| **Matching & Refusal Engine** | [`src/lib/matcher.ts`](file:///c:/Users/admin/Desktop/MEDORA/src/lib/matcher.ts), [`/api/identify/route.ts`](file:///c:/Users/admin/Desktop/MEDORA/src/app/api/identify/route.ts) | **COMPLETED** | Weighted keyword matching engine. Strictly enforces $\ge 70\%$ confidence threshold refusal guardrail (`LOW_CONFIDENCE_REFUSAL`). |
| **Constrained AI Explanations** | [`src/lib/ai.ts`](file:///c:/Users/admin/Desktop/MEDORA/src/lib/ai.ts), [`/api/explain/route.ts`](file:///c:/Users/admin/Desktop/MEDORA/src/app/api/explain/route.ts) | **COMPLETED** | Constrained explanation generator using strictly verified database text in Hausa or English without medical hallucination. |
| **Result Card & Refusal Views** | [`ResultCard.tsx`](file:///c:/Users/admin/Desktop/MEDORA/src/components/ResultCard.tsx) | **COMPLETED** | Renders verified medicine cards with NAFDAC badges, uses, side effects, or low-confidence refusal warnings when match is weak. |
| **Safety Disclaimer Footer** | [`Disclaimer.tsx`](file:///c:/Users/admin/Desktop/MEDORA/src/components/Disclaimer.tsx) | **COMPLETED** | Prominent warning banner explaining MEDORA does not substitute professional medical advice or prescribe treatments. |
| **Supabase DB Schema** | [`supabase/seed.sql`](file:///c:/Users/admin/Desktop/MEDORA/supabase/seed.sql) | **COMPLETED** | PostgreSQL table definitions for `medicines` and `scan_logs` with row-level security (RLS) policies. |
| **Main Page Pipeline Shell** | [`src/app/page.tsx`](file:///c:/Users/admin/Desktop/MEDORA/src/app/page.tsx) | **COMPLETED** | Integrates Header, UploadBox, ResultCard, and Disclaimer into an end-to-end user scan workflow. |

---

## Seed Database Summary (5 Medicines)

1. **Paracetamol 500mg** (Emzor Pharmaceuticals | NAFDAC 04-0123)
2. **Coartem 80/480mg** (Novartis | NAFDAC 04-5678)
3. **Amoxil 500mg** (GlaxoSmithKline | NAFDAC 04-2345)
4. **Glucophage 500mg** (Merck | NAFDAC 04-8901)
5. **Ibuprofen 400mg** (Bond Chemical | NAFDAC 04-3456)

---

## Known Integration & Maintenance Tasks

1. **Package Installation**: Run `npm install` to initialize local `node_modules` for `npm run dev` and `npm run build`.
2. **Type Synchronization**: Standardize `OCRResult` property name (`raw_text` vs `rawText`) in `src/lib/ocr.ts`.
3. **File Object Base64 Encoding**: Update `page.tsx` $\rightarrow$ `UploadBox.tsx` handoff to convert uploaded `File` objects into base64 buffers before passing to `processImageOCR`.

---

## Phase 4: User Testing & Decision Gate — Kickoff Status

**Timestamp**: 2026-09-20T18:50:00+01:00  
**Status**: In Progress / Blocked on deployment credentials and local script policy

### Phase 4 Initiation Checklist
- [ ] Prepare Vercel staging deployment with HTTPS public URL.
- [ ] Register the staging environment and production-safe callback URLs for auth and API routes.
- [ ] Run a controlled user testing cohort of 20–50 Hausa/English speakers in Northern Nigeria / Kano.
- [ ] Track success rate, refusal rate, comprehension self-report, and language preference data.
- [ ] Review the decision gate against the target thresholds before moving to any native client planning.

### Decision Gate Metrics
1. Successful identification rate: $\ge 70\%$ on in-database medicines.
2. User comprehension self-report: $\ge 60\%$.
3. Hausa vs English preference distribution captured and tracked.
4. Low-confidence refusal rate recorded and monitored.
5. End-to-end response time validated on throttled 3G/4G conditions where possible.

### Current Verification Note
- A production build was attempted with `npm install; npm run build`.
- Result: blocked by Windows PowerShell execution policy, which prevented `npm.ps1` from running.
- Error evidence: `File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.`

### Phase 4 Immediate Next Actions
1. Re-run the install/build validation after enabling script execution in the local terminal or using a non-restricted shell.
2. Configure the Vercel staging deployment and capture the public HTTPS URL.
3. Prepare the test cohort brief, consent language, and data collection sheet.
4. Record the user testing results in the QA artifacts and make the decision gate recommendation.

---
