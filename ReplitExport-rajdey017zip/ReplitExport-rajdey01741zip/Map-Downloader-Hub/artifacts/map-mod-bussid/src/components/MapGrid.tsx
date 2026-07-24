import { MapCard, MapCardSkeleton } from './MapCard';
import type { MapMod } from '../hooks/useMaps';

interface MapGridProps {
  maps: MapMod[];
  loading?: boolean;
  skeletonCount?: number;
}

export function MapGrid({
  maps,
  loading = false,
  skeletonCount = 6,
}: MapGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array(skeletonCount)
          .fill(0)
          .map((_, i) => (
            <MapCardSkeleton key={i} />
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {maps.map((map) => (
        <MapCard key={map.id} map={map} />
      ))}
    </div>
  );
}
