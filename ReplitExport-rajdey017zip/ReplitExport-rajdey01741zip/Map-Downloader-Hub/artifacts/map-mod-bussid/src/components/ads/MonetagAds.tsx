import { useEffect } from 'react';
import { areAdsEnabled, detectCountry, isIndianUser } from '@/lib/ads-control';

/**
 * MonetagAds Component — Handles Multitag integration.
 * Optimized for better CPM using Monetag's AI Multitag feature.
 */
export function MonetagAds() {
  useEffect(() => {
    const initAds = async () => {
      if (!areAdsEnabled()) return;

      // Detect country first
      await detectCountry();

      // If user is from India, we do NOT load global scripts (Popunder, Push, etc.)
      // They only get the high-intent Direct Links on buttons.
      if (isIndianUser()) {
        console.log('[Ads Hub] Indian user detected. Multitag suppressed to favor Direct Links.');
        return;
      }

      // Monetag Multitag (Zone 267895)
      // This single script replaces Popunder, Push, and Vignette with AI optimization.
      if (!document.querySelector('script[data-zone="267895"]')) {
        const s = document.createElement('script');
        s.src = "https://quge5.com/88/tag.min.js";
        s.dataset.zone = "267895";
        s.async = true;
        s.dataset.cfasync = "false";
        document.body.appendChild(s);
      }
    };

    initAds();
  }, []);

  return null;
}
