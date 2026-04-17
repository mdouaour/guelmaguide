import { activities } from '@/lib/activities'
import { landmarks, type DiscoveryTag } from '@/lib/landmarks'

const keywordMap: Record<DiscoveryTag, string[]> = {
  relax: ['relax', 'calm', 'quiet', 'chill', 'rest', 'peaceful'],
  nature: ['nature', 'green', 'forest', 'spring', 'outdoor', 'park'],
  food: ['food', 'eat', 'meal', 'taste', 'restaurant', 'market'],
  romantic: ['romantic', 'couple', 'date', 'sunset'],
  explore: ['explore', 'discover', 'visit', 'trip', 'adventure'],
  sport: ['sport', 'run', 'hike', 'walk', 'fitness', 'active'],
  history: ['history', 'historic', 'roman', 'museum', 'heritage'],
  culture: ['culture', 'local', 'festival', 'tradition', 'art'],
}

function extractIntentKeywords(input: string): DiscoveryTag[] {
  const normalized = input.toLowerCase()
  const matched = Object.entries(keywordMap)
    .filter(([, keywords]) => keywords.some((keyword) => normalized.includes(keyword)))
    .map(([tag]) => tag as DiscoveryTag)

  if (matched.length > 0) return matched
  return ['explore']
}

function scoreByTags(itemTags: DiscoveryTag[], intentTags: DiscoveryTag[]) {
  return intentTags.reduce((score, tag) => score + (itemTags.includes(tag) ? 2 : 0), 0)
}

export function getSmartRecommendations(input: string) {
  const intentTags = extractIntentKeywords(input)

  const topPlaces = [...landmarks]
    .map((landmark) => ({ landmark, score: scoreByTags(landmark.tags, intentTags) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.landmark)

  const topActivities = [...activities]
    .map((activity) => ({ activity, score: scoreByTags(activity.tags, intentTags) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((entry) => entry.activity)

  return {
    intentTags,
    places: topPlaces,
    activities: topActivities,
  }
}
