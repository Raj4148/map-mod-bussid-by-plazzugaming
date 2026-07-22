/**
 * AdsterraNative — Adsterra native banner (zone 6e8f0caecc9db716d4b3e637e3185a2d).
 *
 * Injected once per page load. Ensures the container is ready
 * before the script runs.
 */
import { useEffect, useRef } from 'react';

export function AdsterraNative({ className = '' }: { className?: string }) {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adContainerRef.current) return;

    // Check if script is already in the document to prevent double-loading
    const scriptId = 'adsterra-native-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.dataset.cfasync = 'false';
      script.src = '//www.effectivecpmnetwork.com/6e8f0caecc9db716d4b3e637e3185a2d/invoke.js';
      document.head.appendChild(script);
    }

    // Many Adsterra native scripts are self-executing and look for
    // the container immediately. If it's already loaded, we might
    // need to trigger a re-run, but standard scripts usually don't
    // support this well in React.
    //
    // A reliable fallback is to force the container into the DOM
    // and let the script find it.
  }, []);

  return (
    <div className={`my-8 w-full flex flex-col items-center ${className}`}>
      <div id="container-6e8f0caecc9db716d4b3e637e3185a2d" ref={adContainerRef}></div>
    </div>
  );
}
