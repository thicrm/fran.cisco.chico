import { useState, useRef, useEffect, useCallback } from 'react'
import { GALLERY_IMAGES } from '../../data/gallery-images'
import { t, tVars } from '../../i18n'

/**
 * Gallery - horizontal scroll + arrow buttons (vertical wheel scrolls the page, not hijacked).
 */
export default function Gallery({ locale }) {
  const scrollRef = useRef(null)
  const [failedUrls, setFailedUrls] = useState(new Set())
  const [lightboxSrc, setLightboxSrc] = useState(null)

  const images = GALLERY_IMAGES.filter((src) => !failedUrls.has(src))

  useEffect(() => {
    if (lightboxSrc) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [lightboxSrc])

  useEffect(() => {
    if (!lightboxSrc) return
    const onKey = (e) => e.key === 'Escape' && setLightboxSrc(null)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightboxSrc])

  const handleImageError = useCallback((src) => {
    setFailedUrls((prev) => new Set(prev).add(src))
  }, [])

  const scrollByOne = useCallback((direction) => {
    const el = scrollRef.current
    if (!el || images.length === 0) return
    const firstChild = el.querySelector(':scope > div')
    const step = firstChild ? firstChild.offsetWidth + 12 : el.clientWidth
    el.scrollBy({ left: direction * step, behavior: 'smooth' })
  }, [images.length])

  if (images.length === 0) return null

  return (
    <>
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => scrollByOne(-1)}
        aria-label={t(locale, 'galleryPrevAria')}
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '28px',
          height: '28px',
          padding: 0,
          border: 'none',
          background: 'rgba(0,0,0,0.3)',
          color: '#fff',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          borderRadius: '4px',
        }}
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => scrollByOne(1)}
        aria-label={t(locale, 'galleryNextAria')}
        style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '28px',
          height: '28px',
          padding: 0,
          border: 'none',
          background: 'rgba(0,0,0,0.3)',
          color: '#fff',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          borderRadius: '4px',
        }}
      >
        ›
      </button>
      <div
        ref={scrollRef}
        style={{
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          display: 'flex',
          gap: '12px',
          padding: '4px 36px',
          margin: '0 -4px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {images.map((src, i) => (
          <div
            key={src}
            role="button"
            tabIndex={0}
            onClick={() => setLightboxSrc(src)}
            onKeyDown={(e) => e.key === 'Enter' && setLightboxSrc(src)}
            style={{
              flex: '0 0 calc(50% - 6px)',
              minWidth: 'min(calc(50vw - 20px), 340px)',
              aspectRatio: '4/3',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              cursor: 'pointer',
            }}
          >
            <img
              src={src}
              alt={tVars(locale, 'galleryAlt', { n: i + 1 })}
              onError={() => handleImageError(src)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        ))}
      </div>
    </div>

    {lightboxSrc && (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t(locale, 'galleryLightboxAria')}
        onClick={() => setLightboxSrc(null)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          cursor: 'pointer',
        }}
      >
        <img
          src={lightboxSrc}
          alt={t(locale, 'galleryFullSizeAlt')}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '90vw',
            maxHeight: '90vh',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            cursor: 'default',
          }}
        />
      </div>
    )}
    </>
  )
}
