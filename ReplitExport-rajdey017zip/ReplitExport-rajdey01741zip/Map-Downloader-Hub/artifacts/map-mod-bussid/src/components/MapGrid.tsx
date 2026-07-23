import { Fragment } from 'react';
import { MapCard, MapCardSkeleton } from './MapCard';
import { AdsterraNative } from './ads/AdsterraNative';
import type { MapMod } from '../hooks/useMaps';

interface MapGridProps {
  maps: MapMod[];
  loading?: boolean;
  skeletonCount?: number;
  /** If provided, injects a native ad after every N items */
  adInterval?: number;
}

/** Split an array into chunks of `size`. */
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export function MapGrid({
  maps,
  loading = false,
  skeletonCount = 6,
  adInterval,
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

  if (!adInterval) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {maps.map((map) => (
          <MapCard key={map.id} map={map} />
        ))}
      </div>
    );
  }

  /* Inject a native banner after every N cards */
  const groups = chunk(maps, adInterval);

  return (
    <>
      {groups.map((group, groupIndex) => (
        <Fragment key={groupIndex}>
          <div className="grid grid-cols-2 gap-3">
            {group.map((map) => (
              <MapCard key={map.id} map={map} />
            ))}
          </div>
          <AdsterraNative className="px-0" />
        </Fragment>
      ))}
    </>
  );
}
