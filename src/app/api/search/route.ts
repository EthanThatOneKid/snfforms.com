import { NextRequest, NextResponse } from 'next/server';
import { getForms } from '@/lib/sheets';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get('query')?.toLowerCase();
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let forms = await getForms();

    if (category) {
      forms = forms.filter(
        (form) => form.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (query) {
      forms = forms.filter(
        (form) =>
          form.formId.toLowerCase().includes(query) ||
          form.description.toLowerCase().includes(query) ||
          form.category.toLowerCase().includes(query)
      );
    }

    const total = forms.length;
    const results = forms.slice(offset, offset + limit);

    return NextResponse.json({
      results,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error searching forms:', error);
    return NextResponse.json(
      { error: 'Failed to search forms' },
      { status: 500 }
    );
  }
}
