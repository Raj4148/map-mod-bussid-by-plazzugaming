const ADS_DISABLED_KEY = 'plazzu_safe_mode';

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

/** Refresh/re-inject Monetag Popunder ad script for a given zone */
export function refreshAdsForZone(zoneId: string): void {
  if (!areAdsEnabled()) return;

  try {
    const existing = document.querySelector(`script[data-zone="${zoneId}"]`);
    if (existing) {
      existing.remove();
    }

    const s = document.createElement('script');
    s.dataset.zone = zoneId;
    s.src = 'https://al5sm.com/tag.min.js';
    (document.head || document.documentElement).appendChild(s);
  } catch (err) {
    console.error('Failed to refresh ad zone:', err);
  }
}

export function injectHomePopunder(): void {
  refreshAdsForZone('11385556');
}

export function injectDownloadPopunder(): void {
  refreshAdsForZone('11854955');
}

export function injectReadyPopunder(): void {
  refreshAdsForZone('11854964');
}

export function injectLastPageAd(): void {}
