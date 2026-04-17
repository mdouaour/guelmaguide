import { activities } from '@/lib/activities'
import { landmarks, type DiscoveryTag } from '@/lib/landmarks'

const keywordMap: Record<DiscoveryTag, string[]> = {
  relax: ['relax', 'calm', 'quiet', 'chill', 'rest', 'peaceful', 'استرخاء', 'هادئ', 'راحة'],
  nature: ['nature', 'green', 'forest', 'spring', 'outdoor', 'park', 'طبيعة', 'غابة', 'حديقة'],
  food: ['food', 'eat', 'meal', 'taste', 'restaurant', 'market', 'طعام', 'أكل', 'مطعم', 'سوق'],
  romantic: ['romantic', 'couple', 'date', 'sunset', 'رومانسي', 'زوجين', 'غروب'],
  explore: ['explore', 'discover', 'visit', 'trip', 'adventure', 'استكشاف', 'اكتشاف', 'زيارة'],
  sport: ['sport', 'run', 'hike', 'walk', 'fitness', 'active', 'رياضة', 'جري', 'مشي'],
  history: ['history', 'historic', 'roman', 'museum', 'heritage', 'تاريخ', 'روماني', 'تراث'],
  culture: ['culture', 'local', 'festival', 'tradition', 'art', 'ثقافة', 'تقليد', 'فن'],
  social: ['social', 'friends', 'group', 'event', 'community', 'اجتماعي', 'أصدقاء', 'فعالية'],
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
