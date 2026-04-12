'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Search, X, Layers } from 'lucide-react'
import Link from 'next/link'
import { landmarks } from '@/lib/landmarks'

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false })

const categoryColors: Record<string, string> = {
  Historical: 'bg-purple-500/20 text-purple-400',
  Nature: 'bg-emerald-500/20 text-emerald-400',
  Culture: 'bg-blue-500/20 text-blue-400',
  Food: 'bg-rose-500/20 text-rose-400',
  'Hidden Gem': 'bg-lime-500/20 text-lime-400',
}

export default function MapPage() {
  const [selected, setSelected] = useState<typeof landmarks[0] | null>(null)
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? landmarks.filter(
        (l) =>
          l.name.toLowerCase().includes(query.toLowerCase()) ||
          l.category.toLowerCase().includes(query.toLowerCase()),
      )
    : landmarks

  return (
    <div className="min-h-screen pt-16 flex flex-col" style={{ background: '#0A0A0F' }}>
      <div className="flex-1 relative flex">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-72 glass border-r border-white/10 overflow-y-auto z-10 shrink-0 flex flex-col"
        >
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-yellow-400" />
              <span className="font-semibold text-sm">Landmarks</span>
              <span className="ml-auto text-white/40 text-xs">{filtered.length}</span>
            </div>
            {/* Search within map */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter landmarks..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-7 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/40 transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="p-2 flex-1">
            {filtered.map((lm) => (
              <button
                key={lm.slug}
                onClick={() => setSelected(lm)}
                className={`w-full text-left px-3 py-3 rounded-lg mb-1 transition-all duration-200 ${
                  selected?.slug === lm.slug ? 'glass-gold' : 'hover:glass'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      lm.category === 'Historical' ? 'bg-purple-400' :
                      lm.category === 'Nature' ? 'bg-emerald-400' :
                      lm.category === 'Culture' ? 'bg-blue-400' :
                      lm.category === 'Food' ? 'bg-rose-400' :
                      'bg-lime-400'
                    }`}
                  />
                  <div>
                    <div className="text-sm font-medium">{lm.name}</div>
                    <div className="text-xs text-white/40">{lm.category}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="p-4 border-t border-white/10">
            <p className="text-white/30 text-xs mb-2">Category colors</p>
            <div className="space-y-1">
              {Object.entries(categoryColors).map(([cat, color]) => (
                <div key={cat} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    cat === 'Historical' ? 'bg-purple-400' :
                    cat === 'Nature' ? 'bg-emerald-400' :
                    cat === 'Culture' ? 'bg-blue-400' :
                    cat === 'Food' ? 'bg-rose-400' :
                    'bg-lime-400'
                  }`} />
                  <span className="text-xs text-white/40">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Map area */}
        <div className="flex-1 relative">
          <LeafletMap landmarks={filtered} onMarkerClick={setSelected} />

          {/* Selected info overlay */}
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-gold rounded-xl px-5 py-3 flex items-center gap-4 max-w-sm z-[1000]"
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{selected.name}</div>
                <div className="text-xs text-white/50">{selected.category} · {selected.location}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/explore/${selected.slug}`}
                  className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-semibold rounded-lg hover:from-yellow-400 hover:to-amber-400 transition-all"
                >
                  View Details
                </Link>
                <button
                  onClick={() => setSelected(null)}
                  className="text-white/40 hover:text-white text-lg leading-none"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
