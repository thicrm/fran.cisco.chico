/**
 * Reels / Shorts / TikToks page
 * Video content from artist's social platforms
 */
export default function Reels() {
  // Placeholder - embed TikTok, Instagram Reels, or YouTube Shorts
  const reels = [
    { id: 1, platform: 'TikTok', title: 'Reel 1', embedUrl: '#' },
    { id: 2, platform: 'Instagram', title: 'Reel 2', embedUrl: '#' },
    { id: 3, platform: 'YouTube', title: 'Short 1', embedUrl: '#' },
  ]

  return (
    <div className="p-6">
      <h2 className="text-xs font-medium tracking-[0.2em] text-white/60 uppercase mb-6">
        Reels & Shorts
      </h2>
      <div className="space-y-6">
        {reels.map((reel) => (
          <div
            key={reel.id}
            className="aspect-[9/16] max-w-[200px] bg-white/5 rounded overflow-hidden"
          >
            <div className="w-full h-full flex items-center justify-center text-white/40 text-sm">
              {reel.platform} • {reel.title}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-white/40 mt-4">
        Add embed URLs for TikTok, Instagram Reels, or YouTube Shorts
      </p>
    </div>
  )
}
