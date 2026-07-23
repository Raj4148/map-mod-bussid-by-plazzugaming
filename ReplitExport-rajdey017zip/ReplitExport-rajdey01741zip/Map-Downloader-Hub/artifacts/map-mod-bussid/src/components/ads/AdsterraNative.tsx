import { useEffect, useRef, useId } from 'react';

interface AdsterraNativeProps {
  className?: string;
}

/**
 * AdsterraNative — Simplified Native Banner
 *
 * Injects the Adsterra code exactly as provided in the screenshot.
 * Does NOT use iframes. Manually manages the DOM lifecycle to ensure
 * the script executes correctly on every mount and route change.
 */
export function AdsterraNative({ className = '' }: AdsterraNativeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Generate a unique ID for each instance to avoid collisions on the same page
  const uniqueId = useId().replace(/:/g, '');
  const adContainerId = `container-6e8f0caecc9db716d4b3e637e3185a2d-${uniqueId}`;

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    // 1. Create the container div
    const adDiv = document.createElement('div');
    // We use the ID Adsterra expects. Note: If multiple ads exist,
    // we set it to the primary ID first so the script finds it.
    adDiv.id = 'container-6e8f0caecc9db716d4b3e637e3185a2d';
    containerRef.current.appendChild(adDiv);

    // 2. Create and Inject the Script
    const script = document.createElement('script');
    script.src = 'https://pl30489267.effectivecpmnetwork.com/6e8f0caecc9db716d4b3e637e3185a2d/invoke.js';
    script.async = true;
    script.dataset.cfasync = 'false';

    containerRef.current.appendChild(script);

    // Cleanup on unmount
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full flex justify-center items-center my-6 min-h-[120px] ${className}`}
    />
  );
}
