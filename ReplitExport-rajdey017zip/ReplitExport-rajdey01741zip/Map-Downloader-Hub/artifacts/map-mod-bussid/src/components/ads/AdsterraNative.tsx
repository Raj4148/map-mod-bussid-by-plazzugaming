/**
 * AdsterraNative — Adsterra native banner (zone 6e8f0caecc9db716d4b3e637e3185a2d).
 *
 * Injected directly into the DOM using a script tag to ensure Adsterra can
 * verify the domain and render the complex native layout correctly.
 */
import { useEffect, useRef } from 'react';

interface AdsterraNativeProps {
  className?: string;
}

export function AdsterraNative({ className = '' }: AdsterraNativeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = '//www.effectivecpmnetwork.com/6e8f0caecc9db716d4b3e637e3185a2d/invoke.js';

    const container = document.createElement('div');
    container.id = 'container-6e8f0caecc9db716d4b3e637e3185a2d';

    containerRef.current.appendChild(script);
    containerRef.current.appendChild(container);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`my-4 w-full min-h-[100px] flex flex-col items-center justify-center ${className}`}
    />
  );
}
