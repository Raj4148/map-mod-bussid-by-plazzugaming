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
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 py-2.5 flex items-center gap-3">
      <Link href="/" className="text-muted-foreground hover:text-foreground active:scale-90 transition-transform"><ChevronLeft className="w-5 h-5" /></Link>
      <h1 className="text-foreground font-black text-[13px] uppercase tracking-tight line-clamp-1">{title}</h1>
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
    <div className="my-6 bg-muted/20 border border-border/50 rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-all">
      <div className="aspect-[16/9] relative">
        <SafeImage src={map.thumbnail} alt={map.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 text-white">
           <p className="text-[10px] font-black uppercase tracking-wider line-clamp-1">{map.name}</p>
        </div>
      </div>
      <div className="p-3 bg-card/50">
        <button onClick={onClick} className="w-full py-3 bg-primary text-white text-[11px] font-black rounded-xl uppercase shadow-lg shadow-primary/20">GET THIS MOD NOW</button>
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
      <div className="px-3 pt-3 space-y-5">
        <div className="relative rounded-2xl overflow-hidden bg-muted aspect-video shadow-lg border border-border/50">
          <SafeImage src={map.thumbnail} alt={map.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded border border-white/10">
            <span className="text-[8px] font-black text-white uppercase tracking-widest">Premium Map Mod</span>
          </div>
        </div>

        <div className="space-y-4">
          {gmPhase === 'idle' && (
            <button onClick={() => setGmPhase('counting')} className="w-full py-4.5 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 text-white font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-green-500/20 active:scale-95 transition-all">
              <DownloadCloud className="w-6 h-6" /> GET MAP
            </button>
          )}

          {gmPhase === 'counting' && (
            <div className="flex flex-col items-center gap-2 py-5 bg-muted/10 rounded-2xl border border-dashed border-border/60">
              <span className="text-4xl font-black text-primary tabular-nums">{gmCountdown}s</span>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Preparing Secure Data...</p>
            </div>
          )}

          {gmPhase === 'revealed' && (
            <div className="py-2 text-center animate-bounce">
              <p className="text-[11px] font-black text-green-500 uppercase tracking-widest bg-green-500/10 py-2 rounded-lg border border-green-500/20">⬇ Scroll down for Next Step</p>
            </div>
          )}
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-4.5 space-y-4 shadow-sm">
          <h3 className="text-foreground font-black text-xs uppercase flex items-center gap-2 tracking-tight"><div className="w-1 h-3.5 bg-primary rounded-full" /> Detailed Information</h3>
          <div className="space-y-4">
            {(() => {
              const paragraphs = map.description.split('\n').filter(p => p.trim() !== '');
              const totalCards = 5;
              const interval = paragraphs.length > totalCards ? Math.floor(paragraphs.length / totalCards) : 1;

              let cardsPlaced = 0;
              const elements: React.ReactNode[] = [];

              paragraphs.forEach((para, idx) => {
                elements.push(
                  <p key={`p-${idx}`} className="text-muted-foreground text-[12px] leading-relaxed font-bold uppercase opacity-70">
                    <LinkifyText text={para} />
                  </p>
                );

                const shouldPlaceCard = (idx + 1) % interval === 0 && cardsPlaced < totalCards;

                if (shouldPlaceCard) {
                  const cardMap = newestMaps[cardsPlaced];
                  if (cardMap) {
                    cardsPlaced++;
                    elements.push(<InlineDownloadCard key={`inline-card-${idx}`} map={cardMap} onClick={() => window.location.assign(`/map/${cardMap.id}`)} />);
                  }
                }
              });

              // If description was too short to place all 5 cards, append remaining
              while (cardsPlaced < totalCards) {
                const cardMap = newestMaps[cardsPlaced];
                if (cardMap) {
                  cardsPlaced++;
                  elements.push(<InlineDownloadCard key={`extra-card-${cardsPlaced}`} map={cardMap} onClick={() => window.location.assign(`/map/${cardMap.id}`)} />);
                } else {
                  break;
                }
              }

              return elements;
            })()}
          </div>
        </div>

        <SuggestionsSection popularMaps={popularMaps} trendingMaps={trendingMaps} />

        {/* Phase 2: Next Step (Moved to Bottom) */}
        {gmPhase === 'revealed' && (
           <div className="pt-4 pb-12">
              <button onClick={() => window.location.assign(`/download/${map.id}`)} className="w-full py-5 rounded-2xl bg-primary text-white font-black text-xl flex items-center justify-center gap-2 shadow-2xl shadow-primary/30 active:scale-95 transition-all">
                NEXT STEP <ArrowRight className="w-6 h-6" />
              </button>
              <p className="text-[9px] text-center text-muted-foreground mt-4 uppercase font-black tracking-[0.2em] opacity-40">Final security check ahead</p>
           </div>
        )}
      </div>
      <div className="h-12" />
    </PageShell>
  );
}
