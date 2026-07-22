import { useEffect, useState } from 'react';

/**
 * AdsterraNative — Adsterra native banner (zone 6e8f0caecc9db716d4b3e637e3185a2d).
 *
 * Uses an iframe to allow multiple instances on the same page without
 * ID collisions. The script inside targets its local container.
 */
export function AdsterraNative({ className = '' }: { className?: string }) {
  const [height, setHeight] = useState(160); // Initial estimated height

  const adHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; overflow: hidden; background: transparent; }
          #container-6e8f0caecc9db716d4b3e637e3185a2d { width: 100%; }
        </style>
      </head>
      <body>
        <div id="container-6e8f0caecc9db716d4b3e637e3185a2d"></div>
        <script async="async" data-cfasync="false" src="//www.effectivecpmnetwork.com/6e8f0caecc9db716d4b3e637e3185a2d/invoke.js"></script>
        <script>
          // Periodically update height to fit content
          function updateHeight() {
            var h = document.body.scrollHeight;
            if (h > 0) window.parent.postMessage({ type: 'adsterra-native-height', height: h, href: window.location.href }, '*');
          }
          var observer = new MutationObserver(updateHeight);
          observer.observe(document.body, { childList: true, subtree: true });
          setInterval(updateHeight, 1000);
        </script>
      </body>
    </html>
  `;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'adsterra-native-height') {
        // We only care about height from our own ads
        setHeight(event.data.height);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className={`my-6 w-full flex justify-center ${className}`}>
      <iframe
        srcDoc={adHtml}
        style={{ width: '100%', height: `${height}px`, border: 'none', display: 'block', maxWidth: '728px' }}
        scrolling="no"
        title="Advertisement"
      />
    </div>
  );
}
