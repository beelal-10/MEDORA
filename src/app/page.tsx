'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import UploadBox from '@/components/UploadBox';
import ResultCard from '@/components/ResultCard';
import Disclaimer from '@/components/Disclaimer';
import { Language, MatchResult, ExplanationResult } from '@/types';
import { getTranslation } from '@/lib/i18n';
import { processImageOCR } from '@/lib/ocr';
import { matchMedicine } from '@/lib/matcher';
import { generateConstrainedExplanation } from '@/lib/ai';

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [explanation, setExplanation] = useState<ExplanationResult | null>(null);

  const t = getTranslation(language);

  const handleImageSelected = async (file: File) => {
    setIsLoading(true);
    setMatchResult(null);
    setExplanation(null);

    try {
      // Step 1: OCR Extraction
      setLoadingStep(t.scanning);
      const ocr = await processImageOCR(file.name);

      // Step 2: Database Identification & Matching
      setLoadingStep(t.identifying);
      const match = await matchMedicine(ocr);
      setMatchResult(match);

      // Step 3: Constrained Explanation if matched
      if (match.status !== 'LOW_CONFIDENCE_REFUSAL' && match.medicine) {
        setLoadingStep(t.explaining);
        const exp = await generateConstrainedExplanation(match.medicine, language);
        setExplanation(exp);
      }
    } catch (err) {
      console.error('Scan pipeline error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMatchResult(null);
    setExplanation(null);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header language={language} onLanguageChange={setLanguage} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {!matchResult && (
          <>
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                {language === 'ha' ? 'Duba Maganinka a Saukake' : 'Scan & Understand Your Medicine'}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'ha'
                  ? 'Ɗauki hoto ko ka ɗora hoton rufin magani domin samun bayani ingantacce cikin Hausa ko Turanci.'
                  : 'Upload package photo to identify verified medicine details with strict refusal safety guardrails.'}
              </p>
            </div>

            <UploadBox
              language={language}
              onImageSelected={handleImageSelected}
              isLoading={isLoading}
              loadingStep={loadingStep}
            />

            <Disclaimer language={language} />
          </>
        )}

        {matchResult && (
          <ResultCard
            matchResult={matchResult}
            explanation={explanation}
            language={language}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4">
          <p>© 2026 Chosen Technologies | MEDORA Web Platform Prototype</p>
        </div>
      </footer>
    </div>
  );
}
