import { useRoute, Link } from 'wouter';
import { useMap, incrementDownloadCount } from '../hooks/useMaps';
import { triggerSmartLinks } from '../lib/adsterra';
import { NativeBannerAd } from '../components/NativeBannerAd';
import { PageShell } from '../components/Layout';
import {
  ChevronLeft, Download, DownloadCloud, Calendar, Tag,
  AlertTriangle, ImageOff, CheckCircle, Clock,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

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
      referrerPolicy="no-referrer" crossOrigin="anonymous"
      className={className}
      onError={() => (imgSrc !== FALLBACK ? setImgSrc(FALLBACK) : setFailed(true))}
    />
  );
}

/* ── split description into 3 chunks for native banner injection ── */
function splitDescription(text: string): [string, string, string] {
  if (!text) return ['', '', ''];
  const sentences = text.split(/[.!?]+\s+/).filter(Boolean);
  if (sentences.length <= 1) {
    const words = text.split(' ');
    const third = Math.max(1, Math.ceil(words.length / 3));
    return [
      words.slice(0, third).join(' '),
      words.slice(third, third * 2).join(' '),
      words.slice(third * 2).join(' '),
    ];
  }
  const third = Math.max(1, Math.ceil(sentences.length / 3));
  return [
    sentences.slice(0, third).join('. '),
    sentences.slice(third, third * 2).join('. '),
    sentences.slice(third * 2).join('. '),
  ];
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

/* ── countdown / download gateway ── */
type Phase = 'idle' | 'waiting' | 'ready' | 'final';
const WAIT_SECONDS = 15;
const FINAL_WAIT_SECONDS = 10;
const SMARTLINK_URL = 'https://pl30380326.effectivecpmnetwork.com/1c/8e/a8/1c8ea84455f7f2907cd1f65920c6395b.js';

export default function MapDetail() {
  const [, params] = useRoute('/map/:id');
  const id = params?.id || '';
  const { map, loading } = useMap(id);

  const [phase, setPhase]       = useState<Phase>('idle');
  const [countdown, setCountdown] = useState(WAIT_SECONDS);
  const [finalCountdown, setFinalCountdown] = useState(FINAL_WAIT_SECONDS);
  const [showFinalButton, setShowFinalButton] = useState(false);
  const [isFinalCountdownRunning, setIsFinalCountdownRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  type GmPhase = 'idle' | 'counting' | 'revealed';
  const [gmPhase, setGmPhase]         = useState<GmPhase>('idle');
  const [gmCountdown, setGmCountdown] = useState(5);
  const gmTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setGmPhase('idle');
    setGmCountdown(5);
    if (gmTimerRef.current) clearInterval(gmTimerRef.current);
  }, [id]);

  useEffect(() => { triggerSmartLinks(); }, [id]);

  useEffect(() => () => {
    if (timerRef.current)   clearInterval(timerRef.current);
    if (gmTimerRef.current) clearInterval(gmTimerRef.current);
  }, []);

  useEffect(() => {
    if (phase !== 'waiting') return;
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timerRef.current!); setPhase('ready'); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'final' || !isFinalCountdownRunning) return;
    timerRef.current = setInterval(() => {
      setFinalCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!);
          setIsFinalCountdownRunning(false);
          setShowFinalButton(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, isFinalCountdownRunning]);

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

  const handleDownload = () => {
    if (!map) return;
    triggerSmartLinks();
    incrementDownloadCount(map.id);
    setCountdown(WAIT_SECONDS);
    setPhase('waiting');
  };

  const handleContinue = () => {
    window.open(SMARTLINK_URL, '_blank');
    setPhase('final');
    setFinalCountdown(FINAL_WAIT_SECONDS);
    setShowFinalButton(false);
    setIsFinalCountdownRunning(false);
  };

  const handleFinalDownloadClick = () => {
    if (!map || !map.downloadUrl || map.downloadUrl === '#') return;
    incrementDownloadCount(map.id);
    window.open(map.downloadUrl, '_blank');
  };

  const handleBack = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('idle');
    setCountdown(WAIT_SECONDS);
    setFinalCountdown(FINAL_WAIT_SECONDS);
    setShowFinalButton(false);
    setIsFinalCountdownRunning(false);
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

  const [desc1, desc2, desc3] = splitDescription(map.description);
  const progress = ((WAIT_SECONDS - countdown) / WAIT_SECONDS) * 100;

  /* ══════════════════════════════════════════════════════════════
     PAGE 2a — WAITING / READY overlay
  ══════════════════════════════════════════════════════════════ */
  if (phase === 'waiting' || phase === 'ready') {
    return (
      <PageShell>
        <StickyHeader onBack={handleBack} title={map.name} />

        <div className="px-4 pt-8 pb-4 flex flex-col items-center text-center">
          {phase === 'waiting' ? (
            <>
              {/* Countdown ring */}
              <div className="relative w-36 h-36 mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="44" fill="none"
                    stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 44}`}
                    strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Clock className="w-5 h-5 text-primary mb-1" />
                  <span className="text-4xl font-black text-foreground">{countdown}</span>
                </div>
              </div>

              <h2 className="text-foreground font-black text-xl mb-1">Preparing Download</h2>
              <p className="text-muted-foreground text-sm mb-2">
                Please wait <span className="text-primary font-bold">{countdown} second{countdown !== 1 ? 's' : ''}</span>
              </p>
              <p className="text-muted-foreground/50 text-xs mb-8">Do not close this page</p>

              <div className="w-full mb-4">
                <NativeBannerAd idSuffix="detail-wait" />
              </div>

              <button onClick={handleBack} className="text-muted-foreground text-sm underline underline-offset-2">
                ← Go back
              </button>
            </>
          ) : (
            <>
              {/* Ready state */}
              <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>

              <h2 className="text-foreground font-black text-2xl mb-2">Ready!</h2>
              <p className="text-muted-foreground text-sm mb-8">Your download link is ready. Tap Continue.</p>

              <button
                onClick={handleContinue}
                className="w-full py-5 rounded-2xl bg-green-500 hover:bg-green-400 active:scale-95 transition-all text-white font-black text-lg flex items-center justify-center gap-2 mb-4"
                style={{ boxShadow: '0 0 24px rgba(34,197,94,0.4)' }}
              >
                <Download className="w-6 h-6" />
                Continue Download
              </button>

              <p className="text-muted-foreground/50 text-xs mb-8">2 sponsor links will open to support this site</p>

              <button onClick={handleBack} className="text-muted-foreground text-sm underline underline-offset-2">
                ← Go back
              </button>
            </>
          )}
        </div>
      </PageShell>
    );
  }

  /* ══════════════════════════════════════════════════════════════
     PAGE 3 — FINAL DESTINATION
  ══════════════════════════════════════════════════════════════ */
  if (phase === 'final') {
    return (
      <PageShell>
        <StickyHeader onBack={handleBack} title={map.name} />

        <div className="px-4 mt-4 space-y-4 pb-8">
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            {!showFinalButton ? (
              <>
                <button
                  onClick={() => {
                    setFinalCountdown(FINAL_WAIT_SECONDS);
                    setShowFinalButton(false);
                    setIsFinalCountdownRunning(true);
                  }}
                  className="w-full py-4 rounded-2xl bg-primary text-white font-black text-lg active:scale-95 transition-all"
                >
                  Continue
                </button>
                <p className="text-muted-foreground text-xs mt-3">Click here and wait 10 seconds</p>
                {isFinalCountdownRunning && (
                  <p className="text-muted-foreground text-xs mt-2">
                    Countdown: <span className="font-bold text-primary">{finalCountdown}s</span>
                  </p>
                )}
              </>
            ) : (
              <p className="text-foreground font-black text-lg">Scroll down and click Download</p>
            )}
          </div>

          <NativeBannerAd idSuffix="final-banner" />
          <NativeBannerAd idSuffix="final-banner-2" />

          {!showFinalButton ? null : (
            <button
              onClick={handleFinalDownloadClick}
              className="w-full py-5 rounded-2xl text-white font-black text-lg flex flex-col items-center justify-center gap-1 active:scale-95 transition-all"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                boxShadow: '0 0 32px rgba(124,58,237,0.5)',
              }}
            >
              <span className="flex items-center gap-2">
                <Download className="w-6 h-6" />
                Download Map
              </span>
            </button>
          )}

          <p className="text-xs text-muted-foreground/50 text-center leading-relaxed">
            By downloading you agree this mod is for BUSSID entertainment purposes only.
          </p>
        </div>
      </PageShell>
    );
  }

  /* ══════════════════════════════════════════════════════════════
     PAGE 1 — MAIN DETAIL VIEW (phase: idle)
  ══════════════════════════════════════════════════════════════ */
  return (
    <PageShell>
      <StickyHeader title={map.name} isLink />

      {/* Hero image */}
      <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden bg-muted" style={{ aspectRatio: '16/9' }}>
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
            onClick={() => { triggerSmartLinks(); setGmPhase('counting'); }}
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
                  strokeDashoffset={`${2 * Math.PI * 26 * (gmCountdown / 5)}`}
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
            <strong className="font-black">⬇ Scroll down &amp; click Download Now</strong>
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
        </div>

        {/* Description */}
        {map.description && (
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-foreground font-bold text-sm mb-3">Description</h3>

            {desc1 && <p className="text-muted-foreground text-sm leading-relaxed">{desc1}</p>}

            {(desc2 || desc3) && (
              <div className="-mx-4">
                <NativeBannerAd idSuffix="detail-desc-1" />
              </div>
            )}

            {desc2 && <p className="text-muted-foreground text-sm leading-relaxed">{desc2}</p>}

            {desc3 && (
              <div className="-mx-4">
                <NativeBannerAd idSuffix="detail-desc-2" />
              </div>
            )}

            {desc3 && <p className="text-muted-foreground text-sm leading-relaxed">{desc3}</p>}
          </div>
        )}

        <NativeBannerAd idSuffix="detail-bottom" />

        {/* Download Now — revealed after Get Map timer */}
        {gmPhase === 'revealed' && (
          <>
            <button
              onClick={handleDownload}
              className="w-full py-5 rounded-2xl bg-primary hover:bg-purple-500 active:scale-95 transition-all text-white font-black text-lg flex flex-col items-center justify-center gap-1"
              style={{ boxShadow: '0 0 24px rgba(139,92,246,0.4)' }}
            >
              <span className="flex items-center gap-2">
                <Download className="w-6 h-6" />
                Download Now
              </span>
              <span className="text-xs font-medium text-white/60 uppercase tracking-widest">Tap to start</span>
            </button>

            <p className="text-xs text-muted-foreground/50 text-center leading-relaxed pb-2">
              By downloading you agree this mod is for BUSSID entertainment purposes only.
            </p>
          </>
        )}
      </div>
    </PageShell>
  );
}
