import React from 'react';
import seedMedicines from '@/data/seed-medicines.json';

const recentAuditEvents = [
  { id: 'evt-1', match_status: 'EXACT_MATCH', confidence: 0.94, language: 'en', timestamp: '2026-09-20T17:59:00Z' },
  { id: 'evt-2', match_status: 'FUZZY_MATCH', confidence: 0.82, language: 'ha', timestamp: '2026-09-20T17:58:15Z' },
  { id: 'evt-3', match_status: 'LOW_CONFIDENCE_REFUSAL', confidence: 0.31, language: 'en', timestamp: '2026-09-20T17:57:40Z' }
];

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl p-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">MEDORA Medicine Database Admin</h1>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Seed records</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{seedMedicines.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Active review</p>
          <p className="mt-2 text-3xl font-black text-slate-900">Phase 3</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Rate limit</p>
          <p className="mt-2 text-3xl font-black text-slate-900">20/min</p>
        </div>
      </div>

      <div className="mb-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-100 font-semibold text-slate-700">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Brand Name</th>
              <th className="p-3">Generic Name</th>
              <th className="p-3">Strength</th>
              <th className="p-3">NAFDAC Reg</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {seedMedicines.map((med) => (
              <tr key={med.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono text-xs">{med.id}</td>
                <td className="p-3 font-medium">{med.brand_name}</td>
                <td className="p-3">{med.generic_name}</td>
                <td className="p-3">{med.strength}</td>
                <td className="p-3 font-mono text-xs">{med.nafdac_reg_number}</td>
                <td className="p-3">
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                    Verified
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-100 font-semibold text-slate-700">
            <tr>
              <th className="p-3">Time</th>
              <th className="p-3">Result</th>
              <th className="p-3">Confidence</th>
              <th className="p-3">Language</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {recentAuditEvents.map((event) => (
              <tr key={event.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono text-xs">{event.timestamp}</td>
                <td className="p-3">{event.match_status}</td>
                <td className="p-3">{(event.confidence * 100).toFixed(0)}%</td>
                <td className="p-3 uppercase">{event.language}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
