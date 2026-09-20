import { NextResponse } from 'next/server';
import { matchMedicine } from '@/lib/matcher';
import { OCRResult } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ocrResult: OCRResult = body.ocrResult;

    if (!ocrResult || !ocrResult.extracted_keywords) {
      return NextResponse.json(
        { success: false, error: 'Invalid OCR payload' },
        { status: 400 }
      );
    }

    const matchResult = await matchMedicine(ocrResult);
    return NextResponse.json({ success: true, data: matchResult });
  } catch (error) {
    console.error('Identify Route Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to identify medicine' },
      { status: 500 }
    );
  }
}
