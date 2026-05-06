import { useState, useMemo } from 'react'
import { t, tVars, weekdayHeaders } from '../../i18n'

/** Reference year for calendar grid (dates are PT-BR day/month from the brief) */
const SHOW_YEAR = 2025

/** TODO: replace with Francisco's real address */
const BOOKING_MAILTO = 'mailto:francisco@example.com'

/** PT-BR day/month order: 7/02 → 14/03 → 26/04 → 2/12 → 5/12 */
const SHOW_ITEMS = [
  {
    src: 'https://pub-da3fda702d23470fbab5a502b13cac38.r2.dev/sec%CC%A7a%CC%83o%20show%20/IMG_9378.PNG',
    day: 7,
    month: 2,
    year: SHOW_YEAR,
  },
  {
    src: 'https://pub-da3fda702d23470fbab5a502b13cac38.r2.dev/sec%CC%A7a%CC%83o%20show%20/IMG_9381.PNG',
    day: 14,
    month: 3,
    year: SHOW_YEAR,
  },
  {
    src: 'https://pub-da3fda702d23470fbab5a502b13cac38.r2.dev/sec%CC%A7a%CC%83o%20show%20/IMG_9377.PNG',
    day: 26,
    month: 4,
    year: SHOW_YEAR,
  },
  {
    src: 'https://pub-da3fda702d23470fbab5a502b13cac38.r2.dev/sec%CC%A7a%CC%83o%20show%20/295746fe-81f8-4334-981a-02f251d22d68.jpg',
    day: 2,
    month: 12,
    year: SHOW_YEAR,
  },
  {
    src: 'https://pub-da3fda702d23470fbab5a502b13cac38.r2.dev/sec%CC%A7a%CC%83o%20show%20/IMG_9380.PNG',
    day: 5,
    month: 12,
    year: SHOW_YEAR,
  },
]

function getMonthCells(year, monthIndex) {
  const first = new Date(year, monthIndex, 1)
  const last = new Date(year, monthIndex + 1, 0)
  const startWeekday = first.getDay()
  const daysInMonth = last.getDate()
  const cells = []
  for (let i = 0; i < startWeekday; i += 1) cells.push(null)
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export default function ShowPictures({ locale }) {
  const localeTag = locale === 'pt-BR' ? 'pt-BR' : 'en-US'
  const [index, setIndex] = useState(0)
  const current = SHOW_ITEMS[index]
  const weekdays = useMemo(() => weekdayHeaders(locale), [locale])

  const monthLabel = useMemo(() => {
    const d = new Date(current.year, current.month - 1, 1)
    return d.toLocaleDateString(localeTag, { month: 'long', year: 'numeric' })
  }, [current.month, current.year, localeTag])

  const cells = useMemo(
    () => getMonthCells(current.year, current.month - 1),
    [current.month, current.year]
  )

  const dateFull = useMemo(
    () =>
      new Date(current.year, current.month - 1, current.day).toLocaleDateString(localeTag, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    [current.day, current.month, current.year, localeTag]
  )

  const goPrev = () => setIndex((i) => (i - 1 + SHOW_ITEMS.length) % SHOW_ITEMS.length)
  const goNext = () => setIndex((i) => (i + 1) % SHOW_ITEMS.length)

  return (
    <div
      style={{
        display: 'flex',
        gap: '40px',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      {/* Picture visualizer */}
      <div style={{ width: 'min(280px, 100%)', flexShrink: 0 }}>
        <div
          style={{
            border: '2px solid',
            borderColor: '#808080 #dfdfdf #dfdfdf #808080',
            backgroundColor: '#c0c0c0',
            padding: '4px',
            boxShadow: 'inset 1px 1px 0 #000',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              minHeight: '280px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              key={current.src}
              src={current.src}
              alt={tVars(locale, 'showsImgAlt', { date: dateFull })}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '360px',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            marginTop: '12px',
            fontFamily: 'MS Sans Serif, Tahoma, sans-serif',
          }}
        >
          <button type="button" className="win95-btn" onClick={goPrev} style={{ padding: '6px 14px', fontSize: '11px' }}>
            {t(locale, 'showsPrev')}
          </button>
          <button type="button" className="win95-btn" onClick={goNext} style={{ padding: '6px 14px', fontSize: '11px' }}>
            {t(locale, 'showsNext')}
          </button>
        </div>
        <p
          style={{
            margin: '8px 0 0',
            textAlign: 'center',
            fontSize: '11px',
            fontFamily: 'MS Sans Serif, Tahoma, sans-serif',
            opacity: 0.85,
          }}
        >
          {index + 1} / {SHOW_ITEMS.length} — {dateFull}
        </p>
      </div>

      {/* Win95 calendar — sizing like about notepad */}
      <div
        style={{
          flex: '0 1 auto',
          minWidth: '280px',
          maxWidth: 'min(400px, calc(100% - 100px))',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            border: '2px solid',
            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
            boxShadow: '1px 1px 0 #000',
            backgroundColor: '#c0c0c0',
          }}
        >
          <div
            style={{
              padding: '2px 4px',
              background: 'linear-gradient(90deg, #000080 0%, #1084d0 100%)',
              color: '#fff',
              fontSize: '11px',
              fontFamily: 'MS Sans Serif, Tahoma, sans-serif',
            }}
          >
            {t(locale, 'showsCalendarTitle')}
          </div>
          <div
            style={{
              padding: '8px 10px 10px',
              fontFamily: 'MS Sans Serif, Tahoma, sans-serif',
              color: '#000',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '10px',
                textTransform: 'capitalize',
              }}
            >
              {monthLabel}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '2px',
                fontSize: '10px',
                marginBottom: '4px',
                textAlign: 'center',
                color: '#404040',
              }}
            >
              {weekdays.map((w) => (
                <div key={w}>{w}</div>
              ))}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '2px',
                fontSize: '11px',
                textAlign: 'center',
              }}
            >
              {cells.map((day, i) => {
                if (day === null) {
                  return <div key={`e-${i}`} style={{ minHeight: '22px' }} />
                }
                const selected = day === current.day
                return (
                  <div
                    key={day}
                    style={{
                      minHeight: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: selected ? '#000080' : '#c0c0c0',
                      color: selected ? '#fff' : '#000',
                      border: selected ? '1px solid #fff' : '1px solid transparent',
                      fontWeight: selected ? 700 : 400,
                    }}
                  >
                    {day}
                  </div>
                )
              })}
            </div>
            <div
              style={{
                marginTop: '10px',
                padding: '6px 8px',
                backgroundColor: '#ffffff',
                border: '2px solid',
                borderColor: '#808080 #dfdfdf #dfdfdf #808080',
                fontSize: '11px',
                textAlign: 'center',
              }}
            >
              {t(locale, 'showsDateLabel')} <strong>{dateFull}</strong>
            </div>
          </div>
        </div>

        <a
          href={BOOKING_MAILTO}
          className="win95-btn"
          style={{
            display: 'block',
            width: '100%',
            marginTop: '10px',
            padding: '10px 12px',
            fontSize: '11px',
            fontFamily: 'MS Sans Serif, Tahoma, sans-serif',
            textAlign: 'center',
            textDecoration: 'none',
            color: '#000',
            boxSizing: 'border-box',
          }}
        >
          {t(locale, 'showsBookCta')}
        </a>
      </div>
    </div>
  )
}
