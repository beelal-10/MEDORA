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
    <div className="inline-flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
      <Globe className="w-4 h-4 text-slate-500 ml-2 mr-1" />
      <button
        onClick={() => onLanguageChange('en')}
        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
          language === 'en'
            ? 'bg-white text-sky-700 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        English
      </button>
      <button
        onClick={() => onLanguageChange('ha')}
        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
          language === 'ha'
            ? 'bg-sky-600 text-white shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        Hausa
      </button>
    </div>
  );
}
