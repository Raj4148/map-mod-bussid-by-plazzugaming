/**
 * AdsterraBanner — display banner slot.
 * Zone: 80f7fa7719c57e33ec30ee642c6c9d39 (same invoke.js as native banner)
 *
 * Rendered inside an isolated <iframe srcDoc> so the container ID
 * never clashes with AdsterraNative instances on the same page.
 * The iframe starts at 0px height and expands once the ad renders.
 */
import { useEffect, useRef, useState } from 'react';

interface AdsterraBannerProps {
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
  var observer = new MutationObserver(function() {
    var h = document.body.scrollHeight;
    if (h > 0) parent.postMessage({ adBannerHeight: h }, '*');
  });
  observer.observe(document.body, { childList: true, subtree: true, attributes: true });
</script>
</body>
</html>`;

export function AdsterraBanner({ className = '' }: AdsterraBannerProps) {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && typeof e.data.adBannerHeight === 'number' && e.data.adBannerHeight > 0) {
        setHeight(e.data.adBannerHeight);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className={`my-4 flex justify-center w-full overflow-hidden ${className}`}>
      <iframe
        srcDoc={AD_HTML}
        sandbox="allow-scripts allow-popups allow-same-origin"
        scrolling="no"
        style={{ width: '100%', maxWidth: 728, height, border: 'none', display: 'block' }}
        aria-label="Advertisement"
      />
    </div>
  );
}
