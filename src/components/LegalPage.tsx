'use client';

import React from 'react';
import Link from 'next/link';

interface LegalPageProps {
  title: string;
  intro: string;
  sections: Array<{
    heading: string;
    body: string[];
  }>;
}

export default function LegalPage({ title, intro, sections }: LegalPageProps) {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:py-12">
      <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
          MEDORA
        </div>
        <h1 className="text-3xl font-black tracking-[-0.06em] text-slate-900 sm:text-4xl">{title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">{intro}</p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <section key={section.heading} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-900">{section.heading}</h2>
            <div className="space-y-3 text-sm leading-relaxed text-slate-700">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Back to scan
        </Link>
        <Link
          href="/about"
          className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          About MEDORA
        </Link>
      </div>
    </main>
  );
}
