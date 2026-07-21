import { Fragment } from 'react';
import { MapCard, MapCardSkeleton } from './MapCard';
import { AdsterraNative } from './ads/AdsterraNative';
import type { MapMod } from '../hooks/useMaps';

interface MapGridProps {
  maps: MapMod[];
  loading?: boolean;
  skeletonCount?: number;
  /** Unique prefix so every ad gets a distinct key — pass the page name */
  adPrefix?: string;
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
  adPrefix = 'grid',
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

  /* Inject a native banner after every 3rd card */
  const groups = chunk(maps, 3);

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
