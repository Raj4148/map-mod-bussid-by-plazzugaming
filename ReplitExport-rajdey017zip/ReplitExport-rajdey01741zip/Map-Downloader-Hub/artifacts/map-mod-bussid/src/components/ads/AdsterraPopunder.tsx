import { useEffect } from 'react';

/**
 * AdsterraPopunder — Official Popunder Script
 *
 * Injects the Adsterra popunder script. This script handles its own
 * frequency capping and user interaction detection.
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

    return () => {
      // We don't necessarily remove the script on unmount because it
      // might have global handlers, but for React SPAs, sometimes it helps.
    };
  }, []);

  return null;
}
