const ADS_DISABLED_KEY = 'plazzu_safe_mode';

export function disableAds(): void {
  localStorage.setItem(ADS_DISABLED_KEY, 'true');
}

export function areAdsEnabled(): boolean {
  return localStorage.getItem(ADS_DISABLED_KEY) !== 'true';
}

export function injectPopunder(): void {
  // Global Smart Tag in index.html (Zone 11854975) handles clicks now
}

export function removePopunder(): void {
  // Global Smart Tag handles itself
}

export function injectLastPageAd(): void {
  if (!areAdsEnabled()) return;
  const s = document.createElement('script');
  s.dataset.zone = '11385886';
  s.src = 'https://nap5k.com/tag.min.js';
  document.body.appendChild(s);
}

export function injectFunnelAd(): void {
  if (!areAdsEnabled()) return;
  if (document.getElementById('funnel-ad-script')) return;

  const s = document.createElement('script');
  s.id = 'funnel-ad-script';
  s.dataset.zone = '11854975';
  s.src = 'https://al5sm.com/tag.min.js';
  document.body.appendChild(s);
}

export function removeFunnelAd(): void {
  const s = document.getElementById('funnel-ad-script');
  if (s) s.remove();
}
