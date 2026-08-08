import { useRoute, Link } from 'wouter';
import { useMap, useMaps, useTopMaps, incrementDownloadCount, MapMod, fmtCount } from '../hooks/useMaps';

import { PageShell } from '../components/Layout';
import {
  ChevronLeft, Download, DownloadCloud, Calendar, Tag,
  AlertTriangle, ImageOff, ArrowRight, Share2, Flame, Sparkles
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

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
        <img
          src={map.thumbnail || FALLBACK}
          alt={map.name}
          referrerPolicy="no-referrer"
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

/* ── countdown durations ── */
const GM_TIMER_SECONDS = 10;
const DL_TIMER_SECONDS = 15;

export default function MapDetail() {
  const [, params] = useRoute('/map/:id');
  const id = params?.id || '';
  const { map, loading } = useMap(id);
  const { toast } = useToast();

  // Suggestions data
  const { maps: newMaps } = useMaps(undefined, 'newest');
  const { maps: trendingMaps } = useTopMaps(8);

  /* Get Map unlock phase */
  type GmPhase = 'idle' | 'counting' | 'revealed';
  const [gmPhase, setGmPhase]         = useState<GmPhase>('idle');
  const [gmCountdown, setGmCountdown] = useState(GM_TIMER_SECONDS);
  const gmTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Download countdown phases */
  type DlPhase = 'idle' | 'intermediate' | 'counting' | 'ready';
  const [dlPhase, setDlPhase]         = useState<DlPhase>('idle');
  const [dlCountdown, setDlCountdown] = useState(DL_TIMER_SECONDS);
  const dlTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Reset state when navigating to a different map */
  useEffect(() => {
    setGmPhase('idle');
    setGmCountdown(GM_TIMER_SECONDS);
    setDlPhase('idle');
    setDlCountdown(DL_TIMER_SECONDS);
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

  /* Download 15-second countdown timer */
  useEffect(() => {
    if (dlPhase !== 'counting') return;
    dlTimerRef.current = setInterval(() => {
      setDlCountdown((c) => {
        if (c <= 1) { clearInterval(dlTimerRef.current!); setDlPhase('ready'); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => { if (dlTimerRef.current) clearInterval(dlTimerRef.current); };
  }, [dlPhase]);

  const handleGetMap = () => {
    // Open Monetag Direct Link 1
    window.open('https://omg10.com/4/11401834', '_blank', 'noopener');
    setGmPhase('counting');
  };

  const handleNextStep = () => {
    if (!map) return;
    // Move to intermediate step ("Continue")
    setDlPhase('intermediate');
  };

  const handleContinueToCountdown = () => {
    // Open Monetag Direct Link 3
    window.open('https://omg10.com/4/11533894', '_blank', 'noopener');
    setDlCountdown(DL_TIMER_SECONDS);
    setDlPhase('counting');
  };

  const handleFinalDownload = () => {
    if (!map || !map.downloadUrl || map.downloadUrl === '#') return;
    incrementDownloadCount(map.id);

    // Open Monetag Direct Link 4
    window.open('https://omg10.com/4/11385953', '_blank', 'noopener');

    const fileUrl = map.downloadUrl;
    setTimeout(() => {
      window.location.href = fileUrl;
    }, 300);
  };

  const handleBackFromDownload = () => {
    if (dlTimerRef.current) clearInterval(dlTimerRef.current);
    setDlPhase('idle');
    setDlCountdown(DL_TIMER_SECONDS);
    window.scrollTo(0, 0);
  };

  const handleShare = () => {
    if (!map) return;
    const shareData = {
      title: map.name,
      text: `Download ${map.name} BUSSID Map Mod!`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareData.url);
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
        <StickyHeader onBack={handleBackFromDownload} title={map.name} />

        <div className="px-4 pt-6 pb-20 flex flex-col items-center text-center">

          {/* Phase 1: Intermediate "Continue" */}
          {dlPhase === 'intermediate' && (
            <div className="w-full space-y-6">
              <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center gap-4">
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
            </div>
          )}

          {/* Phase 2: Countdown Timer */}
          {dlPhase === 'counting' && (
            <div className="w-full space-y-6">
              <div className="w-full rounded-2xl border border-border bg-card p-6 flex flex-col items-center gap-4 my-2">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="44" fill="none"
                      stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 44}`}
                      strokeDashoffset={`${2 * Math.PI * 44 * (1 - (DL_TIMER_SECONDS - dlCountdown) / DL_TIMER_SECONDS)}`}
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-foreground">{dlCountdown}</span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm font-medium">
                  Your download link is generating in{' '}
                  <span className="text-primary font-bold">{dlCountdown}s</span>…
                </p>
                <p className="text-muted-foreground/40 text-xs">Do not close this page</p>
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

          {/* ── Suggestions Section ── */}
          <div className="w-full mt-10 space-y-10 pb-10">
            {/* New Released */}
            <div className="text-left">
              <h3 className="flex items-center gap-2 text-foreground font-black text-sm mb-4 px-1">
                <Sparkles className="w-4 h-4 text-blue-400" />
                🆕 New Released Maps You Might Like
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-4 px-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                {newMaps.slice(0, 8).map(m => (
                  <SuggestionCard key={m.id} map={m} />
                ))}
              </div>
            </div>

            {/* Trending */}
            <div className="text-left">
              <h3 className="flex items-center gap-2 text-foreground font-black text-sm mb-4 px-1">
                <Flame className="w-4 h-4 text-orange-500" />
                🔥 Trending BUSSID Maps This Week
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-4 px-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                {trendingMaps.map(m => (
                  <SuggestionCard key={m.id} map={m} />
                ))}
              </div>
            </div>
          </div>

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
            <p className="text-muted-foreground text-sm leading-relaxed">{map.description}</p>
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
