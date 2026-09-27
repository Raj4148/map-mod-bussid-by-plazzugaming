const ADS_DISABLED_KEY = 'plazzu_safe_mode';

export const MONETAG_DIRECT_LINKS = {
  link1: 'https://omg10.com/4/11401834', // Step 1: "Get Map"
  link2: 'https://omg10.com/4/11385854', // Step 1: "Next", Step 3: "Skip Ad", Step 4: "Mirror Link"
  link3: 'https://omg10.com/4/11533894', // Step 3: "Continue", Step 4: "Backup Link"
  link4: 'https://omg10.com/4/11385953', // Step 4: "Fast Download"
} as const;

export function disableAds(): void {
  localStorage.setItem(ADS_DISABLED_KEY, 'true');
}

export function enableAds(): void {
  localStorage.removeItem(ADS_DISABLED_KEY);
}

export function areAdsEnabled(): boolean {
  return localStorage.getItem(ADS_DISABLED_KEY) !== 'true';
}

export function toggleAds(): boolean {
  if (areAdsEnabled()) {
    disableAds();
    return false;
  } else {
    enableAds();
    return true;
  }
}

/** Opens specified Monetag Direct Link in new tab */
export function openMonetagDirectLink(linkUrl: string): void {
  if (!areAdsEnabled()) return;

  try {
    window.open(linkUrl, '_blank', 'noopener,noreferrer');
  } catch (err) {
    console.error(`Failed to open Monetag Direct Link (${linkUrl}):`, err);
  }
}

/** Triggers Monetag Zone ad via direct link mapping */
export function triggerMonetagZone(zoneId: string): void {
  if (!areAdsEnabled()) return;

  let url: string = `https://al5sm.com/direct/${zoneId}`;
  if (zoneId === '11401834') url = MONETAG_DIRECT_LINKS.link1;
  else if (zoneId === '11385854' || zoneId === '11696301') url = MONETAG_DIRECT_LINKS.link2;
  else if (zoneId === '11533894') url = MONETAG_DIRECT_LINKS.link3;
  else if (zoneId === '11385953') url = MONETAG_DIRECT_LINKS.link4;

  openMonetagDirectLink(url);
}

export function injectHomePopunder(): void {}
export function injectDownloadPopunder(): void {}
export function injectReadyPopunder(): void {}
export function injectLastPageAd(): void {}
