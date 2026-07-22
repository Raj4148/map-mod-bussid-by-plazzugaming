/**
 * AdsterraSocialBar — sticky social-bar ad fixed at the bottom of the viewport.
 * Script: https://pl30380326.effectivecpmnetwork.com/1c/8e/a8/1c8ea84455f7f2907cd1f65920c6395b.js
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
      'https://pl30380326.effectivecpmnetwork.com/1c/8e/a8/1c8ea84455f7f2907cd1f65920c6395b.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
