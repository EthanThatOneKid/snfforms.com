import { ImageResponse } from 'next/og';
import { getFormById } from '@/lib/sheets';

export default async function Image({
  params,
  searchParams,
}: {
  params: { formId: string };
  searchParams: { facility?: string };
}) {
  const { formId } = params;
  const { facility } = searchParams;
  const form = await getFormById(formId);

  if (!form) {
    return new Response('Not Found', { status: 404 });
  }

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        backgroundImage:
          'radial-gradient(circle at 50% 50%, #111 0%, #000 100%)',
        padding: '80px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
          borderLeft: '4px solid #fff',
          paddingLeft: '40px',
        }}
      >
        {facility && (
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: '#fff',
              opacity: 0.6,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '20px',
            }}
          >
            Exclusively for {facility}
          </div>
        )}
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#fff',
            opacity: 0.4,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            marginBottom: '10px',
          }}
        >
          {form.category} • {form.formId}
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.1,
            maxWidth: '800px',
          }}
        >
          {form.description}
        </div>
        <div
          style={{
            marginTop: '40px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: '#fff',
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '12px 24px',
              borderRadius: '8px',
            }}
          >
            SNF Printing
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
