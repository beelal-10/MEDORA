import { MatchResult, Medicine, OCRResult } from '@/types';
import { getVerifiedMedicines } from './db';

const CONFIDENCE_THRESHOLD = 0.70;

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+/\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => word.length > 1);
}

function scoreAgainstKeywords(tokens: string[], targetKeywords: string[]): number {
  if (!tokens.length || !targetKeywords.length) {
    return 0;
  }

  let hits = 0;
  const uniqueTargets = new Set(targetKeywords);

  const targetList = Array.from(uniqueTargets);

  for (const token of tokens) {
    for (const target of targetList) {
      if (token === target || target.includes(token) || token.includes(target)) {
        hits += 1;
        break;
      }
    }
  }

  return hits / Math.max(targetKeywords.length, 1);
}

function calculateMatchScore(ocr: OCRResult, medicine: Medicine): number {
  const ocrTokens = Array.from(new Set([
    ...ocr.extracted_keywords,
    ...tokenize(ocr.raw_text),
    ...tokenize(ocr.candidate_brand_name || ''),
    ...tokenize(ocr.candidate_generic_name || ''),
    ...tokenize(ocr.candidate_strength || ''),
    ...tokenize(ocr.candidate_manufacturer || '')
  ]));

  const brandKeywords = tokenize(medicine.brand_name);
  const genericKeywords = tokenize(medicine.generic_name);
  const activeKeywords = medicine.active_ingredients.flatMap((ingredient) => tokenize(ingredient));
  const manufacturerKeywords = tokenize(medicine.manufacturer);
  const strengthKeywords = tokenize(medicine.strength);

  const weightedScore =
    scoreAgainstKeywords(ocrTokens, brandKeywords) * 2.8 +
    scoreAgainstKeywords(ocrTokens, genericKeywords) * 2.2 +
    scoreAgainstKeywords(ocrTokens, strengthKeywords) * 1.8 +
    scoreAgainstKeywords(ocrTokens, manufacturerKeywords) * 1.1 +
    scoreAgainstKeywords(ocrTokens, activeKeywords) * 1.6;

  const totalWeight = 2.8 + 2.2 + 1.8 + 1.1 + 1.6;
  const normalized = weightedScore / totalWeight;

  return Math.min(Math.max(normalized, 0), 0.99);
}

/**
 * Matches OCR extracted text against verified DB records.
 * Strictly enforces >= 0.70 confidence threshold refusal guardrail.
 */
export async function matchMedicine(ocr: OCRResult): Promise<MatchResult> {
  const medicines = await getVerifiedMedicines();

  let bestMatch: Medicine | null = null;
  let highestScore = 0;

  for (const med of medicines) {
    const score = calculateMatchScore(ocr, med);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = med;
    }
  }

  if (highestScore < CONFIDENCE_THRESHOLD || !bestMatch) {
    return {
      status: 'LOW_CONFIDENCE_REFUSAL',
      confidence: highestScore,
      medicine: null,
      refusal_reason: 'Match confidence below 70% threshold. Refusing to guess medicine identity for clinical safety.'
    };
  }

  return {
    status: highestScore >= 0.90 ? 'EXACT_MATCH' : 'FUZZY_MATCH',
    confidence: highestScore,
    medicine: bestMatch
  };
}
