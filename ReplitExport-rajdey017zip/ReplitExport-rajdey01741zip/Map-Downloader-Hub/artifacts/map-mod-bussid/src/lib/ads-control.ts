const ADS_DISABLED_KEY = 'plazzu_safe_mode';
const MONETAG_ZONE_1 = '11385556';

export function disableAds(): void {
  localStorage.setItem(ADS_DISABLED_KEY, 'true');
}

export function enableAds(): void {
  localStorage.removeItem(ADS_DISABLED_KEY);
}

export function areAdsEnabled(): boolean {
  return localStorage.getItem(ADS_DISABLED_KEY) !== 'true';
}

export function toggleAds(): boolean {
  if (areAdsEnabled()) {
    disableAds();
    return false;
  } else {
    enableAds();
    return true;
  }
}

/** Ensure Monetag Zone 1 Popunder script is active across full site */
export function injectHomePopunder(): void {
  if (!areAdsEnabled()) return;

  try {
    const existing = document.querySelector(`script[data-zone="${MONETAG_ZONE_1}"]`);
    if (existing) {
      return;
    }

    const s = document.createElement('script');
    s.dataset.zone = MONETAG_ZONE_1;
    s.src = 'https://al5sm.com/tag.min.js';
    (document.head || document.documentElement).appendChild(s);
  } catch (err) {
    console.error('Failed to inject Monetag Zone 1:', err);
  }
}

export function injectDownloadPopunder(): void {
  injectHomePopunder();
}

export function injectReadyPopunder(): void {
  injectHomePopunder();
}

export function injectLastPageAd(): void {}
