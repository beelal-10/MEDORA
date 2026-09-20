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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-sky-600 text-white shadow-lg shadow-emerald-200/80">
            <Pill className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-[-0.04em] text-slate-900 sm:text-xl">
                {t.appTitle}
              </h1>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Verified
              </span>
            </div>
            <p className="hidden text-[11px] text-slate-500 sm:block">{t.appSubtitle}</p>
          </div>
        </div>

        <LanguageToggle language={language} onLanguageChange={onLanguageChange} />
      </div>
    </header>
  );
}
