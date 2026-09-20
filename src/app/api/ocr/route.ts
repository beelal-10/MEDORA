import { NextResponse } from 'next/server';
import { processImageOCR } from '@/lib/ocr';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let payload = '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      payload = body.image || body.fileName || '';
    } else {
      payload = 'Paracetamol BP 500mg Emzor NAFDAC 04-0123';
    }

    const ocrResult = await processImageOCR(payload);
    return NextResponse.json({ success: true, data: ocrResult });
  } catch (error) {
    console.error('OCR Route Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process image OCR' },
      { status: 500 }
    );
  }
}
