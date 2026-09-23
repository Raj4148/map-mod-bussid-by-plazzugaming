import { useRoute, Link } from 'wouter';
import { useMap, useMaps, MapMod, fmtCount } from '../hooks/useMaps';
import { PageShell } from '../components/Layout';
import { ChevronLeft, ArrowRight, Flame, X, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { areAdsEnabled } from '../lib/ads-control';

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
          <a key={m.id} href={`/index.html?id=${m.id}`} className="bg-card border border-border/50 rounded-xl overflow-hidden">
            <div className="aspect-[16/10] overflow-hidden relative"><SafeImage src={m.thumbnail} alt={m.name} className="w-full h-full object-cover" /></div>
            <div className="p-2"><p className="text-foreground font-bold text-[10px] line-clamp-1">{m.name}</p></div>
          </a>
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
    <div className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-2xl flex flex-col items-center justify-center p-3 animate-in fade-in duration-500">
      <div className="absolute top-0 left-0 right-0 p-3.5 border-b border-border bg-card/50 backdrop-blur-md flex justify-between items-center">
        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Sponsored Ad</span>
        {!isReady ? (
          <div className="text-[10px] font-black text-foreground bg-muted/80 px-3 py-1.5 rounded-lg border border-border/50">
            WAIT <span className="text-primary tabular-nums">{seconds}s</span>
          </div>
        ) : (
          <button onClick={onComplete} className="flex items-center gap-1.5 text-[10px] font-black bg-primary text-white px-4 py-2 rounded-lg animate-pulse shadow-lg shadow-primary/20">
            SKIP & CONTINUE <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <div className="w-full max-w-xs space-y-6 text-center mt-10">
        <div className="space-y-1">
          <h2 className="text-xl font-black tracking-tighter uppercase">Link Generating...</h2>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider opacity-60">Please wait for the check</p>
        </div>
        <div className="relative aspect-[4/5] bg-card border border-border rounded-[2rem] overflow-hidden shadow-2xl scale-95">
          <img src="/cat-other.jpg" alt="Sponsor" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-end p-8 text-white space-y-4 bg-gradient-to-t from-black/80 via-transparent to-transparent">
             <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-xl"><Flame className="w-8 h-8 text-orange-500" /></div>
             <div className="w-full py-3.5 bg-red-600 font-black text-[11px] rounded-xl uppercase tracking-widest shadow-xl">Support our work</div>
          </div>
        </div>
        <p className="text-[9px] text-muted-foreground font-black tracking-widest uppercase opacity-40">Tap overlay to unlock speed</p>
      </div>
    </div>
  );
}

export default function MapDownload() {
  const [, params] = useRoute('/download/:id');
  const queryId = new URLSearchParams(window.location.search).get('id');
  const id = params?.id || queryId || '';
  const { map, loading: mapLoading } = useMap(id);
  const { allMaps, loading: allLoading } = useMaps();
  const [showAdOverlay, setShowAdOverlay] = useState(false);

  useEffect(() => {
    if (map) {
      document.title = `Step 2: Processing ${map.name} | Plazzu Gaming`;
    }
  }, [map]);

  const popularMaps = useMemo(() => [...allMaps].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 8), [allMaps]);
  const trendingMaps = useMemo(() => [...allMaps].sort((a, b) => b.downloadCount - a.downloadCount).slice(8, 16), [allMaps]);

  if (mapLoading || allLoading) return <PageShell><div className="p-8 text-center font-bold">Verifying Download Request...</div></PageShell>;
  if (!map) {
    return (
      <PageShell>
        <div className="px-4 py-12 text-center max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto border border-primary/20">
            <AlertTriangle className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black uppercase tracking-tight">Map Download Link Not Found</h2>
            <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
              The requested map download link could not be located. Please select a map mod from the catalog below.
            </p>
          </div>
          <a
            href="/index.html"
            className="inline-flex items-center justify-center gap-2 w-full py-4 bg-primary text-white font-black text-sm rounded-xl uppercase shadow-lg shadow-primary/20 active:scale-95 transition-transform"
          >
            Browse All Maps
          </a>
          <SuggestionsSection popularMaps={popularMaps} trendingMaps={trendingMaps} />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {showAdOverlay && <AdOverlay onComplete={() => window.location.href = `/ready.html?id=${map.id}`} />}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 py-2.5">
        <h1 className="text-foreground font-black text-[12px] uppercase text-center tracking-tighter line-clamp-1">Step 2: {map.name}</h1>
      </div>

      <div className="px-3 pt-6 pb-20 flex flex-col items-center text-center space-y-8">
        <div className="bg-card border border-border/50 rounded-3xl p-7 flex flex-col items-center gap-4 text-center shadow-sm w-full">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
            <ArrowRight className="w-7 h-7 text-primary animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-foreground font-black text-[15px] uppercase tracking-tight">Security Check Required</h3>
            <p className="text-muted-foreground text-[10px] font-bold leading-relaxed uppercase opacity-60">Generate your high-speed link by tapping the button below.</p>
          </div>
        </div>

        <button onClick={() => setShowAdOverlay(true)} className="w-full py-4.5 rounded-2xl bg-primary text-white font-black text-lg flex items-center justify-center gap-2 shadow-2xl shadow-primary/30 active:scale-95 transition-all uppercase tracking-tight">
          CONTINUE TO DOWNLOAD <ArrowRight className="w-5 h-5" />
        </button>

        <div className="text-left bg-muted/10 rounded-2xl p-5 border border-border/40">
          <h4 className="text-foreground font-black text-[9px] uppercase tracking-[0.2em] mb-3 opacity-40">Info: Why show ads?</h4>
          <div className="text-muted-foreground text-[10px] leading-relaxed font-bold uppercase opacity-60">
            <p>Our server costs are covered by sponsors. This allows us to keep map downloads 100% free and fast for everyone. Thank you for your support!</p>
          </div>
        </div>

        <SuggestionsSection popularMaps={popularMaps} trendingMaps={trendingMaps} />
      </div>
      <div className="h-10" />
    </PageShell>
  );
}
