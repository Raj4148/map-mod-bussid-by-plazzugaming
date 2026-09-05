import { useRoute, Link } from 'wouter';
import { useMap, useMaps, useTopMaps, incrementDownloadCount, MapMod, fmtCount } from '../hooks/useMaps';

import { PageShell } from '../components/Layout';
import {
  ChevronLeft, Download, DownloadCloud, Calendar, Tag,
  AlertTriangle, ImageOff, ArrowRight, Share2, Flame, Youtube, X
} from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { areAdsEnabled } from '../lib/ads-control';

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

/* ── Suggestion Card ── */
function SuggestionCard({ map }: { map: MapMod }) {
  return (
    <Link
      href={`/map/${map.id}`}
      className="flex-shrink-0 w-36 group relative rounded-xl overflow-hidden bg-card border border-border/50 transition-all hover:border-primary/50"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <SafeImage
          src={map.thumbnail}
          alt={map.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
      </div>
      <div className="p-2">
        <p className="text-foreground font-bold text-[10px] leading-tight line-clamp-2 mb-1">{map.name}</p>
        <p className="text-muted-foreground text-[8px] flex items-center gap-1">
          📥 {fmtCount(map.downloadCount)}
        </p>
      </div>
    </Link>
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

/* ── Non-Skippable Ad Overlay (7s Timer) ── */
function AdOverlay({ onComplete, adLink }: { onComplete: () => void; adLink: string }) {
  const [seconds, setSeconds] = useState(7);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
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

  const handleAdClick = () => {
    const SIX_HOURS = 6 * 60 * 60 * 1000;
    const now = Date.now();
    const lastClick = localStorage.getItem('last_direct_link_1_time');

    if (!lastClick || (now - parseInt(lastClick)) > SIX_HOURS) {
      window.open(adLink, '_blank', 'noopener');
      localStorage.setItem('last_direct_link_1_time', now.toString());
    }
  };

  const [skipClicks, setSkipClicks] = useState(0);

  const handleSkip = () => {
    if (skipClicks === 0 && areAdsEnabled()) {
      window.open('https://omg10.com/4/11696301', '_blank', 'noopener');
      setSkipClicks(1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-500">
      {/* Top Bar with Timer/Skip */}
      <div className="absolute top-0 left-0 right-0 p-4 border-b border-border bg-card/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sponsored Ad</span>
        </div>
        {!isReady ? (
          <div className="text-xs font-bold text-foreground bg-muted px-4 py-2 rounded-xl border border-border">
            Please wait <span className="text-primary font-black">{seconds}s</span> to skip...
          </div>
        ) : (
          <button
            onClick={handleSkip}
            className="flex items-center gap-2 text-xs font-black bg-primary text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all animate-in zoom-in-95"
          >
            Skip Ad & Get Link
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="w-full max-w-sm space-y-8 text-center mt-12">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-foreground">Your link is ready!</h2>
          <p className="text-muted-foreground text-sm">Please support our community by interacting with the sponsor below.</p>
        </div>

        {/* Ad Body / Vignette Trigger Area */}
        <div
          onClick={handleAdClick}
          className="relative aspect-[4/5] bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 z-10" />
          <img
            src="/cat-other.jpg"
            alt="Sponsor Content"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-end p-10 text-white space-y-6">
             <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20">
                 <Flame className="w-10 h-10 text-orange-500 animate-bounce" />
             </div>
             <div className="space-y-2">
               <p className="font-black text-2xl">BUSSID Premium</p>
               <p className="text-white/70 text-xs font-medium">Daily New Map Releases Hub</p>
             </div>
             <div className="w-full py-4 bg-red-600 text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:bg-red-700 transition-colors">
               GET MODS
               <ArrowRight className="w-4 h-4" />
             </div>
          </div>

          <div className="absolute top-6 left-6 z-20 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
            <span className="text-[8px] font-bold text-white uppercase tracking-widest">Advertisement</span>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground max-w-[220px] mx-auto leading-relaxed">
          Ads help maintain our high-speed servers for free downloads. Thank you!
        </p>
      </div>
    </div>
  );
}

/* ── countdown durations ── */
const GM_TIMER_SECONDS = 5;
const FINAL_TIMER_SECONDS = 5;

export default function MapDetail() {
  const [, params] = useRoute('/map/:id');
  const id = params?.id || '';
  const { map, loading: mapLoading } = useMap(id);
  const { toast } = useToast();

  // Optimization: Fetch all maps once and derive lists locally
  const { allMaps, loading: allLoading } = useMaps();

  const loading = mapLoading || allLoading;

  const popularMaps = useMemo(() =>
    [...allMaps].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 8),
  [allMaps]);

  const trendingMaps = useMemo(() =>
    [...allMaps].sort((a, b) => b.downloadCount - a.downloadCount).slice(8, 16),
  [allMaps]);

  const [showNotice, setShowNotice] = useState(false);
  const [showAdOverlay, setShowAdOverlay] = useState(false);

  /* Trigger Notice popup after 3 seconds on first visit to detail page */
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

  /* Get Map unlock phase */
  type GmPhase = 'idle' | 'counting' | 'revealed';
  const [gmPhase, setGmPhase]         = useState<GmPhase>('idle');
  const [gmCountdown, setGmCountdown] = useState(GM_TIMER_SECONDS);
  const gmTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Download countdown phases */
  type DlPhase = 'idle' | 'intermediate' | 'final_step' | 'ready';
  const [dlPhase, setDlPhase]         = useState<DlPhase>('idle');
  const [dlCountdown, setDlCountdown] = useState(FINAL_TIMER_SECONDS);
  const dlTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Reset state when navigating to a different map */
  useEffect(() => {
    setGmPhase('idle');
    setGmCountdown(GM_TIMER_SECONDS);
    setDlPhase('idle');
    setDlCountdown(FINAL_TIMER_SECONDS);
    setShowAdOverlay(false);
    if (gmTimerRef.current) clearInterval(gmTimerRef.current);
    if (dlTimerRef.current) clearInterval(dlTimerRef.current);
    window.scrollTo(0, 0);
  }, [id]);

  /* Scroll to top when moving to download screens */
  useEffect(() => {
    if (dlPhase !== 'idle') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [dlPhase]);

  useEffect(() => {
    return () => {
      if (gmTimerRef.current) clearInterval(gmTimerRef.current);
      if (dlTimerRef.current) clearInterval(dlTimerRef.current);
    };
  }, []);

  /* Get Map 5-second reveal timer */
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

  /* Download countdown timer (Final Step) */
  useEffect(() => {
    if (dlPhase !== 'final_step') return;

    dlTimerRef.current = setInterval(() => {
      setDlCountdown((c) => {
        if (c <= 1) { clearInterval(dlTimerRef.current!); setDlPhase('ready'); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => { if (dlTimerRef.current) clearInterval(dlTimerRef.current); };
  }, [dlPhase]);

  const handleGetMap = () => {
    setGmPhase('counting');
  };

  const handleNextStep = () => {
    if (!map) return;
    // Move to intermediate step ("Continue")
    setDlPhase('intermediate');
  };

  const handleContinueToCountdown = () => {
    // If ads are enabled, trigger the custom overlay instead of the 5s timer
    if (areAdsEnabled()) {
      setShowAdOverlay(true);
    } else {
      setDlCountdown(FINAL_TIMER_SECONDS);
      setDlPhase('final_step');
    }
  };

  const handleAdOverlayComplete = () => {
    setShowAdOverlay(false);
    // Directly go to ready state as requested
    setDlPhase('ready');
  };

  const handleFinalDownload = () => {
    if (!map || !map.downloadUrl || map.downloadUrl === '#') return;
    incrementDownloadCount(map.id);

    // Open Monetag Direct Link 4
    if (areAdsEnabled()) {
      const SIX_HOURS = 6 * 60 * 60 * 1000;
      const now = Date.now();
      const lastClick = localStorage.getItem('last_direct_link_2_time');

      if (!lastClick || (now - parseInt(lastClick)) > SIX_HOURS) {
        window.open('https://omg10.com/4/11385953', '_blank', 'noopener');
        localStorage.setItem('last_direct_link_2_time', now.toString());
      }
    }

    const fileUrl = map.downloadUrl;
    setTimeout(() => {
      window.location.href = fileUrl;
    }, 300);
  };

  const handleBackFromDownload = () => {
    if (dlTimerRef.current) clearInterval(dlTimerRef.current);
    setDlPhase('idle');
    setDlCountdown(FINAL_TIMER_SECONDS);
    window.scrollTo(0, 0);
  };

  const handleShare = () => {
    if (!map) return;
    const shareUrl = `https://plazzugamingmaps.xyz/map/${map.id}`;
    const shareData = {
      title: map.name,
      text: `Download ${map.name} BUSSID Map Mod!`,
      url: shareUrl,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        // Fallback to clipboard if user cancels or share fails
        navigator.clipboard.writeText(shareUrl);
        toast({ title: "Link copied!", description: "Share link copied to clipboard." });
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Map link copied to clipboard.",
      });
    }
  };

  /* ── loading skeleton ── */
  if (loading) {
    return (
      <PageShell>
        <div className="px-4 pt-4 animate-pulse space-y-4">
          <div className="h-6 w-24 bg-muted rounded" />
          <div className="rounded-2xl bg-muted w-full" style={{ aspectRatio: '16/9' }} />
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      </PageShell>
    );
  }

  /* ── not found ── */
  if (!map) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4 opacity-60" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Map Not Found</h1>
          <p className="text-muted-foreground text-sm mb-6">This map mod doesn't exist or was removed.</p>
          <Link href="/" className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm">
            Return Home
          </Link>
        </div>
      </PageShell>
    );
  }

  /* ══════════════════════════════════════════════════════════════
     DOWNLOAD FLOW SCREENS (Intermediate / Countdown / Ready)
  ══════════════════════════════════════════════════════════════ */
  if (dlPhase !== 'idle') {
    return (
      <PageShell>
        {showAdOverlay && (
          <AdOverlay
            adLink="https://omg10.com/4/11533894"
            onComplete={handleAdOverlayComplete}
          />
        )}
        <StickyHeader onBack={handleBackFromDownload} title={map.name} />

        <div className="px-4 pt-6 pb-20 flex flex-col items-center text-center">

          {/* Phase 1: Intermediate "Continue" */}
          {dlPhase === 'intermediate' && (
            <div className="w-full space-y-6">
              <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
                <ArrowRight className="w-12 h-12 text-primary animate-pulse" />
                <h3 className="text-foreground font-black text-lg">Next step ready</h3>
                <p className="text-muted-foreground text-sm">Tap the button below to generate your download link.</p>
              </div>

              <button
                onClick={handleContinueToCountdown}
                className="w-full py-5 rounded-2xl bg-primary text-white font-black text-lg flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="mt-8 text-left bg-muted/30 rounded-2xl p-6 border border-border/50">
                <h4 className="text-foreground font-bold text-sm mb-4">Why Download BUSSID Map Mods from Plazzu Gaming?</h4>
                <div className="text-muted-foreground text-[11px] leading-relaxed space-y-4">
                  <p>
                    <strong>Bus Simulator Indonesia (BUSSID)</strong> has evolved from a simple driving game into a massive cultural phenomenon, especially in India, Nepal, and Indonesia. One of the key features that keeps the community thriving is the ability to install custom <strong>BUSSID Map Mods</strong>. These mods transform your standard routes into breathtaking journeys across specialized terrains. Whether you are looking for an <strong>Indian Map Mod for BUSSID</strong> featuring the busy streets of Delhi or the treacherous curves of the Himalayan foothills, our collection provides the most immersive experience available today.
                  </p>
                  <p>
                    For those who crave technical driving challenges, the <strong>Nepali BUSSID Map Mod</strong> category is a top choice. These maps often include extreme hilly roads, muddy paths, and narrow bridges that test your precision and control. Navigating a heavy bus through a <strong>Nepali Hill Road Mod</strong> requires a deep understanding of vehicle physics and gear management, making it a favorite among hardcore simulator fans. Our maps are optimized for performance, ensuring that even players on mid-range mobile devices can enjoy high-quality textures and realistic environmental effects without significant frame drops.
                  </p>
                  <p>
                    The <strong>BUSSID Map Mod download</strong> process on our site is designed to be secure and straightforward. We host a variety of unique locations, including authentic <strong>Indonesian Map Mods</strong> that capture the essence of Java, Sumatra, and Bali. From the legendary Kelok 44 sharp turns to the long stretches of the Java Trans-Toll road, the variety is endless. Each mod is carefully vetted to ensure compatibility with the latest version of Bus Simulator Indonesia, so you don't have to worry about game crashes or corrupted files.
                  </p>
                  <p>
                    In addition to geography, many of our <strong>BUSSID Mod</strong> releases include specialized features like custom traffic patterns, realistic weather systems, and regional assets such as local shops, landmarks, and roadside billboards. Using an <strong>Indian Map Mod with Traffic</strong> can completely change how you play, adding the chaos and excitement of real-world Indian highways to your screen. The attention to detail in these mods is what sets <strong>Plazzu Gaming</strong> apart as a leading hub for the BUSSID community.
                  </p>
                  <p>
                    Updating your game with new terrain is essential for maintaining long-term interest. The <strong>Bus Simulator Indonesia Mod Map</strong> scene is constantly innovating, and we pride ourselves on being the first to upload the daily 8:00 PM drops. By choosing our platform, you are joining a global community of virtual drivers who value quality and authenticity. From <strong>Extreme Offroad BUSSID Maps</strong> to relaxing city drives, our catalog caters to every mood and driving style.
                  </p>
                  <p>
                    Keywords like <strong>BUSSID Indian Map download</strong>, <strong>Nepali Bus Simulator Mod</strong>, and <strong>Best BUSSID Maps 2024</strong> are frequently searched because players want the most up-to-date content. We ensure that our SEO-optimized descriptions help you find exactly what you're looking for. Remember, to install these mods, simply download the file, move it to your BUSSID mod folder, and activate it within the game's management menu. Get ready to explore new horizons and take your virtual driving career to the next level with our premium <strong>BUSSID Map Mods</strong>!
                  </p>
                  <p>
                    Our mission is to provide a one-stop-shop for all things BUSSID. Beyond maps, we understand the importance of realistic bus skins, liveries, and vehicle mods that complement your new routes. Using a <strong>Hilly Road Map</strong> with a powerful Indian sleeper bus mod creates an unbeatable simulation atmosphere. Don't forget to check our suggestions section for more <strong>BUSSID Map Mods</strong> that might interest you, and subscribe to our YouTube channel for tutorials on how to install these mods correctly and gameplay showcases of the latest releases.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Phase 2: Final Countdown Timer */}
          {dlPhase === 'final_step' && (
            <div className="w-full space-y-6">
              <div className="w-full rounded-2xl border border-border bg-card p-6 flex flex-col items-center gap-4 my-2">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="44" fill="none"
                      stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 44}`}
                      strokeDashoffset={`${2 * Math.PI * 44 * (1 - (FINAL_TIMER_SECONDS - dlCountdown) / FINAL_TIMER_SECONDS)}`}
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-foreground">{dlCountdown}</span>
                  </div>
                </div>
                <h3 className="text-foreground font-black text-lg mt-2">Final Step</h3>
                <p className="text-muted-foreground text-sm font-medium">
                  Your secure link is arriving in{' '}
                  <span className="text-primary font-bold">{dlCountdown}s</span>…
                </p>
                <p className="text-muted-foreground/40 text-xs text-balance">The file will be ready after this short security check</p>
              </div>
            </div>
          )}

          {/* Phase 3: Final Ready State */}
          {dlPhase === 'ready' && (
            <div className="w-full space-y-6">
              <div className="w-full rounded-2xl border border-border bg-card p-6 flex flex-col items-center gap-4 my-2">
                <p className="text-foreground font-black text-lg">✅ Link ready! Tap Download below.</p>
              </div>

              <button
                onClick={handleFinalDownload}
                className="w-full py-5 rounded-2xl bg-primary hover:bg-purple-500 active:scale-95 transition-all text-white font-black text-lg flex items-center justify-center gap-2"
                style={{
                  boxShadow: '0 0 32px rgba(124,58,237,0.5)',
                }}
              >
                <Download className="w-6 h-6" />
                Download File
              </button>
            </div>
          )}

          <SuggestionsSection popularMaps={popularMaps} trendingMaps={trendingMaps} />

          <button
            onClick={handleBackFromDownload}
            className="text-muted-foreground text-sm underline underline-offset-2 mt-4 mb-10"
          >
            ← Go back
          </button>
        </div>

        <div className="h-16" />
      </PageShell>
    );
  }

  /* ══════════════════════════════════════════════════════════════
     MAIN DETAIL VIEW (idle / get-map flow)
  ══════════════════════════════════════════════════════════════ */
  return (
    <PageShell>
      {showNotice && <NoticePopup onClose={() => setShowNotice(false)} />}
      {showAdOverlay && (
        <AdOverlay
          adLink="https://omg10.com/4/11533894"
          onComplete={handleAdOverlayComplete}
        />
      )}
      <StickyHeader title={map.name} isLink />

      {/* Hero image */}
      <div className="relative mx-4 rounded-2xl overflow-hidden bg-muted" style={{ aspectRatio: '16/9' }}>
        <SafeImage src={map.thumbnail} alt={map.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 rounded text-[10px] font-black text-yellow-400 uppercase tracking-widest border border-yellow-500/30">
          MAP MOD BUSSID
        </div>
        {map.featured && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-black text-white bg-red-500 uppercase">
            HOT
          </div>
        )}
      </div>

      {/* Second image */}
      {map.thumbnail2 && (
        <div className="relative mx-4 mt-3 rounded-2xl overflow-hidden bg-muted" style={{ aspectRatio: '16/9' }}>
          <SafeImage src={map.thumbnail2} alt={`${map.name} preview 2`} className="w-full h-full object-cover" />
        </div>
      )}

      {/* ── Get Map / unlock area ── */}
      <div className="mx-4 mt-4">
        {gmPhase === 'idle' && (
          <button
            onClick={handleGetMap}
            className="w-full py-4 rounded-2xl font-black text-base text-white flex items-center justify-center gap-2 active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', boxShadow: '0 0 24px rgba(22,163,74,0.45)' }}
          >
            <DownloadCloud className="w-5 h-5" />
            Get Map
          </button>
        )}

        {gmPhase === 'counting' && (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
                <circle
                  cx="32" cy="32" r="26" fill="none" stroke="#16a34a" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (gmCountdown / GM_TIMER_SECONDS)}`}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-foreground font-black text-xl">
                {gmCountdown}
              </span>
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
        {/* Title */}
        <h2 className="text-foreground font-black text-xl leading-tight">{map.name}</h2>

        {/* Stats chips */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 bg-card border border-border rounded-xl px-3 py-2">
            <DownloadCloud className="w-4 h-4 text-primary" />
            <span className="text-foreground text-xs font-bold">{map.downloadCount.toLocaleString()} Downloads</span>
          </div>
          <div className="flex items-center gap-1.5 bg-card border border-border rounded-xl px-3 py-2">
            <Tag className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            <span className="text-foreground text-xs font-bold capitalize">{map.category}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-card border border-border rounded-xl px-3 py-2">
            <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="text-foreground text-xs font-bold">
              {new Date(map.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-xl px-3 py-2 text-primary hover:bg-primary/20 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Share</span>
          </button>
        </div>

        {/* Description + mid-content native ad */}
        {map.description && (
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-foreground font-bold text-sm mb-3">Description</h3>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
              <LinkifyText text={map.description} />
            </p>
          </div>
        )}

        {/* Next — revealed after Get Map timer */}
        {gmPhase === 'revealed' && (
          <>
            <button
              onClick={handleNextStep}
              className="w-full py-5 rounded-2xl bg-primary hover:bg-purple-500 active:scale-95 transition-all text-white font-black text-lg flex flex-col items-center justify-center gap-1"
              style={{ boxShadow: '0 0 24px rgba(139,92,246,0.4)' }}
            >
              <span className="flex items-center gap-2">
                <Download className="w-6 h-6" />
                Next
              </span>
              <span className="text-xs font-medium text-white/60 uppercase tracking-widest">Tap to start</span>
            </button>

            <p className="text-xs text-muted-foreground/50 text-center leading-relaxed pb-2">
              By downloading you agree this mod is for BUSSID entertainment purposes only.
            </p>
          </>
        )}
      </div>

      {/* bottom padding so content isn't hidden behind social bar */}
      <div className="h-16" />
    </PageShell>
  );
}
