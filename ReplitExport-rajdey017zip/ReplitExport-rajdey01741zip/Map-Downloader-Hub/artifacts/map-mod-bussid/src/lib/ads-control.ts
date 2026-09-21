const ADS_DISABLED_KEY = 'plazzu_safe_mode';

export function disableAds(): void {
  localStorage.setItem(ADS_DISABLED_KEY, 'true');
}

export function areAdsEnabled(): boolean {
  return localStorage.getItem(ADS_DISABLED_KEY) !== 'true';
}

function clearPopunderScripts(): void {
  // 1. Remove all previous popunder script tags
  const scripts = document.querySelectorAll('script[data-popunder="true"]');
  scripts.forEach(s => s.remove());

  // 2. Attempt to neutralize Monetag's internal listeners if they exist
  // This helps prevent "Double Popunder" blocks by the browser
  try {
    (window as any)._pop = undefined;
    (window as any)._popunder = undefined;
  } catch (e) {}
}

function injectScript(zoneId: string): void {
  if (!areAdsEnabled()) return;

  // If this exact zone is already active, don't re-inject
  if (document.querySelector(`script[data-zone="${zoneId}"]`)) return;

  clearPopunderScripts();

  const s = document.createElement('script');
  s.dataset.zone = zoneId;
  s.src = 'https://al5sm.com/tag.min.js';
  s.dataset.popunder = "true";
  s.async = true;
  document.body.appendChild(s);
}

export function injectHomePopunder(): void {
  // Zone for Page 1 (Detail/Home)
  injectScript('11385556');
}

export function injectDownloadPopunder(): void {
  // Zone for Page 2 (Download/SEO)
  injectScript('11854955');
}

export function injectReadyPopunder(): void {
  // Zone for Page 3 (Ready/Final)
  injectScript('11854964');
}

export function injectLastPageAd(): void {
  if (!areAdsEnabled()) return;
  const s = document.createElement('script');
  s.dataset.zone = '11385886';
  s.src = 'https://nap5k.com/tag.min.js';
  document.body.appendChild(s);
}
