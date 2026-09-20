import React from 'react';
import seedMedicines from '@/data/seed-medicines.json';

export default function AdminPage() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">MEDORA Medicine Database Admin</h1>
      <p className="text-sm text-slate-600 mb-6">
        Verified Medicine Catalog ({seedMedicines.length} Seed Records)
      </p>

      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
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
                  <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-medium">
                    Verified
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
