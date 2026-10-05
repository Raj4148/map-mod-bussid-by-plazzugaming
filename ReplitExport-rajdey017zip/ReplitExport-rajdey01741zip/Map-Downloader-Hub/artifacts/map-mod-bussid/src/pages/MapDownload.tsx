import { useRoute, Link, useLocation } from 'wouter';
import { useMap, useMaps, MapMod, fmtCount } from '../hooks/useMaps';
import { PageShell } from '../components/Layout';
import { ArrowRight, Flame, AlertTriangle, ShieldCheck, ExternalLink } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { areAdsEnabled, openMonetagDirectLink, MONETAG_DIRECT_LINKS } from '../lib/ads-control';

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

export default function MapDownload() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/download/:id');
  const queryId = new URLSearchParams(window.location.search).get('id');
  const id = params?.id || queryId || '';
  const { map, loading: mapLoading } = useMap(id);
  const { allMaps, loading: allLoading } = useMaps();

  // Overlay state for Step 3
  const [showAdOverlay, setShowAdOverlay] = useState(false);
  const [overlaySeconds, setOverlaySeconds] = useState(10);
  const [skipClickCount, setSkipClickCount] = useState(0);

  useEffect(() => {
    if (map) {
      document.title = `Step 2: Verification - ${map.name} | Plazzu Gaming`;
    }
  }, [map]);

  // 10s Overlay Countdown Timer
  useEffect(() => {
    if (!showAdOverlay) return;
    if (overlaySeconds <= 0) return;

    const timer = setInterval(() => {
      setOverlaySeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showAdOverlay, overlaySeconds]);

  const handleStartContinueFlow = () => {
    // Step 3 Action: Click "Continue" -> Opens Direct Link 3 (11533894) -> Opens 10s Ad Overlay
    openMonetagDirectLink(MONETAG_DIRECT_LINKS.link3);
    setShowAdOverlay(true);
    setOverlaySeconds(10);
    setSkipClickCount(0);
  };

  const handleSkipAdClick = () => {
    if (skipClickCount === 0) {
      // 1st Click on Skip Ad: Opens Direct Link 2 (11385854)
      openMonetagDirectLink(MONETAG_DIRECT_LINKS.link2);
      setSkipClickCount(1);
    } else {
      // 2nd Click on Skip Ad: Skips to Step 4 Ready Page
      setShowAdOverlay(false);
      if (map) {
        setLocation(`/ready/${map.id}`);
      }
    }
  };

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
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-4 bg-primary text-white font-black text-sm rounded-xl uppercase shadow-lg shadow-primary/20 active:scale-95 transition-transform"
          >
            Browse All Maps
          </Link>
          <SuggestionsSection popularMaps={popularMaps} trendingMaps={trendingMaps} />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 py-2.5">
        <h1 className="text-foreground font-black text-[12px] uppercase text-center tracking-tighter line-clamp-1">Step 2: {map.name}</h1>
      </div>

      <div className="px-3 pt-6 pb-20 flex flex-col items-center text-center space-y-6">
        <div className="bg-card border border-border/50 rounded-3xl p-6 flex flex-col items-center gap-3 text-center shadow-sm w-full">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-foreground font-black text-[14px] uppercase tracking-tight">Verification Required</h3>
            <p className="text-muted-foreground text-[10px] font-bold leading-relaxed uppercase opacity-60">Click Continue below to generate your direct link.</p>
          </div>
        </div>

        {/* Sponsor Banner Card */}
        <div className="w-full bg-card border border-border/60 rounded-3xl overflow-hidden shadow-lg relative group">
          <div className="aspect-[16/9] relative">
            <img src="/cat-other.jpg" alt="Sponsor" className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end p-4 text-white space-y-2 bg-gradient-to-t from-black/85 via-transparent to-transparent">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20 shadow-xl">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div className="w-full py-2.5 bg-red-600 font-black text-[10px] rounded-xl uppercase tracking-widest shadow-xl text-center">
                DOWNLOAD PREMIUM MAPS
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button (Triggers 7s Overlay) */}
        <button
          onClick={handleStartContinueFlow}
          className="w-full py-5 rounded-2xl bg-primary text-white font-black text-lg flex items-center justify-center gap-2 shadow-2xl shadow-primary/30 active:scale-95 transition-all uppercase tracking-tight"
        >
          CONTINUE <ArrowRight className="w-6 h-6" />
        </button>

        <div className="text-left bg-muted/10 rounded-2xl p-5 border border-border/40 w-full">
          <h4 className="text-foreground font-black text-[9px] uppercase tracking-[0.2em] mb-2 opacity-40">Info: Free Download Support</h4>
          <div className="text-muted-foreground text-[10px] leading-relaxed font-bold uppercase opacity-60">
            <p>Our server costs are covered by sponsors. This allows us to keep map downloads 100% free and fast for everyone. Thank you for your support!</p>
          </div>
        </div>

        <SuggestionsSection popularMaps={popularMaps} trendingMaps={trendingMaps} />
      </div>

      {/* ─── Step 3: 7s Ad Overlay Modal ─── */}
      {showAdOverlay && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-sm w-full text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="space-y-2">
              <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                SPONSORED VERIFICATION
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight text-foreground">Preparing Download Link</h3>
              <p className="text-xs text-muted-foreground font-medium">Please wait while we establish direct server connectivity.</p>
            </div>

            {/* Countdown / Skip Ad State */}
            {overlaySeconds > 0 ? (
              <div className="py-6 bg-muted/20 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2">
                <span className="text-4xl font-black text-primary tabular-nums">{overlaySeconds}s</span>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sponsored Ad Overlay</p>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleSkipAdClick}
                  className="w-full py-4.5 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-black text-sm rounded-2xl uppercase tracking-wider shadow-xl shadow-green-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {skipClickCount === 0 ? (
                    <>SKIP AD <ExternalLink className="w-4 h-4" /></>
                  ) : (
                    <>CLICK AGAIN TO CONTINUE <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                  {skipClickCount === 0 ? 'Click Skip Ad to proceed to download' : 'Final click to skip ad'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="h-10" />
    </PageShell>
  );
}
