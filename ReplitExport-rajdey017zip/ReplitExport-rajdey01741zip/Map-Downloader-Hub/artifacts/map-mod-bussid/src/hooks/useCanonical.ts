import { useEffect } from 'react';

const DOMAIN = 'https://plazzugamingmaps.xyz';

/** Dynamically sets or updates the canonical link tag in <head> for Search Console SEO */
export function useCanonical(path: string): void {
  useEffect(() => {
    let cleanPath = path || '/';
    if (!cleanPath.startsWith('/')) {
      cleanPath = `/${cleanPath}`;
    }

    // Normalize trailing slash (e.g. /maps/ -> /maps) to prevent duplicate canonical errors in GSC
    if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
      cleanPath = cleanPath.slice(0, -1);
    }

    // Normalize index.html references
    if (cleanPath.endsWith('/index.html') || cleanPath === '/index.html') {
      cleanPath = cleanPath.replace('/index.html', '') || '/';
    }

    const fullUrl = `${DOMAIN}${cleanPath}`;

    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }

    link.href = fullUrl;
  }, [path]);
}
