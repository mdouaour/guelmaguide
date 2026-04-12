'use client'

import { motion } from 'framer-motion'
import { MapPin, ExternalLink, Mail, Coffee, Code, Heart, ArrowRight, Globe } from 'lucide-react'
import Link from 'next/link'

const stack = [
  { name: 'Next.js 16', desc: 'App Router framework', color: 'bg-white/10' },
  { name: 'TypeScript', desc: 'Type-safe code', color: 'bg-blue-500/20' },
  { name: 'Tailwind CSS', desc: 'Styling', color: 'bg-cyan-500/20' },
  { name: 'Framer Motion', desc: 'Animations', color: 'bg-pink-500/20' },
  { name: 'React Leaflet', desc: 'Interactive maps', color: 'bg-green-500/20' },
  { name: 'Vercel', desc: 'Free hosting', color: 'bg-white/10' },
]

const features = [
  { title: '14+ Landmarks', desc: 'Detailed pages for every major site in Guelma', icon: MapPin },
  { title: 'AI Guide', desc: 'Smart local tips and travel advice', icon: Code },
  { title: 'Interactive Map', desc: 'Every location pinned and searchable', icon: Globe },
  { title: 'Completely Free', desc: 'No subscription, no paywalls — ever', icon: Heart },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-20 px-4" style={{ background: '#0A0A0F' }}>
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 pt-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-gold rounded-full text-xs text-yellow-400 mb-6">
            <Code className="w-3 h-3" /> Open &amp; Free for Guelma
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
            Built with <span className="gold-gradient">Love</span> for Guelma
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
            GuelmaGuide is a free, open city guide built to put Guelma on the map —
            to help travelers discover its Roman ruins, thermal springs, and rich culture,
            and to help locals share what they love about home.
          </p>
        </motion.div>

        {/* Developer Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-gold rounded-3xl p-8 md:p-10 mb-10 glow-gold"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-3xl font-bold text-black font-serif shadow-lg shadow-yellow-500/30">
                M
              </div>
            </div>

            {/* Bio */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold font-serif mb-1">Mouhamed Douaour</h2>
              <p className="text-yellow-400 text-sm font-medium mb-4">Full-Stack Developer · Guelma, Algeria 🇩🇿</p>

              <p className="text-white/70 leading-relaxed mb-6">
                I&apos;m a developer from Guelma who believes my city deserves better digital visibility.
                Guelma has 2,000-year-old Roman ruins, spectacular thermal springs, and warm, welcoming
                people — but it&apos;s barely on the tourist map. I built GuelmaGuide to change that.
              </p>
              <p className="text-white/60 leading-relaxed mb-6 text-sm">
                This entire project is free to use, forever. I keep it running because I love this city
                and I want travelers to discover it. If it helped you plan your visit or learn something
                new, a coffee would genuinely make my day.
              </p>

              {/* Social links */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <a
                  href="https://github.com/mdouaour"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 glass border border-white/20 rounded-xl text-sm text-white/70 hover:text-white hover:border-white/40 transition-all"
                >
                  <ExternalLink className="w-4 h-4" /> GitHub
                </a>
                <a
                  href="mailto:contact@guelma.guide"
                  className="inline-flex items-center gap-2 px-4 py-2 glass border border-white/20 rounded-xl text-sm text-white/70 hover:text-white hover:border-white/40 transition-all"
                >
                  <Mail className="w-4 h-4" /> Email Me
                </a>
              </div>
            </div>
          </div>

          {/* Buy Me a Coffee */}
          <div className="mt-8 pt-8 border-t border-yellow-400/20 text-center">
            <p className="text-white/50 text-sm mb-4">
              Hosting and domain are paid from my own pocket. If GuelmaGuide helped you,
              support keeps it alive.
            </p>
            <a
              href="https://www.buymeacoffee.com/mdouaour"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#FFDD00] text-[#000000] font-bold rounded-2xl hover:bg-[#FFE740] transition-all shadow-lg shadow-yellow-500/20 text-lg"
            >
              <Coffee className="w-5 h-5" />
              Buy Me a Coffee ☕
            </a>
            <p className="text-white/30 text-xs mt-3">Opens buymeacoffee.com — no account required</p>
          </div>
        </motion.div>

        {/* What this project does */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold font-serif mb-6 text-center">
            What <span className="gold-gradient">GuelmaGuide</span> Offers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="glass rounded-2xl p-5 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl glass-gold flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="font-semibold text-sm mb-1">{f.title}</div>
                  <div className="text-white/50 text-xs leading-relaxed">{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 md:p-8 mb-10"
        >
          <h2 className="text-xl font-bold font-serif mb-6 text-center">
            Built With
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {stack.map((s) => (
              <div key={s.name} className={`${s.color} rounded-xl p-3 border border-white/10`}>
                <div className="font-semibold text-sm">{s.name}</div>
                <div className="text-white/40 text-xs mt-0.5">{s.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact / Suggest a Place */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 md:p-8 mb-10"
        >
          <h2 className="text-xl font-bold font-serif mb-2">Know a Hidden Gem?</h2>
          <p className="text-white/50 text-sm mb-5 leading-relaxed">
            Guelma has countless beautiful spots that don&apos;t appear in any guide.
            If you know a place that should be featured here, I&apos;d love to hear about it.
          </p>
          <a
            href="mailto:contact@guelma.guide?subject=Suggest%20a%20Place%20for%20GuelmaGuide&body=Place%20name%3A%0ALocation%3A%0AWhat%20makes%20it%20special%3A%0A"
            className="inline-flex items-center gap-2 px-5 py-3 glass border border-yellow-400/30 text-yellow-400 rounded-xl text-sm font-medium hover:border-yellow-400/60 transition-all"
          >
            <Mail className="w-4 h-4" /> Suggest a Place <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* CTA to Explore */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-amber-400 transition-all text-base"
          >
            Explore Guelma <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
