const ADS_DISABLED_KEY = 'plazzu_safe_mode';

export function disableAds(): void {
  localStorage.setItem(ADS_DISABLED_KEY, 'true');
}

export function areAdsEnabled(): boolean {
  return localStorage.getItem(ADS_DISABLED_KEY) !== 'true';
}

function injectZone(zoneId: string): void {
  if (!areAdsEnabled()) return;
  const s = document.createElement('script');
  s.dataset.zone = zoneId;
  s.src = 'https://al5sm.com/tag.min.js';
  document.head.appendChild(s);
}

export function injectHomePopunder(): void {
  // Page 1: Detail/Home (Zone 11385556)
  injectZone('11385556');
}

export function injectDownloadPopunder(): void {
  // Page 2: Download/SEO (Zone 11854955)
  injectZone('11854955');
}

export function injectReadyPopunder(): void {
  // Page 3: Ready/Final (Zone 11854964)
  injectZone('11854964');
}

export function injectLastPageAd(): void {
  if (!areAdsEnabled()) return;
  const s = document.createElement('script');
  s.dataset.zone = '11385886';
  s.src = 'https://nap5k.com/tag.min.js';
  document.body.appendChild(s);
}
