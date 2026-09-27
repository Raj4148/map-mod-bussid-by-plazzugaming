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

/** Triggers Monetag Zone ad (opens direct link ad tab + initializes zone script) */
export function triggerMonetagZone(zoneId: string): void {
  if (!areAdsEnabled()) return;

  try {
    // 1. Inject script tag for Monetag Zone
    const existing = document.querySelector(`script[data-zone="${zoneId}"]`);
    if (!existing) {
      const s = document.createElement('script');
      s.dataset.zone = zoneId;
      s.src = 'https://al5sm.com/tag.min.js';
      (document.head || document.documentElement).appendChild(s);
    }

    // 2. Open Monetag Direct Link
    window.open(`https://al5sm.com/direct/${zoneId}`, '_blank', 'noopener,noreferrer');
  } catch (err) {
    console.error(`Failed to trigger Monetag zone ${zoneId}:`, err);
  }
}

export function injectHomePopunder(): void {}
export function injectDownloadPopunder(): void {}
export function injectReadyPopunder(): void {}
export function injectLastPageAd(): void {}
