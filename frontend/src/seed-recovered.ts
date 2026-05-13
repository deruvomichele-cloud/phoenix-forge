import type { PhoenixNft } from './phoenix-card.js';
import { ELEMENTS } from './elements.js';

// Videos hosted on GitHub Releases — public, permanent, correct Content-Type
const GH = 'https://github.com/deruvomichele-cloud/phoenix-nft-simple/releases/download/v1.0/';

const RECOVERED_DATA = [
  { id:'recovered-vmw1oRQd', name:'Recovered Phoenix #vmw1oR', elements:['fire' as const], video:`${GH}p1.mp4`, createdAt:1778154681000 },
  { id:'recovered-JI1WPhgw', name:'Recovered Phoenix #JI1WPh', elements:['lightning' as const], video:`${GH}p2.mp4`, createdAt:1778154407000 },
  { id:'recovered-XMKLoLKG', name:'Recovered Phoenix #XMKLoL', elements:['water' as const], video:`${GH}p3.mp4`, createdAt:1778153204000 },
  { id:'recovered-d2bAZY91', name:'Recovered Phoenix #d2bAZY', elements:['earth' as const], video:`${GH}p4.mp4`, createdAt:1778153195000 },
  { id:'recovered-06NKPSKOEg', name:'Recovered Phoenix #06NKPS', elements:['air' as const], video:`${GH}p5.mp4`, createdAt:1778147265000 },
  { id:'recovered-MrMV8t14', name:'Recovered Phoenix #MrMV8t', elements:['light' as const], video:`${GH}p6.mp4`, createdAt:1778146597000 },
  { id:'recovered-7gbh09dl', name:'Recovered Phoenix #7gbh09', elements:['shadow' as const], video:`${GH}p7.mp4`, createdAt:1778143327000 },
  { id:'recovered-sDDifUzb', name:'Recovered Phoenix #sDDifU', elements:['fire' as const,'lightning' as const], video:`${GH}p8.mp4`, createdAt:1778143303000 },
  { id:'recovered-ZFgQmij2', name:'Recovered Phoenix #ZFgQmi', elements:['water' as const,'light' as const], video:`${GH}p9.mp4`, createdAt:1778142708000 },
  { id:'recovered-GbZo45Wl', name:'Recovered Phoenix #GbZo45', elements:['fire' as const,'shadow' as const], video:`${GH}p10.mp4`, createdAt:1778140049000 },
  { id:'recovered-QxJyBCbT', name:'Recovered Phoenix #QxJyBC', elements:['earth' as const,'shadow' as const], video:`${GH}p11.mp4`, createdAt:1778139866000 },
  { id:'recovered-TKmgjSdv', name:'Recovered Phoenix #TKmgjS', elements:['fire' as const,'air' as const], video:`${GH}p12.mp4`, createdAt:1778139683000 },
  { id:'recovered-HP3bTZSu', name:'Recovered Phoenix #HP3bTZ', elements:['lightning' as const,'shadow' as const], video:`${GH}p13.mp4`, createdAt:1778139607000 },
  { id:'recovered-8UMXunqE', name:'Recovered Phoenix #8UMXun', elements:['water' as const,'earth' as const], video:`${GH}p14.mp4`, createdAt:1778139472000 },
];

export function getRecoveredPhoenixes(): PhoenixNft[] {
  return RECOVERED_DATA.map(r => ({
    id: r.id,
    name: r.name,
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
