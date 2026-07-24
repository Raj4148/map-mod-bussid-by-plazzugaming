import { Link } from 'wouter';

import { MapMod, fmtCount, getMapBadge, isMapNew } from '../hooks/useMaps';
import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const badge = getMapBadge(map, showNew ? isMapNew(map.createdAt) : false);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: map.name,
      text: `Download ${map.name} BUSSID Map Mod!`,
      url: `${window.location.origin}/map/${map.id}`,
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

  return (
    <div className="relative group">
      <Link
        href={`/map/${map.id}`}
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

      {/* Share button */}
      <button
        onClick={handleShare}
        className="absolute top-2 left-2 p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Share map"
      >
        <Share2 className="w-3.5 h-3.5" />
      </button>
    </div>
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
