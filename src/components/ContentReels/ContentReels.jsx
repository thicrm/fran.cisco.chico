import { useState, useRef, useCallback } from 'react'
import InstagramEmbed from '../InstagramEmbed/InstagramEmbed'

/** Instagram /p/ permalinks — blockquote embed (same proportions as before: min 326px, max 540px) */
const CONTENT_REELS = [
  { id: 'C2AmeFgLhDc', permalink: 'https://www.instagram.com/p/C2AmeFgLhDc/?utm_source=ig_embed&amp;utm_campaign=loading' },
  { id: 'DKPYLVftn95', permalink: 'https://www.instagram.com/p/DKPYLVftn95/?utm_source=ig_embed&amp;utm_campaign=loading' },
  { id: 'DJ71eSJP4Jj', permalink: 'https://www.instagram.com/p/DJ71eSJP4Jj/?utm_source=ig_embed&amp;utm_campaign=loading' },
  { id: 'DVjBcp5kVsm', permalink: 'https://www.instagram.com/p/DVjBcp5kVsm/?utm_source=ig_embed&amp;utm_campaign=loading' },
  { id: 'DE5-ov8PKMd', permalink: 'https://www.instagram.com/p/DE5-ov8PKMd/?utm_source=ig_embed&amp;utm_campaign=loading' },
]

const FADE_MS = 320
const EASE = 'cubic-bezier(0.33, 1, 0.68, 1)'

const IPHONE_FRAME_PNG =
  'https://pub-da3fda702d23470fbab5a502b13cac38.r2.dev/IPhone_5.png'

export default function ContentReels() {
  const [index, setIndex] = useState(0)
  const [embedVisible, setEmbedVisible] = useState(true)
  const [busy, setBusy] = useState(false)
  const lockRef = useRef(false)

  const current = CONTENT_REELS[index]

  const navigate = useCallback((delta) => {
    if (lockRef.current) return
    lockRef.current = true
    setBusy(true)
    setEmbedVisible(false)

    window.setTimeout(() => {
      setIndex((i) => (i + delta + CONTENT_REELS.length) % CONTENT_REELS.length)
      requestAnimationFrame(() => {
        setEmbedVisible(true)
        window.setTimeout(() => {
          lockRef.current = false
          setBusy(false)
        }, FADE_MS + 40)
      })
    }, FADE_MS)
  }, [])

  const goPrev = () => navigate(-1)
  const goNext = () => navigate(1)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      <button type="button" className="content-reel-arrow" aria-label="Reel anterior" onClick={goPrev} disabled={busy} aria-busy={busy}>
        ‹
      </button>
      <div
        style={{
          flex: '0 0 auto',
          width: 'min(326px, calc(100% - 88px))',
          minHeight: 'min(580px, 78vh)',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'visible',
        }}
      >
        <img
          src={IPHONE_FRAME_PNG}
          alt=""
          aria-hidden
          draggable={false}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1.05)',
            zIndex: 0,
            width: 'min(420px, calc(100% + 96px))',
            height: 'auto',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            marginLeft: '9px',
            borderRadius: '2px',
            boxShadow:
              '0 0 12px rgba(255, 255, 255, 0.55), 0 0 28px rgba(255, 255, 255, 0.35), 0 0 52px rgba(255, 255, 255, 0.2)',
            opacity: embedVisible ? 1 : 0,
            transform: embedVisible ? 'scale(1)' : 'scale(0.985)',
            transition: `opacity ${FADE_MS}ms ${EASE}, transform ${FADE_MS}ms ${EASE}`,
            willChange: 'opacity, transform',
            pointerEvents: embedVisible ? 'auto' : 'none',
          }}
        >
          <InstagramEmbed key={current.id} permalink={current.permalink} />
        </div>
      </div>
      <button type="button" className="content-reel-arrow" aria-label="Próximo reel" onClick={goNext} disabled={busy} aria-busy={busy}>
        ›
      </button>
    </div>
  )
}
