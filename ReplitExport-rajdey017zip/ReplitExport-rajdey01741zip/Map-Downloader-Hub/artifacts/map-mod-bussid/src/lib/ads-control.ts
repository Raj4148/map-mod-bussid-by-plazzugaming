/**
 * Ads Control System
 *
 * Manages the self-click safety mechanism.
 * Visiting /raju disables all ads for the current browser session.
 */

const ADS_DISABLED_KEY = 'plazzu_safe_mode';

export function disableAds(): void {
  localStorage.setItem(ADS_DISABLED_KEY, 'true');
}

export function enableAds(): void {
  localStorage.removeItem(ADS_DISABLED_KEY);
}

export function areAdsEnabled(): boolean {
  // Check if we are in safe mode
  const isSafeMode = localStorage.getItem(ADS_DISABLED_KEY) === 'true';
  return !isSafeMode;
}
