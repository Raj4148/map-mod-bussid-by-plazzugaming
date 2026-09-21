import { useRoute, Link } from 'wouter';
import { useMap, useMaps, MapMod, fmtCount } from '../hooks/useMaps';
import { PageShell } from '../components/Layout';
import { ChevronLeft, ArrowRight, Flame, X } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { areAdsEnabled, injectDownloadPopunder } from '../lib/ads-control';

function SafeImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} referrerPolicy="no-referrer" className={className} />;
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
          <Link key={m.id} href={`/map/${m.id}`} className="bg-card border border-border/50 rounded-xl overflow-hidden">
            <div className="aspect-[16/10] overflow-hidden relative"><SafeImage src={m.thumbnail} alt={m.name} className="w-full h-full object-cover" /></div>
            <div className="p-2"><p className="text-foreground font-bold text-[10px] line-clamp-1">{m.name}</p></div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AdOverlay({ onComplete }: { onComplete: () => void }) {
  const [seconds, setSeconds] = useState(15);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => { setSeconds((p) => { if (p <= 1) { clearInterval(timer); setIsReady(true); return 0; } return p - 1; }); }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
      <div className="absolute top-0 left-0 right-0 p-4 border-b border-border bg-card/50 flex justify-between items-center">
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sponsored Content</span>
        {!isReady ? (
          <div className="text-xs font-bold text-foreground bg-muted px-4 py-2 rounded-xl">Please wait <span className="text-primary font-black">{seconds}s</span>...</div>
        ) : (
          <button onClick={onComplete} className="flex items-center gap-2 text-xs font-black bg-primary text-white px-5 py-2.5 rounded-xl animate-bounce">SKIP AD & CONTINUE <X className="w-4 h-4" /></button>
        )}
      </div>
      <div className="w-full max-w-sm space-y-8 text-center mt-12">
        <h2 className="text-2xl font-black">Link is generating...</h2>
        <div className="relative aspect-[4/5] bg-card border rounded-[2.5rem] overflow-hidden shadow-2xl">
          <img src="/cat-other.jpg" alt="Sponsor" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-end p-10 text-white space-y-6">
             <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20"><Flame className="w-10 h-10 text-orange-500" /></div>
             <div className="w-full py-4 bg-red-600 font-black text-sm rounded-2xl uppercase">Interacting supports us</div>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Tap to start download immediately</p>
      </div>
    </div>
  );
}

export default function MapDownload() {
  const [, params] = useRoute('/download/:id');
  const id = params?.id || '';
  const { map, loading: mapLoading } = useMap(id);
  const { allMaps, loading: allLoading } = useMaps();
  const [showAdOverlay, setShowAdOverlay] = useState(false);

  useEffect(() => {
    if (map) {
      document.title = `Step 2: Processing ${map.name} | Plazzu Gaming`;
      injectDownloadPopunder();
    }
  }, [map]);

  const popularMaps = useMemo(() => [...allMaps].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 8), [allMaps]);
  const trendingMaps = useMemo(() => [...allMaps].sort((a, b) => b.downloadCount - a.downloadCount).slice(8, 16), [allMaps]);

  if (mapLoading || allLoading) return <PageShell><div className="p-8 text-center">Loading...</div></PageShell>;
  if (!map) return <PageShell><div className="p-8 text-center">Map Not Found</div></PageShell>;

  return (
    <PageShell>
      {showAdOverlay && <AdOverlay onComplete={() => window.location.assign(`/ready/${map.id}`)} />}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3">
        <h1 className="text-foreground font-black text-xs uppercase text-center tracking-tighter">Security Check: {map.name}</h1>
      </div>

      <div className="px-4 pt-6 pb-20 flex flex-col items-center text-center space-y-8">
        <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center gap-4 text-center shadow-sm w-full">
          <ArrowRight className="w-12 h-12 text-primary animate-pulse" />
          <h3 className="text-foreground font-black text-lg uppercase tracking-tight">Final security verification</h3>
          <p className="text-muted-foreground text-xs font-bold leading-relaxed uppercase opacity-60">Generate your direct mediafire link by tapping the button below.</p>
        </div>

        <button onClick={() => setShowAdOverlay(true)} className="w-full py-5 rounded-2xl bg-primary text-white font-black text-xl flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition-all">
          CONTINUE TO DOWNLOAD <ArrowRight className="w-6 h-6" />
        </button>

        <div className="mt-8 text-left bg-muted/20 rounded-2xl p-6 border border-border/50">
          <h4 className="text-foreground font-black text-[10px] uppercase tracking-widest mb-4 opacity-40">Information: Why we show ads?</h4>
          <div className="text-muted-foreground text-[10px] leading-relaxed font-bold uppercase opacity-60">
            <p>We provide 100% free BUSSID map mods for our community. To keep our high-speed 5G servers running and support creators, we use minimal advertisements. Thank you for your patience!</p>
          </div>
        </div>

        <SuggestionsSection popularMaps={popularMaps} trendingMaps={trendingMaps} />
      </div>
    </PageShell>
  );
}
