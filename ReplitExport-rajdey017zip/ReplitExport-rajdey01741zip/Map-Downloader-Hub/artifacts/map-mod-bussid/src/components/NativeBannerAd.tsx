interface NativeBannerAdProps {
  /** Unique suffix used as the iframe key so React remounts on change */
  idSuffix: string;
}

// Each iframe gets its own isolated document, so the same container ID
// can appear inside every frame without any DOM conflict.
// allow-same-origin is required so Adsterra can access cookies / storage;
// without it the script runs in a null-origin context and the ad stays blank.
const AD_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { background: transparent; overflow: hidden; }
  </style>
</head>
<body>
  <div id="container-80f7fa7719c57e33ec30ee642c6c9d39"></div>
  <script async data-cfasync="false"
    src="https://pl30380328.effectivecpmnetwork.com/80f7fa7719c57e33ec30ee642c6c9d39/invoke.js"
    onerror="void 0"></script>
</body>
</html>`;

export function NativeBannerAd({ idSuffix }: NativeBannerAdProps) {
  return (
    <div
      className="w-full my-4 rounded-xl overflow-hidden"
      style={{ minHeight: 320 }}
    >
      <iframe
        key={idSuffix}
        srcDoc={AD_HTML}
        title={`Advertisement ${idSuffix}`}
        scrolling="auto"
        // allow-same-origin  → Adsterra can read/write cookies & storage
        // allow-scripts      → the invoke.js script can run
        // allow-popups*      → ad click-throughs open in a new tab
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
        style={{ width: '100%', height: 320, border: 'none', display: 'block' }}
      />
    </div>
  );
}
