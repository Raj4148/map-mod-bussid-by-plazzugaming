import { useEffect } from 'react';
import { areAdsEnabled } from '@/lib/ads-control';

export function MonetagAds() {
  useEffect(() => {
    if (!areAdsEnabled()) return;

    // 1. Onclick Popunder
    const popunder = document.createElement('script');
    popunder.innerHTML = "(function(s){s.dataset.zone='11385556',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))";
    document.body.appendChild(popunder);

    // 2. Push Notification
    const push = document.createElement('script');
    push.src = "https://5gvci.com/act/files/tag.min.js?z=11385570";
    push.dataset.cfasync = "false";
    push.async = true;
    document.body.appendChild(push);

    // 3. Vignette Banner
    const vignette = document.createElement('script');
    vignette.innerHTML = "(function(s){s.dataset.zone='11385828',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))";
    document.body.appendChild(vignette);

  }, []);

  return null;
}
