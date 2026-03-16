import { useEffect, useRef } from 'react'

export default function PixelBassCanvas({ width = 560, height = 100 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function px(x, y, w, h, color) {
      ctx.fillStyle = color
      ctx.fillRect(x, y, w, h)
    }

    ctx.clearRect(0, 0, width, height)

    // ── Body ──────────────────────────────────────────────────────────
    const bodyShapes = [
      [130, 6, 8, 4, '#8B1A1A'],
      [122, 10, 24, 4, '#A52020'],
      [118, 14, 32, 66, '#C0392B'],
      [122, 80, 24, 8, '#A52020'],
      [130, 88, 8, 4, '#8B1A1A'],
      [150, 4, 100, 88, '#C0392B'],
      [250, 10, 30, 76, '#A52020'],
      [274, 16, 16, 64, '#8B1A1A'],
      [282, 24, 8, 48, '#6B1010'],
      [246, 4, 32, 10, '#A52020'],
      [254, 2, 20, 10, '#8B1A1A'],
    ]
    bodyShapes.forEach(([x, y, w, h, c]) => px(x, y, w, h, c))

    px(150, 4, 100, 2, '#6B1010')
    px(150, 90, 100, 2, '#6B1010')
    px(284, 20, 2, 56, '#4a0a0a')

    // ── Pickguard ─────────────────────────────────────────────────────
    px(158, 14, 72, 56, '#111')
    px(160, 16, 68, 52, '#1e1e1e')

    // ── Pickups ───────────────────────────────────────────────────────
    px(164, 24, 50, 10, '#2a2a2a')
    px(166, 26, 46, 6, '#444')
    for (let i = 0; i < 4; i++) px(169 + i * 10, 27, 4, 4, '#888')

    px(164, 42, 50, 10, '#2a2a2a')
    px(166, 44, 46, 6, '#444')
    for (let i = 0; i < 4; i++) px(169 + i * 10, 45, 4, 4, '#888')

    // ── Knobs ─────────────────────────────────────────────────────────
    for (let i = 0; i < 3; i++) {
      px(226 + i * 12, 66, 8, 8, '#555')
      px(227 + i * 12, 67, 6, 6, '#999')
      px(229 + i * 12, 68, 2, 2, '#fff')
    }

    // ── Jack ──────────────────────────────────────────────────────────
    px(278, 70, 4, 8, '#666')
    px(279, 71, 2, 6, '#aaa')

    // ── Neck ──────────────────────────────────────────────────────────
    for (let x = 0; x < 130; x++) {
      const taper = Math.floor((x / 130) * 8)
      const neckY = 36 + taper
      const neckH = 28 - taper * 2
      const shade = 80 + Math.floor(x * 0.5)
      ctx.fillStyle = `rgb(${Math.floor(shade * 0.55)},${Math.floor(shade * 0.35)},${Math.floor(shade * 0.12)})`
      ctx.fillRect(x, neckY, 1, neckH)
    }

    for (let x = 0; x < 130; x++) {
      const taper = Math.floor((x / 130) * 8)
      px(x, 36 + taper, 1, 1, '#c8a96e')
      px(x, 36 + taper + 28 - taper * 2 - 1, 1, 1, '#c8a96e')
    }

    // ── Fret lines ────────────────────────────────────────────────────
    const fretPositions = [14, 27, 39, 50, 61, 70, 79, 87, 95, 102, 109, 115, 121]
    fretPositions.forEach((fx) => {
      const taper = Math.floor((fx / 130) * 8)
      px(fx, 37 + taper, 2, 26 - taper * 2, '#c8c8b0')
    })

    const markerFrets = [2, 4, 6, 8]
    markerFrets.forEach((mi) => {
      const fx = fretPositions[mi]
      if (fx) px(fx - 5, 49, 4, 4, 'rgba(255,255,255,0.4)')
    })

    // ── Strings ───────────────────────────────────────────────────────
    const stringColors = ['#f0d090', '#d4b85e', '#b89040', '#9a7830']
    const stringYs = [41, 46, 51, 56]
    const stringThick = [2, 2, 1, 1]
    stringYs.forEach((sy, i) => {
      ctx.fillStyle = stringColors[i]
      ctx.fillRect(0, sy, 294, stringThick[i])
      ctx.fillStyle = 'rgba(0,0,0,0.3)'
      ctx.fillRect(0, sy + stringThick[i], 294, 1)
    })

    // ── Headstock ─────────────────────────────────────────────────────
    px(0, 32, 16, 36, '#4a2808')
    px(2, 30, 12, 4, '#4a2808')
    px(2, 68, 12, 4, '#4a2808')
    px(2, 34, 12, 32, '#6b3c14')
    px(3, 35, 10, 30, '#7a4520')
    px(14, 36, 4, 28, '#ddd')

    // ── Tuning pegs ───────────────────────────────────────────────────
    const pegYs = [36, 44, 52, 60]
    pegYs.forEach((py) => {
      px(0, py, 10, 6, '#777')
      px(1, py + 1, 8, 4, '#aaa')
      px(2, py + 2, 4, 2, '#ddd')
      px(10, py + 1, 4, 4, '#888')
    })

    // ── Bridge ────────────────────────────────────────────────────────
    px(284, 30, 10, 40, '#444')
    px(285, 32, 8, 36, '#666')
    px(286, 34, 6, 32, '#888')
    stringYs.forEach((sy, i) => {
      px(282, sy, 20, stringThick[i], stringColors[i])
    })

    px(284, 88, 8, 6, '#777')
    px(285, 89, 6, 4, '#bbb')
    px(118, 50, 6, 6, '#777')
    px(119, 51, 4, 4, '#bbb')

    ctx.fillStyle = '#e8c97a'
    ctx.font = 'bold 8px monospace'
    ctx.fillText('BASS-4', 160, 12)
  }, [width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ imageRendering: 'pixelated', display: 'block', width: '100%', maxWidth: width }}
    />
  )
}
