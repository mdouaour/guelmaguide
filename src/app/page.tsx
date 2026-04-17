import Link from 'next/link'
import { activities } from '@/lib/activities'

const actions = [
  {
    title: 'Discover Places',
    description: 'Browse landmarks by vibe and tags to quickly choose where to go next.',
    href: '/discover',
  },
  {
    title: 'Activities',
    description: 'See what is happening this week and bookmark what you want to try.',
    href: '/activities',
  },
  {
    title: 'AI Guide',
    description: 'Describe what you want and get structured place and activity suggestions.',
    href: '/ai',
  },
]

export default function HomePage() {
  const happeningThisWeek = activities.slice(0, 4)

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="mb-2 text-xs uppercase tracking-wide text-yellow-400">Smart city guide</p>
        <h1 className="text-3xl font-semibold">What do you want to do in Guelma today?</h1>
        <p className="mt-2 text-sm text-white/70">Choose one action and reach useful results in under two clicks.</p>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-yellow-400/50">
            <h2 className="text-lg font-semibold">{action.title}</h2>
            <p className="mt-2 text-sm text-white/70">{action.description}</p>
            <span className="mt-4 inline-block text-sm text-yellow-400">Open →</span>
          </Link>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Happening This Week</h2>
        <p className="mt-1 text-sm text-white/60">Mocked weekly highlights for quick planning.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {happeningThisWeek.map((activity) => (
            <article key={activity.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase text-yellow-400">{activity.type}</p>
              <h3 className="mt-1 font-medium">{activity.title}</h3>
              <p className="mt-1 text-sm text-white/70">{activity.date} · {activity.time}</p>
              <p className="mt-2 text-sm text-white/60">{activity.location}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
