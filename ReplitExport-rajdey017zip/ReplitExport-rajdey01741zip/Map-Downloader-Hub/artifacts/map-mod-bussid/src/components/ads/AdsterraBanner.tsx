/**
 * AdsterraBanner — display banner slot for Adsterra.
 *
 * Usage:
 *   <AdsterraBanner type="320x50" />
 *   <AdsterraBanner type="728x90" />
 *
 * To activate: replace the TODO comment inside useEffect with the
 * <script> snippet from your Adsterra dashboard for this banner zone.
 */
import { useEffect, useRef } from 'react';

type BannerType = '728x90' | '320x50';

const SIZES: Record<BannerType, { w: number; h: number }> = {
  '728x90': { w: 728, h: 90 },
  '320x50': { w: 320, h: 50 },
};

interface AdsterraBannerProps {
  type?: BannerType;
  className?: string;
}

export function AdsterraBanner({ type = '320x50', className = '' }: AdsterraBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || el.dataset.adLoaded) return;
    el.dataset.adLoaded = '1';

    // TODO: inject your Adsterra banner script here, e.g.:
    // const s = document.createElement('script');
    // s.src = 'https://pl....effectivecpmnetwork.com/...invoke.js';
    // s.async = true;
    // el.appendChild(s);
  }, []);

  const { w, h } = SIZES[type];

  return (
    <div className={`my-4 flex justify-center ${className}`}>
      <div
        ref={containerRef}
        style={{ width: w, maxWidth: '100%', minHeight: h }}
        aria-label="Advertisement"
      />
    </div>
  );
}
