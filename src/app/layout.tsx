import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MEDORA - Understand Your Medicine, in Your Language',
  description: 'AI-assisted health accessibility platform providing verified medicine identification and simplified explanations in Hausa and English.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
