import { useEffect, useRef } from 'react';

/**
 * AdsterraNative — Adsterra native banner (zone 6e8f0caecc9db716d4b3e637e3185a2d).
 *
 * Refactored to dynamically attach the script inside the container after mounting
 * to ensure the Adsterra script finds the DOM element correctly.
 */
export function AdsterraNative({ className = '' }: { className?: string }) {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Ensure the container div exists
    if (!adContainerRef.current) return;

    // 2. Clear any existing content in the container to avoid duplicates
    adContainerRef.current.innerHTML = '';

    // 3. Create the script element
    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = '//www.effectivecpmnetwork.com/6e8f0caecc9db716d4b3e637e3185a2d/invoke.js';

    // 4. Append the script directly to our ref'd container
    // The invoke.js expects to find 'container-6e8f0caecc9db716d4b3e637e3185a2d'
    // which is the ID of the div below.
    adContainerRef.current.appendChild(script);

    // Cleanup: Clear the container on unmount
    return () => {
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className={`my-8 w-full flex flex-col items-center ${className}`}>
      {/*
        The script targets this specific ID.
        By using a ref and appending the script inside this div's parent,
        we guarantee the ID exists in the DOM when the script starts executing.
      */}
      <div
        id="container-6e8f0caecc9db716d4b3e637e3185a2d"
        ref={adContainerRef}
        className="w-full"
      />
    </div>
  );
}
