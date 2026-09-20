'use client';

import React from 'react';
import { Language } from '@/types';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageToggle({ language, onLanguageChange }: LanguageToggleProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100/80 p-1.5 shadow-sm">
      <div className="hidden items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500 sm:flex">
        <Globe className="h-3.5 w-3.5" />
        {language === 'ha' ? 'Hausa' : 'English'}
      </div>

      <button
        onClick={() => onLanguageChange('en')}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
          language === 'en'
            ? 'bg-white text-sky-700 shadow-sm ring-1 ring-slate-200'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onLanguageChange('ha')}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
          language === 'ha'
            ? 'bg-sky-700 text-white shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        HA
      </button>
    </div>
  );
}
