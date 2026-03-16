import { useState } from 'react'
import MusicPlayer from './components/MusicPlayer/MusicPlayer'
import InstagramEmbed from './components/InstagramEmbed/InstagramEmbed'
import Gallery from './components/Gallery/Gallery'
import Bass from './components/Bass/Bass'

const REELS = [
  { id: 'C2AmeFgLhDc', url: 'https://www.instagram.com/reel/C2AmeFgLhDc/', useBlockquote: true },
  { id: 'DVeoKZ6Dmou', url: 'https://www.instagram.com/reel/DVeoKZ6Dmou/', useBlockquote: true },
  { id: 'DH3WP6OuE2u', url: 'https://www.instagram.com/reel/DH3WP6OuE2u/', useBlockquote: true },
]

const NAV_ITEMS = [
  { id: 'music', label: 'music', hoverClass: 'nav-hover-music' },
  { id: 'content', label: 'content', hoverClass: 'nav-hover-content' },
  { id: 'gallery', label: 'gallery', hoverClass: 'nav-hover-gallery' },
  { id: 'shows', label: 'shows', hoverClass: 'nav-hover-shows' },
  { id: 'about', label: 'about me', hoverClass: 'nav-hover-about' },
  { id: 'contact', label: 'contact', hoverClass: 'nav-hover-contact' },
]

// Contact links - update with your details
const CONTACT_LINKS = {
  email: 'mailto:your@email.com',
  whatsapp: 'https://wa.me/',
  instagram: 'https://instagram.com/',
  tiktok: 'https://tiktok.com/@',
}

// Use mp4 for broad browser support. For faster loading, re-encode with: ffmpeg -i input.mov -c:v libx264 -movflags +faststart -preset fast -crf 26 -vf "scale=-2:720" output.mp4
// (+faststart = progressive playback, 720p = smaller file for background)
const VIDEO_BACKGROUND_MP4 = 'https://pub-da3fda702d23470fbab5a502b13cac38.r2.dev/Screen%20Recording%202026-03-16%20at%2014.15.39.mp4'
const VIDEO_BACKGROUND_MOV = 'https://pub-da3fda702d23470fbab5a502b13cac38.r2.dev/Screen%20Recording%202026-03-16%20at%2014.15.39.mov'

// Strong backgrounds (gradient like music player) + pastel text
const PAGE_COLORS = [
  { name: 'white', swatch: '#ffffff', bg: '#ffffff', text: '#000000' },
  { name: 'blue', swatch: '#084a8c', bg: 'linear-gradient(135deg, #000080 0%, #1084d0 50%, #4fc3f7 100%)', text: '#e3f2fd' },
  { name: 'pink', swatch: '#ad1457', bg: 'linear-gradient(135deg, #880e4f 0%, #e91e63 50%, #f48fb1 100%)', text: '#fce4ec' },
  { name: 'green', swatch: '#2e7d32', bg: 'linear-gradient(135deg, #1b5e20 0%, #43a047 50%, #81c784 100%)', text: '#e8f5e9' },
  { name: 'purple', swatch: '#6a1b9a', bg: 'linear-gradient(135deg, #4a148c 0%, #7c4dff 50%, #b39ddb 100%)', text: '#ede7f6' },
  { name: 'orange', swatch: '#e65100', bg: 'linear-gradient(135deg, #bf360c 0%, #ff9800 50%, #ffcc80 100%)', text: '#fff3e0' },
  { name: 'gold', swatch: '#f57f17', bg: 'linear-gradient(135deg, #e65100 0%, #ffeb3b 50%, #fff9c4 100%)', text: '#fffde7' },
  { name: 'teal', swatch: '#00695c', bg: 'linear-gradient(135deg, #004d40 0%, #00897b 50%, #4dd0e1 100%)', text: '#e0f2f1' },
]

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export default function App() {
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

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #eee',
          padding: '16px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
        }}
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-link ${item.hoverClass}`}
            onClick={() => {
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
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

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
            title="Video background"
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
          <MusicPlayer onClose={() => setShowMusicPlayer(false)} />
        </div>
      )}

      <main
        style={{
          position: 'relative',
          padding: '40px 100px 40px 40px',
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
          <h1 style={{ fontSize: '32px', margin: 0, fontWeight: 400, color: 'inherit', fontFamily: 'system-ui, sans-serif' }}>
            <span className="notepad-at-sign">@</span>fran.cisco.chico
          </h1>
          <p style={{ marginTop: '16px', color: 'inherit', opacity: 0.85, fontFamily: 'system-ui, sans-serif', fontWeight: 300, textTransform: 'lowercase' }}>
            Musician • Bassist • Guitarist • Drummer • Producer
          </p>
        </header>

        <section id="music" style={{ marginTop: '64px', marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontSize: '11px', letterSpacing: '0.2em', opacity: 0.7, textTransform: 'uppercase', marginBottom: '24px', alignSelf: 'stretch' }}>Music</h2>
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
              onClick={() => setShowMusicPlayer(true)}
              style={{
                marginTop: '24px',
                padding: '8px 16px',
                fontSize: '12px',
                backgroundColor: 'rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.15)',
                color: 'inherit',
                cursor: 'pointer',
              }}
            >
              Open Music Player
            </button>
          )}
        </section>

        <section id="content" style={{ marginTop: '80px' }}>
          <h2 style={{ fontSize: '11px', letterSpacing: '0.2em', opacity: 0.7, textTransform: 'uppercase', marginBottom: '24px' }}>Content</h2>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {REELS.map((reel) =>
              reel.useBlockquote ? (
                <InstagramEmbed key={reel.id} reelId={reel.id} />
              ) : (
                <a
                  key={reel.id}
                  href={reel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 'min(280px, 100%)',
                    display: 'block',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <iframe
                    src={`https://www.instagram.com/reel/${reel.id}/embed?hidecaption=1`}
                    title={`Reel ${reel.id}`}
                    scrolling="no"
                    style={{
                      width: '100%',
                      aspectRatio: '9/16',
                      border: 'none',
                      display: 'block',
                    }}
                  />
                </a>
              )
            )}
          </div>
        </section>

        <section id="gallery" style={{ marginTop: '80px' }}>
          <h2 style={{ fontSize: '11px', letterSpacing: '0.2em', opacity: 0.7, textTransform: 'uppercase', marginBottom: '24px' }}>Gallery</h2>
          <Gallery />
        </section>

        <section id="shows" style={{ marginTop: '80px' }}>
          <h2 style={{ fontSize: '11px', letterSpacing: '0.2em', opacity: 0.7, textTransform: 'uppercase', marginBottom: '24px' }}>Shows</h2>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <InstagramEmbed permalink="https://www.instagram.com/p/DDDT4gXyN83/?utm_source=ig_embed&amp;utm_campaign=loading" />
            <InstagramEmbed permalink="https://www.instagram.com/p/C_eOUUNvgSM/?utm_source=ig_embed&amp;utm_campaign=loading" />
          </div>
        </section>

        <section id="about" style={{ marginTop: '80px' }}>
          <h2 style={{ fontSize: '11px', letterSpacing: '0.2em', opacity: 0.7, textTransform: 'uppercase', marginBottom: '24px' }}>About me</h2>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div
              className="about-picture"
              style={{
                width: 'min(280px, 100%)',
                backgroundColor: 'rgba(0,0,0,0.08)',
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: `0 0 30px 0 ${hexToRgba(pageColor.bg === '#ffffff' ? '#818cf8' : '#ffffff', 0.5)}, 0 0 60px 0 ${hexToRgba(pageColor.bg === '#ffffff' ? '#818cf8' : '#ffffff', 0.25)}`,
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
                flex: '1',
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
                  <span className="notepad-at-sign">@</span>fran.cisco.chico
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
                  File  Edit  Format  View  Help
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
                    fran.cisco.chico is a musician, bassist, guitarist, drummer, producer, and content creator based in [location].
                  </p>
                  <p style={{ margin: 0, marginBottom: '0.8em' }}>
                    With a passion for crafting sounds across multiple instruments and production styles, the focus is on collaboration and bringing creative visions to life—whether in the studio, on stage, or through digital content.
                  </p>
                  <p style={{ margin: 0, marginBottom: '0.8em' }}>
                    Available for sessions, collaborations, and creative projects.
                  </p>
                  <p style={{ margin: 0 }}>
                    Reach out to connect and create.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" style={{ marginTop: '80px', paddingBottom: '80px' }}>
          <h2 style={{ fontSize: '11px', letterSpacing: '0.2em', opacity: 0.7, textTransform: 'uppercase', marginBottom: '24px' }}>Contact</h2>
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
              ✉ Email
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
              WhatsApp
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
              Instagram
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
              TikTok
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
            textTransform: 'lowercase',
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
          © {new Date().getFullYear()} fran.cisco.chico
        </footer>
        </div>
      </main>
    </div>
  )
}
