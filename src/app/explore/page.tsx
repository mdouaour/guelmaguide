'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Star, Clock, Search, X, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { landmarks, categories, getLandmarksByCategory } from '@/lib/landmarks'
import type { Category } from '@/lib/landmarks'

function ExploreContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  useEffect(() => {
    const q = searchParams.get('q') ?? ''
    setQuery(q)
  }, [searchParams])

  const handleSearch = (value: string) => {
    setQuery(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value.trim()) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    router.replace(`/explore?${params.toString()}`, { scroll: false })
  }

  const clearSearch = () => handleSearch('')

  const byCategory = getLandmarksByCategory(activeCategory)
  const filtered = query.trim()
    ? byCategory.filter(
        (l) =>
          l.name.toLowerCase().includes(query.toLowerCase()) ||
          l.desc.toLowerCase().includes(query.toLowerCase()) ||
          l.location.toLowerCase().includes(query.toLowerCase()) ||
          l.nameFr.toLowerCase().includes(query.toLowerCase()),
      )
    : byCategory

  return (
    <div className="min-h-screen pt-20 px-4 pb-16" style={{ background: '#0A0A0F' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 pt-8"
        >
          <h1 className="text-5xl font-bold font-serif mb-4">
            Explore <span className="gold-gradient">Guelma</span>
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">
            Discover {landmarks.length} remarkable destinations across Guelma and its surroundings.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="max-w-xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search landmarks, categories, or locations..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-10 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition-colors"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black'
                  : 'glass text-white/60 hover:text-white border border-white/10 hover:border-yellow-400/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Results count */}
        {query && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/40 text-sm mb-6"
          >
            {filtered.length === 0
              ? 'No results found'
              : `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${query}"`}
          </motion.p>
        )}

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">No landmarks found</h3>
              <p className="text-white/40 text-sm mb-6">Try a different search term or category.</p>
              <Link
                href="/concierge"
                className="inline-flex items-center gap-2 px-5 py-3 glass border border-yellow-400/30 text-yellow-400 rounded-xl text-sm hover:border-yellow-400/60 transition-all"
              >
                <Sparkles className="w-4 h-4" /> Ask the AI Guide instead
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((lm, i) => (
                <motion.div
                  key={lm.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="glass rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <Link href={`/explore/${lm.slug}`} className="block">
                    <div className={`h-44 bg-gradient-to-br ${lm.gradient} relative overflow-hidden`}>
                      <Image
                        src={lm.photo}
                        alt={lm.name}
                        fill
                        className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute top-3 right-3 flex items-center gap-1 glass px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-white/80">{lm.rating}</span>
                      </div>
                      {lm.category === 'Hidden Gem' && (
                        <div className="absolute top-3 left-3 bg-lime-500/80 px-2 py-1 rounded-full text-xs font-medium text-black">
                          ✦ Hidden Gem
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${lm.color}`}>
                        {lm.category}
                      </span>
                      <h3 className="font-bold text-lg font-serif mb-1 group-hover:text-yellow-400 transition-colors">
                        {lm.name}
                      </h3>
                      <div className="flex items-center gap-1 text-white/40 text-xs mb-3">
                        <MapPin className="w-3 h-3" /> {lm.location}
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-2">{lm.desc}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-white/40 text-xs">
                          <Clock className="w-3 h-3" /> {lm.hours}
                        </div>
                        <span className="text-yellow-400 text-xs">View Details →</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-20 flex items-center justify-center" style={{ background: '#0A0A0F' }}>
        <div className="text-white/40">Loading...</div>
      </div>
    }>
      <ExploreContent />
    </Suspense>
  )
}
