import { useRoute, Link } from 'wouter';
import { useMap, useMaps, MapMod, fmtCount } from '../hooks/useMaps';
import { PageShell } from '../components/Layout';
import { ChevronLeft, ArrowRight, Flame, AlertTriangle } from 'lucide-react';
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
          <a key={m.id} href={`/index.html?id=${m.id}`} className="bg-card border border-border/50 rounded-xl overflow-hidden">
            <div className="aspect-[16/10] overflow-hidden relative"><SafeImage src={m.thumbnail} alt={m.name} className="w-full h-full object-cover" /></div>
            <div className="p-2"><p className="text-foreground font-bold text-[10px] line-clamp-1">{m.name}</p></div>
          </a>
        ))}
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

  const [seconds, setSeconds] = useState(15);
  const [isReady, setIsReady] = useState(() => !areAdsEnabled());

  useEffect(() => {
    injectDownloadPopunder();
    if (map) {
      document.title = `Step 2: Processing ${map.name} | Plazzu Gaming`;
    }
  }, [map]);

  useEffect(() => {
    if (!areAdsEnabled()) {
      setIsReady(true);
      setSeconds(0);
      return;
    }
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const handleContinue = () => {
    window.location.href = `/ready.html?id=${map.id}`;
  };

  return (
    <PageShell>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 py-2.5">
        <h1 className="text-foreground font-black text-[12px] uppercase text-center tracking-tighter line-clamp-1">Step 2: {map.name}</h1>
      </div>

      <div className="px-3 pt-6 pb-20 flex flex-col items-center text-center space-y-6">
        <div className="bg-card border border-border/50 rounded-3xl p-6 flex flex-col items-center gap-3 text-center shadow-sm w-full">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
            <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-foreground font-black text-[14px] uppercase tracking-tight">Security Check Required</h3>
            <p className="text-muted-foreground text-[10px] font-bold leading-relaxed uppercase opacity-60">Generate your high-speed link below.</p>
          </div>
        </div>

        {/* Sponsor Banner Card with text "download premium maps" */}
        <div className="w-full bg-card border border-border/60 rounded-3xl overflow-hidden shadow-lg relative group">
          <div className="aspect-[16/9] relative">
            <img src="/cat-other.jpg" alt="Sponsor" className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end p-4 text-white space-y-2 bg-gradient-to-t from-black/85 via-transparent to-transparent">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20 shadow-xl">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div className="w-full py-2.5 bg-red-600 font-black text-[10px] rounded-xl uppercase tracking-widest shadow-xl text-center">
                download premium maps
              </div>
            </div>
          </div>
        </div>

        {/* 15-Second Auto Timer / Continue Button */}
        {!isReady ? (
          <div className="w-full py-5 px-6 rounded-2xl bg-muted/20 border border-primary/40 flex flex-col items-center justify-center gap-2 animate-pulse shadow-inner">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-primary tabular-nums">{seconds}s</span>
            </div>
            <p className="text-[11px] font-black text-foreground uppercase tracking-wider">Generating Secure Download Link...</p>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">Please wait for verification</p>
          </div>
        ) : (
          <button
            onClick={handleContinue}
            className="w-full py-5 rounded-2xl bg-primary text-white font-black text-lg flex items-center justify-center gap-2 shadow-2xl shadow-primary/30 active:scale-95 transition-all uppercase tracking-tight animate-bounce"
          >
            CONTINUE TO DOWNLOAD <ArrowRight className="w-6 h-6" />
          </button>
        )}

        <div className="text-left bg-muted/10 rounded-2xl p-5 border border-border/40 w-full">
          <h4 className="text-foreground font-black text-[9px] uppercase tracking-[0.2em] mb-2 opacity-40">Info: Why show ads?</h4>
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
