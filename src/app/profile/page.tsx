import Link from 'next/link';

export default function ProfilePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col px-4 py-12 sm:px-6">
      <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-3 text-3xl font-black tracking-[-0.06em] text-slate-900">Profile</h1>
        <p className="mb-6 text-sm leading-relaxed text-slate-600">
          This is a protected-profile placeholder for future Supabase Auth integration. The prototype currently shows the expected shell only.
        </p>

        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-medium text-slate-900">Account status</p>
          <p className="mt-2">Signed out (prototype placeholder)</p>
        </div>

        <div className="mt-8">
          <Link href="/auth" className="text-sm font-medium text-sky-700 hover:text-sky-800">
            Go to sign-in page
          </Link>
        </div>
      </div>
    </main>
  );
}
