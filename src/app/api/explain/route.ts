import { NextResponse } from 'next/server';
import { generateConstrainedExplanation } from '@/lib/ai';
import { Medicine, Language } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const medicine: Medicine = body.medicine;
    const language: Language = body.language || 'en';

    if (!medicine || !medicine.id) {
      return NextResponse.json(
        { success: false, error: 'Invalid medicine payload' },
        { status: 400 }
      );
    }

    const explanation = await generateConstrainedExplanation(medicine, language);
    return NextResponse.json({ success: true, data: explanation });
  } catch (error) {
    console.error('Explain Route Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate explanation' },
      { status: 500 }
    );
  }
}
