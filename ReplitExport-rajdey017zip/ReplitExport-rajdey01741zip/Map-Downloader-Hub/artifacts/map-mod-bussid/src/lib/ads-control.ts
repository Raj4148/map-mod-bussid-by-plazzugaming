const ADS_DISABLED_KEY = 'plazzu_safe_mode';

export function disableAds(): void {
  localStorage.setItem(ADS_DISABLED_KEY, 'true');
}

export function areAdsEnabled(): boolean {
  return localStorage.getItem(ADS_DISABLED_KEY) !== 'true';
}

let popunderListener: ((e: MouseEvent) => void) | null = null;

export function injectPopunder(): void {
  if (!areAdsEnabled() || popunderListener) return;

  popunderListener = () => {
    const now = Date.now();
    const lastPop = localStorage.getItem('last_pop_time');
    const ONE_MINUTE = 60 * 1000;

    if (!lastPop || (now - parseInt(lastPop)) > ONE_MINUTE) {
      // Manual Popunder trigger to avoid about:blank hanging
      const adWindow = window.open('https://omg10.com/4/11385556', '_blank', 'noopener');
      if (adWindow) {
        adWindow.blur();
        window.focus();
        localStorage.setItem('last_pop_time', now.toString());
      }
    }
  };

  window.addEventListener('click', popunderListener);
}

export function removePopunder(): void {
  if (popunderListener) {
    window.removeEventListener('click', popunderListener);
    popunderListener = null;
  }
}

export function injectLastPageAd(): void {
  if (!areAdsEnabled()) return;
  const s = document.createElement('script');
  s.dataset.zone = '11385886';
  s.src = 'https://nap5k.com/tag.min.js';
  document.body.appendChild(s);
}
