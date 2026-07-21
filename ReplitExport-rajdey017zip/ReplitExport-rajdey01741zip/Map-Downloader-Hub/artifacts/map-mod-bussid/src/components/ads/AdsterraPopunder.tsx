/**
 * AdsterraPopunder — fires the Adsterra smartlink as a popunder
 * on the first user click on the page. One-shot per mount.
 */
import { useEffect, useRef } from 'react';

const SMART_LINK_URL =
  'https://pl30380326.effectivecpmnetwork.com/1c/8e/a8/1c8ea84455f7f2907cd1f65920c6395b.js';

export function AdsterraPopunder() {
  const firedRef = useRef(false);

  useEffect(() => {
    const handleFirstClick = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      try {
        window.open(SMART_LINK_URL, '_blank', 'noopener');
      } catch {
        // silently ignore popup-blocker rejections
      }
    };

    document.addEventListener('click', handleFirstClick, { once: true });
    return () => document.removeEventListener('click', handleFirstClick);
  }, []);

  return null;
}
