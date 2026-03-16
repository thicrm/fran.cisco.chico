import { useRef, useCallback } from 'react'
import * as Tone from 'tone'

export function useBassAudio() {
  const synthRef = useRef(null)
  const filterRef = useRef(null)
  const volRef = useRef(null)

  const initAudio = useCallback(async () => {
    if (synthRef.current) return
    await Tone.start()

    volRef.current = new Tone.Volume(-6).toDestination()
    filterRef.current = new Tone.Filter(400, 'lowpass').connect(volRef.current)
    const dist = new Tone.Distortion(0.05).connect(filterRef.current)

    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'fatsawtooth', count: 2, spread: 8 },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0.6, release: 0.8 },
    }).connect(dist)
  }, [])

  const playNote = useCallback(
    async (stringIdx, fret) => {
      await initAudio()
      const base = [28, 33, 38, 43] // E A D G MIDI base
      const midi = base[stringIdx] + fret
      const freq = 440 * Math.pow(2, (midi - 69) / 12)
      synthRef.current.triggerAttackRelease(freq, '4n')
    },
    [initAudio]
  )

  const setVolume = useCallback((db) => {
    if (volRef.current) volRef.current.volume.value = db
  }, [])

  const setTone = useCallback((freq) => {
    if (filterRef.current) filterRef.current.frequency.value = freq
  }, [])

  const setSustain = useCallback((release) => {
    if (synthRef.current) synthRef.current.set({ envelope: { release } })
  }, [])

  const dispose = useCallback(() => {
    synthRef.current?.dispose()
    filterRef.current?.dispose()
    volRef.current?.dispose()
    synthRef.current = null
    filterRef.current = null
    volRef.current = null
  }, [])

  return { playNote, setVolume, setTone, setSustain, dispose }
}
