import { useRoute, Link } from 'wouter';
import { useMap, useMaps, incrementDownloadCount, MapMod, fmtCount } from '../hooks/useMaps';
import { PageShell } from '../components/Layout';
import { ChevronLeft, DownloadCloud } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { areAdsEnabled, injectReadyPopunder } from '../lib/ads-control';

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

function PopularFooterGrid({ maps, onNavigate }: { maps: MapMod[], onNavigate: (id: string) => void }) {
  return (
    <div className="w-full mt-12 pt-8 border-t border-border/50 space-y-6 text-left">
      <h3 className="text-sm font-black uppercase">Most Popular Maps</h3>
      <div className="grid grid-cols-1 gap-5">
        {maps.map(m => (
          <div key={m.id} className="bg-card border rounded-[2rem] overflow-hidden flex flex-col shadow-sm">
             <div className="aspect-video relative overflow-hidden">
                <SafeImage src={m.thumbnail} alt={m.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-4"><p className="text-white font-black text-xs uppercase">{m.name}</p></div>
                <div className="absolute top-3 right-3 px-2 py-1 bg-primary rounded text-[9px] font-black text-white">{fmtCount(m.downloadCount)} DL</div>
             </div>
             <div className="p-5 flex gap-3">
                <button onClick={() => onNavigate(m.id)} className="flex-1 py-4 bg-red-600 text-white font-black text-[10px] rounded-2xl">Download Now</button>
                <button onClick={() => onNavigate(m.id)} className="flex-1 py-4 bg-muted text-foreground font-black text-[10px] rounded-2xl">View Details</button>
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
    // Hilltop/Monetag smart tags handle Step 4 usually, but we inject popunder here anyway
    injectReadyPopunder();
    window.scrollTo(0, 0);
  }, []);

  const popularMaps = useMemo(() => [...allMaps].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 8), [allMaps]);

  if (mapLoading || allLoading) return <PageShell><div className="p-8 text-center">Loading...</div></PageShell>;
  if (!map) return <PageShell><div className="p-8 text-center">Map Not Found</div></PageShell>;

  const handleDownload = (adUrl: string) => {
    incrementDownloadCount(map.id);
    if (areAdsEnabled()) { window.open(adUrl, '_blank', 'noopener'); }
    window.open(map.downloadUrl, '_blank', 'noopener');
  };

  return (
    <PageShell>
      <StickyHeader onBack={() => window.history.back()} title={map.name} />
      <div className="px-4 pt-6 pb-20 flex flex-col items-center text-center">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="bg-[#0f172a] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl overflow-hidden relative group">
            <h3 className="text-white font-black text-xl mb-6 uppercase">READY TO DOWNLOAD</h3>
            <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-blue-400/30 mb-6">
              <SafeImage src={map.thumbnail} alt={map.name} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-2 text-white"><p className="font-black text-sm uppercase">{map.name} MAP MOD</p><p className="text-blue-400/60 font-bold text-[10px]">File Size: {(Math.random() * 200 + 50).toFixed(0)} MB | Format: .zip</p></div>
          </div>
          <div className="space-y-3 px-2">
            <button onClick={() => handleDownload('https://omg10.com/4/11385953')} className="w-full py-5 rounded-[1.25rem] bg-[#00ff88] text-[#0f172a] font-black text-lg shadow-xl">START FAST DOWNLOAD</button>
            <button onClick={() => handleDownload('https://omg10.com/4/11533894')} className="w-full py-4 rounded-[1.25rem] bg-[#1e293b] text-white font-bold text-sm flex items-center justify-center gap-3">Backup Server Link <DownloadCloud className="w-5 h-5 text-blue-400" /></button>
            <button onClick={() => handleDownload('https://omg10.com/4/11696301')} className="w-full py-4 rounded-[1.25rem] bg-[#1e293b] text-white font-bold text-sm flex items-center justify-center gap-3">Mirror Link 1 <DownloadCloud className="w-5 h-5 text-blue-400" /></button>
          </div>
          <div className="pt-4 space-y-4"><p className="text-foreground/40 font-black text-[10px] uppercase">Help & Guide</p><div className="flex justify-center gap-8 text-xs font-bold text-foreground/70"><span>How to Install</span><span>Troubleshooting</span></div><button className="text-blue-500 text-[11px] font-bold">Report a Problem</button></div>
          <PopularFooterGrid maps={popularMaps.filter(m => m.id !== id).slice(0, 3)} onNavigate={(mid) => window.location.assign(`/map/${mid}`)} />
        </div>
      </div>
    </PageShell>
  );
}
