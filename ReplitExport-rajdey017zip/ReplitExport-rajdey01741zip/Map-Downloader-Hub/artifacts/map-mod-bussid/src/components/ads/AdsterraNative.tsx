import { useEffect, useRef, useState } from 'react';

/**
 * AdsterraNative — Native Banner Placement
 *
 * Injects the Adsterra code exactly as provided, using an iframe to support
 * multiple instances on the same page (e.g. grid spacing) without ID conflicts.
 */
export function AdsterraNative({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(160); // Default fallback height

  useEffect(() => {
    if (!containerRef.current) return;

    // Create a unique iframe to isolate this ad instance
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    iframe.style.margin = '0 auto';
    iframe.scrolling = 'no';
    iframe.height = height.toString();

    // Clear and append
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      // Inject the provided codes exactly as requested
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { margin: 0; padding: 0; overflow: hidden; background: transparent; display: flex; justify-content: center; }
              #container-6e8f0caecc9db716d4b3e637e3185a2d { width: 100%; min-height: 50px; }
            </style>
          </head>
          <body>
            <!-- Native Banner Placement -->
            <div id="container-6e8f0caecc9db716d4b3e637e3185a2d"></div>
            <script async="async" data-cfasync="false" src="https://www.effectivecpmnetwork.com/6e8f0caecc9db716d4b3e637e3185a2d/invoke.js"></script>

            <script>
              function notify() {
                var h = document.body.scrollHeight;
                if (h > 0) window.parent.postMessage({ type: 'ad-resize', h: h }, '*');
              }
              window.onload = notify;
              var obs = new MutationObserver(notify);
              obs.observe(document.body, { childList: true, subtree: true });
              setInterval(notify, 1000); // Periodic check for dynamic loading
            </script>
          </body>
        </html>
      `);
      doc.close();
    }

    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === 'ad-resize' && e.source === iframe.contentWindow) {
        setHeight(e.data.h);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div
      className={`w-full flex justify-center my-6 ${className}`}
      ref={containerRef}
      style={{ minHeight: '50px' }}
    />
  );
}
