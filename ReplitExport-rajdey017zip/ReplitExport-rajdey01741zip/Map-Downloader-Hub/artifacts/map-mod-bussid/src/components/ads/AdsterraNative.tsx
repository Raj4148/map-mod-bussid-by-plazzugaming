/**
 * AdsterraNative — injects the Adsterra native banner script.
 * Zone: 80f7fa7719c57e33ec30ee642c6c9d39
 *
 * Pass a unique `idSuffix` for every instance on the same page
 * so container IDs don't collide.
 *
 * Min-height of 250px is reserved so the layout does not collapse
 * before the ad script renders.
 */
import { useEffect, useRef } from 'react';

interface AdsterraNativeProps {
  /** Unique suffix per page instance, e.g. "home-1", "detail-mid" */
  idSuffix?: string;
  className?: string;
}

let instanceCount = 0;

export function AdsterraNative({ idSuffix, className = '' }: AdsterraNativeProps) {
  const suffixRef = useRef(idSuffix ?? String(++instanceCount));
  const containerId = `container-80f7fa7719c57e33ec30ee642c6c9d39-${suffixRef.current}`;

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container || container.dataset.adLoaded) return;
    container.dataset.adLoaded = '1';

    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src =
      'https://pl30380328.effectivecpmnetwork.com/80f7fa7719c57e33ec30ee642c6c9d39/invoke.js';
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [containerId]);

  return (
    <div className={`my-4 ${className}`}>
      <div
        id={containerId}
        className="min-h-[250px]"
        aria-label="Advertisement"
      />
    </div>
  );
}
