import { NextRequest, NextResponse } from 'next/server';
import { getForms } from '@/lib/sheets';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category');
    const q = searchParams.get('q')?.toLowerCase();

    let forms = await getForms();

    if (category) {
      forms = forms.filter(
        (form) => form.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (q) {
      forms = forms.filter((form) => form.formId.toLowerCase().includes(q));
    }

    return NextResponse.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forms' },
      { status: 500 }
    );
  }
}
