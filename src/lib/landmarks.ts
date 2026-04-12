export interface Landmark {
  slug: string
  name: string
  nameAr: string
  nameFr: string
  category: 'Historical' | 'Nature' | 'Culture' | 'Food' | 'Hidden Gem'
  location: string
  lat: number
  lng: number
  rating: number
  hours: string
  fee: string
  desc: string
  longDesc: string
  tips: string[]
  photo: string
  gradient: string
  color: string
  mapsUrl: string
  nearby: string[]
}

export const landmarks: Landmark[] = [
  {
    slug: 'roman-theatre',
    name: 'Roman Theatre of Guelma',
    nameAr: 'المسرح الروماني لقالمة',
    nameFr: 'Théâtre Romain de Guelma',
    category: 'Historical',
    location: 'City Center, Guelma',
    lat: 36.4621,
    lng: 7.4247,
    rating: 4.9,
    hours: '8:00 AM – 6:00 PM',
    fee: '200 DA',
    desc: 'A remarkably preserved 2nd-century Roman amphitheatre, one of the best in North Africa. Still hosts cultural events today.',
    longDesc: `The Roman Theatre of Guelma stands as one of Algeria's most extraordinary ancient monuments. Built in the 2nd century AD during the reign of the Roman Emperor Trajan, when the city was known as Calama, this magnificent structure could seat up to 4,000 spectators.

The theatre was carved directly into the hillside using the natural slope of the terrain — a common Roman engineering technique. Its semi-circular orchestra pit, tiered seating (cavea), and stage building (scaena) are remarkably well preserved, giving visitors a vivid sense of what Roman public entertainment was like nearly 2,000 years ago.

The site was rediscovered in the early 20th century by French archaeologists and has since been carefully excavated and partially restored. Today, it remains culturally alive: every summer, the theatre hosts the prestigious Guelma Theatre Festival, which attracts theater companies from across Algeria and the Arab world.

Surrounding the theatre, ongoing excavations continue to reveal Roman-era streets, columns, and fragments of the ancient forum of Calama. The site is managed by the Algerian Ministry of Culture.`,
    tips: [
      'Visit early morning to avoid the heat and get the best light for photos',
      'The annual Guelma Theatre Festival (July) transforms the site into a living stage',
      'Wear comfortable shoes — the stone steps can be uneven',
      'A local guide can be hired at the entrance for 500 DA for a 45-minute tour',
      'Combine with the nearby Archaeological Museum, which houses artefacts found here',
    ],
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Theatre_romain_de_Guelma.jpg/1280px-Theatre_romain_de_Guelma.jpg',
    gradient: 'from-purple-900 to-indigo-950',
    color: 'bg-purple-500/20 text-purple-400',
    mapsUrl: 'https://maps.google.com/?q=36.4621,7.4247',
    nearby: ['hammam-debagh', 'guelma-museum', 'guelma-cathedral'],
  },
  {
    slug: 'hammam-debagh',
    name: 'Hammam Debagh',
    nameAr: 'حمام دباغ',
    nameFr: 'Hammam Debagh',
    category: 'Historical',
    location: 'Hammam Debagh, 12km NW of Guelma',
    lat: 36.5041,
    lng: 7.3234,
    rating: 4.8,
    hours: '6:00 AM – 8:00 PM',
    fee: '150 DA',
    desc: 'Ancient Roman thermal baths over 2,000 years old. Steaming natural pools cascade over dramatic limestone formations.',
    longDesc: `Hammam Debagh is one of Algeria's most dramatic natural wonders and one of its oldest continuously used thermal sites. The hot springs here have been flowing since Roman times, when Calama's citizens would travel to bathe in their mineral-rich waters.

The spectacle is breathtaking: natural hot water (reaching 98°C at the source) cascades down a hillside, forming pools of white and ochre limestone travertine formations strikingly similar to Turkey's Pamukkale. The water cools to bathing temperature (37–45°C) in the lower pools, which are divided into sections for men and women.

Legend holds that the Roman general who built Guelma's theatre discovered these springs and ordered thermal baths constructed here. Coins and Roman-era tiles found nearby support regular use of the site during antiquity. The Ottomans later expanded the bathing facilities in the 16th century.

Today the site draws thousands of Algerian visitors annually, particularly on weekends and during summer. The surrounding valley is green and forested, making it a beautiful natural setting.`,
    tips: [
      'The upper cascade area is stunning but too hot to bathe in — admire it from a safe distance',
      'Weekday mornings are the quietest time to visit',
      'Bring your own towel and flip-flops; facilities are basic',
      'The drive through the Seybouse valley is scenic — stop at viewpoints',
      'Local vendors sell snacks and mint tea near the entrance',
    ],
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Hammam_Debagh_-_Algeria.jpg/1280px-Hammam_Debagh_-_Algeria.jpg',
    gradient: 'from-amber-900 to-orange-950',
    color: 'bg-amber-500/20 text-amber-400',
    mapsUrl: 'https://maps.google.com/?q=36.5041,7.3234',
    nearby: ['roman-theatre', 'ain-larbi-springs', 'heliopolois-memorial'],
  },
  {
    slug: 'ain-larbi-springs',
    name: 'Ain Larbi Hot Springs',
    nameAr: 'عين العربي',
    nameFr: 'Sources d\'Aïn Larbi',
    category: 'Nature',
    location: 'Ain Larbi, 15km N of Guelma',
    lat: 36.5120,
    lng: 7.3850,
    rating: 4.7,
    hours: 'Open 24 hours',
    fee: 'Free',
    desc: 'Natural thermal springs surrounded by lush greenery, rich in minerals and historically believed to have healing properties.',
    longDesc: `The Ain Larbi hot springs sit in a lush valley north of Guelma, where warm mineral water bubbles up from the earth surrounded by dense vegetation. The setting is tranquil and beautiful, especially in spring when wildflowers cover the hillsides.

The springs produce water at around 40–50°C, rich in calcium, magnesium, and sulfur. Local tradition holds that bathing in or drinking the water alleviates skin conditions, joint pain, and digestive issues — beliefs that have brought visitors here for centuries.

Unlike the more developed Hammam Debagh, Ain Larbi retains a wilder, more natural character. Simple bathing pools have been built to collect the thermal water, but the setting remains largely untouched. Surrounding the springs, the valley is ideal for short hikes through cork oak woodland.

The site is also important for birdwatching: the mixed woodland and stream habitat attracts numerous bird species, including the rare Algerian nuthatch found only in northeastern Algeria.`,
    tips: [
      'Free access — one of the few truly free natural attractions in the region',
      'Spring (March–May) is the most beautiful time to visit with wildflowers in bloom',
      'Bring a picnic — there are grassy spots ideal for outdoor meals',
      'The surrounding forest has easy walking paths suitable for all ages',
      'Water shoes are useful for the rocky pool areas',
    ],
    photo: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=1280&q=80',
    gradient: 'from-emerald-900 to-teal-950',
    color: 'bg-emerald-500/20 text-emerald-400',
    mapsUrl: 'https://maps.google.com/?q=36.5120,7.3850',
    nearby: ['hammam-debagh', 'medjez-amar-forest'],
  },
  {
    slug: 'guelma-museum',
    name: 'Guelma Archaeological Museum',
    nameAr: 'متحف قالمة الأثري',
    nameFr: 'Musée Archéologique de Guelma',
    category: 'Culture',
    location: 'Place de la République, Guelma',
    lat: 36.4640,
    lng: 7.4260,
    rating: 4.5,
    hours: '9:00 AM – 5:00 PM (closed Fri)',
    fee: '100 DA',
    desc: 'Houses remarkable Roman artifacts, mosaics, and statues excavated from the ancient city of Calama.',
    longDesc: `The Guelma Archaeological Museum is one of northeastern Algeria's most important cultural institutions, holding a collection that spans millennia of human settlement in the region.

The museum's centerpiece is its Roman collection: beautifully preserved mosaics depicting mythological scenes, marble statues of gods and emperors, bronze everyday objects, inscribed stones, and coins from the Roman province of Numidia. Many of these were excavated directly from the site of ancient Calama — the Roman city whose remains lie beneath modern Guelma.

Pre-Roman artifacts reveal even older habitation: Numidian pottery, Phoenician trade goods, and Berber jewelry trace the region's history back thousands of years before Roman conquest. A dedicated room covers the Byzantine and early Islamic periods, showing the extraordinary continuity of settlement in this fertile valley.

The museum building itself is architecturally interesting — a colonial-era structure that was originally a French municipal hall, now sympathetically converted to house the ancient collections.`,
    tips: [
      'Closed on Fridays — plan your visit for another day',
      'Ask the staff to point out the famous "Venus mosaic" — the museum\'s most photographed piece',
      'Photography is permitted inside (no flash)',
      'Combine with the Roman Theatre, just a 5-minute walk away',
      'The museum shop sells postcards and small reproductions of key artifacts',
    ],
    photo: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1280&q=80',
    gradient: 'from-blue-900 to-cyan-950',
    color: 'bg-blue-500/20 text-blue-400',
    mapsUrl: 'https://maps.google.com/?q=36.4640,7.4260',
    nearby: ['roman-theatre', 'guelma-cathedral', 'central-souk'],
  },
  {
    slug: 'medjez-amar-forest',
    name: 'Medjez Amar Forest',
    nameAr: 'غابة مجاز عمار',
    nameFr: 'Forêt de Medjez Amar',
    category: 'Nature',
    location: 'Medjez Amar, 20km S of Guelma',
    lat: 36.4180,
    lng: 7.4100,
    rating: 4.6,
    hours: 'Sunrise – Sunset',
    fee: 'Free',
    desc: 'Lush cork oak and pine forest ideal for hiking, picnics, and birdwatching. Cool and tranquil year-round.',
    longDesc: `Medjez Amar Forest covers thousands of hectares of rolling terrain south of Guelma, forming one of the largest green spaces in the Guelma region. Cork oak, Aleppo pine, and holm oak dominate the canopy, creating a cool retreat from summer heat that Guelma residents have treasured for generations.

The forest is part of a broader network of Algerian Mediterranean woodlands that sustain exceptional biodiversity. Cork oak harvesting has been practiced here for centuries, and you may still see the distinctive reddish lower trunks of recently harvested trees. The cork from this region traditionally supplied furniture and bottle stopper industries across North Africa.

Several well-worn paths wind through the forest, leading to clearing viewpoints where you can look out over the valley toward Guelma city. In spring, the understory bursts with wildflowers — asphodels, cistus, and wild orchids are common. Autumn brings mushroom foragers and the yellow glow of turning oak leaves.

Wildlife includes wild boar, foxes, and numerous bird species. The Algerian nuthatch, endemic to northeastern Algeria, can sometimes be spotted in the mature cork oak areas.`,
    tips: [
      'Early morning visits in spring offer the best birdwatching and wildflower displays',
      'Bring plenty of water — there are no facilities inside the forest',
      'The main picnic area near the forest entrance has shaded tables',
      'Autumn is mushroom season — locals gather here after rain, but only collect what you can identify',
      'The forest road can be muddy after rain — a vehicle with some clearance is helpful',
    ],
    photo: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1280&q=80',
    gradient: 'from-green-900 to-lime-950',
    color: 'bg-green-500/20 text-green-400',
    mapsUrl: 'https://maps.google.com/?q=36.4180,7.4100',
    nearby: ['ain-larbi-springs', 'bou-hamdane-village'],
  },
  {
    slug: 'central-souk',
    name: 'Guelma Central Souk',
    nameAr: 'سوق قالمة المركزي',
    nameFr: 'Souk Central de Guelma',
    category: 'Food',
    location: 'Old Town, Guelma',
    lat: 36.4610,
    lng: 7.4230,
    rating: 4.4,
    hours: '7:00 AM – 9:00 PM',
    fee: 'Free entry',
    desc: 'A vibrant traditional market selling spices, local crafts, fresh produce, and Algerian street food.',
    longDesc: `Guelma's Central Souk is the beating heart of the old city — a labyrinthine market where traders have set up stalls for centuries, selling everything from pyramids of spices and aromatic herbs to handwoven Berber rugs, copper ware, and fresh seasonal produce from surrounding farms.

The spice section is a sensory highlight: vivid mounds of cumin, coriander, dried rose petals, fenugreek, and the distinctive Algerian spice blend ras el hanout. Herbalists offer both culinary and traditional medicinal plants that have been sold here since Ottoman times.

The food court section of the souk comes alive in the afternoon: vendors fire up grills for merguez sausages, serve bowls of lablabi chickpea soup, and stack fresh msemen (layered flatbread) glistening with oil and honey. This is the place to try authentic Guelma street food alongside local families.

The craft section features pottery from nearby workshops, embroidered textiles in regional patterns, handmade leather slippers (balgha), and silver jewelry. Bargaining is expected and part of the experience.`,
    tips: [
      'Visit on Thursday or Friday morning for the largest weekly market',
      'Try msemen with honey from the bakery stalls near the main entrance — a local breakfast staple',
      'Bargaining is normal — start at 60% of the asking price',
      'The spice souk section is best photographed in morning light streaming through the covered alleys',
      'Keep an eye on your belongings in the crowded sections',
    ],
    photo: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1280&q=80',
    gradient: 'from-rose-900 to-red-950',
    color: 'bg-rose-500/20 text-rose-400',
    mapsUrl: 'https://maps.google.com/?q=36.4610,7.4230',
    nearby: ['guelma-museum', 'guelma-cathedral', 'roman-theatre'],
  },
  {
    slug: 'bou-hamdane-village',
    name: 'Bou Hamdane Village',
    nameAr: 'قرية بوحمدان',
    nameFr: 'Village de Bou Hamdane',
    category: 'Historical',
    location: 'Bou Hamdane, 30km E of Guelma',
    lat: 36.4530,
    lng: 7.5100,
    rating: 4.3,
    hours: 'Open all day',
    fee: 'Free',
    desc: 'Traditional Algerian village preserving centuries of Berber and Ottoman architectural heritage amid mountain scenery.',
    longDesc: `Nestled in the foothills east of Guelma, Bou Hamdane is a living museum of traditional northeastern Algerian village life. Stone houses with wooden-beamed rooflines climb the hillsides in organic clusters that follow centuries-old patterns, their ochre walls blending into the rocky terrain.

The village layout reflects Ottoman-era urban planning: a central square (houma) surrounded by the mosque, a hammam, and communal wells, with residential quarters radiating outward through narrow cobbled lanes. Original carved wooden doors, decorated with geometric Berber motifs, still mark the entrances to many homes.

Bou Hamdane's weekly market (souq) on Sundays draws farmers and artisans from surrounding villages, offering a window into the agricultural rhythms of the Guelma hinterland. Local specialties sold here include dried figs, olive oil pressed from ancient trees, and home-spun wool.

The landscape around the village offers beautiful walks: terraced fields descend toward the valley, dotted with centuries-old olive and fig trees. In spring, the entire area is carpeted in wildflowers.`,
    tips: [
      'Visit on a Sunday to catch the weekly market',
      'Ask permission before photographing residents',
      'The café on the main square serves excellent Turkish coffee and homemade pastries',
      'The drive from Guelma is scenic — take the road via Nechmaya for mountain views',
      'Combine with Medjez Amar Forest on the return journey',
    ],
    photo: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1280&q=80',
    gradient: 'from-yellow-900 to-amber-950',
    color: 'bg-yellow-500/20 text-yellow-400',
    mapsUrl: 'https://maps.google.com/?q=36.4530,7.5100',
    nearby: ['medjez-amar-forest', 'ain-larbi-springs'],
  },
  {
    slug: 'heliopolis-memorial',
    name: 'Héliopolis Memorial',
    nameAr: 'نصب هليوبوليس التذكاري',
    nameFr: 'Mémorial d\'Héliopolis',
    category: 'Historical',
    location: 'Héliopolis, 8km W of Guelma',
    lat: 36.4750,
    lng: 7.3800,
    rating: 4.6,
    hours: '8:00 AM – 5:00 PM',
    fee: '50 DA',
    desc: 'A powerful memorial commemorating the May 8, 1945 massacres — a pivotal turning point in Algerian independence history.',
    longDesc: `The Héliopolis Memorial stands as one of Algeria's most historically significant commemorative sites. It marks the events of May 8, 1945 — the same day World War II ended in Europe — when Algerian independence demonstrations in Sétif, Guelma, and Kherrata were violently suppressed by French colonial forces.

In Guelma, hundreds of Algerians were killed over the following weeks in what historians now recognize as a pivotal moment in Algeria's path to independence. The memorial was built to honor the victims and ensure that this chapter of history is never forgotten. Its architecture is stark and powerful: dark stone walls inscribed with names, leading to a central monument that casts a long shadow at dawn and dusk.

The adjacent museum (recently renovated) holds photographs, documents, and personal testimonies from survivors and witnesses. It provides essential context for understanding the 1954–1962 War of Independence and Algeria's national identity today.

For Algerians, May 8th is a national commemoration day, and the memorial draws visitors from across the country — particularly schools and families with connections to the events.`,
    tips: [
      'May 8th (Victory Day / Commemoration Day in Algeria) sees large gatherings here',
      'The museum section includes French and Arabic text — English summaries are available on request',
      'A respectful, contemplative visit — this is a sacred site for many Algerian families',
      'Photography of the monument is permitted; photograph people with permission',
      'Combine with a visit to the Guelma city center, 8km east',
    ],
    photo: 'https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=1280&q=80',
    gradient: 'from-slate-800 to-gray-950',
    color: 'bg-slate-500/20 text-slate-400',
    mapsUrl: 'https://maps.google.com/?q=36.4750,7.3800',
    nearby: ['roman-theatre', 'guelma-museum'],
  },
  {
    slug: 'guelma-cathedral',
    name: 'Guelma Cathedral',
    nameAr: 'كنيسة قالمة',
    nameFr: 'Cathédrale de Guelma',
    category: 'Historical',
    location: 'Rue Didouche Mourad, Guelma',
    lat: 36.4625,
    lng: 7.4255,
    rating: 4.2,
    hours: '9:00 AM – 6:00 PM',
    fee: 'Free',
    desc: 'A beautiful French colonial-era cathedral, now a cultural center, showcasing stunning neo-Byzantine architecture.',
    longDesc: `The Guelma Cathedral is one of the most architecturally striking buildings in northeastern Algeria. Built by French colonial authorities in the late 19th century in a neo-Byzantine style, its white stone facade, arched windows, and distinctive bell tower dominate the surrounding streetscape.

Since Algerian independence, the building has been repurposed as a cultural center — hosting exhibitions, theater performances, music concerts, and community events. This transformation is a fascinating example of architectural heritage being given new life and meaning within the independent Algerian state.

The interior retains much of its original structure: soaring vaulted ceilings, decorative stone columns, and colorful geometric tilework. Exhibitions mounted on the original altar steps have included contemporary Algerian art, photography of the region, and displays about Guelma's history.

The building's location in the center of Guelma makes it an easy addition to any city walking tour. Nearby you'll find several colonial-era administrative buildings, the archaeological museum, and the markets of the old town.`,
    tips: [
      'Check local listings for current exhibitions — the cultural program changes monthly',
      'The exterior is best photographed in morning light when the white stone glows',
      'The building is free to enter when exhibitions are on',
      'Look for the original mosaic floor near the entrance — it has survived intact',
      'A 10-minute walk from the Roman Theatre — combine both in one city-center stroll',
    ],
    photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1280&q=80',
    gradient: 'from-sky-900 to-blue-950',
    color: 'bg-sky-500/20 text-sky-400',
    mapsUrl: 'https://maps.google.com/?q=36.4625,7.4255',
    nearby: ['roman-theatre', 'guelma-museum', 'central-souk'],
  },
  {
    slug: 'seybouse-river',
    name: 'Seybouse River Valley',
    nameAr: 'وادي سيبوس',
    nameFr: 'Vallée de la Seybouse',
    category: 'Nature',
    location: 'Northern Guelma region',
    lat: 36.5200,
    lng: 7.4500,
    rating: 4.5,
    hours: 'Open all day',
    fee: 'Free',
    desc: 'A wide fertile river valley stretching from Guelma to Annaba, lined with poplar trees and rich farmland.',
    longDesc: `The Seybouse River is the lifeblood of the Guelma region, flowing northwest from the mountains of the Medjerda range through the fertile plain toward Annaba and the Mediterranean Sea. The valley it has carved over millennia is one of the most productive agricultural regions in Algeria.

Poplar-lined banks, willow groves, and riverside reed beds characterize the river in the Guelma section. Farmers grow wheat, sunflowers, citrus, and vegetables on the rich alluvial soil. In spring, the valley is brilliantly green and alive with birds migrating along the river corridor.

The river was called "Ubaba" by the Berbers and "Ubus" by the Romans — ancient Calama depended on its waters for agriculture and industry. Roman engineers built irrigation channels from the river whose routes can still be traced in aerial photographs.

Today the riverside is a popular spot for families and fishermen. The best access points are north of the city, where the river broadens and shallow pools form excellent spots for cool paddling in summer.`,
    tips: [
      'The riverside north of Guelma has grassy picnic areas shaded by poplars',
      'Early morning is best for birdwatching — herons, kingfishers, and egrets are common',
      'The river is shallow and calm in summer — children love wading in the cool water',
      'Spring flooding can make some riverside paths inaccessible — check conditions locally',
      'The road following the river toward Annaba passes through beautiful agricultural landscapes',
    ],
    photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&q=80',
    gradient: 'from-teal-900 to-cyan-950',
    color: 'bg-teal-500/20 text-teal-400',
    mapsUrl: 'https://maps.google.com/?q=36.5200,7.4500',
    nearby: ['ain-larbi-springs', 'hammam-debagh'],
  },
  {
    slug: 'djebel-mahouna',
    name: 'Djebel Mahouna',
    nameAr: 'جبل ماهونة',
    nameFr: 'Djebel Mahouna',
    category: 'Nature',
    location: 'South of Guelma, 25km',
    lat: 36.3800,
    lng: 7.3600,
    rating: 4.7,
    hours: 'Sunrise – Sunset',
    fee: 'Free',
    desc: 'The highest peak overlooking Guelma, offering panoramic views across the region and rewarding hikes through cork oak forest.',
    longDesc: `Djebel Mahouna rises to over 1,400 meters above sea level, dominating the southern skyline of the Guelma region. On clear days, the summit offers views that stretch from the Medjerda mountains in Tunisia to the distant glimmer of the Mediterranean at Annaba.

The mountain is covered in dense cork oak forest at middle elevations, transitioning to rocky scrubland near the summit. The forests are home to wild boar, Barbary macaque monkeys, golden jackals, and numerous bird species. The mountain and its forested slopes are classified as a protected natural area.

Several routes ascend the mountain: a paved road reaches a mid-mountain plateau used for picnics and family outings, while rougher tracks and footpaths continue to the summit ridge. The most popular hiking route from the base takes approximately 3–4 hours round trip.

Spring is the most beautiful season: the hillsides are carpeted in wildflowers including asphodels, rock roses, and wild iris. Mist often clings to the upper forests in early morning, creating a magical atmosphere.`,
    tips: [
      'Start early to reach the summit before midday heat in summer',
      'The paved road to the mid-mountain picnic area is accessible to regular cars',
      'Bring extra layers — the summit is significantly cooler and can be windy',
      'Barbary macaques may approach picnickers near the plateau — don\'t feed them',
      'Best visibility for panoramic views is in October–November after summer haze clears',
    ],
    photo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1280&q=80',
    gradient: 'from-stone-800 to-stone-950',
    color: 'bg-stone-500/20 text-stone-400',
    mapsUrl: 'https://maps.google.com/?q=36.3800,7.3600',
    nearby: ['medjez-amar-forest', 'bou-hamdane-village'],
  },
  {
    slug: 'ain-makhlouf-spring',
    name: 'Ain Makhlouf Spring',
    nameAr: 'عين مخلوف',
    nameFr: 'Source d\'Aïn Makhlouf',
    category: 'Hidden Gem',
    location: 'Ain Makhlouf, 35km SW of Guelma',
    lat: 36.3400,
    lng: 7.2300,
    rating: 4.6,
    hours: 'Open all day',
    fee: 'Free',
    desc: 'A hidden natural spring feeding a lush oasis valley known only to locals — crystal-clear water surrounded by wild fig and pomegranate trees.',
    longDesc: `Ain Makhlouf (Spring of Makhlouf) is one of the region's best-kept secrets — a natural freshwater spring that emerges from fractured limestone in a side valley southwest of Guelma, feeding a small but remarkably lush micro-oasis.

The spring has been flowing since ancient times: Roman-era stonework can be found near the water source, suggesting it was captured and managed as part of Calama's water supply system. The channel carved to direct the water is still visible, now overgrown with moss and maiden-hair fern.

The water is crystal clear and cold (around 14°C year-round), pooling in a series of natural basins before flowing down into the valley below. The banks are shaded by enormous wild fig trees, pomegranate bushes, and oleander. In early summer, the air is heavy with the scent of flowering herbs.

This is a spot beloved by local families for summer afternoon picnics and a cooling dip. Arriving here feels like discovering a secret garden — which in a sense, it is.`,
    tips: [
      'Only accessible by a rough track — a 4x4 vehicle is recommended, or park and walk 1km',
      'Best visited May–September when the surrounding vegetation is at its most lush',
      'The water is potable — locals fill bottles here',
      'Absolutely no rubbish should be left — this pristine site is fragile',
      'Ask locals in Ain Makhlouf village for exact directions — the track is not marked',
    ],
    photo: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1280&q=80',
    gradient: 'from-lime-900 to-green-950',
    color: 'bg-lime-500/20 text-lime-400',
    mapsUrl: 'https://maps.google.com/?q=36.3400,7.2300',
    nearby: ['djebel-mahouna', 'medjez-amar-forest'],
  },
  {
    slug: 'guelma-university',
    name: 'University of Guelma (8 Mai 1945)',
    nameAr: 'جامعة 8 ماي 1945 قالمة',
    nameFr: 'Université 8 Mai 1945 Guelma',
    category: 'Culture',
    location: 'BP 401, Guelma',
    lat: 36.4520,
    lng: 7.4400,
    rating: 4.3,
    hours: 'Campus open daily',
    fee: 'Free',
    desc: 'Named after the 1945 massacres, Guelma\'s university campus features beautiful gardens and is the intellectual heart of the city.',
    longDesc: `The University of Guelma, officially named "Université 8 Mai 1945 Guelma" in honor of the 1945 independence movement, is the city's most important modern institution. Founded in 1986, it has grown into a major regional university with faculties covering engineering, science, literature, social sciences, and technology.

The campus is a pleasant green space in the eastern part of the city, with well-maintained gardens, fountains, and walking paths that are open to the public. The main administrative building is an attractive piece of modern Algerian architecture, its facade decorated with traditional geometric motifs.

The university library holds significant collections related to northeastern Algerian history, culture, and literature. The campus also hosts cultural events, exhibitions, and the famous annual student theater festival that attracts groups from across Algeria.

For visitors, the campus is a window into modern Algerian student life and a pleasant place to walk, rest, and perhaps chat with the friendly, multilingual student population.`,
    tips: [
      'The campus gardens are open to the public and make a pleasant afternoon walk',
      'Student-run cafés near the campus serve excellent inexpensive coffee and sandwiches',
      'The annual student cultural festival (spring) features theater, music, and art exhibitions',
      'The library\'s regional history section has excellent resources on ancient Calama',
      'Many students speak English and are happy to talk about city life',
    ],
    photo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1280&q=80',
    gradient: 'from-violet-900 to-purple-950',
    color: 'bg-violet-500/20 text-violet-400',
    mapsUrl: 'https://maps.google.com/?q=36.4520,7.4400',
    nearby: ['roman-theatre', 'heliopolis-memorial'],
  },
  {
    slug: 'guelma-botanical-garden',
    name: 'Guelma Botanical Garden',
    nameAr: 'الحديقة النباتية لقالمة',
    nameFr: 'Jardin Botanique de Guelma',
    category: 'Nature',
    location: 'Avenue Colonel Amirouche, Guelma',
    lat: 36.4615,
    lng: 7.4285,
    rating: 4.1,
    hours: '8:00 AM – 7:00 PM',
    fee: '50 DA',
    desc: 'A green oasis in the heart of the city featuring Mediterranean and North African plant species, beloved by families.',
    longDesc: `The Guelma Botanical Garden is the city's beloved green lung — a peaceful park in the heart of the urban area, filled with labeled specimens of Mediterranean and Algerian native plants. It was established during the colonial period and has been continuously maintained and expanded since independence.

The garden's collection includes over 300 plant species, from the towering Atlas cedar and maritime pine to low-growing aromatic herbs: lavender, rosemary, thyme, and wild mint. A special section is dedicated to medicinal plants traditionally used in Algerian folk medicine, with information panels explaining their uses.

A rose garden (best in May and June) draws visitors from across the region when hundreds of heritage rose varieties bloom simultaneously. The garden also has a small greenhouse with subtropical species, a children's play area, and shaded benches along the main path.

The botanical garden is a social hub as much as a horticultural one: on weekday mornings, elderly men play dominoes under the eucalyptus trees; on weekends, families spread picnic blankets on the grass. It's the most relaxed and local-feeling of Guelma's attractions.`,
    tips: [
      'Visit in May–June for the spectacular rose garden in full bloom',
      'The garden is popular for family picnics on Friday and Saturday afternoons',
      'The information panels are in Arabic and French — a good opportunity to practice French',
      'A small kiosk near the entrance sells ice cream and soft drinks',
      'The garden hosts a small weekly plant market near the main gate on Sundays',
    ],
    photo: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1280&q=80',
    gradient: 'from-green-900 to-emerald-950',
    color: 'bg-green-500/20 text-green-400',
    mapsUrl: 'https://maps.google.com/?q=36.4615,7.4285',
    nearby: ['roman-theatre', 'guelma-museum', 'central-souk'],
  },
]

export const categories = ['All', 'Historical', 'Nature', 'Culture', 'Food', 'Hidden Gem'] as const
export type Category = typeof categories[number]

export function getLandmarkBySlug(slug: string): Landmark | undefined {
  return landmarks.find((l) => l.slug === slug)
}

export function getLandmarksByCategory(category: Category): Landmark[] {
  if (category === 'All') return landmarks
  return landmarks.filter((l) => l.category === category)
}

export function searchLandmarks(query: string): Landmark[] {
  if (!query.trim()) return landmarks
  const q = query.toLowerCase()
  return landmarks.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.desc.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q) ||
      l.location.toLowerCase().includes(q) ||
      l.nameFr.toLowerCase().includes(q) ||
      l.nameAr.includes(q),
  )
}

export function getNearbyLandmarks(slug: string): Landmark[] {
  const lm = getLandmarkBySlug(slug)
  if (!lm) return []
  return lm.nearby
    .map((s) => getLandmarkBySlug(s))
    .filter((l): l is Landmark => l !== undefined)
}
