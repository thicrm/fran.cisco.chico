import { useState, useRef, useEffect } from 'react'
import Draggable from 'react-draggable'

/**
 * Music player - Windows 95 style, draggable
 * Retro desktop aesthetic like sosoradio.co
 */
const TRACKS = [
  {
    title: 'composição',
    artist: 'Francisco Chico',
    src: 'https://pub-da3fda702d23470fbab5a502b13cac38.r2.dev/sec%CC%A7a%CC%83o%20music/%C3%A1udios%20player/composi%C3%A7%C3%A3o.wav',
  },
  {
    title: 'diskaum MIX FINAL',
    artist: 'Francisco Chico',
    src: 'https://pub-da3fda702d23470fbab5a502b13cac38.r2.dev/sec%CC%A7a%CC%83o%20music/%C3%A1udios%20player/diskaum%20MIX%20FINAL.wav',
  },
  {
    title: 'fonk',
    artist: 'Francisco Chico',
    src: 'https://pub-da3fda702d23470fbab5a502b13cac38.r2.dev/sec%CC%A7a%CC%83o%20music/%C3%A1udios%20player/fonk.wav',
  },
  {
    title: 'house vibez',
    artist: 'Francisco Chico',
    src: 'https://pub-da3fda702d23470fbab5a502b13cac38.r2.dev/sec%CC%A7a%CC%83o%20music/%C3%A1udios%20player/house%20vibez.wav',
  },
  {
    title: 'llllllll',
    artist: 'Francisco Chico',
    src: 'https://pub-da3fda702d23470fbab5a502b13cac38.r2.dev/sec%CC%A7a%CC%83o%20music/%C3%A1udios%20player/llllllll.wav',
  },
  {
    title: 'nova iorque',
    artist: 'Francisco Chico',
    src: 'https://pub-da3fda702d23470fbab5a502b13cac38.r2.dev/sec%CC%A7a%CC%83o%20music/%C3%A1udios%20player/nova%20iorque.wav',
  },
  {
    title: 'shuffle',
    artist: 'Francisco Chico',
    src: 'https://pub-da3fda702d23470fbab5a502b13cac38.r2.dev/sec%CC%A7a%CC%83o%20music/%C3%A1udios%20player/shuffle.wav',
  },
  {
    title: 'tréopi',
    artist: 'Francisco Chico',
    src: 'https://pub-da3fda702d23470fbab5a502b13cac38.r2.dev/sec%CC%A7a%CC%83o%20music/%C3%A1udios%20player/tr%C3%A9opi.wav',
  },
]

export default function MusicPlayer({ onClose }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [error, setError] = useState(null)
  const audioRef = useRef(null)
  const nodeRef = useRef(null)
  const isPlayingRef = useRef(false)

  isPlayingRef.current = isPlaying

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Load new track when currentTrack changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !TRACKS[currentTrack]) return
    setError(null)
    const track = TRACKS[currentTrack]
    audio.src = track.src
    audio.volume = volume
    audio.load()
  }, [currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
  }, [volume])

  // Play or pause when isPlaying changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      if (audio.readyState >= 2) {
        audio.play().catch((e) => {
          setError('Playback failed')
          setIsPlaying(false)
        })
      }
    } else {
      audio.pause()
    }
  }, [isPlaying])

  const handleCanPlay = () => {
    if (isPlayingRef.current && audioRef.current) {
      audioRef.current.play().catch((e) => {
        setError('Playback failed')
        setIsPlaying(false)
      })
    }
  }

  const handlePlayPause = () => setIsPlaying((p) => !p)

  const handleTrackSelect = (i) => setCurrentTrack(i)

  const handleEnded = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length)
  }

  const handleError = () => {
    setError('Failed to load audio')
    setIsPlaying(false)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const volumeBars = 10
  const filledBars = Math.round(volume * volumeBars)

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".win95-title-bar"
      bounds="body"
      defaultPosition={
        typeof window !== 'undefined'
          ? { x: Math.max(0, window.innerWidth - 340 - 120), y: 20 }
          : { x: 100, y: 200 }
      }
    >
      <div ref={nodeRef} className="win95-window" style={{ position: 'absolute', zIndex: 1000 }}>
        {/* Win95 outer border - 3D raised effect */}
        <div
          style={{
            border: '2px solid',
            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
            boxShadow: '1px 1px 0 #000',
            backgroundColor: '#c0c0c0',
          }}
        >
          {/* Title bar - Win95 blue */}
          <div
            className="win95-title-bar"
            style={{
              padding: '2px 4px 2px 4px',
              background: 'linear-gradient(90deg, #000080 0%, #1084d0 100%)',
              color: '#fff',
              fontSize: '11px',
              fontFamily: 'MS Sans Serif, Tahoma, sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'move',
              userSelect: 'none',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px' }}>🎵</span>
              Francisco Chico music player
            </span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                className="win95-btn"
                onClick={onClose}
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                  width: '16px',
                  height: '14px',
                  minWidth: '16px',
                  padding: 0,
                  fontSize: '9px',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Close"
              >
                ×
              </button>
            </div>
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
            File  Edit  Options  Help
          </div>

          {/* Client area - Win95 gray */}
          <div
            style={{
              padding: '12px',
              backgroundColor: '#c0c0c0',
              fontFamily: 'MS Sans Serif, Tahoma, sans-serif',
              fontSize: '11px',
              color: '#000',
              width: '320px',
            }}
          >
            {/* Branding */}
            <div
              style={{
                textAlign: 'center',
                fontSize: '12px',
                color: '#000',
                marginBottom: '12px',
                letterSpacing: '0.05em',
              }}
            >
              ⣿ Francisco Chico ⣿
            </div>

            {/* Track info */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontWeight: 'bold' }}>{TRACKS[currentTrack].title}</div>
              <div style={{ color: '#555', fontSize: '10px' }}>
                {TRACKS[currentTrack].artist}
              </div>
            </div>

            {/* Volume - Win95 style */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '12px',
              }}
            >
              <span>Volume:-</span>
              <div style={{ display: 'flex', gap: '1px' }}>
                {Array.from({ length: volumeBars }).map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setVolume((i + 1) / volumeBars)}
                    style={{
                      width: '14px',
                      height: '12px',
                      border: '1px solid',
                      borderColor: '#808080 #dfdfdf #dfdfdf #808080',
                      backgroundColor: i < filledBars ? '#000080' : '#c0c0c0',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
              <button
                className="win95-btn"
                onClick={() => setVolume((v) => Math.min(1, v + 0.1))}
                style={{ width: '20px', height: '18px', padding: 0, fontSize: '12px' }}
              >
                +
              </button>
            </div>

            {/* Playlist */}
            <div style={{ marginBottom: '12px' }}>
              <div
                style={{
                  fontSize: '10px',
                  color: '#555',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                }}
              >
                Playlist
              </div>
              <div
                style={{
                  border: '1px solid',
                  borderColor: '#808080 #dfdfdf #dfdfdf #808080',
                  backgroundColor: '#fff',
                  padding: '4px',
                  maxHeight: '80px',
                  overflowY: 'auto',
                }}
              >
                {TRACKS.map((track, i) => (
                  <div
                    key={i}
                    onClick={() => handleTrackSelect(i)}
                    style={{
                      padding: '2px 6px',
                      cursor: 'pointer',
                      backgroundColor: i === currentTrack ? '#000080' : 'transparent',
                      color: i === currentTrack ? '#fff' : '#000',
                    }}
                  >
                    {i + 1}  {track.title}
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div
              style={{
                fontSize: '10px',
                color: '#555',
                marginBottom: '8px',
              }}
            >
              {error ? (
                <span style={{ color: '#c00' }}>{error}</span>
              ) : (
                <>
                  {isPlaying ? 'Playing' : 'Paused'} - Track {currentTrack + 1} of {TRACKS.length}
                </>
              )}
            </div>

            {/* Play button - Win95 3D button */}
            <button
              className="win95-btn"
              onClick={handlePlayPause}
              style={{
                width: '100%',
                padding: '6px 12px',
                fontSize: '11px',
              }}
            >
              {isPlaying ? 'Pause' : 'Start'}
            </button>

            {/* Links */}
            <div
              style={{
                marginTop: '12px',
                fontSize: '10px',
                display: 'flex',
                gap: '12px',
              }}
            >
              <a href="#" style={{ color: '#000080', textDecoration: 'underline' }}>
                Full Sets on Soundcloud
              </a>
              <a href="#" style={{ color: '#000080', textDecoration: 'underline' }}>
                Watch on YouTube
              </a>
            </div>
          </div>

          {/* Status bar */}
          <div
            style={{
              padding: '4px 8px',
              backgroundColor: '#c0c0c0',
              borderTop: '1px solid #808080',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: '#000',
            }}
          >
            <span>Music Player</span>
            <span>Francisco Chico</span>
            <span>{formatTime(currentTime)}</span>
          </div>
        </div>

        <audio
          ref={audioRef}
          onEnded={handleEnded}
          onCanPlay={handleCanPlay}
          onError={handleError}
        />
      </div>
    </Draggable>
  )
}
