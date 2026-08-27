import { useEffect, useState } from 'react';
import { useMaps } from '../hooks/useMaps';

const BASE_URL = 'https://plazzugamingmaps.xyz';

export default function Sitemap() {
  const { allMaps, loading } = useMaps();
  const [xml, setXml] = useState('');

  useEffect(() => {
    if (!loading && allMaps.length > 0) {
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/maps</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  ${allMaps.map(map => `
  <url>
    <loc>${BASE_URL}/map/${map.id}</loc>
    <lastmod>${new Date(map.createdAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`;
      setXml(sitemap);
    }
  }, [allMaps, loading]);

  if (loading) return <div className="p-8 text-muted-foreground font-mono">Generating sitemap...</div>;

  return (
    <pre className="p-4 bg-background text-foreground font-mono text-xs whitespace-pre-wrap break-all select-all">
      {xml}
    </pre>
  );
}
