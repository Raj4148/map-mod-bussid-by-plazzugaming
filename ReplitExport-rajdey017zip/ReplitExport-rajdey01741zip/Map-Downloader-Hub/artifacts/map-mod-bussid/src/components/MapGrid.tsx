/**
 * MapGrid — renders any list of maps as a 2-column grid
 * with a NativeBannerAd injected automatically after every 6 cards.
 *
 * Ad placement: (index + 1) % 6 === 0  →  after cards 6, 12, 18 …
 *
 * Each ad is a self-contained <iframe srcDoc> (see NativeBannerAd).
 * When React unmounts an iframe it destroys the inner document, so
 * the Adsterra script is automatically cleaned up — no extra effect needed.
 */
import { Fragment } from 'react';
import { MapCard, MapCardSkeleton } from './MapCard';
import { NativeBannerAd } from './NativeBannerAd';
import type { MapMod } from '../hooks/useMaps';

interface MapGridProps {
  maps: MapMod[];
  loading?: boolean;
  skeletonCount?: number;
  /** Unique prefix so every ad iframe gets a distinct key/id — pass the page name */
  adPrefix?: string;
}

/**
 * Split an array into chunks of `size`.
 * e.g. chunk([1..8], 6) → [[1..6], [7,8]]
 */
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
  /* ── Loading skeleton ── */
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

  /* ── Split into groups of 6, inject ad after each group ── */
  const groups = chunk(maps, 6);

  return (
    <>
      {groups.map((group, groupIndex) => (
        <Fragment key={groupIndex}>
          {/* 2-column card grid for this group */}
          <div className="grid grid-cols-2 gap-3">
            {group.map((map) => (
              <MapCard key={map.id} map={map} />
            ))}
          </div>

          {/* Native banner after every group of 6 */}
          <NativeBannerAd idSuffix={`${adPrefix}-${groupIndex}`} />
        </Fragment>
      ))}
    </>
  );
}
