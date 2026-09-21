import { useRoute, Link } from 'wouter';
import { useMap, useMaps, incrementDownloadCount, MapMod, fmtCount } from '../hooks/useMaps';
import { PageShell } from '../components/Layout';
import { DownloadCloud } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { areAdsEnabled, injectReadyPopunder } from '../lib/ads-control';

function SafeImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} referrerPolicy="no-referrer" className={className} />;
}

function PopularFooterGrid({ maps, onNavigate }: { maps: MapMod[], onNavigate: (id: string) => void }) {
  return (
    <div className="w-full mt-12 pt-8 border-t border-border/50 space-y-6 text-left">
      <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 text-center">People also downloaded</h3>
      <div className="grid grid-cols-1 gap-5">
        {maps.map(m => (
          <div key={m.id} className="bg-card border rounded-[2rem] overflow-hidden flex flex-col shadow-sm">
             <div className="aspect-video relative overflow-hidden">
                <SafeImage src={m.thumbnail} alt={m.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-4"><p className="text-white font-black text-xs uppercase drop-shadow-md">{m.name}</p></div>
                <div className="absolute top-3 right-3 px-2 py-1 bg-primary rounded text-[9px] font-black text-white shadow-lg">{fmtCount(m.downloadCount)} DL</div>
             </div>
             <div className="p-5 flex gap-3">
                <button onClick={() => onNavigate(m.id)} className="flex-1 py-4 bg-red-600 text-white font-black text-[10px] rounded-2xl uppercase">Download Now</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MapReady() {
  const [, params] = useRoute('/ready/:id');
  const id = params?.id || '';
  const { map, loading: mapLoading } = useMap(id);
  const { allMaps, loading: allLoading } = useMaps();

  useEffect(() => {
    if (map) {
      document.title = `Download Ready: ${map.name} | Plazzu Gaming`;
      injectReadyPopunder();
    }
  }, [map]);

  const popularMaps = useMemo(() => [...allMaps].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 8), [allMaps]);

  if (mapLoading || allLoading) return <PageShell><div className="p-8 text-center uppercase font-black tracking-widest">Verifying Connection...</div></PageShell>;
  if (!map) return <PageShell><div className="p-8 text-center font-black">Link Expired</div></PageShell>;

  const handleDownload = () => {
    if (!map || !map.downloadUrl || map.downloadUrl === '#') return;
    incrementDownloadCount(map.id);

    // Redirect current window to Mediafire link
    // The Zone 11854964 Popunder script handles the ad trigger automatically on this click
    window.location.assign(map.downloadUrl);
  };

  return (
    <PageShell>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 py-2.5 flex items-center justify-center">
        <h1 className="text-foreground font-black text-[11px] uppercase tracking-widest line-clamp-1 opacity-70">Ready: {map.name}</h1>
      </div>

      <div className="px-3 pt-4 pb-20 flex flex-col items-center text-center">
        <div className="w-full max-w-sm mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="bg-[#0f172a] rounded-[2.5rem] p-7 border border-white/5 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
            <h3 className="text-white font-black text-lg mb-6 tracking-tighter uppercase">DOWNLOAD READY</h3>
            <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-blue-400/20 mb-6 shadow-inner bg-slate-900">
              <SafeImage src={map.thumbnail} alt={map.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
            <div className="space-y-1.5 text-white">
              <p className="font-black text-[13px] uppercase tracking-tight line-clamp-1">{map.name}</p>
              <div className="flex items-center justify-center gap-2 opacity-50">
                 <span className="text-[9px] font-bold uppercase">Format: .zip</span>
                 <div className="w-1 h-1 bg-white rounded-full" />
                 <span className="text-[9px] font-bold uppercase">SECURE 5G</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 px-1">
            <button onClick={handleDownload} className="w-full py-5 rounded-2xl bg-[#00ff88] text-[#0f172a] font-black text-lg shadow-[0_15px_40px_rgba(0,255,136,0.2)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-tight">
              DOWNLOAD NOW <DownloadCloud className="w-6 h-6" />
            </button>

            <div className="py-2.5 px-4 bg-muted/10 rounded-xl border border-border/40">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">High speed connection verified</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col items-center gap-4 opacity-50">
             <div className="w-10 h-1 bg-border rounded-full" />
             <PopularFooterGrid maps={popularMaps.filter(m => m.id !== id).slice(0, 3)} onNavigate={(mid) => window.location.assign(`/map/${mid}`)} />
          </div>
        </div>
      </div>
      <div className="h-10" />
    </PageShell>
  );
}
