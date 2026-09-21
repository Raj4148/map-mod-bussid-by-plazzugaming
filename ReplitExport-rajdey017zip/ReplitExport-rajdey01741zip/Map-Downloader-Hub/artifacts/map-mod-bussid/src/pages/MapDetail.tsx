import { useRoute, Link, useLocation } from 'wouter';
import { useMap, useMaps, incrementDownloadCount, MapMod, fmtCount } from '../hooks/useMaps';

import { PageShell } from '../components/Layout';
import {
  ChevronLeft, Download, DownloadCloud, Calendar, Tag,
  AlertTriangle, ImageOff, Share2, Flame, Youtube, X, ArrowRight
} from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { areAdsEnabled, injectHomePopunder } from '../lib/ads-control';

/* ── fallback image ── */
const FALLBACK = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop';

/* ── image with graceful error fallback ── */
function SafeImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK);
  const [failed, setFailed] = useState(false);
  useEffect(() => { setImgSrc(src || FALLBACK); setFailed(false); }, [src]);
  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <ImageOff className="w-10 h-10 text-muted-foreground opacity-40" />
      </div>
    );
  }
  return (
    <img
      src={imgSrc} alt={alt}
      referrerPolicy="no-referrer"
      className={className}
      onError={() => (imgSrc !== FALLBACK ? setImgSrc(FALLBACK) : setFailed(true))}
    />
  );
}

/* ── linkify text ── */
function LinkifyText({ text }: { text: string }) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return (
    <>
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-bold underline underline-offset-2 break-all"
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </>
  );
}

/* ── shared sticky header ── */
function StickyHeader({ onBack, title, isLink }: {
  onBack?: () => void;
  title: string;
  isLink?: boolean;
}) {
  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
      {isLink
        ? <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors"><ChevronLeft className="w-5 h-5" /></Link>
        : <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors"><ChevronLeft className="w-5 h-5" /></button>
      }
      <h1 className="text-foreground font-bold text-sm line-clamp-1">{title}</h1>
    </div>
  );
}

/* ── Suggestions Section (Grid Style) ── */
function SuggestionsSection({ popularMaps, trendingMaps }: { popularMaps: MapMod[], trendingMaps: MapMod[] }) {
  const [activeTab, setActiveTab] = useState<'popular' | 'trending'>('popular');

  return (
    <div className="w-full mt-6 space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('popular')}
            className={`text-xs font-black transition-colors ${activeTab === 'popular' ? 'text-primary border-b-2 border-primary pb-1' : 'text-muted-foreground'}`}
          >
            POPULAR
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`text-xs font-black transition-colors ${activeTab === 'trending' ? 'text-primary border-b-2 border-primary pb-1' : 'text-muted-foreground'}`}
          >
            TRENDING
          </button>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter italic">Recommended</span>
      </div>

      <div className="grid grid-cols-2 gap-3 px-1">
        {(activeTab === 'popular' ? popularMaps.slice(0, 6) : trendingMaps.slice(0, 6)).map(m => (
          <Link
            key={m.id}
            href={`/map/${m.id}`}
            className="group relative rounded-xl overflow-hidden bg-card border border-border/50 transition-all hover:border-primary/50 shadow-sm"
          >
            <div className="aspect-[16/10] overflow-hidden relative">
              <SafeImage
                src={m.thumbnail}
                alt={m.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="p-2">
              <p className="text-foreground font-bold text-[10px] leading-tight line-clamp-1 mb-1">{m.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-medium text-muted-foreground">📥 {fmtCount(m.downloadCount)}</span>
                <ArrowRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── Notice Popup ── */
function NoticePopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-card border border-border rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="relative p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-primary" />
          </div>

          <div className="space-y-3">
            <h3 className="text-foreground font-black text-xl">Notice to Our Gamers:</h3>
            <div className="text-muted-foreground text-sm leading-relaxed space-y-4">
              <p>
                All BUSSID map mods on this site are <span className="text-primary font-bold">100% FREE!</span> To cover our server costs and support our map creators, we display sponsor advertisements.
              </p>
              <p>
                Your patience with these ads helps us keep making more awesome free maps for you. Thank you for supporting us!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            I UNDERSTAND
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Inline Download Card ── */
function InlineDownloadCard({ map, onClick }: { map: MapMod; onClick: () => void }) {
  return (
    <div className="my-8 bg-muted/30 border border-border/50 rounded-2xl overflow-hidden shadow-sm animate-in fade-in zoom-in-95 duration-500">
      <div className="aspect-video relative group">
        <SafeImage src={map.thumbnail} alt={map.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="space-y-1">
             <div className="flex items-center gap-1.5">
               <span className="px-1.5 py-0.5 bg-yellow-500 text-black text-[7px] font-black rounded uppercase">Premium Mod</span>
               <span className="text-[7px] font-bold text-white/60 uppercase tracking-widest">Verified Link</span>
             </div>
             <p className="text-xs font-black text-white line-clamp-1 uppercase tracking-tight">{map.name}</p>
          </div>
          <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
            <DownloadCloud className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      <div className="p-4 bg-card/50">
        <button
          onClick={onClick}
          className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-black rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
        >
          <Download className="w-4 h-4" />
          START DOWNLOAD NOW
        </button>
        <p className="text-[8px] text-center text-muted-foreground mt-3 uppercase font-bold tracking-widest opacity-40">Server: High Speed 5G Content Delivery Network</p>
      </div>
    </div>
  );
}

/* ── countdown durations ── */
const GM_TIMER_SECONDS = 15;

export default function MapDetail() {
  const [, params] = useRoute('/map/:id');
  const [, setLocation] = useLocation();
  const id = params?.id || '';
  const { map, loading: mapLoading } = useMap(id);
  const { toast } = useToast();
  const { allMaps, loading: allLoading } = useMaps();
  const loading = mapLoading || allLoading;

  const popularMaps = useMemo(() =>
    [...allMaps].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 8),
  [allMaps]);

  const trendingMaps = useMemo(() =>
    [...allMaps].sort((a, b) => b.downloadCount - a.downloadCount).slice(8, 16),
  [allMaps]);

  const newestMaps = useMemo(() =>
    allMaps.filter(m => m.id !== id).sort((a, b) => b.createdAt - a.createdAt).slice(0, 5),
  [allMaps, id]);

  /* Dynamic SEO Tags */
  useEffect(() => {
    if (map) {
      document.title = `${map.name} - BUSSID Map Mod Download | Plazzu Gaming`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', `Download ${map.name} BUSSID map mod. Latest ${map.category} map for Bus Simulator Indonesia. High speed free download available!`);
      }
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', `https://plazzugamingmaps.xyz/map/${map.id}`);
    }
  }, [map]);

  const [showNotice, setShowNotice] = useState(false);
  useEffect(() => {
    const hasSeenNotice = sessionStorage.getItem('has_seen_notice_popup');
    if (!hasSeenNotice) {
      const timer = setTimeout(() => {
        setShowNotice(true);
        sessionStorage.setItem('has_seen_notice_popup', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [id]);

  useEffect(() => { injectHomePopunder(); }, []);

  type GmPhase = 'idle' | 'counting' | 'revealed';
  const [gmPhase, setGmPhase] = useState<GmPhase>('idle');
  const [gmCountdown, setGmCountdown] = useState(GM_TIMER_SECONDS);
  const gmTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (gmPhase !== 'counting') return;
    gmTimerRef.current = setInterval(() => {
      setGmCountdown((c) => {
        if (c <= 1) { clearInterval(gmTimerRef.current!); setGmPhase('revealed'); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => { if (gmTimerRef.current) clearInterval(gmTimerRef.current); };
  }, [gmPhase]);

  const handleGetMap = (e: React.MouseEvent) => {
    setGmPhase('counting');
    if (areAdsEnabled()) { window.open('https://omg10.com/4/11401834', '_blank', 'noopener'); }
    window.focus();
  };

  const handleNextStep = (e: React.MouseEvent) => {
    if (!map) return;
    if (areAdsEnabled()) { window.open('https://omg10.com/4/11696301', '_blank', 'noopener'); }
    // Redirect to index2 (Step 3/4)
    setLocation(`/download/${map.id}`);
  };

  if (loading) {
    return (
      <PageShell>
        <div className="px-4 pt-4 animate-pulse space-y-4">
          <div className="h-6 w-24 bg-muted rounded" />
          <div className="rounded-2xl bg-muted w-full" style={{ aspectRatio: '16/9' }} />
          <div className="h-8 bg-muted rounded w-3/4" />
        </div>
      </PageShell>
    );
  }

  if (!map) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4 opacity-60" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Map Not Found</h1>
          <Link href="/" className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm">Return Home</Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {showNotice && <NoticePopup onClose={() => setShowNotice(false)} />}
      <StickyHeader title={map.name} isLink />
      <div className="relative mx-4 rounded-2xl overflow-hidden bg-muted" style={{ aspectRatio: '16/9' }}>
        <SafeImage src={map.thumbnail} alt={map.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 rounded text-[10px] font-black text-yellow-400 uppercase tracking-widest border border-yellow-500/30">MAP MOD BUSSID</div>
      </div>
      {map.thumbnail2 && (
        <div className="relative mx-4 mt-3 rounded-2xl overflow-hidden bg-muted" style={{ aspectRatio: '16/9' }}>
          <SafeImage src={map.thumbnail2} alt={`${map.name} preview 2`} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="mx-4 mt-4">
        {gmPhase === 'idle' && (
          <button
            onClick={handleGetMap}
            className="w-full py-4 rounded-2xl font-black text-base text-white flex items-center justify-center gap-2 active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', boxShadow: '0 0 24px rgba(22,163,74,0.45)' }}
          >
            <DownloadCloud className="w-5 h-5" /> Get Map
          </button>
        )}
        {gmPhase === 'counting' && (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 26}`} strokeDashoffset={`${2 * Math.PI * 26 * (gmCountdown / GM_TIMER_SECONDS)}`} style={{ transition: 'stroke-dashoffset 1s linear' }} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-foreground font-black text-xl">{gmCountdown}</span>
            </div>
            <p className="text-muted-foreground text-xs font-medium">Preparing your link…</p>
          </div>
        )}
        {gmPhase === 'revealed' && (
          <p className="py-2 text-center text-sm text-green-500 dark:text-green-400 animate-pulse">
            <strong className="font-black">⬇ Scroll down &amp; click Next</strong>
          </p>
        )}
        <SuggestionsSection popularMaps={popularMaps} trendingMaps={trendingMaps} />
      </div>
      <div className="px-4 mt-4 space-y-4">
        <h2 className="text-foreground font-black text-xl leading-tight">{map.name}</h2>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 bg-card border border-border rounded-xl px-3 py-2">
            <DownloadCloud className="w-4 h-4 text-primary" />
            <span className="text-foreground text-xs font-bold">{map.downloadCount.toLocaleString()} Downloads</span>
          </div>
          <div className="flex items-center gap-1.5 bg-card border border-border rounded-xl px-3 py-2">
            <Tag className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            <span className="text-foreground text-xs font-bold capitalize">{map.category}</span>
          </div>
        </div>
        {map.description && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-foreground font-black text-sm mb-5 flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" /> Detailed Information
            </h3>
            <div className="space-y-4">
              {(() => {
                const paragraphs = map.description.split('\n').filter(p => p.trim() !== '');
                const totalCards = 5;
                const interval = paragraphs.length > totalCards ? Math.floor(paragraphs.length / totalCards) : 1;
                let cardsPlaced = 0;
                const elements: React.ReactNode[] = [];
                paragraphs.forEach((para, idx) => {
                  elements.push(<p key={`p-${idx}`} className="text-muted-foreground text-[13px] leading-relaxed font-medium"><LinkifyText text={para} /></p>);
                  const shouldPlaceCard = (idx + 1) % interval === 0 && cardsPlaced < totalCards;
                  if (shouldPlaceCard) {
                    const cardMap = newestMaps[cardsPlaced] || map;
                    cardsPlaced++;
                    elements.push(<InlineDownloadCard key={`inline-card-${idx}`} map={cardMap} onClick={() => setLocation(`/map/${cardMap.id}`)} />);
                  }
                });
                while (cardsPlaced < totalCards) {
                  const cardMap = newestMaps[cardsPlaced] || map;
                  cardsPlaced++;
                  elements.push(<InlineDownloadCard key={`extra-card-${cardsPlaced}`} map={cardMap} onClick={() => setLocation(`/map/${cardMap.id}`)} />);
                }
                return elements;
              })()}
            </div>
          </div>
        )}
        {gmPhase === 'revealed' && (
          <button onClick={handleNextStep} className="w-full py-5 rounded-2xl bg-primary hover:bg-purple-500 active:scale-95 transition-all text-white font-black text-lg flex flex-col items-center justify-center gap-1" style={{ boxShadow: '0 0 24px rgba(139,92,246,0.4)' }}>
            <span className="flex items-center gap-2"><Download className="w-6 h-6" /> Next</span>
            <span className="text-xs font-medium text-white/60 uppercase tracking-widest">Tap to start</span>
          </button>
        )}
      </div>
      <div className="h-16" />
    </PageShell>
  );
}
