import { useEffect } from 'react';

/**
 * AdsterraSocialBar — sticky social-bar ad fixed at the bottom of the viewport.
 */
export function AdsterraSocialBar() {
  useEffect(() => {
    const scriptId = 'adsterra-socialbar-script';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.src = 'https://pl30489265.effectivecpmnetwork.com/cd/96/11/cd9611b8d2773da2f22298aae0171feb.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
