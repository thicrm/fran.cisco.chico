import { useState, useEffect, useCallback, useRef } from 'react'
import { useBassAudio } from '../../hooks/useBassAudio'
import './BassGuitar.css'

const STRING_NAMES = ['E', 'A', 'D', 'G']
const STRING_COLORS = ['#ffffff', '#ffffff', '#ffffff', '#ffffff']
const STRING_THICK = [3, 2.5, 2, 1.5]
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const NUM_FRETS = 13
const MARKER_FRETS = new Set([3, 5, 7, 9, 12])

const KB_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", '\\'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
]

function getNoteDisplay(stringIdx, fret) {
  const base = [28, 33, 38, 43]
  const midi = base[stringIdx] + fret
  return NOTE_NAMES[midi % 12]
}

export default function Bass({ isWhiteBackground = false }) {
  const { playNote, setVolume, setTone, setSustain, dispose } = useBassAudio()
  const [activeNote, setActiveNote] = useState('—')
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeFrets, setActiveFrets] = useState({})
  const [volVal, setVolVal] = useState(-6)
  const [susVal, setSusVal] = useState(0.8)
  const noteTimeoutRef = useRef(null)

  useEffect(() => () => dispose(), [dispose])

  const handlePlay = useCallback(
    (si, fret) => {
      playNote(si, fret)
      const key = `${si}-${fret}`
      const note = getNoteDisplay(si, fret)
      setActiveNote(note)
      setIsPlaying(true)
      setActiveFrets((prev) => ({ ...prev, [key]: true }))
      clearTimeout(noteTimeoutRef.current)
      noteTimeoutRef.current = setTimeout(() => {
        setActiveNote('—')
        setIsPlaying(false)
        setActiveFrets((prev) => {
          const next = { ...prev }
          delete next[key]
          return next
        })
      }, 400)
    },
    [playNote]
  )

  useEffect(() => {
    const pressed = new Set()
    const onKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return
      const key = e.key.toLowerCase()
      if (pressed.has(key)) return
      pressed.add(key)
      for (let si = 0; si < 4; si++) {
        const idx = KB_ROWS[si].indexOf(key)
        if (idx !== -1) {
          handlePlay(si, idx + 1)
          return
        }
      }
    }
    const onKeyUp = (e) => pressed.delete(e.key.toLowerCase())
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [handlePlay])

  return (
    <div className={`bass-guitar ${isWhiteBackground ? 'bass-guitar--white-bg' : ''}`}>
      <div className="bass-guitar__header">
        <div className={`bass-guitar__note ${isPlaying ? 'playing' : ''}`}>{activeNote}</div>
      </div>

      <div className="bass-guitar__fretboard-wrap">
        <div className="bass-guitar__fretboard">
          {STRING_NAMES.map((name, si) => (
            <div key={name} className="bass-guitar__string-row">
              <button
                type="button"
                className="bass-guitar__open-btn"
                onPointerDown={() => handlePlay(si, 0)}
                title={`Open ${name} string`}
                aria-label={`Play open ${name} string`}
              >
                {name}
              </button>
              <div
                className="bass-guitar__string-line"
                style={{
                  height: `${STRING_THICK[si]}px`,
                  background: STRING_COLORS[si],
                  opacity: 0.65,
                }}
              />
              <div className="bass-guitar__frets">
                {Array.from({ length: NUM_FRETS - 1 }, (_, i) => i + 1).map((fret) => (
                  <div
                    key={fret}
                    data-fret={fret}
                    role="button"
                    tabIndex={0}
                    className={`bass-guitar__fret ${activeFrets[`${si}-${fret}`] ? 'active' : ''}`}
                    onPointerDown={() => handlePlay(si, fret)}
                    aria-label={`${name} string fret ${fret}`}
                  >
                    {MARKER_FRETS.has(fret) && si === 1 && <span className="bass-guitar__dot" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bass-guitar__fret-nums">
          {Array.from({ length: NUM_FRETS - 1 }, (_, i) => i + 1).map((f) => (
            <div key={f} className={`bass-guitar__fret-num ${MARKER_FRETS.has(f) ? 'marker' : ''}`}>
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="bass-guitar__controls">
        <div className="bass-guitar__knob-group">
          <span className="bass-guitar__knob-label">Volume</span>
          <input
            type="range"
            min={-20}
            max={0}
            step={1}
            value={volVal}
            onChange={(e) => {
              const v = +e.target.value
              setVolVal(v)
              setVolume(v)
            }}
          />
          <span className="bass-guitar__knob-value">{volVal} dB</span>
        </div>

        <div className="bass-guitar__knob-group">
          <span className="bass-guitar__knob-label">Tone</span>
          <input
            type="range"
            min={60}
            max={1200}
            step={10}
            defaultValue={400}
            onChange={(e) => setTone(+e.target.value)}
          />
          <span className="bass-guitar__knob-value">filter</span>
        </div>

        <div className="bass-guitar__knob-group">
          <span className="bass-guitar__knob-label">Sustain</span>
          <input
            type="range"
            min={0.1}
            max={2}
            step={0.1}
            value={susVal}
            onChange={(e) => {
              const v = +e.target.value
              setSusVal(v)
              setSustain(v)
            }}
          />
          <span className="bass-guitar__knob-value">{susVal.toFixed(1)}s</span>
        </div>
      </div>

      <p className="bass-guitar__kb-hint">
        keyboard rows [1–0] [q–p] [a–;] [z–/] → strings E A D G
      </p>
    </div>
  )
}
