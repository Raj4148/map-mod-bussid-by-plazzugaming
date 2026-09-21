const ADS_DISABLED_KEY = 'plazzu_safe_mode';

export function disableAds(): void {
  localStorage.setItem(ADS_DISABLED_KEY, 'true');
}

export function areAdsEnabled(): boolean {
  return localStorage.getItem(ADS_DISABLED_KEY) !== 'true';
}

function clearAllPreviousAds(): void {
  // 1. Remove all Monetag script tags from head and body
  const scripts = document.querySelectorAll('script[src*="tag.min.js"], script[data-zone]');
  scripts.forEach(s => s.remove());

  // 2. Wipe Monetag's internal global objects to prevent "3 Popunder" conflict
  try {
    (window as any)._pop = undefined;
    (window as any)._popunder = undefined;
    (window as any).pop_under = undefined;
  } catch (e) {}
}

function injectZone(zoneId: string): void {
  if (!areAdsEnabled()) return;

  // Clear everything before starting a new zone
  clearAllPreviousAds();

  const s = document.createElement('script');
  s.dataset.zone = zoneId;
  s.src = 'https://al5sm.com/tag.min.js';
  s.async = true;
  document.head.appendChild(s);
}

export function injectHomePopunder(): void {
  // Page 1: Zone 11385556
  injectZone('11385556');
}

export function injectDownloadPopunder(): void {
  // Page 2: Zone 11854955
  injectZone('11854955');
}

export function injectReadyPopunder(): void {
  // Page 3: Zone 11854964
  injectZone('11854964');
}

export function injectLastPageAd(): void {
  if (!areAdsEnabled()) return;
  const s = document.createElement('script');
  s.dataset.zone = '11385886';
  s.src = 'https://nap5k.com/tag.min.js';
  document.body.appendChild(s);
}
