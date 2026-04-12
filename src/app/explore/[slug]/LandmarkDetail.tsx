'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Clock, Ticket, Star, ArrowLeft, ChevronRight, Share2, Navigation, Lightbulb } from 'lucide-react'
import type { Landmark } from '@/lib/landmarks'

interface Props {
  landmark: Landmark
  nearby: Landmark[]
}

export default function LandmarkDetail({ landmark: lm, nearby }: Props) {
  const share = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: lm.name, text: lm.desc, url: window.location.href })
    } else if (typeof navigator !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href)
    }
  }

  return (
    <div className="min-h-screen pt-16" style={{ background: '#0A0A0F' }}>
      {/* Back */}
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-2">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <Image
          src={lm.photo}
          alt={lm.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          onError={(e) => {
            // Fallback to gradient on image error
            const el = e.currentTarget as HTMLImageElement
            el.style.display = 'none'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />
        {/* Fallback gradient shown behind the image */}
        <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${lm.gradient}`} />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${lm.color}`}>
            {lm.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        {/* Title row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold font-serif mb-1">{lm.name}</h1>
              <p className="text-white/40 text-sm italic mb-2">{lm.nameFr} · {lm.nameAr}</p>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <MapPin className="w-4 h-4" /> {lm.location}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1 glass px-3 py-2 rounded-xl">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-sm">{lm.rating}</span>
              </div>
              <button
                onClick={share}
                className="p-2 glass rounded-xl text-white/50 hover:text-yellow-400 transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <a
                href={lm.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold rounded-xl text-sm hover:from-yellow-400 hover:to-amber-400 transition-all"
              >
                <Navigation className="w-4 h-4" /> Directions
              </a>
            </div>
          </div>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-3 mt-5">
            <div className="flex items-center gap-2 glass px-3 py-2 rounded-lg text-sm text-white/60">
              <Clock className="w-4 h-4 text-yellow-400" /> {lm.hours}
            </div>
            <div className="flex items-center gap-2 glass px-3 py-2 rounded-lg text-sm text-white/60">
              <Ticket className="w-4 h-4 text-yellow-400" /> {lm.fee}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Long description */}
            <div className="glass rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold font-serif mb-4 gold-gradient">About this place</h2>
              {lm.longDesc.split('\n\n').map((para, i) => (
                <p key={i} className="text-white/70 leading-relaxed mb-4 last:mb-0 text-sm md:text-base">
                  {para.trim()}
                </p>
              ))}
            </div>

            {/* Tips */}
            <div className="glass rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" /> Insider Tips
              </h2>
              <ul className="space-y-3">
                {lm.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                    <span className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Quick info */}
            <div className="glass-gold rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-sm text-yellow-400">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Category</span>
                  <span className="font-medium">{lm.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Entry</span>
                  <span className="font-medium">{lm.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Hours</span>
                  <span className="font-medium text-right max-w-[150px]">{lm.hours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Rating</span>
                  <span className="font-medium text-yellow-400">{lm.rating} / 5.0</span>
                </div>
              </div>
              <a
                href={lm.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold rounded-xl text-sm hover:from-yellow-400 hover:to-amber-400 transition-all"
              >
                <Navigation className="w-4 h-4" /> Open in Google Maps
              </a>
            </div>

            {/* Ask AI */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold mb-2 text-sm">Have questions?</h3>
              <p className="text-white/50 text-xs mb-3">Ask our AI concierge anything about {lm.name}.</p>
              <Link
                href={`/concierge?q=${encodeURIComponent(lm.name)}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 glass border border-yellow-400/30 text-yellow-400 font-medium rounded-xl text-sm hover:border-yellow-400/60 transition-all"
              >
                Ask AI Guide <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Nearby landmarks */}
        {nearby.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold font-serif mb-6">Nearby <span className="gold-gradient">Landmarks</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {nearby.map((n) => (
                <Link
                  key={n.slug}
                  href={`/explore/${n.slug}`}
                  className="glass rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform duration-200"
                >
                  <div className={`h-32 bg-gradient-to-br ${n.gradient} relative overflow-hidden`}>
                    <Image
                      src={n.photo}
                      alt={n.name}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${n.color} mb-1 inline-block`}>
                      {n.category}
                    </span>
                    <div className="font-semibold text-sm">{n.name}</div>
                    <div className="text-white/40 text-xs mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {n.location}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
