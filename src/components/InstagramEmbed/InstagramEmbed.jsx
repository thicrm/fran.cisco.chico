import { useEffect, useRef } from 'react'

/**
 * Instagram blockquote embed - sets HTML only once on mount
 * so it doesn't blink when parent re-renders (e.g. on color change)
 * Supports reels (reelId) or posts (permalink)
 */
export default function InstagramEmbed({ reelId, permalink }) {
  const containerRef = useRef(null)
  const initializedRef = useRef(false)

  const embedUrl = permalink ?? (reelId ? `https://www.instagram.com/reel/${reelId}/?utm_source=ig_embed&amp;utm_campaign=loading` : null)

  useEffect(() => {
    if (!containerRef.current || initializedRef.current || !embedUrl) return
    initializedRef.current = true

    containerRef.current.innerHTML = `<blockquote class="instagram-media" data-instgrm-permalink="${embedUrl}" data-instgrm-version="14" style=" background:#FFF; border:none; border-radius:0; box-shadow:none; margin:0; max-width:540px; min-width:326px; padding:0; width:100%;"></blockquote>`

    const processEmbed = () => {
      if (window.instgrm) window.instgrm.Embeds.process()
    }
    processEmbed()
    if (window.instgrm) return
    const checkInstgrm = setInterval(() => {
      if (window.instgrm) {
        clearInterval(checkInstgrm)
        processEmbed()
      }
    }, 100)
    return () => clearInterval(checkInstgrm)
  }, [embedUrl])

  return <div ref={containerRef} className="instagram-embed-no-border" style={{ width: 'min(326px, 100%)' }} />
}
