import type { Element } from './elements.js';
import type { PhoenixVariation } from './phoenix-variations.js';

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';

export function buildPhoenixPrompt(elements: Element[], variation: PhoenixVariation): string {
  const visuals = elements.map(e=>`- ${e.name} (${e.emoji}): ${e.visualKeywords}`).join('\n');
  const backgrounds = elements.map(e=>`- ${e.backgroundKeywords}`).join('\n');
  const palette = elements.map(e=>e.color).join(', ');
  return `Generate a single, ultra-detailed digital painting of a mythical PHOENIX, fully embodying these elemental forces:\n\n${visuals}\n\nBODY SHAPE: ${variation.shape.description}.\nPOSE: ${variation.pose.description}.\nFRAMING: ${variation.composition.description}.\nMOOD: ${variation.mood.description}.\n\nUNIQUE BACKGROUND fused from:\n${backgrounds}\n\nColor palette: ${palette}.\n\nStyle: hyper-detailed concept art, cinematic volumetric lighting, NFT collectible art, 1:1 square format, no text, no watermark.`;
}

export async function generatePhoenixImage(opts: { apiKey: string; elements: Element[]; variation: PhoenixVariation }): Promise<{ imageUrl: string; prompt: string }> {
  const prompt = buildPhoenixPrompt(opts.elements, opts.variation);
  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${opts.apiKey}`, 'HTTP-Referer': 'https://phoenix-forge.fly.dev', 'X-Title': 'Phoenix NFT Studio' },
    body: JSON.stringify({ model: 'google/gemini-2.5-flash-image', modalities: ['image','text'], messages: [{ role:'user', content:[{ type:'text', text:prompt }] }] }),
  });
  if (!res.ok) throw new Error(`Gemini failed (${res.status}): ${await res.text()}`);
  const data = await res.json();
  const images = data?.choices?.[0]?.message?.images || [];
  const imageUrl = images?.[0]?.image_url?.url;
  if (!imageUrl) throw new Error(`No image returned: ${JSON.stringify(data).slice(0,200)}`);
  return { imageUrl, prompt };
}

async function uploadImageToPublicHost(dataUrl: string, onProgress?: (s:string)=>void): Promise<string> {
  onProgress?.('uploading');
  const match = dataUrl.match(/^data:(.*?);base64,(.+)$/);
  if (!match) throw new Error('Invalid base64 data URL');
  const mime = match[1]; const b64 = match[2];
  const binary = atob(b64); const bytes = new Uint8Array(binary.length);
  for (let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: mime });
  const form = new FormData(); form.append('file', blob, `phoenix.${mime.split('/')[1]||'png'}`);
  const res = await fetch('https://tmpfiles.org/api/v1/upload', { method:'POST', body:form });
  if (!res.ok) throw new Error(`Upload failed (${res.status})`);
  const data = await res.json();
  const url: string|undefined = data?.data?.url;
  if (!url) throw new Error('No URL from image host');
  return url.replace('://tmpfiles.org/', '://tmpfiles.org/dl/');
}

export type AnimatePhoenixResult = { videoUrl: string; remoteVideoUrl: string; jobId: string };

export async function animatePhoenixVideo(opts: { apiKey: string; imageDataUrl: string; elements: Element[]; modelId?: string; onProgress?: (s:string)=>void; signal?: AbortSignal }): Promise<AnimatePhoenixResult> {
  const motion = opts.elements.map(e=>e.visualKeywords.split(',')[0]).join(', ');
  const backgroundMotion = opts.elements.map(e=>e.backgroundKeywords).join('. ');
  const prompt = `Cinematic 10-second animation starting from the reference image.\n\nPHOENIX: wings beating with strong rhythmic flaps, feathers shimmering with ${motion}, glowing particles streaming off the body, eyes pulsing with light.\n\nBACKGROUND (must be dynamic): ${backgroundMotion}. Clouds drifting, water rushing, fire swirling, lightning crackling, sparks flying, smoke billowing, light rays sweeping, parallax depth.\n\nCamera: very slow cinematic push-in. Keep the phoenix design consistent. Nothing static. No text, no watermark.`;

  const publicImageUrl = await uploadImageToPublicHost(opts.imageDataUrl, opts.onProgress);

  const submit = await fetch(`${OPENROUTER_BASE}/videos`, {
    method:'POST', signal: opts.signal,
    headers: { 'Content-Type':'application/json', Authorization:`Bearer ${opts.apiKey}`, 'HTTP-Referer':'https://phoenix-forge.fly.dev', 'X-Title':'Phoenix NFT Studio' },
    body: JSON.stringify({
      model: opts.modelId ?? 'kwaivgi/kling-video-o1',
      prompt, audio: false, generate_audio: false, duration: 10, aspect_ratio: '1:1',
      frame_images: [
        { type:'image_url', image_url:{ url:publicImageUrl }, frame_type:'first_frame' },
        { type:'image_url', image_url:{ url:publicImageUrl }, frame_type:'last_frame' },
      ],
    }),
  });
  if (!submit.ok) throw new Error(`Kling submit failed (${submit.status}): ${await submit.text()}`);
  const job = await submit.json() as { id: string; polling_url?: string };
  const pollUrl = job.polling_url || `${OPENROUTER_BASE}/videos/${job.id}`;

  const start = Date.now();
  let attempt = 0;
  while (Date.now()-start < 8*60*1000) {
    if (opts.signal?.aborted) throw new DOMException('Cancelled','AbortError');
    await new Promise<void>((resolve,reject) => {
      const t = setTimeout(resolve, Math.min(2000+attempt*500,6000));
      opts.signal?.addEventListener('abort', () => { clearTimeout(t); reject(new DOMException('Cancelled','AbortError')); }, { once:true });
    });
    const pollRes = await fetch(pollUrl, { headers:{ Authorization:`Bearer ${opts.apiKey}` }, signal:opts.signal });
    if (!pollRes.ok) throw new Error(`Poll failed (${pollRes.status})`);
    const pollData = await pollRes.json() as { status: string; unsigned_urls?: string[]; signed_urls?: string[]; error?: string };
    opts.onProgress?.(pollData.status);
    if (pollData.status==='completed'||pollData.status==='succeeded') {
      const remoteUrl = pollData.signed_urls?.[0] || pollData.unsigned_urls?.[0];
      if (!remoteUrl) throw new Error('No video URL in completed job');
      opts.onProgress?.('downloading');
      const videoRes = await fetch(remoteUrl, { headers:{ Authorization:`Bearer ${opts.apiKey}` }, signal:opts.signal });
      if (!videoRes.ok) throw new Error(`Download failed (${videoRes.status})`);
      const blob = await videoRes.blob();
      return { videoUrl: URL.createObjectURL(blob), remoteVideoUrl: remoteUrl, jobId: job.id };
    }
    if (pollData.status==='failed'||pollData.status==='error') throw new Error(`Video failed: ${pollData.error||'unknown'}`);
    attempt++;
  }
  throw new Error('Video generation timed out');
}

export async function rehydrateVideoUrl(opts: { apiKey: string; remoteVideoUrl: string }): Promise<string> {
  const res = await fetch(opts.remoteVideoUrl, { headers:{ Authorization:`Bearer ${opts.apiKey}` } });
  if (!res.ok) throw new Error(`Rehydrate failed (${res.status})`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
