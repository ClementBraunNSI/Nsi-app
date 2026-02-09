import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Cours NSI';
  const chapter = searchParams.get('chapter');

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: '#FFFBF5',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '20px solid #F97316',
          position: 'relative',
        }}
      >
        <div style={{ fontSize: 120, marginBottom: 20 }}>🦊</div>
        
        <div style={{ 
          color: '#1E293B', 
          fontWeight: 900, 
          textAlign: 'center', 
          maxWidth: '80%',
          lineHeight: 1.2,
          display: 'flex',
          justifyContent: 'center',
        }}>
          {title}
        </div>
        
        {chapter && (
          <div style={{ 
            fontSize: 40, 
            marginTop: 30, 
            color: '#EA580C', 
            textTransform: 'uppercase', 
            letterSpacing: 4,
            fontWeight: 700,
            background: 'rgba(255,255,255,0.8)',
            padding: '10px 30px',
            borderRadius: 50,
            border: '2px solid #FED7AA'
          }}>
            {chapter}
          </div>
        )}
        
        <div style={{
          position: 'absolute',
          bottom: 40,
          right: 50,
          fontSize: 30,
          color: '#94A3B8',
          fontWeight: 600,
        }}>
          nsi.xyz
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
