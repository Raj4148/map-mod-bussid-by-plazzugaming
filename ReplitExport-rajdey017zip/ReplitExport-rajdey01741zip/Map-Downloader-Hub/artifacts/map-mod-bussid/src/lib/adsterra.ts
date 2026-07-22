const SMART_LINK_URL =
  'https://www.effectivecpmnetwork.com/jdcbs1hk9?key=d39b1d6606836661854b0c900f6a6bab';

/** Open the Adsterra smartlink in a new tab. */
export function triggerSmartLinks(): void {
  try {
    window.open(SMART_LINK_URL, '_blank', 'noopener');
  } catch {
    // silently ignore popup-blocker rejections
  }
}
