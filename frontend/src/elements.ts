export type ElementId = 'water'|'earth'|'fire'|'lightning'|'air'|'light'|'shadow';
export type Element = { id: ElementId; name: string; emoji: string; color: string; glow: string; visualKeywords: string; backgroundKeywords: string; };
export const ELEMENTS: Record<ElementId, Element> = {
  water: { id:'water', name:'Acqua', emoji:'💧', color:'#3aa9ff', glow:'rgba(58,169,255,0.55)', visualKeywords:'liquid feathers, flowing water plumes, droplets cascading off wings, oceanic blue and teal hues, iridescent wet shine', backgroundKeywords:'deep ocean abyss, swirling waves, underwater coral cathedrals, bioluminescent currents' },
  earth: { id:'earth', name:'Terra', emoji:'🌿', color:'#7bcf6a', glow:'rgba(123,207,106,0.55)', visualKeywords:'feathers of moss and vines, crystalline rock plumage, earthen amber and emerald tones, blooming flowers along the wings', backgroundKeywords:'ancient mossy forest, towering crystal mountains, glowing flora, roots and stones' },
  fire: { id:'fire', name:'Fuoco', emoji:'🔥', color:'#ff6a3a', glow:'rgba(255,106,58,0.65)', visualKeywords:'wings of pure molten flame, ember sparks trailing, blazing crimson and gold, smoke curling around the body', backgroundKeywords:'volcanic eruption, lava rivers, burning sky, columns of fire and ash' },
  lightning: { id:'lightning', name:'Fulmine', emoji:'⚡', color:'#c77dff', glow:'rgba(199,125,255,0.65)', visualKeywords:'electric arcs across feathers, plasma plumage, neon violet and white sparks, crackling energy aura', backgroundKeywords:'thunderstorm sky, lightning storm cathedrals, electric purple clouds, charged atmosphere' },
  air: { id:'air', name:'Aria', emoji:'🌬️', color:'#b6e3ff', glow:'rgba(182,227,255,0.55)', visualKeywords:'translucent feathers like wind currents, soft pastel sky tones, swirling vortexes around the body, weightless ethereal form', backgroundKeywords:'high altitude clouds, swirling cyclones, open infinite sky, aurora wisps' },
  light: { id:'light', name:'Luce', emoji:'✨', color:'#ffd86b', glow:'rgba(255,216,107,0.7)', visualKeywords:'radiant golden halo, feathers made of pure light, blinding solar shine, divine glowing aura', backgroundKeywords:'celestial heavens, pillars of golden light, sunrise nebulae, luminous celestial plane' },
  shadow: { id:'shadow', name:'Ombra', emoji:'🌑', color:'#9b6bff', glow:'rgba(155,107,255,0.65)', visualKeywords:'inky black feathers swallowing light, smoky tendrils, deep violet undertones, void-like silhouette with glowing eyes', backgroundKeywords:'eclipsed cosmos, void with distant stars, dark dimensional rifts, midnight obsidian world' },
};
export const ELEMENT_LIST: Element[] = Object.values(ELEMENTS);
export function pickRandomElements(): Element[] {
  const count = 1 + Math.floor(Math.random() * 3);
  const pool = [...ELEMENT_LIST];
  const picked: Element[] = [];
  for (let i = 0; i < count; i++) { const idx = Math.floor(Math.random()*pool.length); picked.push(pool.splice(idx,1)[0]); }
  return picked;
}
export function generatePhoenixName(elements: Element[]): string {
  const prefixes = ['Ignis','Vael','Zeph','Nyx','Solar','Umbra','Aether','Kael','Lyra','Drak','Vor','Sera'];
  const suffixes = ['mortis','volkar','thalas','rion','phyre','shar','velor','naxis','drael','lumos'];
  const p = prefixes[Math.floor(Math.random()*prefixes.length)];
  const s = suffixes[Math.floor(Math.random()*suffixes.length)];
  const tag = elements.map(e=>e.name[0]).join('');
  return `${p}'${s} ${tag}`;
}
