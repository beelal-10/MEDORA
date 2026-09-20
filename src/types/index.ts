export type Language = 'en' | 'ha';

export interface Medicine {
  id: string;
  brand_name: string;
  generic_name: string;
  active_ingredients: string[];
  strength: string;
  dosage_form: string;
  manufacturer: string;
  nafdac_reg_number: string;
  uses: {
    en: string[];
    ha: string[];
  };
  warnings: {
    en: string[];
    ha: string[];
  };
  side_effects: {
    en: string[];
    ha: string[];
  };
  storage: {
    en: string;
    ha: string;
  };
  verified: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OCRResult {
  raw_text: string;
  lines: string[];
  confidence: number;
  extracted_keywords: string[];
  candidate_brand_name?: string;
  candidate_generic_name?: string;
  candidate_strength?: string;
  candidate_manufacturer?: string;
}

export type MatchStatus = 'EXACT_MATCH' | 'FUZZY_MATCH' | 'LOW_CONFIDENCE_REFUSAL';

export interface MatchResult {
  status: MatchStatus;
  confidence: number;
  medicine: Medicine | null;
  refusal_reason?: string;
}

export interface ExplanationResult {
  medicine_id: string;
  brand_name: string;
  language: Language;
  simplified_uses: string[];
  simplified_warnings: string[];
  simplified_side_effects: string[];
  disclaimer: string;
}

export interface ScanLog {
  id: string;
  timestamp: string;
  match_status: MatchStatus;
  confidence: number;
  medicine_id?: string;
  language: Language;
}
