import { Link } from 'wouter';
import { triggerSmartLinks } from '../lib/adsterra';
import { MapMod, fmtCount, getMapBadge, isMapNew } from '../hooks/useMaps';
import { useState } from 'react';

interface MapCardProps {
  map: MapMod;
  /** Override: pass false to skip NEW detection (e.g. Popular page doesn't need it) */
  showNew?: boolean;
}

const FALLBACK =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop';

const BADGE_STYLES: Record<string, string> = {
  HOT:     'bg-red-500',
  POPULAR: 'bg-orange-500',
  NEW:     'bg-blue-500',
};

const BADGE_LABELS: Record<string, string> = {
  HOT:     '🔥 HOT',
  POPULAR: '⭐ POPULAR',
  NEW:     '✨ NEW',
};

export function MapCard({ map, showNew = true }: MapCardProps) {
  const [imgSrc, setImgSrc] = useState(map.thumbnail || FALLBACK);

  const badge = getMapBadge(map, showNew ? isMapNew(map.createdAt) : false);

  return (
    <Link
      href={`/map/${map.id}`}
      onClick={() => triggerSmartLinks()}
      className="block relative rounded-xl overflow-hidden bg-muted"
      style={{ aspectRatio: '4/3' }}
    >
      <img
        src={imgSrc}
        alt={map.name}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        onError={() => setImgSrc(FALLBACK)}
      />

      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

      {/* Badge: HOT / POPULAR / NEW */}
      {badge && (
        <div
          className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide text-white ${BADGE_STYLES[badge]}`}
        >
          {BADGE_LABELS[badge]}
        </div>
      )}

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <p className="text-white text-xs font-bold leading-tight line-clamp-2 drop-shadow-lg">
          {map.name}
        </p>
        {/* Download count */}
        <p className="text-white/70 text-[10px] mt-0.5 flex items-center gap-0.5">
          📥 {fmtCount(map.downloadCount)}
        </p>
      </div>
    </Link>
  );
}

export function MapCardSkeleton() {
  return (
    <div
      className="rounded-xl overflow-hidden bg-muted animate-pulse"
      style={{ aspectRatio: '4/3' }}
    />
  );
}
