import { useEffect } from 'react';
import { areAdsEnabled } from '@/lib/ads-control';

/**
 * MonetagAds Component — Handles Multitag integration.
 * Unified for all users (No geo-restrictions).
 */
export function MonetagAds() {
  useEffect(() => {
    if (!areAdsEnabled()) return;

    // Monetag Multitag (Zone 267895)
    // AI-optimized ad delivery for all regions.
    if (!document.querySelector('script[data-zone="267895"]')) {
      const s = document.createElement('script');
      s.src = "https://quge5.com/88/tag.min.js";
      s.dataset.zone = "267895";
      s.async = true;
      s.dataset.cfasync = "false";
      document.body.appendChild(s);
    }
  }, []);

  return null;
}
