const ADS_DISABLED_KEY = 'plazzu_safe_mode';

export function disableAds(): void {
  localStorage.setItem(ADS_DISABLED_KEY, 'true');
}

export function areAdsEnabled(): boolean {
  return localStorage.getItem(ADS_DISABLED_KEY) !== 'true';
}

function clearPopunderScripts(): void {
  const scripts = document.querySelectorAll('script[data-popunder="true"]');
  scripts.forEach(s => s.remove());
}

function injectScript(zoneId: string, src = 'https://al5sm.com/tag.min.js'): void {
  if (!areAdsEnabled()) return;
  clearPopunderScripts();

  const s = document.createElement('script');
  s.dataset.zone = zoneId;
  s.src = src;
  s.dataset.popunder = "true";
  document.body.appendChild(s);
}

export function injectHomePopunder(): void {
  // Old Monetag Popunder (Zone 11385556)
  injectScript('11385556');
}

export function injectDownloadPopunder(): void {
  // index2 context (Zone 11854955)
  injectScript('11854955');
}

export function injectReadyPopunder(): void {
  // index3 context (Zone 11854964)
  injectScript('11854964');
}

export function injectLastPageAd(): void {
  if (!areAdsEnabled()) return;
  const s = document.createElement('script');
  s.dataset.zone = '11385886';
  s.src = 'https://nap5k.com/tag.min.js';
  document.body.appendChild(s);
}
