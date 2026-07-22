/**
 * AdsterraBanner — display fixed-size banner slots.
 * Supports 728x90, 468x60, and 320x50.
 */
import { useEffect, useState } from 'react';

type BannerType = '728x90' | '468x60' | '320x50';

interface AdsterraBannerProps {
  type: BannerType;
  className?: string;
}

const BANNER_CONFIG: Record<BannerType, { key: string; width: number; height: number }> = {
  '468x60': { key: '8c91b676759152319fca5b025f528826', width: 468, height: 60 },
  '320x50': { key: '788a67c50c0daa4caa50fd5da1ec1598', width: 320, height: 50 },
  '728x90': { key: '942ba123281ef93232e40c5a82e994e2', width: 728, height: 90 },
};

function getAdHtml(type: BannerType) {
  const conf = BANNER_CONFIG[type];
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>body { margin: 0; padding: 0; background: transparent; overflow: hidden; display: flex; justify-content: center; }</style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '${conf.key}',
      'format' : 'iframe',
      'height' : ${conf.height},
      'width' : ${conf.width},
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="//www.highperformanceformat.com/${conf.key}/invoke.js"></script>
</body>
</html>`;
}

export function AdsterraBanner({ type, className = '' }: AdsterraBannerProps) {
  const conf = BANNER_CONFIG[type];

  return (
    <div className={`my-4 flex justify-center w-full overflow-hidden ${className}`}>
      <iframe
        srcDoc={getAdHtml(type)}
        sandbox="allow-scripts allow-popups allow-same-origin"
        scrolling="no"
        style={{
          width: '100%',
          maxWidth: conf.width,
          height: conf.height,
          border: 'none',
          display: 'block'
        }}
        aria-label="Advertisement"
      />
    </div>
  );
}
