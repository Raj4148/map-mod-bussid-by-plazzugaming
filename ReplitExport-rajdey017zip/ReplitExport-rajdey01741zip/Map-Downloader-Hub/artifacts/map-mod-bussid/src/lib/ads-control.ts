const ADS_DISABLED_KEY = 'plazzu_safe_mode';

export function disableAds(): void {
  localStorage.setItem(ADS_DISABLED_KEY, 'true');
}

export function areAdsEnabled(): boolean {
  return localStorage.getItem(ADS_DISABLED_KEY) !== 'true';
}

// These are now handled statically by index.html, download.html, and ready.html
export function injectHomePopunder(): void {}
export function injectDownloadPopunder(): void {}
export function injectReadyPopunder(): void {}
export function injectLastPageAd(): void {}
