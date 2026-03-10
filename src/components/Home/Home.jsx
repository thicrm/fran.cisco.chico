/**
 * Home / Landing - GMB-inspired split typography
 * Bold, minimal, editorial
 */
export default function Home() {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 300,
            color: '#ffffff',
            margin: 0,
          }}
        >
          [ARTIST
        </h1>
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 300,
            color: '#ffffff',
            margin: 0,
          }}
        >
          NAME]
        </h1>
      </div>
      <p
        style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '24px',
          maxWidth: '400px',
        }}
      >
        Musician • Bassist • Guitarist • Drummer • Producer • Content Creator
      </p>
      <p
        style={{
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.6)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        Open windows above to explore
      </p>
    </div>
  )
}
