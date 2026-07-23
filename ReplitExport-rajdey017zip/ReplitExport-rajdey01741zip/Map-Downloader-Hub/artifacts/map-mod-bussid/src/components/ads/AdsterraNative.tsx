import { useEffect, useRef } from 'react';

/**
 * AdsterraNative — Dedicated Native Ad component.
 *
 * Manually handles script re-injection to ensure ads render dynamically
 * on React route changes and mount/unmount cycles.
 */
export function AdsterraNative() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Clear any existing elements inside container to prevent duplication
    containerRef.current.innerHTML = '';

    // 2. Create target div with the specific ID Adsterra expects
    const adDiv = document.createElement('div');
    adDiv.id = 'container-6e8f0caecc9db716d4b3e637e3185a2d';
    containerRef.current.appendChild(adDiv);

    // 3. Inject Adsterra Invoke Script manually
    const script = document.createElement('script');
    script.src = 'https://pl30489267.effectivecpmnetwork.com/6e8f0caecc9db716d4b3e637e3185a2d/invoke.js';
    script.async = true;
    script.dataset.cfasync = 'false';

    // 4. Append script to the container so it executes relative to the target div
    containerRef.current.appendChild(script);

    // Cleanup logic: Clear container on unmount to prevent memory leaks
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="my-4 text-center min-h-[100px] w-full flex flex-col items-center overflow-hidden"
    />
  );
}
