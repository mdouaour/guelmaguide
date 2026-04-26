-- Seed places data for Guelma
INSERT INTO public.places (name, description, latitude, longitude, category, theme, images) VALUES
(
  'Hammam Debagh',
  'Ancient Roman thermal baths with natural hot springs, a UNESCO heritage candidate featuring stunning rock formations and healing mineral waters.',
  36.4661,
  7.2286,
  'landmark',
  'historical',
  ARRAY['https://images.unsplash.com/photo-1569596082827-c4d95e35f385?w=800']
),
(
  'Theatre of Guelma',
  'One of the best-preserved Roman theaters in North Africa, dating back to the 2nd century AD with a capacity of 5,000 spectators.',
  36.4608,
  7.4258,
  'landmark',
  'historical',
  ARRAY['https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800']
),
(
  'Houara Mountain',
  'Scenic mountain offering panoramic views of Guelma valley, popular for hiking and nature photography.',
  36.4700,
  7.4100,
  'nature',
  'adventure',
  ARRAY['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800']
),
(
  'Seybouse River Walk',
  'Beautiful riverside promenade perfect for morning walks and family picnics along the historic Seybouse river.',
  36.4580,
  7.4300,
  'nature',
  'relaxation',
  ARRAY['https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800']
),
(
  'Guelma Archaeological Museum',
  'Museum showcasing Roman artifacts, mosaics, and sculptures discovered in the ancient city of Calama.',
  36.4625,
  7.4280,
  'museum',
  'cultural',
  ARRAY['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800']
),
(
  'Cascade de Hammam Meskhoutine',
  'Spectacular 20-meter travertine waterfall with unique orange-colored mineral deposits, near the hot springs.',
  36.4650,
  7.2300,
  'nature',
  'adventure',
  ARRAY['https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800']
),
(
  'Place du 1er Novembre',
  'Central square with beautiful gardens, fountains, and cafes - the heart of modern Guelma city life.',
  36.4620,
  7.4265,
  'landmark',
  'cultural',
  ARRAY['https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=800']
),
(
  'Djebel Mahouna',
  'Highest peak in the region offering challenging hikes and breathtaking views of northeastern Algeria.',
  36.4850,
  7.3900,
  'nature',
  'adventure',
  ARRAY['https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800']
)
ON CONFLICT DO NOTHING;
