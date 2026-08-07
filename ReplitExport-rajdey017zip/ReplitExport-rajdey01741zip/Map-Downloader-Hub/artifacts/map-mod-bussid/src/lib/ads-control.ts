/**
 * Ads Control System
 *
 * Unified system for all regions.
 * Managed self-click safety remains active.
 */

const ADS_DISABLED_KEY = 'plazzu_safe_mode';

// Geographic logic removed as per user request (No restrictions for India)
export async function detectCountry(): Promise<string> {
  return 'ALL';
}

export function isIndianUser(): boolean {
  return false;
}

export function disableAds(): void {
  localStorage.setItem(ADS_DISABLED_KEY, 'true');
}

export function enableAds(): void {
  localStorage.removeItem(ADS_DISABLED_KEY);
}

export function areAdsEnabled(): boolean {
  const isSafeMode = localStorage.getItem(ADS_DISABLED_KEY) === 'true';
  return !isSafeMode;
}
