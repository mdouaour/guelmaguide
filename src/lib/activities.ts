import type { Coordinates, DiscoveryTag } from '@/lib/landmarks'
import type { LocalizedText } from '@/lib/i18n'

export const activityTypes = ['all', 'wellness', 'culture', 'food', 'outdoor', 'sport', 'social'] as const
export type ActivityType = (typeof activityTypes)[number]

export interface Activity {
  id: string
  title: LocalizedText
  description: LocalizedText
  location: LocalizedText
  date: string
  time: string
  type: Exclude<ActivityType, 'all'>
  tags: DiscoveryTag[]
  coordinates: Coordinates
  image: string
  wikipediaTitle: string
  wikimediaSearch: string
}

export const activities: Activity[] = [
  {
    id: 'act-history-walk',
    title: { en: 'Calama Heritage Walk', ar: 'جولة تراث كالاما' },
    description: {
      en: 'A guided city walk that starts at the Roman theatre and highlights the historical layers of ancient Calama and modern Guelma.',
      ar: 'جولة مرافقة تنطلق من المسرح الروماني وتُبرز الطبقات التاريخية لمدينة كالاما القديمة وقالمة الحديثة.',
    },
    location: { en: 'Roman Theatre meeting point', ar: 'نقطة الانطلاق: المسرح الروماني' },
    date: '2026-04-20',
    time: '10:00',
    type: 'culture',
    tags: ['history', 'explore', 'culture'],
    coordinates: { lat: 36.4621, lng: 7.4247 },
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Theatre_romain_de_Guelma.jpg/1280px-Theatre_romain_de_Guelma.jpg',
    wikipediaTitle: 'Guelma',
    wikimediaSearch: 'Théâtre romain de Guelma',
  },
  {
    id: 'act-thermal-morning',
    title: { en: 'Thermal Morning Escape', ar: 'هروب صباحي إلى الينابيع الحارة' },
    description: {
      en: 'A half-day wellness itinerary to Hammam Debagh and nearby spring zones, focused on thermal water and scenic viewpoints.',
      ar: 'برنامج نصف يوم نحو حمام دباغ ومناطق الينابيع القريبة، يركز على المياه الحارة والإطلالات الطبيعية.',
    },
    location: { en: 'Departure from Guelma center', ar: 'الانطلاق من وسط قالمة' },
    date: '2026-04-21',
    time: '08:30',
    type: 'wellness',
    tags: ['relax', 'nature', 'romantic'],
    coordinates: { lat: 36.5041, lng: 7.3234 },
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Hammam_Debagh_-_Algeria.jpg/1280px-Hammam_Debagh_-_Algeria.jpg',
    wikipediaTitle: 'Hammam Debagh',
    wikimediaSearch: 'Hammam Debagh Algeria',
  },
  {
    id: 'act-food-tour',
    title: { en: 'Souk Street Food Tasting', ar: 'تذوق أطعمة الشارع في السوق' },
    description: {
      en: 'An evening tasting route through the central souk with local pastries, grilled snacks, and spice-based specialties.',
      ar: 'مسار تذوق مسائي داخل السوق المركزي يشمل الحلويات المحلية والمأكولات المشوية وتخصصات التوابل.',
    },
    location: { en: 'Guelma Central Souk', ar: 'السوق المركزي بقالمة' },
    date: '2026-04-22',
    time: '17:30',
    type: 'food',
    tags: ['food', 'culture', 'explore', 'social'],
    coordinates: { lat: 36.461, lng: 7.423 },
    image: 'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=1280&q=80&auto=format&fit=crop',
    wikipediaTitle: 'Algerian cuisine',
    wikimediaSearch: 'Algerian food market',
  },
  {
    id: 'act-photo-sunset',
    title: { en: 'Golden Hour Photo Walk', ar: 'جولة تصوير ساعة الغروب' },
    description: {
      en: 'A relaxed sunset walk around the botanical garden focused on city textures, trees, and warm evening light.',
      ar: 'جولة غروب هادئة حول الحديقة النباتية تركز على تفاصيل المدينة والأشجار وضوء المساء الذهبي.',
    },
    location: { en: 'Botanical Garden entrance', ar: 'مدخل الحديقة النباتية' },
    date: '2026-04-23',
    time: '18:00',
    type: 'outdoor',
    tags: ['romantic', 'relax', 'nature'],
    coordinates: { lat: 36.4615, lng: 7.4285 },
    image: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1280&q=80&auto=format&fit=crop',
    wikipediaTitle: 'Photography',
    wikimediaSearch: 'sunset city park',
  },
  {
    id: 'act-forest-run',
    title: { en: 'Forest Trail Run', ar: 'سباق مسار الغابة' },
    description: {
      en: 'A beginner-friendly group run in Medjez Amar forest with short intervals, stretching, and breathing sessions.',
      ar: 'جري جماعي مناسب للمبتدئين في غابة مجاز عمار مع فترات قصيرة وتمارين تمدد وتنفس.',
    },
    location: { en: 'Medjez Amar Forest gate', ar: 'بوابة غابة مجاز عمار' },
    date: '2026-04-24',
    time: '07:00',
    type: 'sport',
    tags: ['sport', 'nature', 'explore'],
    coordinates: { lat: 36.418, lng: 7.41 },
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1280&q=80&auto=format&fit=crop',
    wikipediaTitle: 'Trail running',
    wikimediaSearch: 'trail running forest',
  },
  {
    id: 'act-valley-trail',
    title: { en: 'Seybouse Valley Soft Hike', ar: 'تنزه خفيف في وادي سيبوس' },
    description: {
      en: 'A family-paced hike with scenic valley stops, birdwatching moments, and easy terrain for mixed groups.',
      ar: 'مسار تنزه عائلي بوتيرة هادئة مع محطات مطلة على الوادي ومراقبة الطيور وتضاريس سهلة.',
    },
    location: { en: 'Northern valley checkpoint', ar: 'نقطة انطلاق شمال الوادي' },
    date: '2026-04-26',
    time: '09:00',
    type: 'outdoor',
    tags: ['nature', 'explore', 'sport'],
    coordinates: { lat: 36.52, lng: 7.45 },
    image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1280&q=80&auto=format&fit=crop',
    wikipediaTitle: 'Hiking',
    wikimediaSearch: 'hiking trail mountain',
  },
  {
    id: 'act-roman-night-talk',
    title: { en: 'Roman Heritage Night Talk', ar: 'ندوة ليلية حول التراث الروماني' },
    description: {
      en: 'An open-air cultural talk near the theatre discussing Roman North Africa and the archaeology of Guelma.',
      ar: 'لقاء ثقافي في الهواء الطلق قرب المسرح حول شمال أفريقيا الروماني وآثار قالمة.',
    },
    location: { en: 'Roman Theatre plaza', ar: 'ساحة المسرح الروماني' },
    date: '2026-04-27',
    time: '20:00',
    type: 'culture',
    tags: ['history', 'culture', 'social'],
    coordinates: { lat: 36.4621, lng: 7.4247 },
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1280&q=80&auto=format&fit=crop',
    wikipediaTitle: 'Roman Empire',
    wikimediaSearch: 'Roman theatre night',
  },
  {
    id: 'act-cycling-loop',
    title: { en: 'Guelma Urban Cycling Loop', ar: 'حلقة دراجات حضرية في قالمة' },
    description: {
      en: 'A moderate city cycling route linking major boulevards, parks, and coffee stops with local guides.',
      ar: 'مسار دراجات متوسط داخل المدينة يربط الشوارع الرئيسية والحدائق ومحطات القهوة بمرافقة محلية.',
    },
    location: { en: 'Start at Amirouche Avenue', ar: 'الانطلاق من شارع عميروش' },
    date: '2026-04-28',
    time: '16:30',
    type: 'sport',
    tags: ['sport', 'explore', 'social'],
    coordinates: { lat: 36.4618, lng: 7.4275 },
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1280&q=80&auto=format&fit=crop',
    wikipediaTitle: 'Cycling',
    wikimediaSearch: 'city cycling',
  },
  {
    id: 'act-family-park-day',
    title: { en: 'Family Park Picnic Day', ar: 'يوم نزهة عائلية في الحديقة' },
    description: {
      en: 'A social community picnic with games, music, and kid-friendly corners in the botanical garden area.',
      ar: 'نزهة اجتماعية مجتمعية مع ألعاب وموسيقى وأركان مخصصة للأطفال في محيط الحديقة النباتية.',
    },
    location: { en: 'Guelma Botanical Garden', ar: 'الحديقة النباتية بقالمة' },
    date: '2026-04-29',
    time: '11:00',
    type: 'social',
    tags: ['social', 'nature', 'relax'],
    coordinates: { lat: 36.4615, lng: 7.4285 },
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1280&q=80&auto=format&fit=crop',
    wikipediaTitle: 'Picnic',
    wikimediaSearch: 'family picnic park',
  },
  {
    id: 'act-craft-evening',
    title: { en: 'Craft & Handicraft Evening', ar: 'أمسية الحرف والصناعات التقليدية' },
    description: {
      en: 'A local artisan event featuring pottery, textile crafts, and small handmade product showcases.',
      ar: 'فعالية للحرفيين المحليين تشمل الفخار والنسيج وعرض منتجات يدوية صغيرة.',
    },
    location: { en: 'Old Town cultural hall', ar: 'قاعة ثقافية في المدينة القديمة' },
    date: '2026-04-30',
    time: '19:00',
    type: 'culture',
    tags: ['culture', 'social', 'explore'],
    coordinates: { lat: 36.4606, lng: 7.4225 },
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1280&q=80&auto=format&fit=crop',
    wikipediaTitle: 'Handicraft',
    wikimediaSearch: 'traditional handicraft',
  },
  {
    id: 'act-coffee-social',
    title: { en: 'Old Town Coffee Social', ar: 'جلسة قهوة اجتماعية في المدينة القديمة' },
    description: {
      en: 'A relaxed evening meetup at a traditional café for visitors and locals to exchange tips and stories.',
      ar: 'لقاء مسائي هادئ في مقهى تقليدي يجمع الزوار والسكان لتبادل النصائح والقصص.',
    },
    location: { en: 'Central old town café', ar: 'مقهى مركزي في المدينة القديمة' },
    date: '2026-05-01',
    time: '18:30',
    type: 'social',
    tags: ['social', 'culture', 'food'],
    coordinates: { lat: 36.4609, lng: 7.4232 },
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1280&q=80&auto=format&fit=crop',
    wikipediaTitle: 'Coffeehouse',
    wikimediaSearch: 'traditional coffeehouse',
  },
  {
    id: 'act-weekend-football',
    title: { en: 'Weekend Friendly Football', ar: 'مباراة كرة قدم ودية نهاية الأسبوع' },
    description: {
      en: 'Casual 5v5 football sessions for mixed-skill participants, followed by hydration and recovery guidance.',
      ar: 'مباريات كرة قدم ودية 5 ضد 5 لمستويات مختلفة، مع توجيهات للتعافي بعد النشاط.',
    },
    location: { en: 'Municipal sports field', ar: 'الملعب البلدي' },
    date: '2026-05-02',
    time: '09:30',
    type: 'sport',
    tags: ['sport', 'social'],
    coordinates: { lat: 36.4589, lng: 7.4311 },
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1280&q=80&auto=format&fit=crop',
    wikipediaTitle: 'Association football',
    wikimediaSearch: 'football field',
  },
  {
    id: 'act-yoga-thermal',
    title: { en: 'Thermal Yoga & Breathwork', ar: 'يوغا وتنفس قرب الينابيع' },
    description: {
      en: 'A wellness sunrise session combining light yoga and breathwork near thermal landscapes outside Guelma.',
      ar: 'حصة صباحية للصحة تجمع يوغا خفيفة وتمارين تنفس قرب المناظر الحرارية خارج قالمة.',
    },
    location: { en: 'Hammam Debagh viewpoint', ar: 'مطل حمام دباغ' },
    date: '2026-05-03',
    time: '07:30',
    type: 'wellness',
    tags: ['relax', 'nature', 'social'],
    coordinates: { lat: 36.5031, lng: 7.3255 },
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1280&q=80&auto=format&fit=crop',
    wikipediaTitle: 'Yoga',
    wikimediaSearch: 'yoga nature',
  },
]

export function getActivityById(id: string): Activity | undefined {
  return activities.find((activity) => activity.id === id)
}
