/**
 * Ads Control System
 *
 * Manages the self-click safety mechanism.
 * Visiting /raju disables all ads for the current browser session.
 */

const ADS_DISABLED_KEY = 'plazzu_safe_mode';
const USER_COUNTRY_KEY = 'plazzu_user_country';

export async function detectCountry(): Promise<string> {
  const cached = localStorage.getItem(USER_COUNTRY_KEY);
  if (cached) return cached;

  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    if (data.country_code) {
      localStorage.setItem(USER_COUNTRY_KEY, data.country_code);
      return data.country_code;
    }
  } catch (e) {
    console.error('Geo detection failed:', e);
  }
  return 'UNKNOWN';
}

export function isIndianUser(): boolean {
  return localStorage.getItem(USER_COUNTRY_KEY) === 'IN';
}

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
