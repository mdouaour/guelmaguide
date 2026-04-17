export const discoveryTags = ['nature', 'relax', 'history', 'food', 'romantic', 'explore', 'sport', 'culture'] as const

export type DiscoveryTag = (typeof discoveryTags)[number]

export interface Coordinates {
  lat: number
  lng: number
}

export interface Landmark {
  id: string
  slug: string
  name: string
  location: string
  description: string
  vibe: string
  bestTime: string
  tags: DiscoveryTag[]
  coordinates: Coordinates
  mapsUrl: string
  image: string
  relatedActivitiesIds?: string[]
}

export const landmarks: Landmark[] = [
  {
    id: 'lm-roman-theatre',
    slug: 'roman-theatre',
    name: 'Roman Theatre of Guelma',
    location: 'City Center, Guelma',
    description: 'A remarkably preserved Roman amphitheatre where history, architecture, and local culture meet.',
    vibe: 'Historic and cinematic',
    bestTime: 'Morning or sunset',
    tags: ['history', 'explore', 'culture', 'romantic'],
    coordinates: { lat: 36.4621, lng: 7.4247 },
    mapsUrl: 'https://maps.google.com/?q=36.4621,7.4247',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Theatre_romain_de_Guelma.jpg/1280px-Theatre_romain_de_Guelma.jpg',
    relatedActivitiesIds: ['act-history-walk', 'act-photo-sunset'],
  },
  {
    id: 'lm-hammam-debagh',
    slug: 'hammam-debagh',
    name: 'Hammam Debagh',
    location: '12km Northwest of Guelma',
    description: 'Natural thermal cascades and mineral pools in one of the most iconic places around Guelma.',
    vibe: 'Relaxing and dramatic',
    bestTime: 'Weekday mornings',
    tags: ['relax', 'nature', 'explore', 'romantic'],
    coordinates: { lat: 36.5041, lng: 7.3234 },
    mapsUrl: 'https://maps.google.com/?q=36.5041,7.3234',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Hammam_Debagh_-_Algeria.jpg/1280px-Hammam_Debagh_-_Algeria.jpg',
    relatedActivitiesIds: ['act-thermal-morning', 'act-valley-trail'],
  },
  {
    id: 'lm-ain-larbi',
    slug: 'ain-larbi-springs',
    name: 'Ain Larbi Hot Springs',
    location: '15km North of Guelma',
    description: 'A quieter natural spring area surrounded by greenery and short walking routes.',
    vibe: 'Calm and restorative',
    bestTime: 'Spring afternoons',
    tags: ['relax', 'nature', 'explore'],
    coordinates: { lat: 36.512, lng: 7.385 },
    mapsUrl: 'https://maps.google.com/?q=36.5120,7.3850',
    image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=1280&q=80',
    relatedActivitiesIds: ['act-thermal-morning', 'act-valley-trail'],
  },
  {
    id: 'lm-central-souk',
    slug: 'central-souk',
    name: 'Guelma Central Souk',
    location: 'Old Town, Guelma',
    description: 'A lively local market for spices, regional snacks, and day-to-day city energy.',
    vibe: 'Vibrant and social',
    bestTime: 'Thursday or Friday mornings',
    tags: ['food', 'culture', 'explore'],
    coordinates: { lat: 36.461, lng: 7.423 },
    mapsUrl: 'https://maps.google.com/?q=36.4610,7.4230',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1280&q=80',
    relatedActivitiesIds: ['act-food-tour'],
  },
  {
    id: 'lm-botanical',
    slug: 'guelma-botanical-garden',
    name: 'Guelma Botanical Garden',
    location: 'Avenue Colonel Amirouche, Guelma',
    description: 'A green city escape with shaded paths, flowers, and an easy-going local atmosphere.',
    vibe: 'Soft and family-friendly',
    bestTime: 'Late afternoon',
    tags: ['nature', 'relax', 'romantic'],
    coordinates: { lat: 36.4615, lng: 7.4285 },
    mapsUrl: 'https://maps.google.com/?q=36.4615,7.4285',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1280&q=80',
    relatedActivitiesIds: ['act-photo-sunset'],
  },
  {
    id: 'lm-medjez-amar',
    slug: 'medjez-amar-forest',
    name: 'Medjez Amar Forest',
    location: '20km South of Guelma',
    description: 'Large forest area ideal for light hikes, picnic stops, and weekend nature breaks.',
    vibe: 'Fresh and active',
    bestTime: 'Early morning in spring',
    tags: ['nature', 'sport', 'explore', 'relax'],
    coordinates: { lat: 36.418, lng: 7.41 },
    mapsUrl: 'https://maps.google.com/?q=36.4180,7.4100',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1280&q=80',
    relatedActivitiesIds: ['act-forest-run', 'act-valley-trail'],
  },
]

export function getLandmarkBySlug(slug: string): Landmark | undefined {
  return landmarks.find((landmark) => landmark.slug === slug)
}

export function getAllLandmarkTags(): DiscoveryTag[] {
  return [...discoveryTags]
}
