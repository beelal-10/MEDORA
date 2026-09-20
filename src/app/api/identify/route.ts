import { NextResponse } from 'next/server';
import { matchMedicine } from '@/lib/matcher';
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit';
import { logScanEvent } from '@/lib/scan-log';
import { OCRResult } from '@/types';

export async function POST(request: Request) {
  try {
    const clientKey = getClientIdentifier(request);
    const rateLimit = checkRateLimit(`identify:${clientKey}`, 20, 60000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many identification attempts. Please wait ${Math.ceil(rateLimit.retryAfterMs / 1000)}s and try again.`
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const ocrResult: OCRResult = body.ocrResult;

    if (!ocrResult || !ocrResult.extracted_keywords) {
      return NextResponse.json(
        { success: false, error: 'Invalid OCR payload' },
        { status: 400 }
      );
    }

    const matchResult = await matchMedicine(ocrResult);

    await logScanEvent({
      match_status: matchResult.status,
      confidence: matchResult.confidence,
      medicine_id: matchResult.medicine?.id,
      language: 'en'
    });

    return NextResponse.json({ success: true, data: matchResult });
  } catch (error) {
    console.error('Identify Route Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to identify medicine' },
      { status: 500 }
    );
  }
}
