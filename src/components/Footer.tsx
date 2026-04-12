import Link from 'next/link'
import { MapPin, ExternalLink, Mail, Coffee, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#07070B] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg glass-gold flex items-center justify-center">
                <MapPin className="w-4 h-4 text-yellow-400" />
              </div>
              <span className="text-lg font-bold gold-gradient font-serif">GuelmaGuide</span>
            </div>
            <p className="text-white/50 text-sm max-w-xs leading-relaxed mb-4">
              A free, open guide to Guelma, Algeria — ancient ruins, natural wonders, and vibrant culture.
              Built with love for this city.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/mdouaour"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 glass rounded-lg text-white/40 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@guelma.guide"
                className="p-2 glass rounded-lg text-white/40 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://www.buymeacoffee.com/mdouaour"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 glass rounded-lg text-white/40 hover:text-yellow-400 transition-colors"
                aria-label="Buy Me a Coffee"
              >
                <Coffee className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-3">Explore</h3>
            <ul className="space-y-2">
              {[
                { href: '/explore', label: 'All Landmarks' },
                { href: '/map', label: 'Interactive Map' },
                { href: '/concierge', label: 'AI Guide' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/40 hover:text-white/70 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-3">About</h3>
            <ul className="space-y-2">
              {[
                { href: '/about', label: 'About the Project' },
                { href: '/about#contact', label: 'Contact' },
                { href: 'https://www.buymeacoffee.com/mdouaour', label: '☕ Buy Me a Coffee', external: true },
              ].map((l) => (
                <li key={l.href}>
                  {l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/40 hover:text-yellow-400 transition-colors"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="text-sm text-white/40 hover:text-white/70 transition-colors">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/30 text-xs">
            © 2025 GuelmaGuide. Free forever.
          </p>
          <p className="text-white/30 text-xs flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> by{' '}
            <Link href="/about" className="text-yellow-400/70 hover:text-yellow-400 transition-colors">
              Mouhamed Douaour
            </Link>
            {' '}· Guelma, Algeria
          </p>
        </div>
      </div>
    </footer>
  )
}
