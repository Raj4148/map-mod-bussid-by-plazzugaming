import React from 'react';

/**
 * AdsterraNative — Native Ad component using an iframe (srcDoc).
 *
 * This isolates the ad script in its own HTML environment to bypass
 * React SPA lifecycle limits, ensuring the script executes on every
 * mount and route change.
 */
export function AdsterraNative() {
  const iframeHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }
          #container-6e8f0caecc9db716d4b3e637e3185a2d { width: 100%; }
        </style>
      </head>
      <body>
        <script async="async" data-cfasync="false" src="https://pl30489267.effectivecpmnetwork.com/6e8f0caecc9db716d4b3e637e3185a2d/invoke.js"></script>
        <div id="container-6e8f0caecc9db716d4b3e637e3185a2d"></div>
      </body>
    </html>
  `;

  return (
    <div className="my-4 w-full flex justify-center items-center min-h-[200px] overflow-hidden">
      <iframe
        title="Adsterra Native Ad"
        srcDoc={iframeHtml}
        style={{ width: '100%', height: '260px', border: 'none', overflow: 'hidden' }}
        scrolling="no"
      />
    </div>
  );
}
