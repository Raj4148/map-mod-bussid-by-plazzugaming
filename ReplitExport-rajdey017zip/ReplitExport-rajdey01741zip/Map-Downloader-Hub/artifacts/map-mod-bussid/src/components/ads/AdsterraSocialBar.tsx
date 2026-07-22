/**
 * AdsterraSocialBar — sticky social-bar ad fixed at the bottom of the viewport.
 * Script: https://www.effectivecpmnetwork.com/cd/96/11/cd9611b8d2773da2f22298aae0171feb.js
 *
 * The script self-renders its own UI; this component just injects it once.
 */
import { useEffect } from 'react';

let injected = false;

export function AdsterraSocialBar() {
  useEffect(() => {
    if (injected) return;
    injected = true;

    const script = document.createElement('script');
    script.src =
      'https://www.effectivecpmnetwork.com/cd/96/11/cd9611b8d2773da2f22298aae0171feb.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
