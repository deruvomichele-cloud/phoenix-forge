import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ELEMENT_LIST, type ElementId } from './elements.js';
import { PhoenixCard, type PhoenixNft } from './phoenix-card.js';
import type { KlingModelId } from './kling-models.js';
import styles from './collection-page.module.css';

export type CollectionPageProps = { nfts:PhoenixNft[]; onAnimate:(id:string,modelId:KlingModelId)=>void; onAttachJobId:(nftId:string,jobId:string)=>Promise<void>|void; onDelete:(id:string)=>Promise<void>|void; filter:ElementId|'all'; onFilterChange:(f:ElementId|'all')=>void; };

export function CollectionPage({ nfts,onAnimate,onAttachJobId,onDelete,filter,onFilterChange }: CollectionPageProps) {
  const filtered=useMemo(()=>filter==='all'?nfts:nfts.filter(n=>n.elements.some(e=>e.id===filter)),[nfts,filter]);
  const stats=useMemo(()=>{ const elementCount:Record<string,number>={}; nfts.forEach(n=>n.elements.forEach(e=>{elementCount[e.id]=(elementCount[e.id]||0)+1;})); return{total:nfts.length,animated:nfts.filter(n=>n.status==='complete').length,elementCount}; },[nfts]);
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div><Link to="/" className={styles.backLink}>← Back to Forge</Link><h1>📜 Phoenix Collection</h1><p>The full chronicle of every Phoenix you have summoned.</p></div>
        <div className={styles.stats}>
          <div className={styles.statBox}><span className={styles.statValue}>{stats.total}</span><span className={styles.statLabel}>Total minted</span></div>
          <div className={styles.statBox}><span className={styles.statValue}>{stats.animated}</span><span className={styles.statLabel}>Animated</span></div>
        </div>
      </header>
      <section className={styles.filters}>
        <button type="button" className={`${styles.filterChip}${filter==='all'?' '+styles.filterChipActive:''}`} onClick={()=>onFilterChange('all')}>All ({nfts.length})</button>
        {ELEMENT_LIST.map(e=>(
          <button key={e.id} type="button" className={`${styles.filterChip}${filter===e.id?' '+styles.filterChipActive:''}`} onClick={()=>onFilterChange(e.id)} style={{ borderColor:e.color, background:filter===e.id?`linear-gradient(135deg,${e.glow},transparent)`:undefined }}>
            <span>{e.emoji}</span> {e.name}<span className={styles.filterCount}>{stats.elementCount[e.id]||0}</span>
          </button>
        ))}
      </section>
      {filtered.length===0?<div className={styles.empty}>{nfts.length===0?'No Phoenix yet. ':'No Phoenix matches. '}<Link to="/">Forge one now →</Link></div>:(
        <div className={styles.grid}>{filtered.map(n=><PhoenixCard key={n.id} nft={n} onAnimate={onAnimate} onAttachJobId={onAttachJobId} onDelete={onDelete}/>)}</div>
      )}
    </div>
  );
}
