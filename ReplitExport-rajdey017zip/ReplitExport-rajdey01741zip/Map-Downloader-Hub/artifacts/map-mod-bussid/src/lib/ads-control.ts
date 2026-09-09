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
    s.dataset.zone = '11385556';
    s.src = 'https://al5sm.com/tag.min.js';
    document.body.appendChild(s);
    localStorage.setItem('last_pop_time', now.toString());
  }
}
