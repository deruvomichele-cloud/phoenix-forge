import type { PhoenixNft } from './phoenix-card.js';

const BASE = '/api';

function toServerShape(n: PhoenixNft) {
  const { videoUrl, ...rest } = n;
  void videoUrl;
  return rest;
}

export async function listPhoenixes(): Promise<PhoenixNft[]> {
  try {
    const res = await fetch(`${BASE}/phoenixes`);
    if (!res.ok) return [];
    const docs = (await res.json()) as PhoenixNft[];
    return docs.map((d) => ({
      ...d,
      videoUrl:
        d.videoRemoteUrl &&
        !d.videoRemoteUrl.includes('openrouter.ai') &&
        !d.videoRemoteUrl.includes('tmpfiles.org')
          ? d.videoRemoteUrl
          : undefined,
    }));
  } catch {
    return [];
  }
}

export async function upsertPhoenix(nft: PhoenixNft): Promise<void> {
  try {
    await fetch(`${BASE}/phoenixes/${encodeURIComponent(nft.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toServerShape(nft)),
    });
  } catch {}
}

export async function deletePhoenix(id: string): Promise<void> {
  try {
    await fetch(`${BASE}/phoenixes/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  } catch {}
}
