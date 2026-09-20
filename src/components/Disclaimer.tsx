'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Language } from '@/types';
import { getTranslation } from '@/lib/i18n';

interface DisclaimerProps {
  language: Language;
}

export default function Disclaimer({ language }: DisclaimerProps) {
  const t = getTranslation(language);

  return (
    <div className="my-6 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900 shadow-sm shadow-amber-100/60">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div>
          <h4 className="mb-1 text-sm font-bold text-amber-950">{t.disclaimerTitle}</h4>
          <p className="text-xs leading-relaxed text-amber-800">{t.disclaimerBody}</p>
        </div>
      </div>
    </div>
  );
}
