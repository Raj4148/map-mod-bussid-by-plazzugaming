import { useEffect, useRef } from 'react';

/**
 * AdsterraNative — Advanced Native Ad component.
 *
 * Uses a unique wrapper and manual DOM injection to bypass React SPA
 * limitations and allow multiple instances (if Adsterra script supports it).
 */
export function AdsterraNative({ className = '' }: { className?: string }) {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adContainerRef.current) return;

    // 1. Clean the specific container for this instance
    const container = adContainerRef.current;
    container.innerHTML = '';

    // 2. Create the target div Adsterra looks for
    const adDiv = document.createElement('div');
    adDiv.id = 'container-6e8f0caecc9db716d4b3e637e3185a2d';
    container.appendChild(adDiv);

    // 3. Force create the script
    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = `https://pl30489267.effectivecpmnetwork.com/6e8f0caecc9db716d4b3e637e3185a2d/invoke.js`;

    // 4. Append script to the same container
    container.appendChild(script);

    return () => {
      // Clean up to prevent duplicate script executions
      container.innerHTML = '';
    };
  }, []);

  return (
    <div
      className={`adsterra-native-wrapper w-full flex justify-center my-8 min-h-[150px] ${className}`}
      ref={adContainerRef}
    />
  );
}
