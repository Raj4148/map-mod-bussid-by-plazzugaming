import { Link, useLocation } from 'wouter';
import { useMaps, useTopMaps, fmtCount, getMapBadge, isMapNew } from '../hooks/useMaps';
import { triggerSmartLinks } from '../lib/adsterra';
import { MapCardSkeleton } from '../components/MapCard';
import { MapGrid } from '../components/MapGrid';
import { PageShell } from '../components/Layout';
import { AdsterraBanner } from '../components/ads/AdsterraBanner';
import { AdsterraSocialBar } from '../components/ads/AdsterraSocialBar';
import { DownloadCloud, ChevronRight, MapPin, Trophy } from 'lucide-react';
import { useState } from 'react';

/* ─── Category tiles ─── */
const CATEGORIES = [
  { id: 'all',        label: 'All Maps',       image: '/cat-other.jpg' },
  { id: 'indian',     label: 'Indian map',     image: '/cat-indian.jpg' },
  { id: 'nepali',     label: 'Nepali map',     image: '/cat-nepali.png' },
  { id: 'indonesian', label: 'Indonesian map',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=300&auto=format&fit=crop' },
];

const BADGE_COLORS: Record<string, string> = {
  HOT:     'bg-red-500',
  POPULAR: 'bg-orange-500',
  NEW:     'bg-blue-500',
};

/* ─── Featured Map card (horizontal scroll) ─── */
function FeaturedCard({ map }: { map: Parameters<typeof getMapBadge>[0] }) {
  const [imgSrc, setImgSrc] = useState(map.thumbnail || '');
  const badge = getMapBadge(map, isMapNew(map.createdAt));

  return (
    <Link
      href={`/map/${map.id}`}
      onClick={() => triggerSmartLinks()}
      className="flex-shrink-0 relative rounded-xl overflow-hidden block bg-muted"
      style={{ width: 148, aspectRatio: '4/3' }}
    >
      <img
        src={imgSrc || `https://picsum.photos/seed/${map.id}/300/225`}
        alt={map.name}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={() => setImgSrc(`https://picsum.photos/seed/${map.id}/300/225`)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {badge && (
        <div className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-black text-white uppercase ${BADGE_COLORS[badge]}`}>
          {badge === 'HOT' ? '🔥' : badge === 'POPULAR' ? '⭐' : '✨'} {badge}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2">
        <p className="text-white text-[11px] font-bold leading-tight line-clamp-2">{map.name}</p>
        <p className="text-white/65 text-[10px] mt-0.5">📥 {fmtCount(map.downloadCount)}</p>
      </div>
    </Link>
  );
}

/* ─── Home Page ─── */
export default function Home() {
  const { maps: allMaps, loading: allLoading } = useMaps();
  const { maps: topMaps, loading: topLoading } = useTopMaps(6);
  const [, setLocation] = useLocation();

  const handleCategoryClick = (id: string) => {
    triggerSmartLinks();
    setLocation(id === 'all' ? '/maps' : `/maps?category=${id}`);
  };

  return (
    <PageShell>
      {/* ── Notice Bar ── */}
      <div className="bg-yellow-400 text-black px-4 py-2 flex items-center gap-2 sticky top-0 z-40">
        <span className="text-base">🔔</span>
        <p className="text-xs font-bold truncate">Notice: Daily 8:00 PM new map mod uploaded!</p>
      </div>

      {/* ── Top Banner Ad ── */}
      <div className="px-4">
        <AdsterraBanner type="320x50" />
      </div>

      {/* ── Featured Maps (top 6 by download count) ── */}
      <section className="mt-2">
        <div className="px-4 flex items-center justify-between mb-3">
          <h2 className="text-foreground font-bold text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Featured Maps
          </h2>
          <Link
            href="/maps"
            onClick={() => triggerSmartLinks()}
            className="flex items-center gap-1 text-purple-400 text-xs font-semibold"
          >
            See all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 px-4" style={{ scrollbarWidth: 'none' }}>
          {topLoading
            ? Array(4).fill(0).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 rounded-xl bg-muted animate-pulse"
                  style={{ width: 148, aspectRatio: '4/3' }}
                />
              ))
            : topMaps.map((map) => <FeaturedCard key={map.id} map={map} />)
          }
        </div>
      </section>

      {/* ── Explore Categories ── */}
      <section className="mt-5 px-4">
        <h2 className="text-foreground font-bold text-lg mb-3">Explore Categories</h2>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="relative flex-shrink-0 rounded-xl overflow-hidden"
              style={{ width: 130, height: 80 }}
            >
              <img src={cat.image} alt={cat.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50" />
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm text-center px-2 leading-tight">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Latest Maps (native ad injected after every 3rd card by MapGrid) ── */}
      <section className="mt-6 px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-foreground font-bold text-lg">Latest Maps</h2>
          <Link
            href="/maps"
            onClick={() => triggerSmartLinks()}
            className="flex items-center gap-1 text-purple-400 text-xs font-semibold"
          >
            See all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {allMaps.length === 0 && !allLoading ? (
          <div className="py-16 text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-muted-foreground text-sm font-medium">No maps yet</p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              Check back at 8:00 PM for the daily drop!
            </p>
          </div>
        ) : (
          <MapGrid
            maps={allMaps}
            loading={allLoading}
            skeletonCount={6}
            adPrefix="home"
          />
        )}
      </section>

      {/* bottom padding so last card isn't hidden behind social bar */}
      <div className="h-16" />

      {/* ── Sticky Social Bar ── */}
      <AdsterraSocialBar />
    </PageShell>
  );
}
