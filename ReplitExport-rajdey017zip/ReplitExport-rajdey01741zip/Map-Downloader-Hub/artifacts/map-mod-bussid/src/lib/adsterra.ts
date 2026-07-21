/**
 * Adsterra Smartlink — opens the smartlink in a new tab.
 * Replace SMARTLINK_URL with your actual Adsterra smartlink.
 */
const SMARTLINK_URL =
  'https://pl30380326.effectivecpmnetwork.com/1c/8e/a8/1c8ea84455f7f2907cd1f65920c6395b.js';

export function triggerSmartLinks(): void {
  try {
    window.open(SMARTLINK_URL, '_blank');
  } catch {
    // silently ignore popup-blocker rejections
  }
}
