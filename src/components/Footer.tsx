import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#07070B]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>Smart city guide for Guelma, Algeria.</p>
        <div className="flex items-center gap-4">
          <Link href="/discover" className="hover:text-white">Discover</Link>
          <Link href="/activities" className="hover:text-white">Activities</Link>
          <Link href="/ai" className="hover:text-white">AI Guide</Link>
        </div>
      </div>
    </footer>
  )
}
