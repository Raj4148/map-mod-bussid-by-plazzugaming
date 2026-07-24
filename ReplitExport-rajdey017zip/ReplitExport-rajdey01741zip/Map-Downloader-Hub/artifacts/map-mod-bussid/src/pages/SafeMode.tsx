import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { disableAds } from '@/lib/ads-control';
import { ShieldCheck } from 'lucide-react';

export default function SafeMode() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Enable safe mode
    disableAds();

    // Redirect to home after a delay
    const timer = setTimeout(() => {
      setLocation('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center animate-bounce">
            <ShieldCheck className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground">Self-Click Safety Active</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Safe Mode enabled. All advertisements have been disabled for this session.
            You can now test the site safely.
          </p>
        </div>

        <div className="pt-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/60">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Redirecting to Home...
          </div>
        </div>
      </div>
    </div>
  );
}
