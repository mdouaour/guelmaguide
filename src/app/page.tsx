'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Star, Users, Landmark, ChevronRight, Sparkles, Coffee, Heart, CheckCircle } from 'lucide-react'
import { landmarks } from '@/lib/landmarks'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const featuredLandmarks = landmarks.slice(0, 3)

const stats = [
  { value: `${landmarks.length}+`, label: 'Landmarks', icon: Landmark },
  { value: 'Free', label: 'Forever', icon: Heart },
  { value: '4.9★', label: 'Rating', icon: Star },
]

const steps = [
  { step: '01', title: 'Find Your Destination', desc: 'Search or browse 14+ curated landmarks — from Roman ruins to hidden natural springs.' },
  { step: '02', title: 'Ask the AI Guide', desc: 'Get instant answers about opening hours, transport, local food, and insider tips.' },
  { step: '03', title: 'Explore on the Map', desc: 'Use the interactive map to plan your route and navigate Guelma with confidence.' },
]

const testimonials = [
  { name: 'Amira Bensalem', role: 'Travel Blogger', text: 'GuelmaGuide is the only resource I could find that covers Guelma in this much depth. The AI guide answered every question!', rating: 5 },
  { name: 'Karim Boudjemaa', role: 'History Enthusiast', text: 'The Roman Theatre section has incredible historical detail. Finally a guide that does justice to Calama\'s legacy.', rating: 5 },
  { name: 'Nadia Merabet', role: 'Local Guide', text: 'I recommend this to all my tour groups. The interactive map and detailed pages are superb.', rating: 5 },
]

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: '#0A0A0F' }}>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-900/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div {...fadeUp} className="inline-flex items-center gap-2 px-4 py-2 glass-gold rounded-full text-xs text-yellow-400 mb-6">
            <Sparkles className="w-3 h-3" />
            Free City Guide · AI-Powered · No Login Needed
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold font-serif mb-6 leading-tight"
          >
            Discover{' '}
            <span className="gold-gradient">Guelma</span>
            <br />
            Like Never Before
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Explore ancient Roman ruins, natural thermal springs, and rich Algerian culture
            with your personal AI travel guide. Completely free, always.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold rounded-xl hover:from-yellow-400 hover:to-amber-400 transition-all duration-200 shadow-lg shadow-yellow-500/25"
            >
              Explore Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/concierge"
              className="inline-flex items-center gap-2 px-8 py-4 glass border border-white/20 text-white font-medium rounded-xl hover:border-yellow-400/40 transition-all duration-200"
            >
              Ask the AI Guide <Sparkles className="w-4 h-4 text-yellow-400" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-8 bg-gradient-to-b from-yellow-400/50 to-transparent" />
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-gold rounded-2xl p-6 text-center"
              >
                <div className="text-3xl font-bold gold-gradient font-serif mb-1">{stat.value}</div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Landmarks */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-3">
              <span className="gold-gradient">Featured</span> Landmarks
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">Guelma&apos;s most remarkable destinations, waiting to be explored.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredLandmarks.map((lm, i) => (
              <motion.div
                key={lm.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="glass rounded-2xl overflow-hidden group cursor-pointer"
              >
                <Link href={`/explore/${lm.slug}`} className="block">
                  <div className={`h-48 bg-gradient-to-br ${lm.gradient} relative overflow-hidden`}>
                    <Image
                      src={lm.photo}
                      alt={lm.name}
                      fill
                      className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${lm.color}`}>
                      {lm.category}
                    </span>
                    <h3 className="font-bold text-lg mb-2 font-serif group-hover:text-yellow-400 transition-colors">{lm.name}</h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-2">{lm.desc}</p>
                    <span className="inline-flex items-center gap-1 text-yellow-400 text-sm">
                      Learn More <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 glass border border-white/20 text-white rounded-xl hover:border-yellow-400/40 transition-all text-sm"
            >
              View all {landmarks.length} landmarks <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Concierge Teaser */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 glass-gold rounded-full text-xs text-yellow-400 mb-4">
                <Sparkles className="w-3 h-3" /> AI-Powered
              </div>
              <h2 className="text-3xl font-bold font-serif mb-4">
                Your Personal<br /><span className="gold-gradient">AI Guide</span> to Guelma
              </h2>
              <p className="text-white/50 mb-6 leading-relaxed">
                Ask anything about Guelma. Our AI guide knows every landmark, local tip, opening hour, and hidden gem.
              </p>
              <Link
                href="/concierge"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold rounded-xl hover:from-yellow-400 hover:to-amber-400 transition-all"
              >
                Start Chatting <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <div className="flex justify-end">
                <div className="glass px-4 py-3 rounded-2xl rounded-tr-sm max-w-xs text-sm text-white/80">
                  What are the best places to visit in Guelma?
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-xs font-bold text-black shrink-0">
                  AI
                </div>
                <div className="glass-gold px-4 py-3 rounded-2xl rounded-tl-sm max-w-xs text-sm text-white/80 leading-relaxed">
                  Guelma has incredible treasures! Start with the Roman Theatre, then head to Hammam Debagh for an unforgettable thermal bath experience...
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold font-serif mb-3">How It <span className="gold-gradient">Works</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass rounded-2xl p-6 relative"
              >
                <div className="text-5xl font-bold font-serif text-yellow-500/20 mb-4">{s.step}</div>
                <h3 className="font-bold text-lg mb-2 font-serif">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Free forever + Buy Me a Coffee */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-gold rounded-3xl p-8 text-center glow-gold"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full text-xs text-green-400 mb-4">
              <CheckCircle className="w-3 h-3" /> 100% Free · No Account · No Ads
            </div>
            <h2 className="text-3xl font-bold font-serif mb-2">Free, Always</h2>
            <p className="text-white/50 mb-6 leading-relaxed max-w-sm mx-auto">
              GuelmaGuide will always be free to use. If it helped you discover something beautiful,
              buying me a coffee keeps the servers running.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-2">
              {['Detailed landmark pages', 'AI travel guide', 'Interactive map', 'No signup needed'].map((f) => (
                <div key={f} className="flex items-center gap-1 text-sm text-white/60">
                  <CheckCircle className="w-4 h-4 text-yellow-400" /> {f}
                </div>
              ))}
            </div>
            <a
              href="https://www.buymeacoffee.com/mdouaour"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-3 px-8 py-4 bg-[#FFDD00] text-black font-bold rounded-2xl hover:bg-[#FFE740] transition-all text-lg"
            >
              <Coffee className="w-5 h-5" /> Buy Me a Coffee ☕
            </a>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold font-serif mb-3">What Travelers <span className="gold-gradient">Say</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-white/40 text-xs">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
