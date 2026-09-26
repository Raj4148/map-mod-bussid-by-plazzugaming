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

export function refreshAdsForZone(_zoneId: string): void {}
export function injectHomePopunder(): void {}
export function injectDownloadPopunder(): void {}
export function injectReadyPopunder(): void {}
export function injectLastPageAd(): void {}
