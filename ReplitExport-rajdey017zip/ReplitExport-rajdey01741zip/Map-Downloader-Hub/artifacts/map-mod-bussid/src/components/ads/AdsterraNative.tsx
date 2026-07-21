/**
 * AdsterraNative — native banner slot for Adsterra.
 *
 * To activate: replace the TODO comment inside useEffect with the
 * <script> snippet from your Adsterra dashboard for this native zone.
 */
import { useEffect, useRef } from 'react';

interface AdsterraNativeProps {
  className?: string;
}

export function AdsterraNative({ className = '' }: AdsterraNativeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || el.dataset.adLoaded) return;
    el.dataset.adLoaded = '1';

    // TODO: inject your Adsterra native banner script here, e.g.:
    // const s = document.createElement('script');
    // s.src = 'https://pl....effectivecpmnetwork.com/...invoke.js';
    // s.async = true;
    // el.appendChild(s);
  }, []);

  return (
    <div className={`my-4 ${className}`}>
      <div
        ref={containerRef}
        style={{ minHeight: 90 }}
        aria-label="Advertisement"
      />
    </div>
  );
}
