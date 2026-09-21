const ADS_DISABLED_KEY = 'plazzu_safe_mode';

export function disableAds(): void {
  localStorage.setItem(ADS_DISABLED_KEY, 'true');
}

export function areAdsEnabled(): boolean {
  return localStorage.getItem(ADS_DISABLED_KEY) !== 'true';
}

export function injectPopunder(): void {
  if (!areAdsEnabled()) return;

  const now = Date.now();
  const lastPop = localStorage.getItem('last_pop_time');
  const ONE_MINUTE = 60 * 1000;

  if (!lastPop || (now - parseInt(lastPop)) > ONE_MINUTE) {
    const s = document.createElement('script');
    s.id = 'monetag-popunder';
    s.dataset.zone = '11385556';
    s.src = 'https://al5sm.com/tag.min.js';
    document.body.appendChild(s);
    localStorage.setItem('last_pop_time', now.toString());
  }
}

export function removePopunder(): void {
  const s = document.getElementById('monetag-popunder');
  if (s) s.remove();
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
