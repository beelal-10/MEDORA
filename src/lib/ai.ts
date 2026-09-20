import { ExplanationResult, Language, Medicine } from '@/types';

/**
 * Constrained explanation prompt generator.
 * Strictly rephrases verified database records into simple English or Hausa.
 * NEVER adds unverified medical claims, diagnostic advice, or dosage recommendations.
 */
export async function generateConstrainedExplanation(
  medicine: Medicine,
  language: Language
): Promise<ExplanationResult> {
  const isHausa = language === 'ha';

  const disclaimer = isHausa
    ? "MEDORA tana samar da bayanan ilimantarwa ne kawai wadanda aka tattara daga madogara masu tabbaci. Wannan BAZAI zama maimakon shawarar likita ko masanin magani ba."
    : "MEDORA provides simplified educational information derived from verified medical reference data. It does NOT substitute professional medical advice, diagnosis, or treatment.";

  // Strictly use pre-reviewed verified translations from database record
  return {
    medicine_id: medicine.id,
    brand_name: medicine.brand_name,
    language,
    simplified_uses: isHausa ? medicine.uses.ha : medicine.uses.en,
    simplified_warnings: isHausa ? medicine.warnings.ha : medicine.warnings.en,
    simplified_side_effects: isHausa ? medicine.side_effects.ha : medicine.side_effects.en,
    disclaimer
  };
}
