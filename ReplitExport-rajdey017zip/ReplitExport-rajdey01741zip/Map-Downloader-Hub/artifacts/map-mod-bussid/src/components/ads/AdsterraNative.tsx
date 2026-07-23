import { useEffect, useRef } from 'react';

/**
 * AdsterraNative — Reusable Native Ad component
 *
 * Safely injects and executes the Adsterra script inside a React component.
 * Uses a unique wrapper to prevent conflicts and ensure script runs on mount.
 */
export function AdsterraNative({ className = '' }: { className?: string }) {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure the container exists
    if (!adContainerRef.current) return;

    // 1. Clear previous content to handle route changes and re-renders
    adContainerRef.current.innerHTML = '';

    // 2. Create the container div with the ID expected by Adsterra
    // Note: If multiple instances are on one page, they will all share this ID.
    // Adsterra's invoke.js will typically look for this ID.
    const adDiv = document.createElement('div');
    adDiv.id = 'container-6e8f0caecc9db716d4b3e637e3185a2d';
    adDiv.style.width = '100%';
    adDiv.style.minHeight = '50px';
    adContainerRef.current.appendChild(adDiv);

    // 3. Create the script element
    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = 'false';
    // Using the NEW provided script source
    script.src = 'https://pl30489267.effectivecpmnetwork.com/6e8f0caecc9db716d4b3e637e3185a2d/invoke.js';

    // 4. Append script to the container
    adContainerRef.current.appendChild(script);

    // Cleanup logic: Clear container on unmount to prevent ghost elements
    return () => {
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      className={`w-full flex justify-center my-8 ${className}`}
      ref={adContainerRef}
    />
  );
}
