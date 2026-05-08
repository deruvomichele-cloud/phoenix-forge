export type PhoenixPose = { id: string; description: string };
export type PhoenixShape = { id: string; description: string };
export type PhoenixComposition = { id: string; description: string };
export type PhoenixMood = { id: string; description: string };

export const POSES: PhoenixPose[] = [
  { id:'soaring', description:'soaring upward with wings fully spread wide, head raised toward the sky, tail feathers trailing behind' },
  { id:'diving', description:'diving downward at high speed, wings swept back, talons forward, fierce predatory stance' },
  { id:'rearing', description:'rearing up dramatically with chest puffed out, wings flared in a threat display, head tilted back' },
  { id:'perched', description:'perched majestically on a floating rock or crystal pedestal, wings half-folded, gazing into the distance' },
  { id:'looping', description:'mid-loop in flight, body twisted sideways, one wing pointing up and one down, dynamic spiral motion' },
  { id:'hovering', description:'hovering in place with wings beating fast, body upright, looking directly at the viewer with glowing eyes' },
  { id:'rising', description:'rising vertically out of a burst of energy, wings just unfurling, dramatic emergence from below the frame' },
  { id:'curled', description:'curled mid-air in a crescent moon shape, head tucked toward tail, wings forming a protective halo' },
  { id:'gliding', description:'gliding sideways with wings perfectly extended, profile view, serene and powerful silhouette' },
  { id:'attacking', description:'lunging forward with beak open and claws extended, wings angled like blades, aggressive battle pose' },
];
export const SHAPES: PhoenixShape[] = [
  { id:'classic', description:'classic phoenix silhouette: long elegant neck, large feathered wings, sweeping multi-tail of streaming feathers' },
  { id:'serpentine', description:'serpentine elongated body, snake-like neck with feathered scales, twin trailing tail-streamers, dragon-like proportions' },
  { id:'crested', description:'massive crowned crest of horn-like plumes, broad shoulders, short stocky body, eagle-like proportions' },
  { id:'celestial', description:'translucent ethereal body of pure energy, indistinct edges dissolving into smoke and stars, ghostly silhouette' },
  { id:'armored', description:'armored crystalline body with overlapping plate-like feathers, sharp angular wings, mecha-bird aesthetic' },
  { id:'flowing', description:'flowing liquid body shape, feathers like flames or running water, no hard edges, painterly silhouette' },
  { id:'multi-winged', description:'six wings instead of two — two large primary wings plus four smaller upper and lower wings, seraphic appearance' },
  { id:'long-tailed', description:'extreme long peacock-like tail of flowing feathers many times longer than the body, ribbon-like trail' },
  { id:'compact', description:'compact muscular falcon-like body, short tail, sharp swept-back wings built for speed' },
  { id:'antlered', description:'mythic antlered phoenix with branching horns or antlers of light growing from the head, regal stag-bird hybrid' },
];
export const COMPOSITIONS: PhoenixComposition[] = [
  { id:'centered', description:'phoenix centered in the frame, full body visible, symmetrical heroic composition' },
  { id:'low-angle', description:'low-angle shot looking up at the phoenix from below, sky filling most of the background, monumental feeling' },
  { id:'high-angle', description:'high-angle shot looking down on the phoenix from above, the landscape stretching out below it' },
  { id:'wide', description:'extreme wide shot, phoenix small in the frame against a vast epic landscape, sense of scale and awe' },
  { id:'close-up', description:'cinematic close-up framing — phoenix fills 70% of the frame, head and chest dominant, intricate feather detail visible' },
  { id:'profile', description:'pure side-profile composition, phoenix in silhouette against bright atmospheric backlight' },
  { id:'three-quarter', description:'three-quarter angle, phoenix turned partly toward the camera, dynamic asymmetric framing' },
  { id:'rule-of-thirds', description:'phoenix placed off-center on the right third of the frame, leaving a vast atmospheric background on the left' },
];
export const MOODS: PhoenixMood[] = [
  { id:'serene', description:'serene and majestic mood, soft volumetric god-rays, peaceful aura' },
  { id:'fierce', description:'fierce and wrathful mood, intense contrast, dramatic shadows, embers and sparks everywhere' },
  { id:'mystical', description:'mystical dreamlike mood, soft glowing fog, magical sparkles, painterly atmosphere' },
  { id:'apocalyptic', description:'apocalyptic mood, sky tearing open, violent energy, end-of-world drama' },
  { id:'reborn', description:'rebirth moment, light radiating outward from the body, halo of energy, sense of awakening' },
  { id:'ancient', description:'ancient and timeless mood, ruined temples or monoliths around, mythological atmosphere' },
  { id:'cosmic', description:'cosmic mood, galaxy and nebulae behind, stardust trailing from the wings, interstellar scale' },
];
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random()*arr.length)]; }
export type PhoenixVariation = { pose: PhoenixPose; shape: PhoenixShape; composition: PhoenixComposition; mood: PhoenixMood };
export function pickRandomVariation(): PhoenixVariation {
  return { pose:pick(POSES), shape:pick(SHAPES), composition:pick(COMPOSITIONS), mood:pick(MOODS) };
}
