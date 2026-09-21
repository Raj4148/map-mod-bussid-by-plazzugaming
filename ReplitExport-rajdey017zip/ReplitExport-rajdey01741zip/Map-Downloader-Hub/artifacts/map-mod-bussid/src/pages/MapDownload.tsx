import { useRoute, Link } from 'wouter';
import { useMap, useMaps, MapMod, fmtCount } from '../hooks/useMaps';
import { PageShell } from '../components/Layout';
import {
  ChevronLeft, DownloadCloud, ArrowRight, Flame, X
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { areAdsEnabled, injectPopunder } from '../lib/ads-control';

function SafeImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={className} />;
}

function StickyHeader({ onBack, title }: { onBack?: () => void; title: string; }) {
  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
      <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors"><ChevronLeft className="w-5 h-5" /></button>
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
            <div className="aspect-[16/10] overflow-hidden relative">
              <SafeImage src={m.thumbnail} alt={m.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-2">
              <p className="text-foreground font-bold text-[10px] line-clamp-1">{m.name}</p>
              <span className="text-[8px] text-muted-foreground">📥 {fmtCount(m.downloadCount)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AdOverlay({ onComplete, adLink }: { onComplete: () => void; adLink: string }) {
  const [seconds, setSeconds] = useState(15);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => { setSeconds((p) => { if (p <= 1) { clearInterval(timer); setIsReady(true); return 0; } return p - 1; }); }, 1000);
    return () => clearInterval(timer);
  }, []);
  const [skipClicks, setSkipClicks] = useState(0);
  const handleSkip = () => {
    if (skipClicks === 0 && areAdsEnabled()) {
      window.open('https://omg10.com/4/11696301', '_blank', 'noopener');
      setSkipClicks(1);
      window.focus();
    } else { onComplete(); }
  };
  return (
    <div className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 right-0 p-4 border-b border-border bg-card/50 flex justify-between items-center">
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /><span className="text-[10px] font-black text-muted-foreground uppercase">Sponsored Ad</span></div>
        {!isReady ? (
          <div className="text-xs font-bold text-foreground bg-muted px-4 py-2 rounded-xl">Please wait <span className="text-primary font-black">{seconds}s</span>...</div>
        ) : (
          <button onClick={handleSkip} className="flex items-center gap-2 text-xs font-black bg-primary text-white px-5 py-2.5 rounded-xl">Skip Ad & Get Link <X className="w-4 h-4" /></button>
        )}
      </div>
      <div className="w-full max-w-sm space-y-8 text-center mt-12">
        <h2 className="text-2xl font-black">Your link is ready!</h2>
        <div onClick={() => { if(areAdsEnabled()) window.open(adLink, '_blank'); window.focus(); }} className="relative aspect-[4/5] bg-card border rounded-[2.5rem] overflow-hidden shadow-2xl cursor-pointer">
          <img src="/cat-other.jpg" alt="Sponsor" className="w-full h-full object-cover" />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-end p-10 text-white space-y-6">
             <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20"><Flame className="w-10 h-10 text-orange-500" /></div>
             <div><p className="font-black text-2xl">BUSSID Premium</p><p className="text-white/70 text-xs font-medium">Daily New Map Releases Hub</p></div>
             <div className="w-full py-4 bg-red-600 font-black text-sm rounded-2xl">GET MODS <ArrowRight className="w-4 h-4 inline" /></div>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground">Ads help maintain our high-speed servers. Thank you!</p>
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

  useEffect(() => { injectPopunder(); window.scrollTo(0, 0); }, []);

  const popularMaps = useMemo(() => [...allMaps].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 8), [allMaps]);
  const trendingMaps = useMemo(() => [...allMaps].sort((a, b) => b.downloadCount - a.downloadCount).slice(8, 16), [allMaps]);

  if (mapLoading || allLoading) return <PageShell><div className="p-8 text-center">Loading...</div></PageShell>;
  if (!map) return <PageShell><div className="p-8 text-center">Map Not Found</div></PageShell>;

  const handleContinue = () => {
    if (areAdsEnabled()) { setShowAdOverlay(true); }
    else { window.location.assign(`/ready/${map.id}`); }
  };

  const handleAdOverlayComplete = () => { window.location.assign(`/ready/${map.id}`); };

  return (
    <PageShell>
      {showAdOverlay && <AdOverlay adLink="https://omg10.com/4/11533894" onComplete={handleAdOverlayComplete} />}
      <StickyHeader onBack={() => window.history.back()} title={map.name} />
      <div className="px-4 pt-6 pb-20 flex flex-col items-center text-center">
        <div className="w-full space-y-6">
          <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
            <ArrowRight className="w-12 h-12 text-primary animate-pulse" /><h3 className="text-foreground font-black text-lg">Next step ready</h3>
            <p className="text-muted-foreground text-sm">Tap the button below to generate your download link.</p>
          </div>
          <button onClick={handleContinue} className="w-full py-5 rounded-2xl bg-primary text-white font-black text-lg flex items-center justify-center gap-2 shadow-xl">Continue <ArrowRight className="w-5 h-5" /></button>
          <div className="mt-8 text-left bg-muted/30 rounded-2xl p-6 border border-border/50">
            <h4 className="text-foreground font-bold text-sm mb-4">Why Download BUSSID Map Mods from Plazzu Gaming?</h4>
            <div className="text-muted-foreground text-[11px] leading-relaxed space-y-4">
              <p><strong>Bus Simulator Indonesia (BUSSID)</strong> is a massive cultural phenomenon. Custom <strong>BUSSID Map Mods</strong> transform your routes into specialized terrains. Navigating <strong>Indian Map Mods</strong> or <strong>Nepali Hill Roads</strong> provides the most immersive experience today.</p>
              <p>Navigating a heavy bus through extreme muddy paths near Pokhara tests your precision. Each mod is carefully vetted for compatibility. Get ready to take your virtual driving career to the next level with our premium <strong>BUSSID Map Mods</strong>!</p>
            </div>
          </div>
        </div>
        <SuggestionsSection popularMaps={popularMaps} trendingMaps={trendingMaps} />
      </div>
    </PageShell>
  );
}
