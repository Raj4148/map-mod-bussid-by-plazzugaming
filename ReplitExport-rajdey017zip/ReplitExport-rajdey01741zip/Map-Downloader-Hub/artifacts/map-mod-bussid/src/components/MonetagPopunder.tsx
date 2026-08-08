import { useEffect } from 'react';
import { areAdsEnabled } from '../lib/ads-control';

export function MonetagPopunder() {
  useEffect(() => {
    if (!areAdsEnabled()) return;

    const script = document.createElement('script');
    script.innerHTML = `(function(s){s.dataset.zone='11385556',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`;
    document.head.appendChild(script);

    return () => {
      // Optional: cleanup if needed, though popunders usually stay active
    };
  }, []);

  return null;
}
