/** Campus-authored data only. Shared presentation and exact tour pins are supplied separately. */
export const CAMPUS_ABOUT = Object.freeze({
  title: 'University of Minnesota Twin Cities: campus tour',
  description: 'Explore 60 campus panoramas in 23 tour stops, with earlier stops retained. Photographs, descriptions, placements and import rules are owned by UMN-VR.',
  applicationRepository: 'UMN-VR/app',
  sceneRepositories: Object.freeze(['UMN-VR/minneapolis', 'UMN-VR/st-paul', 'UMN-VR/twin-cities']),
  selectorRepository: 'UMN-VR/tour',
  aboutRepository: 'UMN-VR/about',
  publishedSiteRepository: 'UMN-VR/UMN-VR.github.io',
  tourUrl: 'https://umn-vr.github.io/tour/twin-cities/',
  clubUrl: 'https://umn-vr.github.io/',
  credits: Object.freeze([
    Object.freeze({ text: 'Photographs © Regents of the University of Minnesota', url: 'https://twin-cities.umn.edu/' }),
    Object.freeze({ text: 'Campus positions include OpenStreetMap data, © OpenStreetMap contributors, ODbL 1.0', url: 'https://www.openstreetmap.org/copyright' }),
    Object.freeze({ text: 'Imported from YouVisit tour 60288', url: 'https://www.youvisit.com/tour/60288/' }),
    Object.freeze({ text: 'Shared globe, UI and 360 viewer: FOSS Earth', url: 'https://github.com/foss-earth' }),
  ]),
  limitations: Object.freeze([
    'Capture positions are approximate; five photographs still need precise placement.',
    'North is not aligned for the 60 photographs.',
    'The separate accessible tour is unfinished. Current photograph descriptions and keyboard/text access remain available.',
    'Ordinary photos, narration and videos remain future work.',
  ]),
});
