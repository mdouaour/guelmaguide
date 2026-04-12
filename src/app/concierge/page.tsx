'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, MessageCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

interface Message {
  role: 'user' | 'ai'
  text: string
  id: number
}

const aiResponses: Record<string, string> = {
  default: "I'd be happy to help you explore Guelma! Ask me about landmarks, local food, transport, weather, history, or the best times to visit. Type anything or tap a suggestion below.",

  visit: "The best time to visit Guelma is **spring (March–May)** or **autumn (September–November)**. You'll enjoy mild temperatures (18–25°C) perfect for exploring the Roman Theatre and outdoor springs. Summer can be hot (35°C+) but the thermal baths are refreshing. Winter is mild but rainy.",

  hammam: "**Hammam Debagh** is about 12km northwest of Guelma city. You can take a local taxi (service) from the main bus station for around 100–200 DA, or rent a car. It's open **6:00 AM to 8:00 PM** daily. The entry fee is 150 DA. Bring a towel and flip-flops — facilities are basic but the experience is unforgettable!",

  food: "Guelma's local specialties include **Chakhchoukha** (layered flatbread with lamb stew), **Berkoukes** (small pasta in broth), **Baklawa** sweets, and **msemen** flatbread with honey. The Central Souk has the best street food. Try **Café Riche** near the Roman Theatre for traditional Algerian coffee and pastries.",

  hotel: "Near the Roman Theatre, you'll find **Hotel Cirta** and several guesthouses on Rue Colonel Amirouche. For a traditional experience, stay in a local riad in the old town. Budget options start at 2,500–4,000 DA/night. There are also newer hotels near the university area.",

  theatre: "The **Roman Theatre of Guelma** was built in the 2nd century AD when the city was called **Calama**. It could seat **4,000 spectators** and is one of the best-preserved Roman theatres in North Africa. It still hosts the annual **Guelma Theatre Festival** every summer. Entry is 200 DA, open 8 AM–6 PM.",

  museum: "The **Guelma Archaeological Museum** on Place de la République holds Roman mosaics, statues, coins, and artifacts from ancient Calama. Entry is 100 DA. Open 9 AM–5 PM, **closed on Fridays**. Don't miss the 'Venus mosaic' — the museum's most famous piece.",

  transport: "Getting around Guelma: **Local taxis (service)** run fixed routes for 50–200 DA. **Buses** connect Guelma to Annaba (1.5h), Constantine (2h), and Sétif (2.5h) from the main bus station. **Car rental** is available at a few agencies near the center. There is no train service currently.",

  weather: "Guelma has a **Mediterranean climate** with hot dry summers and mild wet winters. Average temperatures: January 8°C, July 32°C. Spring and autumn are ideal for tourism. Rainfall mainly October–March. Snow is rare but possible on the surrounding mountains in January–February.",

  emergency: "**Emergency numbers in Algeria:** Police: 17 · Ambulance (SAMU): 115 · Fire: 14 · Civil Protection: 021 73 92 92. The nearest major hospital is **Hôpital de Guelma** (CHU Salah Bouchaib) on the main boulevard. Pharmacies (pharmacies) are open until 8–9 PM across the city center.",

  springs: "**Ain Larbi Hot Springs** are 15km north of Guelma, free to enter, and open 24 hours. The water is rich in minerals (40–50°C) and surrounded by lush forest. **Hammam Debagh** (12km NW) is more developed with built bathing pools. Both are beautiful — visit Ain Larbi for a wilder, more natural experience.",

  history: "Guelma was founded by the Romans as **Calama**, an important city in the province of Numidia. It was a prosperous city of 15,000–20,000 people with a forum, theatre, temples, and baths. After the Roman era, it passed through Byzantine, Arab, Ottoman, and French rule before independence in 1962.",

  roman: "Ancient Guelma (**Calama**) was founded by Romans in the 1st century BC. Key sites: the **Roman Theatre** (2nd c. AD), **Hammam Debagh** baths (also Roman-era), and the **Archaeological Museum** housing excavated artifacts. Ongoing excavations near the theatre continue to reveal the ancient forum and city streets.",

  festival: "The **Guelma Theatre Festival** is held annually in **July** at the Roman Theatre — one of Algeria's most prestigious cultural events, bringing theater companies from across Algeria and the Arab world. The city also celebrates **May 8th** (1945 commemoration), **Eid al-Fitr**, and **Eid al-Adha** with special events.",

  currency: "Algeria uses the **Algerian Dinar (DZD / DA)**. Exchange rates: roughly 135 DA per US dollar, 150 DA per euro. **Cash is king** in Guelma — most local businesses don't accept cards. ATMs are available at major banks (BNA, BEA, CPA) on the main boulevard. There are no official exchange bureaus — use bank ATMs.",

  language: "The official language is **Arabic** (Modern Standard / Algerian dialect). **French** is widely spoken in commerce, education, and tourism. English is understood by younger people and university students. Useful Algerian phrases: *مرحبا (merhba)* = welcome, *شكرا (shukran)* = thank you, *بصحتك (b'sahtek)* = cheers.",

  forest: "**Medjez Amar Forest** is 20km south of Guelma — a large cork oak and pine forest perfect for hiking and picnics. Free entry, open sunrise to sunset. In spring, wildflowers carpet the hillsides. Bring water and comfortable shoes. The forest is also excellent for birdwatching.",

  mountain: "**Djebel Mahouna** (over 1,400m) is the highest peak near Guelma, 25km to the south. Stunning panoramic views. A paved road reaches a mid-mountain picnic area accessible by regular car. The full summit hike takes 3–4 hours. Best visited in spring or autumn.",

  annaba: "**Annaba** (Bone), the nearest major city, is 80km northeast of Guelma. It's a coastal city with beautiful beaches, the Basilique Saint-Augustin, and the ancient Roman city of **Hippo Regius** (birthplace of Saint Augustine). The drive takes about 1–1.5 hours.",

  constantine: "**Constantine** is Algeria's third-largest city, 110km west of Guelma. It's famous for its dramatic gorge setting and ancient suspension bridges. A worthwhile day trip — the drive takes about 2 hours. Don't miss the old city (vieux Constantine) and the Emir Abdelkader mosque.",

  ramadan: "During **Ramadan**, restaurants and cafés are generally closed from dawn to sunset. After sunset (iftar), the city comes alive with special foods and social gatherings. Some tourist sites may have reduced hours. If visiting during Ramadan, be respectful of those fasting — avoid eating/drinking in public during the day.",

  tips: "Top tips for visiting Guelma: 1) Visit the Roman Theatre first thing in the morning. 2) Try msemen for breakfast at the Souk. 3) Take a local taxi to Hammam Debagh on a weekday morning (quieter). 4) Visit the museum on a Tuesday or Wednesday (closes Fridays). 5) Bring cash — cards are rarely accepted.",

  map: "The interactive map at /map shows all major landmarks with their GPS coordinates. Click any marker to see details, or use the sidebar to filter by category. You can also open Google Maps directions directly from each landmark's detail page.",

  souk: "The **Guelma Central Souk** (old town) is best visited on **Thursday or Friday morning** for the largest weekly market. You'll find spices, local crafts, fresh produce, and street food. Bargaining is expected — start at 60% of the asking price. Watch for the aromatic spice section near the main entrance.",

  coffee: "Supporting GuelmaGuide? You can buy the developer a coffee at **buymeacoffee.com/mdouaour**. It helps cover hosting costs and keeps this guide free for everyone. Thank you!",

  about: "GuelmaGuide was built by **Mouhamed Douaour**, a developer from Guelma who wanted to give his city the digital guide it deserves. The project is completely free to use. Visit the About page to learn more and connect with the developer.",

  hiking: "Best hiking near Guelma: **Djebel Mahouna** (25km south, 1,400m summit, 3-4h hike), **Medjez Amar Forest** (easy forest walks), and the **Seybouse River Valley** (flat riverside walks, great for families). Spring (March–May) is the best season — cooler temperatures and wildflowers.",

  water: "Guelma has three main water attractions: **Hammam Debagh** (12km NW — dramatic hot spring cascades, 150 DA entry), **Ain Larbi** (15km N — free natural thermal springs in forest), and the **Seybouse River** (north of city — calm river for paddling in summer). All are free or very affordable.",
}

const suggestions = [
  "Best time to visit?",
  "How to get to Hammam Debagh?",
  "Local food recommendations?",
  "Tell me about the Roman Theatre",
  "Weather in Guelma?",
  "Emergency numbers?",
  "What to do in 2 days?",
]

function getAIResponse(text: string): string {
  const lower = text.toLowerCase()

  if (lower.includes('coffee') || lower.includes('support') || lower.includes('donate')) return aiResponses.coffee
  if (lower.includes('about') && (lower.includes('site') || lower.includes('guide') || lower.includes('project') || lower.includes('developer') || lower.includes('who'))) return aiResponses.about
  if (lower.includes('time') || lower.includes('when') || lower.includes('season') || lower.includes('best month')) return aiResponses.visit
  if (lower.includes('hammam') || lower.includes('debagh')) return aiResponses.hammam
  if (lower.includes('ain larbi') || lower.includes('spring') || lower.includes('thermal')) return aiResponses.springs
  if (lower.includes('food') || lower.includes('eat') || lower.includes('restaurant') || lower.includes('cuisine') || lower.includes('dish') || lower.includes('chak')) return aiResponses.food
  if (lower.includes('hotel') || lower.includes('stay') || lower.includes('accommodation') || lower.includes('sleep')) return aiResponses.hotel
  if (lower.includes('theatre') || lower.includes('theater')) return aiResponses.theatre
  if (lower.includes('museum')) return aiResponses.museum
  if (lower.includes('transport') || lower.includes('bus') || lower.includes('taxi') || lower.includes('get to') || lower.includes('how to go') || lower.includes('arrive')) return aiResponses.transport
  if (lower.includes('weather') || lower.includes('climate') || lower.includes('temperature') || lower.includes('rain') || lower.includes('hot') || lower.includes('cold')) return aiResponses.weather
  if (lower.includes('emergency') || lower.includes('police') || lower.includes('hospital') || lower.includes('ambulance') || lower.includes('help') || lower.includes('medical')) return aiResponses.emergency
  if (lower.includes('histor') || lower.includes('ancient') || lower.includes('origin')) return aiResponses.history
  if (lower.includes('roman') || lower.includes('calama') || lower.includes('ruin') || lower.includes('archaeolog')) return aiResponses.roman
  if (lower.includes('festival') || lower.includes('event') || lower.includes('celebration') || lower.includes('july')) return aiResponses.festival
  if (lower.includes('currency') || lower.includes('money') || lower.includes('dinar') || lower.includes('exchange') || lower.includes('atm') || lower.includes('cash')) return aiResponses.currency
  if (lower.includes('language') || lower.includes('speak') || lower.includes('arabic') || lower.includes('french') || lower.includes('phrase')) return aiResponses.language
  if (lower.includes('forest') || lower.includes('medjez') || lower.includes('nature') || lower.includes('park') || lower.includes('picnic')) return aiResponses.forest
  if (lower.includes('mountain') || lower.includes('mahouna') || lower.includes('djebel') || lower.includes('peak') || lower.includes('summit')) return aiResponses.mountain
  if (lower.includes('annaba') || lower.includes('bone') || lower.includes('hippo')) return aiResponses.annaba
  if (lower.includes('constantine')) return aiResponses.constantine
  if (lower.includes('ramadan') || lower.includes('ramadhan') || lower.includes('fasting')) return aiResponses.ramadan
  if (lower.includes('tip') || lower.includes('advice') || lower.includes('recommend') || lower.includes('suggest')) return aiResponses.tips
  if (lower.includes('map') || lower.includes('location') || lower.includes('gps') || lower.includes('direction')) return aiResponses.map
  if (lower.includes('souk') || lower.includes('market') || lower.includes('bazaar') || lower.includes('shop')) return aiResponses.souk
  if (lower.includes('hik') || lower.includes('walk') || lower.includes('trek')) return aiResponses.hiking
  if (lower.includes('2 day') || lower.includes('two day') || lower.includes('weekend') || lower.includes('itinerary') || lower.includes('plan')) {
    return "Here's a **2-day Guelma itinerary**: 🗓 Day 1: Start at the Roman Theatre (morning), then the Archaeological Museum, lunch at the Central Souk, afternoon at the Botanical Garden, evening stroll on the main boulevard. 🗓 Day 2: Morning at Hammam Debagh (get there early!), afternoon at Ain Larbi springs or Medjez Amar Forest, sunset from Djebel Mahouna plateau. Use the map at /map to see all locations!"
  }
  if (lower.includes('water') || lower.includes('swim') || lower.includes('bath') || lower.includes('pool')) return aiResponses.water
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('salam') || lower.includes('مرحبا')) {
    return "مرحباً! Welcome to GuelmaGuide! 🌟 I'm your free AI guide to Guelma, Algeria. Ask me anything — landmarks, transport, food, weather, history, or local tips. What would you like to know?"
  }

  return aiResponses.default
}

function ConciergeContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q')

  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "مرحباً! Welcome to GuelmaGuide AI! 🌟 I'm your free local guide to Guelma, Algeria. Ask me anything — landmarks, transport, local food, history, or insider tips!", id: 0 },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const sentInitial = useRef(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-send if coming from a landmark page with ?q=
  useEffect(() => {
    if (initialQuery && !sentInitial.current) {
      sentInitial.current = true
      sendMessage(`Tell me about ${initialQuery}`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { role: 'user', text: text.trim(), id: Date.now() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    await new Promise((r) => setTimeout(r, 700 + Math.random() * 600))

    const aiMsg: Message = { role: 'ai', text: getAIResponse(text), id: Date.now() + 1 }
    setMessages((prev) => [...prev, aiMsg])
    setIsTyping(false)
  }

  return (
    <div className="min-h-screen pt-16 flex" style={{ background: '#0A0A0F' }}>
      {/* Sidebar */}
      <div className="hidden lg:flex w-64 glass border-r border-white/10 flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="font-semibold text-sm">AI Guide</span>
          </div>
          <p className="text-white/30 text-xs mt-1">Free · No account needed</p>
        </div>
        <div className="p-3 flex-1 overflow-y-auto">
          <p className="text-white/30 text-xs px-2 mb-3">Quick topics</p>
          {[
            'Best time to visit',
            'Getting around',
            'Local food',
            'Roman Theatre history',
            'Hammam Debagh',
            'Emergency contacts',
            'Weekend itinerary',
            'Weather & climate',
          ].map((topic) => (
            <button
              key={topic}
              onClick={() => sendMessage(topic)}
              className="w-full text-left px-3 py-2 rounded-lg hover:glass transition-all mb-1"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3 h-3 text-white/30" />
                <span className="text-xs text-white/70">{topic}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3`}
              >
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-xs font-bold text-black shrink-0">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-yellow-500 to-amber-500 text-black rounded-br-sm font-medium'
                      : 'glass-gold text-white/85 rounded-bl-sm'
                  }`}
                >
                  {msg.role === 'ai'
                    ? msg.text.split(/(\*\*[^*]+\*\*)/).map((part, idx) =>
                        part.startsWith('**') && part.endsWith('**')
                          ? <strong key={idx}>{part.slice(2, -2)}</strong>
                          : part.split('\n').map((line, li, arr) => (
                              <span key={li}>
                                {line}
                                {li < arr.length - 1 && <br />}
                              </span>
                            ))
                      )
                    : msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-xs font-bold text-black shrink-0">
                AI
              </div>
              <div className="glass-gold px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                      className="w-1.5 h-1.5 rounded-full bg-yellow-400"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="shrink-0 px-3 py-1.5 glass text-xs text-white/60 hover:text-yellow-400 border border-white/10 hover:border-yellow-400/30 rounded-full transition-all"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 glass">
          <div className="flex gap-3 max-w-3xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask me anything about Guelma..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition-colors"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black rounded-xl hover:from-yellow-400 hover:to-amber-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConciergePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-16 flex items-center justify-center" style={{ background: '#0A0A0F' }}>
        <div className="text-white/40">Loading AI Guide...</div>
      </div>
    }>
      <ConciergeContent />
    </Suspense>
  )
}
