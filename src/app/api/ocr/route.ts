import { NextResponse } from 'next/server';
import { processImageOCR } from '@/lib/ocr';
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const clientKey = getClientIdentifier(request);
    const rateLimit = checkRateLimit(`ocr:${clientKey}`, 20, 60000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many OCR requests. Please wait ${Math.ceil(rateLimit.retryAfterMs / 1000)}s and try again.`
        },
        { status: 429 }
      );
    }

    const contentType = request.headers.get('content-type') || '';
    let payload: string | File = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const imageFile = formData.get('image');

      if (!(imageFile instanceof File)) {
        return NextResponse.json(
          { success: false, error: 'No valid image file was uploaded.' },
          { status: 400 }
        );
      }

      if (!imageFile.type.startsWith('image/')) {
        return NextResponse.json(
          { success: false, error: 'Only JPG and PNG image files are supported.' },
          { status: 400 }
        );
      }

      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: 'Image exceeds the 5MB upload limit.' },
          { status: 400 }
        );
      }

      payload = imageFile;
    } else {
      const body = await request.json().catch(() => ({}));
      payload = body.image || body.fileName || 'Paracetamol BP 500mg Emzor NAFDAC 04-0123';
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
