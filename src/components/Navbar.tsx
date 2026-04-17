import Link from 'next/link'
import { MapPin } from 'lucide-react'

const links = [
  { href: '/discover', label: 'Discover' },
  { href: '/activities', label: 'Activities' },
  { href: '/ai', label: 'AI Guide' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0A0F]/95 backdrop-blur">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <MapPin className="h-4 w-4 text-yellow-400" />
          <span>GuelmaGuide</span>
        </Link>
        <div className="flex items-center gap-3 text-sm text-white/80">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-md px-2 py-1 hover:bg-white/5 hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
