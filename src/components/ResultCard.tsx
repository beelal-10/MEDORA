'use client';

import React from 'react';
import { MatchResult, ExplanationResult, Language } from '@/types';
import { getTranslation } from '@/lib/i18n';
import { CheckCircle2, AlertOctagon, ShieldCheck, AlertCircle, RefreshCw, Pill } from 'lucide-react';
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

  if (matchResult.status === 'LOW_CONFIDENCE_REFUSAL' || !matchResult.medicine) {
    return (
      <div className="mx-auto my-6 w-full max-w-xl rounded-[28px] border border-rose-200 bg-white p-6 shadow-lg shadow-rose-100/60">
        <div className="mb-4 flex items-center gap-3 border-b border-rose-100 pb-3 text-rose-700">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100">
            <AlertOctagon className="h-6 w-6 text-rose-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold">{t.refusalNotice}</h3>
            <p className="font-mono text-[11px] text-rose-500">
              Match Confidence: {Math.round(matchResult.confidence * 100)}% (&lt; 70% threshold)
            </p>
          </div>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-slate-700">{t.refusalMessage}</p>

        <Disclaimer language={language} />

        <button
          onClick={onReset}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800"
        >
          <RefreshCw className="h-4 w-4" />
          {t.scanAnother}
        </button>
      </div>
    );
  }

  const { medicine } = matchResult;

  return (
    <div className="mx-auto my-6 w-full max-w-2xl rounded-[30px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100/80 sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Verified product</p>
            <h3 className="text-xl font-black tracking-[-0.05em] text-slate-900">{medicine.brand_name}</h3>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
          <ShieldCheck className="h-3.5 w-3.5" />
          {t.confidenceHigh} ({Math.round(matchResult.confidence * 100)}%)
        </span>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t.genericName}</p>
          <p className="font-medium text-slate-900">{medicine.generic_name}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t.strength}</p>
          <p className="font-medium text-slate-900">{medicine.strength}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Dosage form</p>
          <p className="font-medium text-slate-900">{medicine.dosage_form}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t.manufacturer}</p>
          <p className="font-medium text-slate-900">{medicine.manufacturer}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t.nafdacNo}</p>
          <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 font-mono text-xs font-semibold text-sky-700">
            {medicine.nafdac_reg_number}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
            <span className="h-2 w-2 rounded-full bg-sky-500"></span>
            {t.uses}
          </h4>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {(explanation?.simplified_uses || (isHausa ? medicine.uses.ha : medicine.uses.en)).map((use, idx) => (
              <li key={idx}>{use}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-900">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            {t.warnings}
          </h4>
          <ul className="list-disc space-y-1 rounded-xl border border-amber-100 bg-amber-50/80 p-3 pl-5 text-sm text-amber-950">
            {(explanation?.simplified_warnings || (isHausa ? medicine.warnings.ha : medicine.warnings.en)).map((warn, idx) => (
              <li key={idx}>{warn}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
            <span className="h-2 w-2 rounded-full bg-slate-400"></span>
            {t.sideEffects}
          </h4>
          <ul className="list-disc space-y-1 pl-5 text-xs text-slate-600">
            {(explanation?.simplified_side_effects || (isHausa ? medicine.side_effects.ha : medicine.side_effects.en)).map((effect, idx) => (
              <li key={idx}>{effect}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
            <Pill className="h-4 w-4 text-emerald-600" />
            {t.storage}
          </h4>
          <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            {isHausa ? medicine.storage.ha : medicine.storage.en}
          </p>
        </div>
      </div>

      <Disclaimer language={language} />

      <button
        onClick={onReset}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-sky-700"
      >
        <RefreshCw className="h-4 w-4" />
        {t.scanAnother}
      </button>
    </div>
  );
}
