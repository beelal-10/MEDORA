import { NextResponse } from 'next/server';
import { Medicine } from '@/types';
import seedData from '@/data/seed-medicines.json';

const inMemoryMedicines: Medicine[] = [...(seedData as Medicine[])];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: inMemoryMedicines
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const medicine: Medicine = body.medicine || body;

    if (!medicine || !medicine.id || !medicine.brand_name) {
      return NextResponse.json(
        { success: false, error: 'Medicine payload is missing required fields.' },
        { status: 400 }
      );
    }

    const existingIndex = inMemoryMedicines.findIndex((item) => item.id === medicine.id);

    if (existingIndex >= 0) {
      inMemoryMedicines[existingIndex] = { ...inMemoryMedicines[existingIndex], ...medicine };
    } else {
      inMemoryMedicines.push(medicine);
    }

    return NextResponse.json({
      success: true,
      data: medicine
    });
  } catch (error) {
    console.error('Admin medicine route error:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to save medicine record.' },
      { status: 500 }
    );
  }
}
