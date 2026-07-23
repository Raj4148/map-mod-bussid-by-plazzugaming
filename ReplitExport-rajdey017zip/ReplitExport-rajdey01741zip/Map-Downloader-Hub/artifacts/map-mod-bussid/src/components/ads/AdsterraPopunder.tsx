import { useEffect } from 'react';

/**
 * AdsterraPopunder — Official Popunder Script
 *
 * Injects the Adsterra popunder script. This script handles its own
 * frequency capping and user interaction detection, making it the
 * safest and most reliable way to run popunders without account risk.
 */
export function AdsterraPopunder() {
  useEffect(() => {
    // Prevent multiple injections
    const scriptId = 'adsterra-popunder-script';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.src = 'https://pl30489264.effectivecpmnetwork.com/8c/67/b3/8c67b3537755aafc3785cd4457eba1d.js';

    document.body.appendChild(script);
  }, []);

  return null;
}
