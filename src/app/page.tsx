'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import UploadBox from '@/components/UploadBox';
import ResultCard from '@/components/ResultCard';
import Disclaimer from '@/components/Disclaimer';
import { Language, MatchResult, ExplanationResult } from '@/types';
import { getTranslation } from '@/lib/i18n';

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [explanation, setExplanation] = useState<ExplanationResult | null>(null);
  const [showScan, setShowScan] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('medora-language');
    if (savedLanguage === 'en' || savedLanguage === 'ha') {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('medora-language', language);
  }, [language]);

  const t = getTranslation(language);

  const handleImageSelected = async (file: File) => {
    setIsLoading(true);
    setMatchResult(null);
    setExplanation(null);

    try {
      setLoadingStep(t.scanning);

      const formData = new FormData();
      formData.append('image', file);

      const ocrResponse = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      const ocrPayload = await ocrResponse.json();
      if (!ocrResponse.ok || !ocrPayload.success) {
        throw new Error(ocrPayload.error || 'OCR request failed');
      }

      const ocr = ocrPayload.data;

      setLoadingStep(t.identifying);
      const identifyResponse = await fetch('/api/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ocrResult: ocr }),
      });

      const identifyPayload = await identifyResponse.json();
      if (!identifyResponse.ok || !identifyPayload.success) {
        throw new Error(identifyPayload.error || 'Identification request failed');
      }

      const match = identifyPayload.data as MatchResult;
      setMatchResult(match);

      if (match.status !== 'LOW_CONFIDENCE_REFUSAL' && match.medicine) {
        setLoadingStep(t.explaining);
        const explainResponse = await fetch('/api/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ medicine: match.medicine, language }),
        });

        const explainPayload = await explainResponse.json();
        if (!explainResponse.ok || !explainPayload.success) {
          throw new Error(explainPayload.error || 'Explanation request failed');
        }

        setExplanation(explainPayload.data as ExplanationResult);
      }
    } catch (err) {
      console.error('Scan pipeline error:', err);
      setMatchResult({
        status: 'LOW_CONFIDENCE_REFUSAL',
        confidence: 0,
        medicine: null,
        refusal_reason: 'Unable to complete the scan pipeline securely.'
      });
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleReset = () => {
    setMatchResult(null);
    setExplanation(null);
    setShowScan(false);
  };

  const featureCards = [
    {
      title: language === 'ha' ? 'Hoton Magani' : 'Medicine Scan',
      text:
        language === 'ha'
          ? 'Dauki hoto na rigar magani kuma ka sami bayani cikin sauri.'
          : 'Upload a package photo and get a quick, trusted medicine readout.'
    },
    {
      title: language === 'ha' ? 'Tabbaci' : 'Verified Match',
      text:
        language === 'ha'
          ? 'An yi daidaitawa da ingantaccen ajiyar magunguna ba tare da hasashe ba.'
          : 'Matching is checked against a verified medicine database before any result is shown.'
    },
    {
      title: language === 'ha' ? 'Hausa da Turanci' : 'Hausa & English',
      text:
        language === 'ha'
          ? 'Ana bayar da bayani cikin Hausa ko Turanci don saukin fahimta.'
          : 'Results can be explained in Hausa or English for easy understanding.'
    }
  ];

  return (
    <div className="flex flex-1 flex-col">
      <Header language={language} onLanguageChange={setLanguage} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:py-10">
        {!matchResult && (
          <>
            <section className="mb-12 grid gap-8 rounded-[32px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 shadow-sm sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
              <div className="flex flex-col justify-center">
                <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                  {language === 'ha' ? 'Bayanan lafiyar mutum' : 'Trusted health information'}
                </div>

                <h1 className="mb-4 text-4xl font-black tracking-[-0.08em] text-slate-900 sm:text-5xl">
                  {language === 'ha' ? 'Fahimci maganin ka, cikin harshen ka.' : 'Understand your medicine, in your language.'}
                </h1>

                <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                  {language === 'ha'
                    ? 'MEDORA yana taimaka maka ka gano magani da ingantaccen bayani cikin Hausa ko Turanci, ba tare da zancen da ba daidai ba.'
                    : 'MEDORA helps you identify medicines and read clearer explanations in Hausa or English, without guessing or inventing medical details.'}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setShowScan(true)}
                    className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    {language === 'ha' ? 'Fara duba magani' : 'Start scan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowScan(false)}
                    className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    {language === 'ha' ? 'Koyi game da MEDORA' : 'Learn more'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-center rounded-[28px] border border-slate-200 bg-white/80 p-5 shadow-sm">
                <div className="mb-4 rounded-2xl bg-slate-900 p-4 text-white">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">
                    {language === 'ha' ? 'Ayyuka' : 'How it works'}
                  </p>
                  <ol className="mt-4 space-y-3 text-sm text-slate-100">
                    <li>1. {language === 'ha' ? 'Dauki hoto na rufin magani' : 'Upload a medicine package photo'}</li>
                    <li>2. {language === 'ha' ? 'Ana karanta rubutun' : 'We read the text'}</li>
                    <li>3. {language === 'ha' ? 'Ana daidaitawa da ajiyar tabbaci' : 'We match against verified data'}</li>
                    <li>4. {language === 'ha' ? 'Ana bayar da bayani cikin fahimta' : 'We explain it clearly'}</li>
                  </ol>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                  <p className="font-semibold">{language === 'ha' ? 'Sanarwa ta tsaro' : 'Safety notice'}</p>
                  <p className="mt-2 leading-6 text-emerald-800">
                    {language === 'ha'
                      ? 'Ba mu yarda da hasashe na magani ba. Idan ba a iya tabbatarsa da kwarin gwiwa ba, za mu hana sakamakon.'
                      : 'We do not guess medicine details. If confidence is too low, we stop and refuse the result.'}
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-10 grid gap-4 md:grid-cols-3">
              {featureCards.map((card) => (
                <div key={card.title} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 h-10 w-10 rounded-full bg-emerald-100 text-lg font-black text-emerald-700 flex items-center justify-center">
                    ✓
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">{card.title}</h3>
                  <p className="text-sm leading-6 text-slate-600">{card.text}</p>
                </div>
              ))}
            </section>

            {showScan && (
              <section className="mb-10">
                <div className="mx-auto mb-6 max-w-2xl text-center">
                  <h2 className="text-2xl font-black tracking-[-0.06em] text-slate-900 sm:text-3xl">
                    {language === 'ha' ? 'Duba rufin magani' : 'Scan a medicine package'}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {language === 'ha'
                      ? 'Danna ko jallabi hoton magani don fara bincike.'
                      : 'Click or drop an image to begin the medicine verification flow.'}
                  </p>
                </div>

                <UploadBox
                  language={language}
                  onImageSelected={handleImageSelected}
                  isLoading={isLoading}
                  loadingStep={loadingStep}
                />

                <Disclaimer language={language} />
              </section>
            )}

            {!showScan && (
              <section className="mb-10 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      {language === 'ha' ? 'A cikin sauki' : 'Fast and clear'}
                    </p>
                    <h3 className="mt-2 text-2xl font-black tracking-[-0.05em] text-slate-900">
                      {language === 'ha' ? 'Yanzu fara duba magani ka' : 'Ready to check a medicine?'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowScan(true)}
                    className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    {language === 'ha' ? 'Fara duba magani' : 'Start now'}
                  </button>
                </div>
              </section>
            )}
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

      <footer className="border-t border-slate-200/80 bg-white/80 py-6 text-center text-[11px] tracking-wide text-slate-500">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p>© 2026 Chosen Technologies | MEDORA Web Platform Prototype</p>
        </div>
      </footer>
    </div>
  );
}
