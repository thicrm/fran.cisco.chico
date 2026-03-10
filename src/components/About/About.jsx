/**
 * About page - artist bio, info
 * GMB-inspired: split typography, clean layout
 */
export default function About() {
  return (
    <div className="p-6">
      <h2 className="text-xs font-medium tracking-[0.2em] text-white/60 uppercase mb-6">
        About
      </h2>
      <div className="space-y-6 text-sm text-white/90 leading-relaxed">
        <p>
          [Artist name] is a musician, bassist, guitarist, drummer, producer, and
          content creator. With expertise across multiple instruments and
          production, they develop bold sounds that elevate every project.
        </p>
        <p>
          From live performances to studio production, the focus is on
          collaborating closely with artists to bring their vision to life—
          creating music that resonates deeply with audiences.
        </p>
        <p className="text-white/60 text-xs">(based in [location])</p>
        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-white/50 uppercase tracking-wider mb-2">
            Contact
          </p>
          <p className="text-sm">Available for sessions and collaborations.</p>
          <div className="flex gap-4 mt-2">
            <a href="mailto:artist@example.com" className="text-white/80 hover:text-white underline">
              email
            </a>
            <a href="#" className="text-white/80 hover:text-white underline">
              instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
