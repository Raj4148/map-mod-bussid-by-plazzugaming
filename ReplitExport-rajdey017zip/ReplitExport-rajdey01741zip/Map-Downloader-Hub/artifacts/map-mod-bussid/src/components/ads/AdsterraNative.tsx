import { useEffect, useRef } from 'react';

interface AdsterraNativeProps {
  className?: string;
}

export function AdsterraNative({ className = '' }: AdsterraNativeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear container on mount
    containerRef.current.innerHTML = '';

    // 1. Create Adsterra Target Container
    const adDiv = document.createElement('div');
    adDiv.id = 'container-6e8f0caecc9db716d4b3e637e3185a2d';
    containerRef.current.appendChild(adDiv);

    // 2. Create and Inject Adsterra Script
    const script = document.createElement('script');
    script.src = 'https://pl30489267.effectivecpmnetwork.com/6e8f0caecc9db716d4b3e637e3185a2d/invoke.js';
    script.async = true;
    script.dataset.cfasync = 'false';
    containerRef.current.appendChild(script);

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full flex justify-center items-center my-4 min-h-[100px] ${className}`}
    />
  );
}
