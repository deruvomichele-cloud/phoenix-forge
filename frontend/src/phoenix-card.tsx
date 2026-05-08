import type { Element } from './elements.js';
import { KLING_MODELS, type KlingModelId } from './kling-models.js';
import { pickQuoteForNft } from './phoenix-quotes.js';
import styles from './phoenix-card.module.css';

const DEFAULT_KLING_MODEL: KlingModelId = 'kwaivgi/kling-video-o1';

export type PhoenixNft = {
  id: string; name: string; elements: Element[]; imageUrl: string;
  videoUrl?: string; videoRemoteUrl?: string; videoJobId?: string;
  videoModelId?: KlingModelId; status: 'generating-image'|'image-ready'|'animating'|'complete'|'error';
  error?: string; progressLabel?: string; variationLabel?: string; createdAt: number;
};

export type PhoenixCardProps = {
  nft: PhoenixNft;
  onAnimate?: (id: string, modelId: KlingModelId) => void;
  onAttachJobId?: (nftId: string, jobId: string) => Promise<void>|void;
  onDelete?: (id: string) => Promise<void>|void;
};

export function PhoenixCard({ nft, onAnimate, onAttachJobId, onDelete }: PhoenixCardProps) {
  const gradient = `linear-gradient(135deg, ${nft.elements.map(e=>e.color).join(', ')})`;
  const glow = nft.elements.map(e=>`0 0 60px ${e.glow}`).join(', ');
  const usedModel = KLING_MODELS.find(m=>m.id===nft.videoModelId);
  const quote = pickQuoteForNft(nft.createdAt, nft.id);

  return (
    <div className={styles.card} style={{ boxShadow: glow, borderImage: `${gradient} 1` }}>
      <div className={styles.media}>
        {nft.status==='generating-image' && <div className={styles.loading}><div className={styles.spinner}/><span>Forging phoenix essence…</span></div>}
        {nft.status==='error' && <div className={styles.error}><span>⚠️ {nft.error}</span></div>}
        {nft.imageUrl && nft.status!=='complete' && <img src={nft.imageUrl} alt={nft.name} className={styles.image}/>}
        {nft.status==='animating' && (
          <div className={styles.animatingOverlay}>
            <div className={styles.spinner}/>
            <span>{nft.progressLabel||'Awakening with Kling…'}</span>
          </div>
        )}
        {nft.status==='complete' && nft.videoUrl && (
          <video key={nft.videoUrl} src={nft.videoUrl} className={styles.image} autoPlay loop muted playsInline onCanPlay={e=>{void e.currentTarget.play().catch(()=>{});}}/>
        )}
        {nft.status==='complete' && !nft.videoUrl && (
          <>
            {nft.imageUrl ? <img src={nft.imageUrl} alt={nft.name} className={styles.image}/> : <div className={styles.placeholder}><span className={styles.placeholderEmoji}>{nft.elements[0]?.emoji||'🔥'}</span></div>}
            <div className={styles.animatingOverlay}><div className={styles.spinner}/><span>Loading video…</span></div>
          </>
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.title}>
          <h3>{nft.name}</h3>
          <div className={styles.titleActions}>
            <span className={styles.id}>#{nft.id.slice(0,6)}</span>
            {onDelete && nft.status!=='animating' && (
              <button type="button" className={styles.deleteBtn} title="Delete" onClick={()=>{ if(window.confirm(`Delete "${nft.name}"?`)) void onDelete(nft.id); }}>🗑</button>
            )}
          </div>
        </div>
        {nft.variationLabel && <div className={styles.variation}>{nft.variationLabel}</div>}
        <blockquote className={styles.quote}>
          <span className={styles.quoteText}>&ldquo;{quote.text}&rdquo;</span>
          <cite className={styles.quoteAuthor}>— {quote.author}{quote.origin && <span className={styles.quoteOrigin}> · {quote.origin}</span>}</cite>
        </blockquote>
        <div className={styles.elements}>
          {nft.elements.map(e=>(
            <span key={e.id} className={styles.elementBadge} style={{ background:e.glow, borderColor:e.color }}><span>{e.emoji}</span> {e.name}</span>
          ))}
        </div>
        {nft.status==='image-ready' && onAnimate && (
          <button type="button" className={styles.animateBtn} onClick={()=>onAnimate(nft.id, DEFAULT_KLING_MODEL)} style={{ background:gradient }}>🎬 Animate with Kling</button>
        )}
        {nft.status==='image-ready' && onAttachJobId && (
          <button type="button" className={styles.attachBtn} onClick={async()=>{
            const jobId=window.prompt('OpenRouter video job_id:');
            if(!jobId) return;
            try { await onAttachJobId(nft.id, jobId.trim()); } catch(e) { window.alert(`Error: ${e instanceof Error?e.message:e}`); }
          }}>🔗 Attach existing video by ID</button>
        )}
        {nft.status==='complete' && <div className={styles.completeTag}><span>✨ Living NFT{usedModel?` · ${usedModel.label}`:''}</span></div>}
      </div>
    </div>
  );
}
