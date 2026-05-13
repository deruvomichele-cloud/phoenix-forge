import type { PhoenixNft } from './phoenix-card.js';
import { ELEMENTS } from './elements.js';

// Videos served via /videos/ proxy on the same Fly.io server — no redirects, correct Content-Type
const V = (n: number) => `/videos/p${n}.mp4`;

const RECOVERED_DATA = [
  { id:'recovered-vmw1oRQd', name:'Phoenix #vmw1oR', elements:['fire' as const], video:V(1), createdAt:1778154681000 },
  { id:'recovered-JI1WPhgw', name:'Phoenix #JI1WPh', elements:['lightning' as const], video:V(2), createdAt:1778154407000 },
  { id:'recovered-XMKLoLKG', name:'Phoenix #XMKLoL', elements:['water' as const], video:V(3), createdAt:1778153204000 },
  { id:'recovered-d2bAZY91', name:'Phoenix #d2bAZY', elements:['earth' as const], video:V(4), createdAt:1778153195000 },
  { id:'recovered-06NKPSKOEg', name:'Phoenix #06NKPS', elements:['air' as const], video:V(5), createdAt:1778147265000 },
  { id:'recovered-MrMV8t14', name:'Phoenix #MrMV8t', elements:['light' as const], video:V(6), createdAt:1778146597000 },
  { id:'recovered-7gbh09dl', name:'Phoenix #7gbh09', elements:['shadow' as const], video:V(7), createdAt:1778143327000 },
  { id:'recovered-sDDifUzb', name:'Phoenix #sDDifU', elements:['fire' as const,'lightning' as const], video:V(8), createdAt:1778143303000 },
  { id:'recovered-ZFgQmij2', name:'Phoenix #ZFgQmi', elements:['water' as const,'light' as const], video:V(9), createdAt:1778142708000 },
  { id:'recovered-GbZo45Wl', name:'Phoenix #GbZo45', elements:['fire' as const,'shadow' as const], video:V(10), createdAt:1778140049000 },
  { id:'recovered-QxJyBCbT', name:'Phoenix #QxJyBC', elements:['earth' as const,'shadow' as const], video:V(11), createdAt:1778139866000 },
  { id:'recovered-TKmgjSdv', name:'Phoenix #TKmgjS', elements:['fire' as const,'air' as const], video:V(12), createdAt:1778139683000 },
  { id:'recovered-HP3bTZSu', name:'Phoenix #HP3bTZ', elements:['lightning' as const,'shadow' as const], video:V(13), createdAt:1778139607000 },
  { id:'recovered-8UMXunqE', name:'Phoenix #8UMXun', elements:['water' as const,'earth' as const], video:V(14), createdAt:1778139472000 },
];

export function getRecoveredPhoenixes(): PhoenixNft[] {
  return RECOVERED_DATA.map(r => ({
    id: r.id, name: r.name,
    elements: r.elements.map(id => ELEMENTS[id]),
    imageUrl: '',
    videoUrl: r.video,
    videoRemoteUrl: r.video,
    videoJobId: undefined,
    videoModelId: 'kwaivgi/kling-video-o1' as const,
    status: 'complete' as const,
    variationLabel: 'recovered',
    createdAt: r.createdAt,
  }));
}
