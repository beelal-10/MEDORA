# 🌿 MEDORA Web Platform

> **Understand Your Medicine, in Your Language**  
> *Developed by Chosen Technologies | Next.js + TypeScript + Tailwind CSS*

MEDORA is an AI-assisted health accessibility web platform designed to scan medicine packaging, accurately identify verified medications against an authoritative NAFDAC-aligned database, and provide clear, simplified explanations in **Hausa** and **English**.

---

## 📋 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture & Workflow](#-system-architecture--workflow)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Environment Configuration](#-environment-configuration)
- [How to Start & Run](#-how-to-start--run)
- [Available Scripts](#-available-scripts)
- [Clinical Safety & Guardrails](#-clinical-safety--guardrails)
- [License & Credits](#-license--credits)

---

## 💡 Overview

In many regions across Northern Nigeria and West Africa, language barriers and low health literacy make understanding prescription and over-the-counter medicine information challenging. **MEDORA** bridges this gap by offering:
1. Instant text recognition from package photographs.
2. Verified lookup against a curated database of NAFDAC-registered medicines.
3. Culturally adapted and simplified information in **Hausa** and **English**.
4. Strict safety refusal guardrails to prevent medical hallucination or unverified dosage recommendations.

---

## ✨ Key Features

- 📸 **Packaging Image Scan**: Drag-and-drop or file upload for medication packaging photos (JPEG/PNG).
- 👁️ **Optical Character Recognition (OCR)**: In-memory text extraction using Google Cloud Vision API, Azure Computer Vision, or offline Mock OCR.
- 🎯 **Verifiable Database Matcher**: Exact and fuzzy matching algorithm enforcing a strict **$\ge 70\%$ confidence threshold** to eliminate hallucinated medicine names.
- 🌐 **Bilingual Support (Hausa & English)**: Toggle between Hausa (`ha`) and English (`en`) with persistent language preference storage.
- 🛡️ **Constrained Explanations**: Rephrases only verified database fields; strictly blocks unapproved medical advice, diagnostic claims, or dosage alterations.
- 🔒 **Privacy & Transient Processing**: Package images are processed transiently in memory and discarded immediately after text extraction.

---

## 🏗️ System Architecture & Workflow

```
[ User Browser ]
       │
       │ 1. Upload Package Photo
       ▼
 🖼️  UploadBox Component ──► 2. POST /api/ocr ──► 🌐 Vision API (Google/Azure/Mock)
                                                     │
                                                     ▼ 3. Extracted Candidate Text
                                            🎯 Matcher Engine (lib/matcher.ts)
                                                     │
                                                     ▼ 4. Query Verified DB
                                            🗄️ Supabase / Seed Medicine DB
                                                     │
               ┌─────────────────────────────────────┴─────────────────────────────────────┐
               │ Match Confidence < 70%                                                    │ Match Confidence >= 70%
               ▼                                                                           ▼
 🚫 Low-Confidence Refusal Notice                                            🤖 Constrained LLM (OpenAI/Anthropic/Mock)
               │                                                                           │
               │                                                                           ▼ 5. Simplified Hausa/English
               └─────────────────────────────────────┬─────────────────────────────────────┘
                                                     │
                                                     ▼
                                            📊 Bilingual ResultCard + Disclaimer
```

---

## 📁 Project Structure

```
MEDORA/
├── public/                 # Static assets and public resources
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── page.tsx        # Main landing, upload & result UI shell
│   │   ├── layout.tsx      # Root layout, HTML metadata & responsive shell
│   │   └── api/            # API endpoints
│   │       ├── ocr/        # POST: Packaging OCR text extraction
│   │       ├── identify/   # POST: Exact/fuzzy DB matching & confidence score
│   │       └── explain/    # POST: Constrained Hausa/English explanation engine
│   ├── components/         # React UI components
│   │   ├── Header.tsx          # Navigation header & brand logo
│   │   ├── UploadBox.tsx       # Drag-and-drop image uploader
│   │   ├── LanguageToggle.tsx  # Hausa / English locale selector
│   │   └── Disclaimer.tsx      # Prominent safety disclaimer banner
│   ├── lib/                # Core platform libraries
│   │   ├── ocr.ts          # OCR provider integration (Google, Azure, Mock)
│   │   ├── matcher.ts      # Fuzzy matching algorithm & refusal guardrail
│   │   ├── ai.ts           # Constrained LLM prompt engine
│   │   ├── db.ts           # Supabase database client wrapper
│   │   └── i18n.ts         # Internationalization dictionary & locale state
│   ├── data/               # Local seed JSON dataset (5-10 verified medicines)
│   └── types/              # TypeScript definitions & data models
├── supabase/               # Database migrations & SQL seed scripts
├── .env.example            # Environment template for keys & endpoints
├── package.json            # Project dependencies & scripts
├── implementation.md       # Technical prototype implementation plan
└── README.md               # Project documentation & start guide
```

---

## ⚙️ Prerequisites

Before running MEDORA, make sure you have installed:
- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.0.0` or higher (comes bundled with Node.js)

Verify your installation:
```bash
node -v
npm -v
```

---

## 🔧 Environment Configuration

1. Copy the sample environment file to create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and configure your settings:
   ```env
   # Next.js App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Supabase Database Configuration (Optional for mock mode)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   # OCR Provider Configuration (google_vision | azure_vision | mock)
   OCR_PROVIDER=mock
   GOOGLE_VISION_API_KEY=your_google_cloud_vision_api_key
   AZURE_VISION_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
   AZURE_VISION_KEY=your_azure_vision_key

   # Constrained LLM Provider Configuration (openai | anthropic | mock)
   LLM_PROVIDER=mock
   OPENAI_API_KEY=sk-your-openai-api-key
   ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key
   ```
   > 💡 **Development Tip**: You can leave `OCR_PROVIDER=mock` and `LLM_PROVIDER=mock` to test the platform locally without requiring active API keys.

---

## 🚀 How to Start & Run

Follow these steps to get the development server running locally:

### 1. Clone the Repository
```bash
git clone https://github.com/ChosenTechnologies/MEDORA.git
cd MEDORA
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env.local
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Access the Web Application
Open your web browser and navigate to:
```
http://localhost:3000
```

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server at `http://localhost:3000` |
| `npm run build` | Builds the optimized production application |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Executes ESLint to check for code quality issues |

---

## 🔒 Clinical Safety & Guardrails

1. **Strict Match Threshold ($\ge 70\%$)**: If a scanned packaging photo cannot be matched to an authoritative database record with high confidence, MEDORA issues a **Low-Confidence Refusal Notice** (*"Ina Neman Gafara / Unable to Identify Confidently"*). It will never guess or invent medicine details.
2. **Constrained LLM Prompting**: Explanations in Hausa and English are generated strictly from verified database fields. LLMs are prohibited from offering dosage advice, diagnosing conditions, or altering usage instructions.
3. **Transient Image Handling**: Scanned packaging images are processed strictly in-memory during OCR and immediately deleted post-extraction.

---

## 🤝 License & Credits

- **Proposed & Maintained By**: Chosen Technologies  
- **Technical Lead**: Jamil Muhammad Abdullahi (CTO)  
- **Author**: RahinatuHumaiza Hassan  
- **Version**: 1.0 (Prototype)
