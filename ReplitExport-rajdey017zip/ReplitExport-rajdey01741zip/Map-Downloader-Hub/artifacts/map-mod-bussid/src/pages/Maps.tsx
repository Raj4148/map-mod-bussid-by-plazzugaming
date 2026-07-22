import { useLocation } from 'wouter';
import { useMaps } from '../hooks/useMaps';

import { MapGrid } from '../components/MapGrid';
import { PageShell } from '../components/Layout';
import { AdsterraBanner } from '../components/ads/AdsterraBanner';
import { AdsterraNative } from '../components/ads/AdsterraNative';
import { ChevronLeft, MapPin } from 'lucide-react';

const TABS = [
  { id: 'all',        label: 'All' },
  { id: 'indian',     label: 'Indian' },
  { id: 'nepali',     label: 'Nepali' },
  { id: 'indonesian', label: 'Indonesian' },
];

export default function Maps() {
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const categoryFilter = params.get('category') || 'all';

  const { maps, loading } = useMaps(categoryFilter === 'all' ? undefined : categoryFilter);

  const handleTab = (id: string) => {
    setLocation(id === 'all' ? '/maps' : `/maps?category=${id}`);
  };

  return (
    <PageShell>
      {/* ── Header ── */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setLocation('/')}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-foreground font-bold text-base">Map Directory</h1>
      </div>

      <AdsterraBanner type="320x50" />

      {/* ── Category tabs ── */}
      <div className="flex gap-2 px-4 pt-4 pb-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              categoryFilter === tab.id
                ? 'bg-primary text-white'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Map grid ── */}
      <div className="px-4 pb-4">
        {!loading && maps.length === 0 ? (
          <div className="py-20 text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-muted-foreground font-medium">No maps in this category</p>
            <button
              onClick={() => handleTab('all')}
              className="mt-4 px-4 py-2 rounded-full bg-primary text-white text-sm font-bold"
            >
              Show All
            </button>
            <AdsterraBanner type="320x50" />
          </div>
        ) : (
          <MapGrid
            maps={maps}
            loading={loading}
            skeletonCount={8}
          />
        )}
        <AdsterraNative />
      </div>
    </PageShell>
  );
}
