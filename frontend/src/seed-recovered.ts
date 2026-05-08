import type { PhoenixNft } from './phoenix-card.js';
import { ELEMENTS } from './elements.js';

type Recovered = { jobId: string; elements: (keyof typeof ELEMENTS)[]; createdAt: number; mirrorUrl: string };

const RECOVERED: Recovered[] = [
  { jobId:'vmw1oRQd20EtZ0pweUzD', elements:['fire'], createdAt:1778154681000, mirrorUrl:'https://litter.catbox.moe/6v0ezv.mp4' },
  { jobId:'JI1WPhgw7tWcCM89kegv', elements:['lightning'], createdAt:1778154407000, mirrorUrl:'https://litter.catbox.moe/qiw0o5.mp4' },
  { jobId:'XMKLoLKGyNcoItBjdHNl', elements:['water'], createdAt:1778153204000, mirrorUrl:'https://litter.catbox.moe/ainjmr.mp4' },
  { jobId:'d2bAZY91bZgd1upccsIp', elements:['earth'], createdAt:1778153195000, mirrorUrl:'https://litter.catbox.moe/5jsyu1.mp4' },
  { jobId:'06NKPSKOEg9xtpUePrbe', elements:['air'], createdAt:1778147265000, mirrorUrl:'https://litter.catbox.moe/k3la30.mp4' },
  { jobId:'MrMV8t14XZ7Gv0gmK7IP', elements:['light'], createdAt:1778146597000, mirrorUrl:'https://litter.catbox.moe/b1uibh.mp4' },
  { jobId:'7gbh09dlLshh4JcNJeM6', elements:['shadow'], createdAt:1778143327000, mirrorUrl:'https://litter.catbox.moe/1trs2y.mp4' },
  { jobId:'sDDifUzbkQPQ66LHSJCj', elements:['fire','lightning'], createdAt:1778143303000, mirrorUrl:'https://litter.catbox.moe/vhu5xa.mp4' },
  { jobId:'ZFgQmij2Prh2VsfLn7rX', elements:['water','light'], createdAt:1778142708000, mirrorUrl:'https://litter.catbox.moe/s1qcw4.mp4' },
  { jobId:'GbZo45WlXbQQihH3CsFw', elements:['fire','shadow'], createdAt:1778140049000, mirrorUrl:'https://litter.catbox.moe/fol3wa.mp4' },
  { jobId:'QxJyBCbT1BQaG3FxBVKl', elements:['earth','shadow'], createdAt:1778139866000, mirrorUrl:'https://litter.catbox.moe/tdh2jl.mp4' },
  { jobId:'TKmgjSdvykGBF53rpVRk', elements:['fire','air'], createdAt:1778139683000, mirrorUrl:'https://litter.catbox.moe/bod4f1.mp4' },
  { jobId:'HP3bTZSuWNqY3flZj7Y2', elements:['lightning','shadow'], createdAt:1778139607000, mirrorUrl:'https://litter.catbox.moe/qjbcgi.mp4' },
  { jobId:'8UMXunqETHiAqoiY38GM', elements:['water','earth'], createdAt:1778139472000, mirrorUrl:'https://litter.catbox.moe/op6v7y.mp4' },
];

export function getRecoveredPhoenixes(): PhoenixNft[] {
  return RECOVERED.map(r => ({
    id: `recovered-${r.jobId.slice(0,8)}`,
    name: `Recovered Phoenix #${r.jobId.slice(0,6)}`,
    elements: r.elements.map(id => ELEMENTS[id]),
    imageUrl: '',
    videoUrl: r.mirrorUrl,
    videoRemoteUrl: r.mirrorUrl,
    videoJobId: r.jobId,
    videoModelId: 'kwaivgi/kling-video-o1' as const,
    status: 'complete' as const,
    variationLabel: `recovered · ${r.jobId.slice(0,6)}`,
    createdAt: r.createdAt,
  }));
}
