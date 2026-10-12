import { useEffect } from 'react';
import { useMaps } from '../hooks/useMaps';

const BASE_URL = 'https://plazzugamingmaps.xyz';

export default function Sitemap() {
  const { allMaps, loading } = useMaps();

  useEffect(() => {
    document.title = 'sitemap.xml';
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, follow');
  }, []);

  const staticUrls = [
    { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${BASE_URL}/maps`, priority: '0.9', changefreq: 'daily' },
    { loc: `${BASE_URL}/community`, priority: '0.7', changefreq: 'weekly' },
    { loc: `${BASE_URL}/maps?category=indian`, priority: '0.8', changefreq: 'daily' },
    { loc: `${BASE_URL}/maps?category=nepali`, priority: '0.8', changefreq: 'daily' },
    { loc: `${BASE_URL}/maps?category=indonesian`, priority: '0.8', changefreq: 'daily' },
  ];

  if (loading) {
    return (
      <pre style={{ margin: 0, padding: '1rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px' }}>
        {`<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generating dynamic sitemap from Firestore... -->`}
      </pre>
    );
  }

  const mapUrls = allMaps.map((map) => {
    const dateStr = new Date(map.createdAt || Date.now()).toISOString().split('T')[0];
    return `  <url>
    <loc>${BASE_URL}/map/${map.id}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
${mapUrls.join('\n')}
</urlset>`;

  return (
    <pre style={{ margin: 0, padding: '1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '12px' }}>
      {xmlContent}
    </pre>
  );
}
