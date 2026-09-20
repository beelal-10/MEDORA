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
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6 text-amber-900 text-sm flex gap-3 items-start shadow-sm">
      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-bold mb-1 text-amber-950 flex items-center gap-2">
          {t.disclaimerTitle}
        </h4>
        <p className="text-amber-800 text-xs leading-relaxed">
          {t.disclaimerBody}
        </p>
      </div>
    </div>
  );
}
