import { useState, useEffect } from 'react';
import { disableAds, enableAds, areAdsEnabled } from '../lib/ads-control';
import { ShieldCheck, ShieldAlert, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { PageShell } from '../components/Layout';

export default function SafeMode() {
  const [safeModeActive, setSafeModeActive] = useState(() => !areAdsEnabled());
  const [message, setMessage] = useState('');

  // Auto-enable when visiting /raju if not already enabled
  useEffect(() => {
    disableAds();
    setSafeModeActive(true);
    setMessage('Safe mode automatically enabled for self-testing!');
  }, []);

  const handleEnableSafeMode = () => {
    disableAds();
    setSafeModeActive(true);
    setMessage('Safe mode enabled! All ads and timer popunders are disabled.');
  };

  const handleDisableSafeMode = () => {
    enableAds();
    setSafeModeActive(false);
    setMessage('Safe mode disabled! Monetag ads and timers are active.');
  };

  return (
    <PageShell>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-3xl p-6 text-center space-y-6 shadow-xl">
          <div className="flex justify-center">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border ${
              safeModeActive ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
            }`}>
              {safeModeActive ? (
                <ShieldCheck className="w-10 h-10 text-green-500 animate-pulse" />
              ) : (
                <ShieldAlert className="w-10 h-10 text-red-500" />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              safeModeActive ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {safeModeActive ? '🛡️ Safe Mode ACTIVE' : '⚠️ Normal Mode (Ads Active)'}
            </span>

            <h1 className="text-2xl font-black text-foreground uppercase tracking-tight">Self-Click Safety Control</h1>
            <p className="text-muted-foreground text-xs leading-relaxed font-medium">
              {safeModeActive
                ? 'Safe Mode is ON. All Monetag popunder ads, timers, and overlays are BLOCKED. You can safely test and browse your website without triggering ad clicks.'
                : 'Safe Mode is OFF. Monetag ads and timers will show to visitors.'}
            </p>
          </div>

          {message && (
            <div className="p-3 bg-muted/20 border border-border/50 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-primary">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <div className="space-y-3 pt-2">
            {!safeModeActive ? (
              <button
                onClick={handleEnableSafeMode}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-lg shadow-green-600/20 transition-all"
              >
                Enable Safe Mode (Hide Ads)
              </button>
            ) : (
              <button
                onClick={handleDisableSafeMode}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-lg shadow-red-600/20 transition-all"
              >
                Disable Safe Mode (Show Ads)
              </button>
            )}

            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-card border border-border hover:bg-muted text-foreground font-black text-xs rounded-xl uppercase tracking-wider transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Website
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
