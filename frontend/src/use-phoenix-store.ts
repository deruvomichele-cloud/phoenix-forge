import { useCallback, useEffect, useRef, useState } from 'react';
import { deletePhoenix, listPhoenixes, upsertPhoenix } from './api-client.js';
import { generatePhoenixName, pickRandomElements } from './elements.js';
import type { KlingModelId } from './kling-models.js';
import { animatePhoenixVideo, generatePhoenixImage, rehydrateVideoUrl } from './openrouter-client.js';
import type { PhoenixNft } from './phoenix-card.js';
import { getRecoveredPhoenixes } from './seed-recovered.js';
import { pickRandomVariation } from './phoenix-variations.js';

const STORAGE_KEY = 'phoenix-forge.collection';
const DELETED_KEY = 'phoenix-forge.deleted';

function loadDeletedIds(): Set<string> {
  try { const raw=localStorage.getItem(DELETED_KEY); if(!raw) return new Set(); const arr=JSON.parse(raw); return new Set(Array.isArray(arr)?arr.filter((x:unknown)=>typeof x==='string'):[]); } catch { return new Set(); }
}
function saveDeletedIds(ids: Set<string>) { try { localStorage.setItem(DELETED_KEY, JSON.stringify(Array.from(ids))); } catch {} }

function loadFromStorage(): PhoenixNft[] {
  try {
    const raw=localStorage.getItem(STORAGE_KEY); if(!raw) return [];
    const parsed=JSON.parse(raw) as unknown; if(!Array.isArray(parsed)) return [];
    return (parsed as PhoenixNft[]).filter(n=>n&&typeof n.id==='string'&&Array.isArray(n.elements)&&n.elements.length>0&&(n.status==='image-ready'||n.status==='complete')).map(n=>n.videoUrl?.startsWith('blob:')?{...n,videoUrl:undefined}:n);
  } catch { return []; }
}
function saveToStorage(nfts: PhoenixNft[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(nfts.filter(n=>n.status==='image-ready'||n.status==='complete').map(n=>n.videoUrl?.startsWith('blob:')?{...n,videoUrl:undefined}:n))); } catch {}
}

function mergeCollections(local: PhoenixNft[], server: PhoenixNft[]): PhoenixNft[] {
  const map=new Map<string,PhoenixNft>(); server.forEach(n=>map.set(n.id,n));
  local.forEach(n=>{ const ex=map.get(n.id); if(!ex){map.set(n.id,n);return;} if(n.videoRemoteUrl&&!ex.videoRemoteUrl) map.set(n.id,n); });
  return Array.from(map.values()).sort((a,b)=>b.createdAt-a.createdAt);
}

function mergeWithSeeds(existing: PhoenixNft[], deleted: Set<string>): PhoenixNft[] {
  const seeds=getRecoveredPhoenixes(); const seedMap=new Map(seeds.map(s=>[s.id,s]));
  const patched=existing.map(n=>{ const seed=seedMap.get(n.id); if(!seed) return n; const needsPatch=!n.videoUrl||n.videoUrl.startsWith('blob:')||n.videoUrl.includes('tmpfiles.org'); return needsPatch?{...n,videoUrl:seed.videoUrl,videoRemoteUrl:seed.videoRemoteUrl}:n; });
  const existingIds=new Set(existing.map(n=>n.id));
  const missing=seeds.filter(s=>!existingIds.has(s.id)&&!deleted.has(s.id));
  return [...patched,...missing].sort((a,b)=>b.createdAt-a.createdAt);
}

export type PhoenixStore = { nfts:PhoenixNft[]; minting:boolean; syncing:boolean; mintPhoenix:()=>Promise<void>; animate:(id:string,modelId:KlingModelId)=>Promise<void>; attachVideoFromJobId:(nftId:string,jobId:string)=>Promise<void>; importVideoAsNft:(jobId:string)=>Promise<void>; removePhoenix:(id:string)=>Promise<void>; clear:()=>void; };

export function usePhoenixStore(apiKey: string): PhoenixStore {
  const deletedIds=useRef<Set<string>>(loadDeletedIds());
  const [nfts,setNfts]=useState<PhoenixNft[]>(()=>mergeWithSeeds(loadFromStorage(),deletedIds.current));
  const [minting,setMinting]=useState(false); const [syncing,setSyncing]=useState(true);
  const rehydrated=useRef<Set<string>>(new Set());
  useEffect(()=>{ saveToStorage(nfts); },[nfts]);
  useEffect(()=>{ let cancelled=false; listPhoenixes().then(s=>{ if(!cancelled) setNfts(prev=>mergeWithSeeds(mergeCollections(prev,s).filter(n=>!deletedIds.current.has(n.id)),deletedIds.current)); }).finally(()=>{ if(!cancelled) setSyncing(false); }); return()=>{ cancelled=true; }; },[]);
  const updateNft=useCallback((id:string,patch:Partial<PhoenixNft>)=>{ setNfts(prev=>prev.map(n=>n.id===id?{...n,...patch}:n)); },[]);

  useEffect(()=>{
    if(!apiKey) return; let cancelled=false;
    const pending=nfts.filter(n=>n.status==='complete'&&!n.videoUrl&&n.videoRemoteUrl&&!n.videoRemoteUrl.includes('litter.catbox.moe')&&!rehydrated.current.has(n.id));
    if(pending.length===0) return;
    pending.forEach(n=>rehydrated.current.add(n.id));
    (async()=>{ for(const n of pending){ if(cancelled) return; try{ const url=await rehydrateVideoUrl({apiKey,remoteVideoUrl:n.videoRemoteUrl!}); if(!cancelled) updateNft(n.id,{videoUrl:url}); } catch(err){ rehydrated.current.delete(n.id); } } })();
    return()=>{ cancelled=true; };
  },[apiKey,nfts,updateNft]);

  const persistRemote=useCallback((nft:PhoenixNft)=>{ if(nft.status==='image-ready'||nft.status==='complete') upsertPhoenix(nft).catch(()=>{}); },[]);

  const mintPhoenix=useCallback(async()=>{
    if(!apiKey) return; setMinting(true);
    const elements=pickRandomElements(); const variation=pickRandomVariation();
    const id=`${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    const nft:PhoenixNft={id,name:generatePhoenixName(elements),elements,imageUrl:'',status:'generating-image',createdAt:Date.now(),variationLabel:`${variation.shape.id} · ${variation.pose.id} · ${variation.composition.id}`};
    setNfts(prev=>[nft,...prev]);
    try{ const{imageUrl}=await generatePhoenixImage({apiKey,elements,variation}); const updated={...nft,imageUrl,status:'image-ready' as const}; updateNft(id,{imageUrl,status:'image-ready'}); persistRemote(updated); }
    catch(err){ updateNft(id,{status:'error',error:err instanceof Error?err.message:String(err)}); }
    finally{ setMinting(false); }
  },[apiKey,persistRemote,updateNft]);

  const animate=useCallback(async(id:string,modelId:KlingModelId)=>{
    const target=nfts.find(n=>n.id===id); if(!target||!apiKey) return;
    updateNft(id,{status:'animating',videoModelId:modelId,progressLabel:'Submitting to Kling…'});
    try{
      const{videoUrl,remoteVideoUrl,jobId}=await animatePhoenixVideo({apiKey,imageDataUrl:target.imageUrl,elements:target.elements,modelId,onProgress:(s)=>{ const label=s==='uploading'?'Uploading…':s==='pending'?'Queued…':s==='in_progress'?'Animating…':s==='downloading'?'Downloading…':`${s}`; updateNft(id,{progressLabel:label}); }});
      rehydrated.current.add(id);
      const updated={...target,videoUrl,videoRemoteUrl,videoJobId:jobId,videoModelId:modelId,status:'complete' as const};
      updateNft(id,{videoUrl,videoRemoteUrl,videoJobId:jobId,status:'complete',progressLabel:undefined});
      persistRemote(updated);
    } catch(err){ updateNft(id,{status:'error',error:err instanceof Error?err.message:String(err)}); }
  },[apiKey,nfts,persistRemote,updateNft]);

  const attachVideoFromJobId=useCallback(async(nftId:string,jobId:string)=>{
    if(!apiKey) throw new Error('Missing API key');
    const remoteUrl=`https://openrouter.ai/api/v1/videos/${jobId}/content?index=0`;
    const blobUrl=await rehydrateVideoUrl({apiKey,remoteVideoUrl:remoteUrl});
    const target=nfts.find(n=>n.id===nftId); if(!target) return;
    const updated={...target,videoUrl:blobUrl,videoRemoteUrl:remoteUrl,videoJobId:jobId,status:'complete' as const};
    updateNft(nftId,{videoUrl:blobUrl,videoRemoteUrl:remoteUrl,videoJobId:jobId,status:'complete',progressLabel:undefined});
    persistRemote(updated);
  },[apiKey,nfts,persistRemote,updateNft]);

  const importVideoAsNft=useCallback(async(jobId:string)=>{
    if(!apiKey) throw new Error('Missing API key');
    const remoteUrl=`https://openrouter.ai/api/v1/videos/${jobId}/content?index=0`;
    const blobUrl=await rehydrateVideoUrl({apiKey,remoteVideoUrl:remoteUrl});
    const elements=pickRandomElements(); const id=`import-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    const nft:PhoenixNft={id,name:`Recovered Phoenix #${jobId.slice(0,6)}`,elements,imageUrl:'',videoUrl:blobUrl,videoRemoteUrl:remoteUrl,videoJobId:jobId,status:'complete',createdAt:Date.now(),variationLabel:'imported · from job_id'};
    rehydrated.current.add(id); setNfts(prev=>[nft,...prev]); persistRemote(nft);
  },[apiKey,persistRemote]);

  const removePhoenix=useCallback(async(id:string)=>{
    deletedIds.current.add(id); saveDeletedIds(deletedIds.current);
    setNfts(prev=>prev.filter(n=>n.id!==id)); rehydrated.current.delete(id);
    await deletePhoenix(id).catch(()=>{});
  },[]);

  const clear=useCallback(()=>setNfts([]),[]);
  return{nfts,minting,syncing,mintPhoenix,animate,attachVideoFromJobId,importVideoAsNft,removePhoenix,clear};
}
