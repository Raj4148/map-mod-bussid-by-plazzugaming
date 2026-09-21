import { useRoute, Link } from 'wouter';
import { useMap, useMaps, MapMod, fmtCount } from '../hooks/useMaps';
import { PageShell } from '../components/Layout';
import {
  ChevronLeft, DownloadCloud, Calendar, Tag,
  AlertTriangle, Share2, ArrowRight
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { areAdsEnabled, injectHomePopunder } from '../lib/ads-control';

function SafeImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [imgSrc, setImgSrc] = useState(src || '');
  useEffect(() => { setImgSrc(src); }, [src]);
  return <img src={imgSrc || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'} alt={alt} referrerPolicy="no-referrer" className={className} onError={() => setImgSrc('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800')} />;
}

function LinkifyText({ text }: { text: string }) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return <>{parts.map((p, i) => p.match(urlRegex) ? <a key={i} href={p} target="_blank" rel="noopener" className="text-primary font-bold underline">{p}</a> : p)}</>;
}

function StickyHeader({ title }: { title: string; }) {
  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
      <Link href="/" className="text-muted-foreground hover:text-foreground"><ChevronLeft className="w-5 h-5" /></Link>
      <h1 className="text-foreground font-bold text-sm line-clamp-1">{title}</h1>
    </div>
  );
}

function SuggestionsSection({ popularMaps, trendingMaps }: { popularMaps: MapMod[], trendingMaps: MapMod[] }) {
  const [activeTab, setActiveTab] = useState<'popular' | 'trending'>('popular');
  return (
    <div className="w-full mt-6 space-y-4">
      <div className="flex gap-4 px-1">
        <button onClick={() => setActiveTab('popular')} className={`text-xs font-black ${activeTab === 'popular' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}>POPULAR</button>
        <button onClick={() => setActiveTab('trending')} className={`text-xs font-black ${activeTab === 'trending' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}>TRENDING</button>
      </div>
      <div className="grid grid-cols-2 gap-3 px-1">
        {(activeTab === 'popular' ? popularMaps.slice(0, 6) : trendingMaps.slice(0, 6)).map(m => (
          <Link key={m.id} href={`/map/${m.id}`} className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
            <div className="aspect-[16/10] overflow-hidden relative"><SafeImage src={m.thumbnail} alt={m.name} className="w-full h-full object-cover" /></div>
            <div className="p-2"><p className="text-foreground font-bold text-[10px] line-clamp-1">{m.name}</p><span className="text-[8px] text-muted-foreground">📥 {fmtCount(m.downloadCount)}</span></div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function InlineDownloadCard({ map, onClick }: { map: MapMod; onClick: () => void }) {
  return (
    <div className="my-8 bg-muted/30 border border-border/50 rounded-2xl overflow-hidden shadow-sm">
      <div className="aspect-video relative"><SafeImage src={map.thumbnail} alt={map.name} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" /></div>
      <div className="p-4 bg-card/50">
        <button onClick={onClick} className="w-full py-3.5 bg-red-600 text-white text-[11px] font-black rounded-xl">START DOWNLOAD NOW</button>
      </div>
    </div>
  );
}

export default function MapDetail() {
  const [, params] = useRoute('/map/:id');
  const id = params?.id || '';
  const { map, loading: mapLoading } = useMap(id);
  const { allMaps, loading: allLoading } = useMaps();

  useEffect(() => {
     if (map) {
       document.title = `${map.name} - BUSSID Map Mod | Plazzu Gaming`;
       injectHomePopunder();
       window.scrollTo(0,0);
     }
  }, [map]);

  const newestMaps = useMemo(() => allMaps.filter(m => m.id !== id).sort((a, b) => b.createdAt - a.createdAt).slice(0, 5), [allMaps, id]);
  const popularMaps = useMemo(() => [...allMaps].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 8), [allMaps]);
  const trendingMaps = useMemo(() => [...allMaps].sort((a, b) => b.downloadCount - a.downloadCount).slice(8, 16), [allMaps]);

  const [gmPhase, setGmPhase] = useState<'idle' | 'counting' | 'revealed'>('idle');
  const [gmCountdown, setGmCountdown] = useState(15);

  useEffect(() => {
    if (gmPhase !== 'counting') return;
    const timer = setInterval(() => {
      setGmCountdown((c) => { if (c <= 1) { clearInterval(timer); setGmPhase('revealed'); return 0; } return c - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [gmPhase]);

  if (mapLoading || allLoading) return <PageShell><div className="p-8 text-center">Loading...</div></PageShell>;
  if (!map) return <PageShell><div className="p-8 text-center text-xl font-bold">Map Not Found</div></PageShell>;

  return (
    <PageShell>
      <StickyHeader title={map.name} />
      <div className="px-4 pt-4 space-y-4">
        <div className="relative rounded-2xl overflow-hidden bg-muted aspect-video shadow-lg">
          <SafeImage src={map.thumbnail} alt={map.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Phase 1: Idle or Counting or Revealed */}
        <div className="space-y-4">
          {gmPhase === 'idle' && (
            <button onClick={() => setGmPhase('counting')} className="w-full py-4 rounded-2xl bg-green-600 text-white font-black text-lg flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
              <DownloadCloud className="w-6 h-6" /> GET MAP
            </button>
          )}

          {gmPhase === 'counting' && (
            <div className="flex flex-col items-center gap-2 py-4 bg-muted/20 rounded-2xl border border-border">
              <span className="text-3xl font-black text-primary animate-pulse">{gmCountdown}s</span>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Generating Secure Link...</p>
            </div>
          )}

          {gmPhase === 'revealed' && (
            <div className="py-2 text-center animate-bounce">
              <p className="text-sm font-black text-green-500 uppercase tracking-tight">⬇ Scroll down and press next</p>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-foreground font-black text-sm uppercase flex items-center gap-2"><div className="w-1 h-4 bg-primary rounded-full" /> Detailed Information</h3>
          {map.description.split('\n').filter(p => p.trim() !== '').map((para, idx) => (
             <div key={idx}>
               <p className="text-muted-foreground text-xs leading-relaxed font-medium"><LinkifyText text={para} /></p>
               {idx === 1 && newestMaps[0] && <InlineDownloadCard map={newestMaps[0]} onClick={() => window.location.assign(`/map/${newestMaps[0].id}`)} />}
             </div>
          ))}
        </div>

        <SuggestionsSection popularMaps={popularMaps} trendingMaps={trendingMaps} />

        {/* Phase 2: Next Step (Moved to Bottom) */}
        {gmPhase === 'revealed' && (
           <div className="pt-6 pb-10">
              <button onClick={() => window.location.assign(`/download/${map.id}`)} className="w-full py-5 rounded-2xl bg-primary text-white font-black text-xl flex items-center justify-center gap-2 shadow-2xl animate-bounce">
                NEXT STEP <ArrowRight className="w-6 h-6" />
              </button>
              <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase font-bold tracking-widest opacity-60">Verified Link Ready Below</p>
           </div>
        )}
      </div>
      <div className="h-16" />
    </PageShell>
  );
}
