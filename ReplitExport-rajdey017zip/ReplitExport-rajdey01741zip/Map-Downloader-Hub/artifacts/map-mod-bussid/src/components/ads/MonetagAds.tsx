import { useEffect } from 'react';
import { areAdsEnabled, detectCountry, isIndianUser } from '@/lib/ads-control';

export function MonetagAds() {
  useEffect(() => {
    const initAds = async () => {
      if (!areAdsEnabled()) return;

      // Detect country first
      await detectCountry();

      // If user is from India, we do NOT load global scripts (Popunder, Push, Vignette)
      // They only get Direct Links which are handled in MapDetail.tsx
      if (isIndianUser()) {
        console.log('[Ads Hub] Indian user detected. Global scripts suppressed.');
        return;
      }

      // 1. Onclick Popunder (Zone 11385556)
      if (!document.querySelector('script[src*="al5sm.com"]')) {
        const s = document.createElement('script');
        s.dataset.zone = '11385556';
        s.src = 'https://al5sm.com/tag.min.js';
        document.body.appendChild(s);
      }

      // 2. Push Notification (Zone 11385570)
      if (!document.querySelector('script[src*="5gvci.com"]')) {
        const s = document.createElement('script');
        s.src = "https://5gvci.com/act/files/tag.min.js?z=11385570";
        s.dataset.cfasync = "false";
        s.async = true;
        document.body.appendChild(s);
      }

      // 3. Vignette Banner (Zone 11385828)
      if (!document.querySelector('script[src*="n6wxm.com"]')) {
        const s = document.createElement('script');
        s.dataset.zone = '11385828';
        s.src = 'https://n6wxm.com/vignette.min.js';
        document.body.appendChild(s);
      }
    };

    initAds();
  }, []);

  return null;
}
