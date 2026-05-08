export type KlingModelId = 'kwaivgi/kling-v3.0-std'|'kwaivgi/kling-v3.0-pro'|'kwaivgi/kling-video-o1';
export type KlingModel = { id: KlingModelId; label: string; description: string; costPerVideo: string; accent: string; };
export const KLING_MODELS: KlingModel[] = [
  { id:'kwaivgi/kling-v3.0-std', label:'Kling v3 Std', description:'Cheap & fast', costPerVideo:'~$0.13', accent:'#7bcf6a' },
  { id:'kwaivgi/kling-v3.0-pro', label:'Kling v3 Pro', description:'Higher quality', costPerVideo:'~$0.17', accent:'#ffd86b' },
  { id:'kwaivgi/kling-video-o1', label:'Kling O1', description:'Cinematic premium', costPerVideo:'~$0.56', accent:'#c77dff' },
];
