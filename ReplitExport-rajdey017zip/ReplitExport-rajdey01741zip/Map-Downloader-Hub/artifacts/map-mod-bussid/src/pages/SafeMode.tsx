import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { PageShell } from '../components/Layout';

export default function SafeMode() {
  return (
    <PageShell>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-3xl p-6 text-center space-y-6 shadow-xl">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center border bg-green-500/10 border-green-500/30">
              <ShieldCheck className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-500/20 text-green-400 border border-green-500/30">
              🛡️ Clean & Ad-Free Website
            </span>

            <h1 className="text-2xl font-black text-foreground uppercase tracking-tight">Ad-Free Mode Active</h1>
            <p className="text-muted-foreground text-xs leading-relaxed font-medium">
              All Monetag popunder ad scripts and tracking tags have been completely deleted from the entire website.
              Users can now navigate and download maps directly without popunder ads or ad loops.
            </p>
          </div>

          <div className="pt-2">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-lg shadow-primary/20 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Home
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
