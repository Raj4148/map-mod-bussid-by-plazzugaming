/**
 * AdsterraNative — Adsterra native banner (zone 6e8f0caecc9db716d4b3e637e3185a2d).
 *
 * Uses a non-sandboxed iframe to ensure the Adsterra script can verify
 * the parent domain while allowing multiple instances on one page.
 */
import { useEffect, useState } from 'react';

interface AdsterraNativeProps {
  className?: string;
}

const NATIVE_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>body { margin: 0; padding: 0; background: transparent; overflow: hidden; display: flex; justify-content: center; }</style>
</head>
<body>
  <script async="async" data-cfasync="false" src="//www.effectivecpmnetwork.com/6e8f0caecc9db716d4b3e637e3185a2d/invoke.js"></script>
  <div id="container-6e8f0caecc9db716d4b3e637e3185a2d"></div>
  <script>
    var observer = new MutationObserver(function() {
      var h = document.body.scrollHeight;
      if (h > 0) window.parent.postMessage({ adNativeHeight: h }, '*');
    });
    observer.observe(document.body, { childList: true, subtree: true });
  </script>
</body>
</html>`;

export function AdsterraNative({ className = '' }: AdsterraNativeProps) {
  const [height, setHeight] = useState(120); // Default placeholder height

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && typeof e.data.adNativeHeight === 'number' && e.data.adNativeHeight > 0) {
        setHeight(e.data.adNativeHeight);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className={`my-6 flex justify-center w-full overflow-hidden ${className}`}>
      <iframe
        srcDoc={NATIVE_HTML}
        scrolling="no"
        style={{
          width: '100%',
          maxWidth: 728,
          height: height,
          border: 'none',
          display: 'block'
        }}
        aria-label="Advertisement"
      />
    </div>
  );
}
