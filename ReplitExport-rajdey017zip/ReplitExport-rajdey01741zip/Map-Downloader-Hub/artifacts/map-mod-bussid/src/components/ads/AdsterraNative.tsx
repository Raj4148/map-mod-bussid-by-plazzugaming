/**
 * AdsterraNative — Adsterra native banner (zone 80f7fa7719c57e33ec30ee642c6c9d39).
 *
 * Each instance renders inside its own <iframe srcDoc> so the Adsterra
 * script always finds the exact container ID it expects without clashing
 * when multiple ads appear on the same page.
 *
 * The iframe height auto-expands via a postMessage from within once the
 * ad renders; it starts at 0 so it collapses cleanly when blocked.
 */
import { useEffect, useRef, useState } from 'react';

interface AdsterraNativeProps {
  className?: string;
}

const AD_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: transparent; overflow: hidden; }
</style>
</head>
<body>
<div id="container-80f7fa7719c57e33ec30ee642c6c9d39"></div>
<script async data-cfasync="false"
  src="https://pl30380328.effectivecpmnetwork.com/80f7fa7719c57e33ec30ee642c6c9d39/invoke.js">
</script>
<script>
  // Notify the parent of our rendered height so the iframe can resize
  var observer = new MutationObserver(function() {
    var h = document.body.scrollHeight;
    if (h > 0) parent.postMessage({ adHeight: h }, '*');
  });
  observer.observe(document.body, { childList: true, subtree: true, attributes: true });
</script>
</body>
</html>`;

export function AdsterraNative({ className = '' }: AdsterraNativeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && typeof e.data.adHeight === 'number' && e.data.adHeight > 0) {
        setHeight(e.data.adHeight);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className={`my-4 w-full overflow-hidden ${className}`}>
      <iframe
        ref={iframeRef}
        srcDoc={AD_HTML}
        sandbox="allow-scripts allow-popups allow-same-origin"
        scrolling="no"
        style={{ width: '100%', height, border: 'none', display: 'block' }}
        aria-label="Advertisement"
      />
    </div>
  );
}
