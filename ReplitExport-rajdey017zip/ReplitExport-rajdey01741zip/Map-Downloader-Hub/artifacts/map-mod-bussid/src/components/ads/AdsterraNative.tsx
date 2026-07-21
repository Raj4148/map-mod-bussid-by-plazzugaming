/**
 * AdsterraNative
 * Native banner slot for Adsterra (blends with content).
 *
 * To activate: replace the `// TODO` comment inside useEffect with
 * the <script> snippet provided by Adsterra for this native slot.
 */
import { useEffect, useRef } from 'react';

interface AdsterraNativeProps {
  className?: string;
}

export function AdsterraNative({ className = '' }: AdsterraNativeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || el.dataset.adLoaded) return;
    el.dataset.adLoaded = '1';

    // TODO: inject your Adsterra native banner script here, e.g.:
    // const s = document.createElement('script');
    // s.src = 'https://pl....effectivecpmnetwork.com/...invoke.js';
    // s.async = true;
    // el.appendChild(s);
  }, []);

  return (
    <div className={`my-4 p-2 ${className}`}>
      <div
        ref={containerRef}
        className="w-full min-h-[100px] bg-muted/40 border border-dashed border-border rounded flex items-center justify-center overflow-hidden"
        aria-label="Advertisement"
      >
        <span className="text-muted-foreground/40 text-[10px] uppercase tracking-widest select-none">
          Native Ad
        </span>
      </div>
    </div>
  );
}
