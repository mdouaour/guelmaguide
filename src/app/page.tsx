'use client'

import Link from 'next/link'
import { activities } from '@/lib/activities'
import { useLanguage } from '@/context/LanguageContext'
import { getText } from '@/lib/i18n'

const actions = [
  {
    title: { en: 'Discover Places', ar: 'اكتشف الأماكن' },
    description: {
      en: 'Browse landmarks by vibe and tags to quickly choose where to go next.',
      ar: 'تصفح المعالم حسب الطابع والوسوم لاختيار وجهتك بسرعة.',
    },
    href: '/discover',
  },
  {
    title: { en: 'Activities', ar: 'الأنشطة' },
    description: {
      en: 'See what is happening this week and bookmark what you want to try.',
      ar: 'اطلع على أنشطة هذا الأسبوع واحفظ ما تريد تجربته.',
    },
    href: '/activities',
  },
  {
    title: { en: 'AI Guide', ar: 'الدليل الذكي' },
    description: {
      en: 'Describe what you want and get structured place and activity suggestions.',
      ar: 'صف ما تريده واحصل على اقتراحات منظمة للأماكن والأنشطة.',
    },
    href: '/ai',
  },
]

export default function HomePage() {
  const { lang } = useLanguage()
  const happeningThisWeek = activities.slice(0, 4)

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="mb-2 text-xs uppercase tracking-wide text-yellow-400">{lang === 'ar' ? 'دليل مدينة ذكي' : 'Smart city guide'}</p>
        <h1 className="text-3xl font-semibold">
          {lang === 'ar' ? 'ماذا تريد أن تفعل في قالمة اليوم؟' : 'What do you want to do in Guelma today?'}
        </h1>
        <p className="mt-2 text-sm text-white/70">
          {lang === 'ar'
            ? 'اختر مساراً واحداً واحصل على نتائج مفيدة خلال أقل من نقرتين.'
            : 'Choose one action and reach useful results in under two clicks.'}
        </p>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-yellow-400/50">
            <h2 className="text-lg font-semibold">{getText(action.title, lang)}</h2>
            <p className="mt-2 text-sm text-white/70">{getText(action.description, lang)}</p>
            <span className="mt-4 inline-block text-sm text-yellow-400">{lang === 'ar' ? 'افتح ←' : 'Open →'}</span>
          </Link>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">{lang === 'ar' ? 'فعاليات هذا الأسبوع' : 'Happening This Week'}</h2>
        <p className="mt-1 text-sm text-white/60">
          {lang === 'ar' ? 'مختارات أسبوعية سريعة للتخطيط.' : 'Weekly highlights for quick planning.'}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {happeningThisWeek.map((activity) => (
            <article key={activity.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <img src={activity.image} alt={getText(activity.title, lang)} className="h-36 w-full object-cover" />
              <div className="p-4">
              <p className="text-xs uppercase text-yellow-400">{activity.type}</p>
                <h3 className="mt-1 font-medium">{getText(activity.title, lang)}</h3>
              <p className="mt-1 text-sm text-white/70">{activity.date} · {activity.time}</p>
                <p className="mt-2 text-sm text-white/60">{getText(activity.location, lang)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
