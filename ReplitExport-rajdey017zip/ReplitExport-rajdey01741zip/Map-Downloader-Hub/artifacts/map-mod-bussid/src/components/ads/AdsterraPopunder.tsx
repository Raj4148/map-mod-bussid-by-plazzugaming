/**
 * AdsterraPopunder
 * Fires the Adsterra Popunder script on the first user interaction with the page.
 * Uses a one-shot click listener so it only triggers once per mount.
 *
 * To activate: replace the `// TODO` comment inside the handler with
 * the Adsterra Popunder script injection provided for your zone.
 */
import { useEffect, useRef } from 'react';

export function AdsterraPopunder() {
  const firedRef = useRef(false);

  useEffect(() => {
    const handleFirstClick = () => {
      if (firedRef.current) return;
      firedRef.current = true;

      // TODO: inject your Adsterra Popunder script here, e.g.:
      // const s = document.createElement('script');
      // s.src = 'https://pl....effectivecpmnetwork.com/...popunder.js';
      // s.async = true;
      // document.head.appendChild(s);
    };

    document.addEventListener('click', handleFirstClick, { once: true });
    return () => document.removeEventListener('click', handleFirstClick);
  }, []);

  return null;
}
