'use client';

import React from 'react';
import { Pill } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import { Language } from '@/types';
import { getTranslation } from '@/lib/i18n';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Header({ language, onLanguageChange }: HeaderProps) {
  const t = getTranslation(language);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-200">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {t.appTitle}
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                Verified DB
              </span>
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">{t.appSubtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageToggle language={language} onLanguageChange={onLanguageChange} />
        </div>
      </div>
    </header>
  );
}
