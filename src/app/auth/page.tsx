import Link from 'next/link';

export default function AuthPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col justify-center px-4 py-12 sm:px-6">
      <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Sign in
        </div>

        <h1 className="mb-3 text-3xl font-black tracking-[-0.06em] text-slate-900">MEDORA account</h1>
        <p className="mb-8 text-sm leading-relaxed text-slate-600">
          This prototype includes a placeholder auth page for future Supabase identity integration. It is not yet connected to live sign-in providers.
        </p>

        <div className="space-y-3">
          <button className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Continue with Google
          </button>
          <button className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
            Continue with email
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Prototype placeholder — auth will be connected once the release configuration is ready.
        </div>

        <div className="mt-8">
          <Link href="/" className="text-sm font-medium text-sky-700 hover:text-sky-800">
            Return to scan page
          </Link>
        </div>
      </div>
    </main>
  );
}
