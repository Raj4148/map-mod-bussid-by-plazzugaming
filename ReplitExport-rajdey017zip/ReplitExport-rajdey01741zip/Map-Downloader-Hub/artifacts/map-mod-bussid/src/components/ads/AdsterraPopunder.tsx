/**
 * AdsterraPopunder — fires the new Adsterra smartlink as a popunder
 * on the first user click on the page. One-shot per mount.
 */
import { useEffect, useRef } from 'react';

const SMART_LINK_URL =
  'https://www.effectivecpmnetwork.com/p9fs2r3pt?key=724fc0735b995f73810263ea4b3890a2';

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
