import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MEDORA | Understand Your Medicine, in Your Language',
  description: 'A clear, verified medicine guide for Hausa and English users, designed to simplify medicine information without guessing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-transparent text-slate-900 flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
