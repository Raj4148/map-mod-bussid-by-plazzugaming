/**
 * AdsterraSocialBar
 * Sticky social-bar ad fixed at the bottom of the viewport.
 * Renders a fixed container and injects the Adsterra Social Bar script once.
 *
 * To activate: replace the `// TODO` comment inside useEffect with
 * the <script> snippet provided by Adsterra for the Social Bar format.
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
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      aria-label="Advertisement"
    >
      {/* Social bar script renders its own UI; placeholder shown until activated */}
    </div>
  );
}
