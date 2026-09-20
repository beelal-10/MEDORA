'use client';

import React from 'react';
import { MatchResult, ExplanationResult, Language } from '@/types';
import { getTranslation } from '@/lib/i18n';
import { CheckCircle2, AlertOctagon, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import Disclaimer from './Disclaimer';

interface ResultCardProps {
  matchResult: MatchResult;
  explanation: ExplanationResult | null;
  language: Language;
  onReset: () => void;
}

export default function ResultCard({ matchResult, explanation, language, onReset }: ResultCardProps) {
  const t = getTranslation(language);
  const isHausa = language === 'ha';

  // LOW-CONFIDENCE REFUSAL CARD
  if (matchResult.status === 'LOW_CONFIDENCE_REFUSAL' || !matchResult.medicine) {
    return (
      <div className="w-full max-w-xl mx-auto my-6 bg-white border border-rose-200 rounded-2xl p-6 shadow-md shadow-rose-50">
        <div className="flex items-center gap-3 text-rose-700 mb-4 border-b border-rose-100 pb-3">
          <AlertOctagon className="w-7 h-7 text-rose-600 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold">{t.refusalNotice}</h3>
            <p className="text-xs text-rose-500 font-mono">
              Match Confidence: {Math.round(matchResult.confidence * 100)}% (&lt; 70% threshold)
            </p>
          </div>
        </div>

        <p className="text-slate-700 text-sm leading-relaxed mb-6">
          {t.refusalMessage}
        </p>

        <Disclaimer language={language} />

        <button
          onClick={onReset}
          className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          {t.scanAnother}
        </button>
      </div>
    );
  }

  const { medicine } = matchResult;

  return (
    <div className="w-full max-w-2xl mx-auto my-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-100">
      {/* Verified Badge Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          <span className="font-bold text-slate-900 text-lg sm:text-xl">
            {medicine.brand_name}
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          {t.confidenceHigh} ({Math.round(matchResult.confidence * 100)}%)
        </span>
      </div>

      {/* Grid Key Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-xl text-sm">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t.genericName}</p>
          <p className="font-medium text-slate-900">{medicine.generic_name}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t.strength}</p>
          <p className="font-medium text-slate-900">{medicine.strength} ({medicine.dosage_form})</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t.manufacturer}</p>
          <p className="font-medium text-slate-900">{medicine.manufacturer}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t.nafdacNo}</p>
          <p className="font-mono text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded inline-block">
            {medicine.nafdac_reg_number}
          </p>
        </div>
      </div>

      {/* Uses & Warnings Sections */}
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            {t.uses}
          </h4>
          <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 pl-1">
            {(explanation?.simplified_uses || (isHausa ? medicine.uses.ha : medicine.uses.en)).map((use, idx) => (
              <li key={idx}>{use}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-amber-900 text-sm mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            {t.warnings}
          </h4>
          <ul className="list-disc list-inside text-sm text-amber-950 space-y-1 pl-1 bg-amber-50/60 p-3 rounded-lg border border-amber-100">
            {(explanation?.simplified_warnings || (isHausa ? medicine.warnings.ha : medicine.warnings.en)).map((warn, idx) => (
              <li key={idx}>{warn}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            {t.sideEffects}
          </h4>
          <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1">
            {(explanation?.simplified_side_effects || (isHausa ? medicine.side_effects.ha : medicine.side_effects.en)).map((effect, idx) => (
              <li key={idx}>{effect}</li>
            ))}
          </ul>
        </div>
      </div>

      <Disclaimer language={language} />

      <button
        onClick={onReset}
        className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all mt-4"
      >
        <RefreshCw className="w-4 h-4" />
        {t.scanAnother}
      </button>
    </div>
  );
}
