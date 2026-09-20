# MEDORA: Quality Assurance & Codebase Audit Report

> **Lead QA Engineer**: Antigravity QA Lead / Quality Assurance Team  
> **Timestamp**: 2026-09-20T17:16:00+01:00  
> **Project**: MEDORA (Understand Your Medicine, in Your Language)  
> **Document Status**: APPEND-ONLY AUDIT LOG

---

## 1. Audit Executive Summary

A comprehensive quality assurance audit was conducted on the complete MEDORA web platform codebase (`c:\Users\admin\Desktop\MEDORA`). The audit evaluated:
1. **Requirements Traceability**: Alignment with the CTO PRD (Upload $\rightarrow$ OCR $\rightarrow$ Match $\rightarrow$ Constrained LLM loop).
2. **Build & Environment Readiness**: Verification of dependencies, scripts, and local development binaries.
3. **Type Safety & Data Integrity**: Cross-verification of TypeScript interface definitions (`types/index.ts`) against function implementations.
4. **Safety Guardrails & Refusal Rules**: Verification of low-confidence refusal thresholds ($<70\%$) and clinical disclaimer enforcement.
5. **Internationalization & Localization**: Verification of Hausa (`ha`) and English (`en`) translation keys and toggle state persistence.

---

## 2. Identified Defect Log

### DEFECT-001: Missing `node_modules` Dependencies causing `npm run dev` / `npm run build` failure
- **Date/Time**: 2026-09-20T17:07:59+01:00
- **Defect Classification**: Environment / Build Blocker
- **Severity**: **BLOCKER** (P1)
- **Requirement Reference**: PRD Section 8.2 (Next.js 14/15 + TypeScript stack) & Phase 0 Roadmap
- **Steps to Reproduce**:
  1. Open command line in `c:\Users\admin\Desktop\MEDORA`.
  2. Execute `npm run dev` or `npm run build`.
- **Expected Behavior**: Next.js development server launches on `http://localhost:3000`.
- **Actual Behavior**: Shell returns error `'next' is not recognized as an internal or external command, operable program or batch file.` due to missing `node_modules` directory.
- **Root Cause**: `npm install` was not executed after workspace initialization.
- **Handoff Note**: Senior Programmer must run `npm install` prior to launching dev server.

---

### DEFECT-002: Type Inconsistency in `OCRResult` (`raw_text` vs `rawText`)
- **Date/Time**: 2026-09-20T17:10:30+01:00
- **Defect Classification**: Data Integrity / Type Safety
- **Severity**: **MAJOR** (P2)
- **Requirement Reference**: PRD Section 5.2 (OCR Extraction) & Section 9 (Codebase Layout)
- **Steps to Reproduce**:
  1. Inspect [`src/types/index.ts`](file:///c:/Users/admin/Desktop/MEDORA/src/types/index.ts#L33-L38): defines `raw_text: string`.
  2. Inspect [`src/lib/ocr.ts`](file:///c:/Users/admin/Desktop/MEDORA/src/lib/ocr.ts#L29-L34): returns object `{ rawText, lines, confidence, extracted_keywords }`.
- **Expected Behavior**: Returned object key matches interface contract (`raw_text`).
- **Actual Behavior**: Returned object key is `rawText` (camelCase), causing `ocrResult.raw_text` to evaluate to `undefined` at runtime.
- **Handoff Note**: Senior Programmer should update `src/lib/ocr.ts` to return `raw_text: rawText`.

---

### DEFECT-003: Client Page Passes Filename String Instead of Image Content to OCR Processor
- **Date/Time**: 2026-09-20T17:10:14+01:00
- **Defect Classification**: Integration / Data Pipeline
- **Severity**: **MAJOR** (P2)
- **Requirement Reference**: PRD Section 5.1 (Image Input & Processing)
- **Steps to Reproduce**:
  1. Inspect [`src/app/page.tsx`](file:///c:/Users/admin/Desktop/MEDORA/src/app/page.tsx#L31): `const ocr = await processImageOCR(file.name);`.
  2. Upload an image named `my_package.jpg`.
- **Expected Behavior**: Image file binary/Base64 content is sent to OCR engine or via `/api/ocr` API route.
- **Actual Behavior**: Only the string `"my_package.jpg"` is passed to `processImageOCR`. Real package photos uploaded by users cannot be parsed.
- **Handoff Note**: Senior Programmer should convert `file` to base64 or FormData in `page.tsx` and invoke the `/api/ocr` endpoint.

---

### DEFECT-004: Direct API Route Bypass in `page.tsx` Client Component
- **Date/Time**: 2026-09-20T17:10:14+01:00
- **Defect Classification**: Architecture Alignment
- **Severity**: **MINOR** (P3)
- **Requirement Reference**: PRD Section 8.1 (High-Level Architecture: Client $\rightarrow$ API Route $\rightarrow$ Service)
- **Steps to Reproduce**:
  1. Inspect `src/app/page.tsx`: directly imports `@/lib/ocr`, `@/lib/matcher`, and `@/lib/ai` instead of calling `fetch('/api/ocr')`, `fetch('/api/identify')`, and `fetch('/api/explain')`.
- **Expected Behavior**: Frontend client invokes server-side Next.js API routes (`/api/*`).
- **Actual Behavior**: Frontend client imports backend helper modules directly.
- **Handoff Note**: Refactor `page.tsx` to call API routes via HTTP `fetch` for full backend segregation.

---

## 3. Verified Safety & Compliance Checks

| Safety Rule / Requirement | Status | Audit Findings |
| :--- | :--- | :--- |
| **Low-Confidence Refusal Guardrail** | **PASSED** | [`src/lib/matcher.ts`](file:///c:/Users/admin/Desktop/MEDORA/src/lib/matcher.ts) enforces `CONFIDENCE_THRESHOLD = 0.70`. Returns `LOW_CONFIDENCE_REFUSAL` when score $<0.70$. `ResultCard.tsx` renders clear refusal message without forced guesses. |
| **Constrained Explanation** | **PASSED** | [`src/lib/ai.ts`](file:///c:/Users/admin/Desktop/MEDORA/src/lib/ai.ts) returns strictly pre-reviewed verified database records (`medicine.uses`, `medicine.warnings`, `medicine.side_effects`). Prevents LLM hallucination. |
| **Prominent Disclaimer Banner** | **PASSED** | [`Disclaimer.tsx`](file:///c:/Users/admin/Desktop/MEDORA/src/components/Disclaimer.tsx) rendered on both landing page and result views in Hausa and English. |
| **Hausa / English i18n Scope** | **PASSED** | [`src/lib/i18n.ts`](file:///c:/Users/admin/Desktop/MEDORA/src/lib/i18n.ts) provides complete Hausa & English dictionaries with no missing keys. |

---

## 4. QA Sign-Off & Recommendations

- **Audit Status**: **PROVISIONAL SIGN-OFF WITH REMEDIATION ITEMS**
- **Immediate Action Items**:
  1. Complete `npm install` execution.
  2. Resolve DEFECT-002 (`raw_text` interface alignment).
  3. Resolve DEFECT-003 (Base64 file handoff to OCR).
