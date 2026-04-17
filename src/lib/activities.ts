import type { Coordinates, DiscoveryTag } from '@/lib/landmarks'

export const activityTypes = ['all', 'wellness', 'culture', 'food', 'outdoor', 'sport'] as const
export type ActivityType = (typeof activityTypes)[number]

export interface Activity {
  id: string
  title: string
  description: string
  location: string
  date: string
  time: string
  type: Exclude<ActivityType, 'all'>
  tags: DiscoveryTag[]
  coordinates: Coordinates
}

export const activities: Activity[] = [
  {
    id: 'act-history-walk',
    title: 'Calama Heritage Walk',
    description: 'A guided old-city loop focused on Roman and colonial landmarks.',
    location: 'Roman Theatre meeting point',
    date: '2026-04-20',
    time: '10:00',
    type: 'culture',
    tags: ['history', 'explore', 'culture'],
    coordinates: { lat: 36.4621, lng: 7.4247 },
  },
  {
    id: 'act-thermal-morning',
    title: 'Thermal Morning Escape',
    description: 'A relaxed half-day to Hammam Debagh and Ain Larbi springs.',
    location: 'Departure from Guelma center',
    date: '2026-04-21',
    time: '08:30',
    type: 'wellness',
    tags: ['relax', 'nature', 'romantic'],
    coordinates: { lat: 36.5041, lng: 7.3234 },
  },
  {
    id: 'act-food-tour',
    title: 'Souk Street Food Tasting',
    description: 'Discover local pastries, spice stalls, and family-run food corners.',
    location: 'Guelma Central Souk',
    date: '2026-04-22',
    time: '17:30',
    type: 'food',
    tags: ['food', 'culture', 'explore'],
    coordinates: { lat: 36.461, lng: 7.423 },
  },
  {
    id: 'act-photo-sunset',
    title: 'Golden Hour Photo Walk',
    description: 'An easy sunset route for couples and mobile photography lovers.',
    location: 'Botanical Garden entrance',
    date: '2026-04-23',
    time: '18:00',
    type: 'outdoor',
    tags: ['romantic', 'relax', 'nature'],
    coordinates: { lat: 36.4615, lng: 7.4285 },
  },
  {
    id: 'act-forest-run',
    title: 'Forest Trail Run',
    description: 'A beginner-friendly group run and breathing session in Medjez Amar.',
    location: 'Medjez Amar Forest gate',
    date: '2026-04-24',
    time: '07:00',
    type: 'sport',
    tags: ['sport', 'nature', 'explore'],
    coordinates: { lat: 36.418, lng: 7.41 },
  },
  {
    id: 'act-valley-trail',
    title: 'Seybouse Valley Soft Hike',
    description: 'A light trail with scenic stops and family-friendly pacing.',
    location: 'Northern valley checkpoint',
    date: '2026-04-26',
    time: '09:00',
    type: 'outdoor',
    tags: ['nature', 'explore', 'sport'],
    coordinates: { lat: 36.52, lng: 7.45 },
  },
]

export function getActivityById(id: string): Activity | undefined {
  return activities.find((activity) => activity.id === id)
}
