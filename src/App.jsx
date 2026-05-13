import { useState, useEffect } from 'react'
import MusicPlayer from './components/MusicPlayer/MusicPlayer'
import ContentReels from './components/ContentReels/ContentReels'
import ShowPictures from './components/ShowPictures/ShowPictures'
import Gallery from './components/Gallery/Gallery'
import Bass from './components/Bass/Bass'
import {
  readStoredLocale,
  LOCALE_STORAGE_KEY,
  localeToHtmlLang,
  t,
  tVars,
} from './i18n'

const NAV_DEF = [
  { id: 'about', tKey: 'navAbout', hoverClass: 'nav-hover-about' },
  { id: 'music', tKey: 'navMusic', hoverClass: 'nav-hover-music' },
  { id: 'gallery', tKey: 'navGallery', hoverClass: 'nav-hover-gallery' },
  { id: 'content', tKey: 'navContent', hoverClass: 'nav-hover-content' },
  { id: 'shows', tKey: 'navShows', hoverClass: 'nav-hover-shows' },
  { id: 'contact', tKey: 'navContact', hoverClass: 'nav-hover-contact' },
]

// Contact links - update with your details
const CONTACT_LINKS = {
  email: 'mailto:your@email.com',
  whatsapp: 'https://wa.me/',
  instagram: 'https://instagram.com/',
  tiktok: 'https://tiktok.com/@',
  /** Place `public/resume.pdf` (or update to hosted PDF URL) */
  resume: '/resume.pdf',
}

// Use mp4 for broad browser support. For faster loading, re-encode with: ffmpeg -i input.mov -c:v libx264 -movflags +faststart -preset fast -crf 26 -vf "scale=-2:720" output.mp4
// (+faststart = progressive playback, 720p = smaller file for background)
const VIDEO_BACKGROUND_MP4 = 'https://pub-da3fda702d23470fbab5a502b13cac38.r2.dev/Screen%20Recording%202026-03-16%20at%2014.15.39.mp4'
const VIDEO_BACKGROUND_MOV = 'https://pub-da3fda702d23470fbab5a502b13cac38.r2.dev/Screen%20Recording%202026-03-16%20at%2014.15.39.mov'

/** Fran Nogueira — RECS (playlist 3ukURI59vkk4vXHjHpebJi) */
const SPOTIFY_PLAYLIST_EMBED_SRC =
  'https://open.spotify.com/embed/playlist/3ukURI59vkk4vXHjHpebJi?utm_source=generator'

// Solid page backgrounds only (no gradients)
const PAGE_COLORS = [
  { name: 'white', swatch: '#ffffff', bg: '#ffffff', text: '#000000' },
  { name: 'blue', swatch: '#1565c0', bg: '#1565c0', text: '#e3f2fd' },
  { name: 'pink', swatch: '#c2185b', bg: '#c2185b', text: '#fce4ec' },
  { name: 'green', swatch: '#2e7d32', bg: '#2e7d32', text: '#e8f5e9' },
  { name: 'purple', swatch: '#6a1b9a', bg: '#6a1b9a', text: '#ede7f6' },
  { name: 'orange', swatch: '#e65100', bg: '#e65100', text: '#fff3e0' },
  { name: 'gold', swatch: '#f9a825', bg: '#f9a825', text: '#fffde7' },
  { name: 'teal', swatch: '#00897b', bg: '#00897b', text: '#e0f2f1' },
]

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

/** Picker glyph — Win95-style white arrow with black outline (actual cursor stays system default) */
function CursorClassicGlyph() {
  return (
    <svg className="cursor-pick-classic-svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path
        fill="#ffffff"
        stroke="#000000"
        strokeWidth={1.25}
        strokeLinejoin="miter"
        paintOrder="stroke fill"
        d="M6 2l2.5 17L12 14l5 8 2-1.2-5.2-9.2H20L6 2z"
      />
    </svg>
  )
}

const CURSOR_STORAGE_KEY = 'fran-cursor-pick'
/** Same-origin assets in /public/cursors — avoids CORS tainting canvas & cross-origin cursor limits */
const CURSOR_PICK_THIN = '/cursors/palheta_thin.png'
const CURSOR_PICK_HEAVY = '/cursors/palheta_heavy.png'

/** Picker: classic (system) arrow + guitar picks */
const CURSOR_PICK_DEF = [
  { id: 'classic', labelKey: 'cursorClassic', src: null },
  { id: 'thin', labelKey: 'cursorThin', src: CURSOR_PICK_THIN },
  { id: 'heavy', labelKey: 'cursorHeavy', src: CURSOR_PICK_HEAVY },
]

function readStoredCursorPick() {
  try {
    const v = localStorage.getItem(CURSOR_STORAGE_KEY)
    if (v === 'thin' || v === 'heavy') return v
    /* migrate old presets to classic system arrow */
    if (v === 'win95' || v === 'default' || v === 'classic') return 'classic'
  } catch {
    /* ignore */
  }
  return 'classic'
}

const CURSOR_ALPHA_THRESH = 40

function pickIdx(width, x, y) {
  return (y * width + x) * 4
}

/** Opaque bbox + bottom-row contact point (tip) in full-image pixel coords */
function analyzePickShape(data, width, height) {
  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0
  const t = CURSOR_ALPHA_THRESH
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[pickIdx(width, x, y) + 3] > t) {
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
      }
    }
  }
  if (minX > maxX || minY > maxY) return null
  let tipLo = width
  let tipHi = -1
  for (let x = 0; x < width; x++) {
    if (data[pickIdx(width, x, maxY) + 3] > t) {
      tipLo = Math.min(tipLo, x)
      tipHi = Math.max(tipHi, x)
    }
  }
  if (tipHi < 0) return null
  const tipX = Math.round((tipLo + tipHi) / 2)
  return { minX, minY, maxX, maxY, tipX }
}

export default function App() {
  const [locale, setLocale] = useState(readStoredLocale)
  const [cursorPick, setCursorPick] = useState(readStoredCursorPick)
  const [navMenuOpen, setNavMenuOpen] = useState(false)
  const [showMusicPlayer, setShowMusicPlayer] = useState(true)
  const [pageColor, setPageColor] = useState({ bg: 'transparent', text: '#ffffff', swatch: '#333333' })
  const [useVideoBackground, setUseVideoBackground] = useState(true)
  const [videoReady, setVideoReady] = useState(false)

  const handleColorSelect = (color) => {
    setUseVideoBackground(false)
    setVideoReady(false)
    setPageColor({ bg: color.bg, text: color.text, swatch: color.swatch })
  }

  const handleVideoBackgroundSelect = () => {
    setUseVideoBackground(true)
    setVideoReady(false)
    setPageColor({ bg: 'transparent', text: '#ffffff', swatch: '#333333' })
  }

  useEffect(() => {
    document.documentElement.lang = localeToHtmlLang(locale)
  }, [locale])

  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    } catch {
      /* ignore */
    }
  }, [locale])

  useEffect(() => {
    if (!navMenuOpen) return
    const onDoc = (e) => {
      if (!e.target.closest?.('.site-nav')) setNavMenuOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setNavMenuOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [navMenuOpen])

  useEffect(() => {
    try {
      localStorage.setItem(CURSOR_STORAGE_KEY, cursorPick)
    } catch {
      /* ignore */
    }
    const root = document.documentElement
    const body = document.body
    let cancelled = false

    const clearCursors = () => {
      root.style.cursor = ''
      body.style.cursor = ''
    }

    const applyCursor = (value) => {
      root.style.cursor = value
      body.style.cursor = value
    }

    if (cursorPick === 'default' || cursorPick === 'classic') {
      root.classList.remove('cursor-pick-active')
      clearCursors()
      return () => {
        cancelled = true
      }
    }

    root.classList.add('cursor-pick-active')

    const opt = CURSOR_PICK_DEF.find((o) => o.id === cursorPick)
    const src = opt?.src
    if (!src) {
      root.classList.remove('cursor-pick-active')
      clearCursors()
      return () => {
        cancelled = true
      }
    }

    const img = new Image()
    /* same-origin /public — no crossOrigin needed; avoids tainted canvas */
    img.onload = () => {
      if (cancelled) return
      const max = 128
      const w = img.naturalWidth
      const h = img.naturalHeight
      if (!w || !h) {
        applyCursor(`url("${src}") 16 24, auto`)
        return
      }

      const srcCanvas = document.createElement('canvas')
      srcCanvas.width = w
      srcCanvas.height = h
      const sctx = srcCanvas.getContext('2d')
      if (!sctx) {
        applyCursor(`url("${src}") 16 24, auto`)
        return
      }
      sctx.drawImage(img, 0, 0)
      const full = sctx.getImageData(0, 0, w, h)
      const shape = analyzePickShape(full.data, w, h)
      if (!shape) {
        applyCursor(`url("${src}") 16 24, auto`)
        return
      }

      const { minX, minY, maxX, maxY, tipX } = shape
      const bw = maxX - minX + 1
      const bh = maxY - minY + 1
      const cropped = sctx.getImageData(minX, minY, bw, bh)

      const hotCropX = tipX - minX
      const hotCropY = maxY - minY

      const scale = Math.min(1, max / Math.max(bw, bh))
      const sw = Math.max(1, Math.floor(bw * scale))
      const sh = Math.max(1, Math.floor(bh * scale))
      const hx = Math.min(sw - 1, Math.max(0, Math.round(hotCropX * scale)))
      const hy = Math.min(sh - 1, Math.max(0, Math.round(hotCropY * scale)))

      const tmp = document.createElement('canvas')
      tmp.width = bw
      tmp.height = bh
      const tctx = tmp.getContext('2d')
      const out = document.createElement('canvas')
      out.width = sw
      out.height = sh
      const octx = out.getContext('2d')
      if (!tctx || !octx) {
        applyCursor(`url("${src}") ${hx} ${hy}, auto`)
        return
      }
      tctx.putImageData(cropped, 0, 0)
      octx.imageSmoothingEnabled = true
      octx.imageSmoothingQuality = 'high'
      octx.drawImage(tmp, 0, 0, bw, bh, 0, 0, sw, sh)

      let dataUrl
      try {
        dataUrl = out.toDataURL('image/png')
      } catch {
        applyCursor(`url("${src}") ${hx} ${hy}, auto`)
        return
      }
      applyCursor(`url("${dataUrl}") ${hx} ${hy}, auto`)
    }
    img.onerror = () => {
      if (!cancelled) applyCursor('auto')
    }
    img.src = src

    return () => {
      cancelled = true
      root.classList.remove('cursor-pick-active')
      clearCursors()
    }
  }, [cursorPick])

  return (
    <div style={{ minHeight: '100vh', fontFamily: '"Montserrat", sans-serif' }}>
      <nav className="site-nav">
        <button
          type="button"
          className="site-nav__menu-btn"
          aria-expanded={navMenuOpen}
          aria-label={navMenuOpen ? t(locale, 'navMenuClose') : t(locale, 'navMenuOpen')}
          onClick={() => setNavMenuOpen((o) => !o)}
        >
          <span className="site-nav__menu-bar" />
          <span className="site-nav__menu-bar" />
          <span className="site-nav__menu-bar" />
        </button>
        <div className={`site-nav__links ${navMenuOpen ? 'site-nav__links--open' : ''}`}>
          {NAV_DEF.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-link ${item.hoverClass}`}
              onClick={() => {
                setNavMenuOpen(false)
                scrollToSection(item.id)
                if (item.id === 'music') setShowMusicPlayer(true)
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: '12px',
                letterSpacing: '0.1em',
                color: '#333',
                cursor: 'pointer',
                textTransform: 'lowercase',
                transition: 'color 0.2s ease',
                fontWeight: 300,
                fontFamily: '"Montserrat", sans-serif',
              }}
            >
              {t(locale, item.tKey)}
            </button>
          ))}
        </div>
        <div className="site-nav__lang" role="group" aria-label={t(locale, 'ariaLangSwitch')}>
          {(['pt-BR', 'en-US']).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              aria-pressed={locale === code}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px 0',
                fontSize: '12px',
                letterSpacing: '0.06em',
                color: locale === code ? '#111' : '#888',
                cursor: 'pointer',
                transition: 'color 0.2s ease, font-weight 0.15s ease',
                fontWeight: locale === code ? 600 : 400,
                fontFamily: '"Montserrat", sans-serif',
              }}
            >
              {code}
            </button>
          ))}
        </div>
      </nav>

      {/* Custom cursors — classic arrow + pick choices */}
      <div
        className="cursor-pick-wrap"
        role="group"
        aria-label={t(locale, 'ariaCursorPick')}
        style={{
          position: 'fixed',
          top: '72px',
          right: '16px',
          zIndex: 199,
          maxWidth: 'min(140px, calc(100vw - 120px))',
        }}
      >
        {CURSOR_PICK_DEF.map((opt) => (
          <button
            key={opt.id}
            type="button"
            title={t(locale, opt.labelKey)}
            aria-pressed={cursorPick === opt.id}
            aria-label={t(locale, opt.labelKey)}
            onClick={() => setCursorPick(opt.id)}
            className={`cursor-pick-choice ${opt.id === 'classic' ? 'cursor-pick-choice--classic' : ''} ${cursorPick === opt.id ? 'cursor-pick-choice--selected' : ''}`}
          >
            {opt.src ? <img src={opt.src} alt="" draggable={false} /> : <CursorClassicGlyph />}
          </button>
        ))}
      </div>

      {/* Color palette - Win95 style, always visible on right edge */}
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 200,
          border: '2px solid',
          borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
          boxShadow: '1px 1px 0 #000',
          backgroundColor: '#c0c0c0',
          padding: '4px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 28px)',
            gridTemplateRows: 'repeat(3, 28px)',
            gap: '2px',
          }}
        >
          {PAGE_COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorSelect(color)}
              title={color.name}
              style={{
                width: '28px',
                height: '28px',
                padding: 0,
                margin: 0,
                backgroundColor: color.swatch,
                border: '2px solid',
                borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                boxShadow: '1px 1px 0 #000',
                cursor: 'pointer',
              }}
            />
          ))}
          <button
            onClick={handleVideoBackgroundSelect}
            title={t(locale, 'tooltipVideoBg')}
            style={{
              position: 'relative',
              width: '28px',
              height: '28px',
              padding: 0,
              margin: 0,
              background: 'linear-gradient(135deg, #1e3a5f 0%, #4a1942 50%, #2d1b4e 100%)',
              border: '2px solid',
              borderColor: useVideoBackground ? '#000 #fff #fff #000' : '#dfdfdf #808080 #808080 #dfdfdf',
              boxShadow: useVideoBackground ? 'none' : '1px 1px 0 #000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <video
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            >
              <source src={VIDEO_BACKGROUND_MP4} type="video/mp4" />
              <source src={VIDEO_BACKGROUND_MOV} type="video/mp4" />
            </video>
          </button>
        </div>
      </div>

      {/* Music player - floating, sized to content so doesn't block page */}
      {showMusicPlayer && (
        <div style={{ position: 'fixed', zIndex: 500 }}>
          <MusicPlayer locale={locale} onClose={() => setShowMusicPlayer(false)} />
        </div>
      )}

      <main
        style={{
          position: 'relative',
          /* TRBL — responsive; right edge reserves space for fixed color palette on small/large viewports */
          padding:
            'clamp(20px, 5vw, 40px) clamp(56px, min(100px, 14vw), 120px) clamp(20px, 5vw, 40px) clamp(20px, 4vw, 40px)',
          background: useVideoBackground
            ? (videoReady ? 'transparent' : 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)')
            : pageColor.bg,
          color: pageColor.text,
          minHeight: 'calc(100vh - 57px)',
          transition: 'background 0.4s ease, color 0.3s ease',
          overflow: 'hidden',
        }}
      >
        {useVideoBackground && (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            fetchPriority="high"
            onCanPlay={() => setVideoReady(true)}
            onLoadStart={() => setVideoReady(false)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
              opacity: videoReady ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          >
            <source src={VIDEO_BACKGROUND_MP4} type="video/mp4" />
            <source src={VIDEO_BACKGROUND_MOV} type="video/mp4" />
          </video>
        )}
        <div style={{ position: 'relative', zIndex: 1 }}>
        <header style={{ marginBottom: '64px' }}>
          <h1
            style={{
              fontSize: '32px',
              margin: 0,
              fontWeight: 700,
              color: 'inherit',
              fontFamily: '"Anton", sans-serif',
              letterSpacing: '0.02em',
            }}
          >
            <span className="notepad-at-sign">@</span>Francisco Nogueira
          </h1>
          <p
            style={{
              marginTop: '16px',
              color: 'inherit',
              opacity: 0.85,
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 300,
            }}
          >
            {t(locale, 'heroTagline')}
          </p>
        </header>

        <section
          id="about"
          style={{
            marginTop: '64px',
            marginBottom: '0',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2 className="section-heading" style={{ marginBottom: '24px', alignSelf: 'stretch' }}>
            {t(locale, 'sectionAbout')}
          </h2>
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
            <div
              className="about-picture"
              style={{
                width: 'min(280px, 100%)',
                backgroundColor: 'rgba(0,0,0,0.08)',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <img
                src="https://pub-da3fda702d23470fbab5a502b13cac38.r2.dev/fotos/foto%20portfolio.jpg"
                alt=""
                style={{ width: '100%', height: 'auto', display: 'block', verticalAlign: 'bottom' }}
              />
            </div>
            <div
              className="about-text win95-notepad"
              style={{
                flex: '0 1 auto',
                minWidth: '280px',
                maxWidth: 'min(400px, calc(100% - 100px))',
                flexShrink: 0,
              }}
            >
              {/* Win95 Notepad outer border */}
              <div
                style={{
                  border: '2px solid',
                  borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                  boxShadow: '1px 1px 0 #000',
                  backgroundColor: '#c0c0c0',
                }}
              >
                {/* Title bar */}
                <div
                  style={{
                    padding: '2px 4px',
                    background: 'linear-gradient(90deg, #000080 0%, #1084d0 100%)',
                    color: '#fff',
                    fontSize: '11px',
                    fontFamily: 'MS Sans Serif, Tahoma, sans-serif',
                  }}
                >
                  Francisco Nogueira
                </div>
                {/* Menu bar */}
                <div
                  style={{
                    padding: '2px 6px',
                    backgroundColor: '#c0c0c0',
                    borderBottom: '1px solid #808080',
                    fontSize: '11px',
                    fontFamily: 'MS Sans Serif, Tahoma, sans-serif',
                    color: '#000',
                  }}
                >
                  {t(locale, 'notepadMenubarAbout')}
                </div>
                {/* White notepad content area with scrollbar */}
                <div
                  className="win95-notepad-content"
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    padding: '8px 12px',
                    fontFamily: 'MS Sans Serif, Tahoma, sans-serif',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    height: '246px',
                    minHeight: '246px',
                    overflowY: 'auto',
                  }}
                >
                  <p style={{ margin: 0, marginBottom: '0.8em' }}>
                    {t(locale, 'aboutBio1')}
                  </p>
                  <p style={{ margin: 0, marginBottom: '0.8em' }}>
                    {t(locale, 'aboutBio2')}
                  </p>
                  <p style={{ margin: 0, marginBottom: '0.8em' }}>
                    {t(locale, 'aboutBio3')}
                  </p>
                  <p style={{ margin: 0 }}>
                    {t(locale, 'aboutBio4')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="music"
          style={{
            marginTop: '80px',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 3,
          }}
        >
          <h2 className="section-heading" style={{ marginBottom: '24px', alignSelf: 'stretch' }}>
            {t(locale, 'sectionMusic')}
          </h2>
          <div
            style={{
              width: '100%',
              maxWidth: '700px',
              marginBottom: '32px',
              alignSelf: 'center',
            }}
          >
            <iframe
              title={t(locale, 'spotifyIframeTitle')}
              src={SPOTIFY_PLAYLIST_EMBED_SRC}
              width="100%"
              height={352}
              style={{ border: 'none', borderRadius: '12px', display: 'block', minHeight: '352px' }}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
          <div
            style={{
              width: '100%',
              maxWidth: '700px',
              minHeight: '320px',
              isolation: 'isolate',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto',
              alignSelf: 'center',
            }}
          >
            <Bass isWhiteBackground={pageColor.swatch === '#ffffff'} />
          </div>
          {!showMusicPlayer && (
            <button
              type="button"
              className="win95-btn"
              onClick={() => setShowMusicPlayer(true)}
              style={{
                marginTop: '24px',
                padding: '8px 16px',
                fontSize: '11px',
              }}
            >
              {t(locale, 'openMusicPlayer')}
            </button>
          )}
        </section>

        <section id="gallery" style={{ marginTop: '80px', position: 'relative', zIndex: 1 }}>
          <h2 className="section-heading" style={{ marginBottom: '24px' }}>
            {t(locale, 'sectionGallery')}
          </h2>
          <Gallery locale={locale} />
        </section>

        <section
          id="content"
          style={{
            marginTop: '80px',
            position: 'relative',
            zIndex: 5,
            isolation: 'isolate',
            paddingBottom: 'clamp(48px, 10vw, 120px)',
            scrollMarginTop: '72px',
          }}
        >
          <h2 className="content-section-heading section-heading">
            {t(locale, 'sectionContent')}
          </h2>
          <div className="content-section-body">
            <ContentReels locale={locale} />
          </div>
        </section>

        <section
          id="shows"
          style={{
            marginTop: '80px',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2 className="section-heading" style={{ marginBottom: '24px', alignSelf: 'stretch' }}>
            {t(locale, 'sectionShows')}
          </h2>
          <ShowPictures locale={locale} />
        </section>

        <section id="contact" style={{ marginTop: '80px', paddingBottom: '80px', position: 'relative', zIndex: 1 }}>
          <h2 className="section-heading" style={{ marginBottom: '24px' }}>
            {t(locale, 'sectionContact')}
          </h2>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              fontFamily: 'MS Sans Serif, Tahoma, sans-serif',
            }}
          >
            <a
              href={CONTACT_LINKS.email}
              className="win95-btn"
              style={{
                padding: '8px 16px',
                fontSize: '11px',
                textDecoration: 'none',
                color: '#000',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {t(locale, 'contactEmailLabel')}
            </a>
            <a
              href={CONTACT_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="win95-btn"
              style={{
                padding: '8px 16px',
                fontSize: '11px',
                textDecoration: 'none',
                color: '#000',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {t(locale, 'contactWhatsappLabel')}
            </a>
            <a
              href={CONTACT_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="win95-btn"
              style={{
                padding: '8px 16px',
                fontSize: '11px',
                textDecoration: 'none',
                color: '#000',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {t(locale, 'contactInstagramLabel')}
            </a>
            <a
              href={CONTACT_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="win95-btn"
              style={{
                padding: '8px 16px',
                fontSize: '11px',
                textDecoration: 'none',
                color: '#000',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {t(locale, 'contactTiktokLabel')}
            </a>
            <a
              href={CONTACT_LINKS.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="win95-btn"
              download
              style={{
                padding: '8px 16px',
                fontSize: '11px',
                textDecoration: 'none',
                color: '#000',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {t(locale, 'contactResumeLabel')}
            </a>
          </div>
        </section>

        <footer
          className="notepad-at-sign"
          style={{
            marginTop: '32px',
            paddingBottom: '40px',
            textAlign: 'center',
            fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
            fontWeight: 600,
            fontSize: '14px',
            textShadow: `
              -1px -1px 0 #000,
              1px -1px 0 #000,
              -1px 1px 0 #000,
              1px 1px 0 #000,
              -1px 0 0 #000,
              1px 0 0 #000,
              0 -1px 0 #000,
              0 1px 0 #000
            `,
          }}
        >
          {tVars(locale, 'footerCopyright', { year: new Date().getFullYear() })}
        </footer>
        </div>
      </main>
    </div>
  )
}
