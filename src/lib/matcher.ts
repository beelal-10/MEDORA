import { MatchResult, Medicine, OCRResult } from '@/types';
import { getVerifiedMedicines } from './db';

const CONFIDENCE_THRESHOLD = 0.70;

/**
 * Calculates similarity score between OCR keywords and a medicine record.
 */
function calculateMatchScore(ocrKeywords: string[], medicine: Medicine): number {
  const brandKeywords = medicine.brand_name.toLowerCase().split(/\s+/);
  const genericKeywords = medicine.generic_name.toLowerCase().split(/\s+/);
  const activeKeywords = medicine.active_ingredients.flatMap(i => i.toLowerCase().split(/\s+/));
  const manufacturerKeywords = medicine.manufacturer.toLowerCase().split(/\s+/);

  let hits = 0;
  let totalTargets = brandKeywords.length + genericKeywords.length;

  for (const keyword of ocrKeywords) {
    if (brandKeywords.some(b => b.includes(keyword) || keyword.includes(b))) {
      hits += 2; // Higher weight for brand name match
    }
    if (genericKeywords.some(g => g.includes(keyword) || keyword.includes(g))) {
      hits += 1.5;
    }
    if (activeKeywords.some(a => a.includes(keyword) || keyword.includes(a))) {
      hits += 1;
    }
    if (manufacturerKeywords.some(m => m.includes(keyword) || keyword.includes(m))) {
      hits += 0.5;
    }
  }

  const normalizedScore = hits / Math.max(totalTargets, 1);
  return Math.min(normalizedScore, 0.99);
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
    const score = calculateMatchScore(ocr.extracted_keywords, med);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = med;
    }
  }

  // Refusal Guardrail: If confidence < 70%, refuse to guess!
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
