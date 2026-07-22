const SMART_LINK_URL =
  'https://www.effectivecpmnetwork.com/p9fs2r3pt?key=724fc0735b995f73810263ea4b3890a2';

/** Open the Adsterra smartlink in a new tab. */
export function triggerSmartLinks(): void {
  try {
    window.open(SMART_LINK_URL, '_blank', 'noopener');
  } catch {
    // silently ignore popup-blocker rejections
  }
}
