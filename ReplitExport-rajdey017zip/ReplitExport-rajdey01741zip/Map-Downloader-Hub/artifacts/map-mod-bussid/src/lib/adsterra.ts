const SMART_LINK_URL =
  'https://pl30380326.effectivecpmnetwork.com/1c/8e/a8/1c8ea84455f7f2907cd1f65920c6395b.js';

/** Open the Adsterra smartlink twice (standard Adsterra practice). */
export function triggerSmartLinks(): void {
  try {
    window.open(SMART_LINK_URL, '_blank', 'noopener');
    setTimeout(() => {
      window.open(SMART_LINK_URL, '_blank', 'noopener');
    }, 300);
  } catch {
    // silently ignore popup-blocker rejections
  }
}
