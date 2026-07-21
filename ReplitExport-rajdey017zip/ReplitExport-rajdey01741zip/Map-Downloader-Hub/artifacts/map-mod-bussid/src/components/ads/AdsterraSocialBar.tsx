/**
 * AdsterraSocialBar — sticky social-bar ad fixed at the bottom of the viewport.
 *
 * To activate: replace the TODO comment inside useEffect with the
 * <script> snippet from your Adsterra dashboard for the Social Bar format.
 */
import { useEffect, useRef } from 'react';

export function AdsterraSocialBar() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || el.dataset.adLoaded) return;
    el.dataset.adLoaded = '1';

    // TODO: inject your Adsterra Social Bar script here, e.g.:
    // const s = document.createElement('script');
    // s.src = 'https://pl....effectivecpmnetwork.com/...socialbar.js';
    // s.async = true;
    // el.appendChild(s);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-0 left-0 right-0 z-50"
      aria-label="Advertisement"
    />
  );
}
