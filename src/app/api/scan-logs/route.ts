import { NextResponse } from 'next/server';
import { getScanLogs } from '@/lib/scan-log';

export async function GET() {
  try {
    const logs = await getScanLogs(25);
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error('Scan logs route error:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to read scan logs.' },
      { status: 500 }
    );
  }
}
