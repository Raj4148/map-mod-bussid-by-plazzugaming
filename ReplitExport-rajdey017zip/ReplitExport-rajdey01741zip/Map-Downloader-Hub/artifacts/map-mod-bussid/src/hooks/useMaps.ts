import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export type MapCategory = 'indian' | 'nepali' | 'indonesian' | 'all' | 'other';

export interface MapMod {
  id: string;
  name: string;
  category: MapCategory;
  thumbnail: string;
  thumbnail2: string;
  downloadUrl: string;
  downloadCount: number;
  createdAt: number;
  featured: boolean;
  description: string;
}

// Raw shape from Firestore
interface FirestoreMap {
  Name?: string;
  Category?: string;
  Description?: string;
  DownloadCount?: number;
  'Download Count'?: number;   // backward-compat field name
  DownloadLink?: string;
  ImageUrl?: string;
  ImageUrl2?: string;
  IsHot?: boolean;
  timestamp?: number | { seconds: number; nanoseconds: number };
  secret_key?: string;
}

function toMapMod(id: string, data: FirestoreMap): MapMod {
  let createdAt = Date.now();
  if (data.timestamp) {
    if (typeof data.timestamp === 'number') {
      createdAt = data.timestamp;
    } else if (typeof data.timestamp === 'object' && 'seconds' in data.timestamp) {
      createdAt = data.timestamp.seconds * 1000;
    }
  }

  // Normalize Category: "Indian map" or "Indian" -> "indian"
  let catRaw = (data.Category || 'other').toLowerCase();
  let category: MapCategory = 'other';
  if (catRaw.includes('indian'))      category = 'indian';
  else if (catRaw.includes('nepali')) category = 'nepali';
  else if (catRaw.includes('indones')) category = 'indonesian';

  return {
    id,
    name: data.Name || 'Unnamed Map',
    category,
    thumbnail: data.ImageUrl || '',
    thumbnail2: data.ImageUrl2 || '',
    downloadUrl: data.DownloadLink || '#',
    // Ensure downloadCount is a number
    downloadCount: Number(data.DownloadCount ?? data['Download Count'] ?? 0),
    createdAt,
    featured: data.IsHot === true || String(data.IsHot).toLowerCase() === 'true',
    description: data.Description || '',
  };
}

/** Format a download count for display: 1234 → "1.2K", 1500000 → "1.5M" */
export function fmtCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/** Badge logic: returns null | 'HOT' | 'POPULAR' | 'NEW' */
export function getMapBadge(
  map: MapMod,
  isNew: boolean,
  popularThreshold = 500,
): 'HOT' | 'POPULAR' | 'NEW' | null {
  if (map.featured) return 'HOT';
  if (map.downloadCount >= popularThreshold) return 'POPULAR';
  if (isNew) return 'NEW';
  return null;
}

/** True when the map was uploaded within the last 7 days */
export function isMapNew(createdAt: number): boolean {
  return Date.now() - createdAt < 7 * 24 * 60 * 60 * 1000;
}

// Fallback mock data — shown when Firestore is unreachable or empty
const mockMaps: MapMod[] = [
  {
    id: 'mock-1',
    name: 'Solan HP 64 (rework)',
    category: 'indian',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop',
    thumbnail2: '',
    downloadUrl: '#',
    downloadCount: 145020,
    createdAt: Date.now() - 50_000,
    featured: true,
    description: 'Reworked version of the legendary Solan HP 64 map.',
  },
  {
    id: 'mock-2',
    name: 'Ali Temple Mountain Road',
    category: 'nepali',
    thumbnail: 'https://images.unsplash.com/photo-1544735716-392fe2449fee?w=600&auto=format&fit=crop',
    thumbnail2: '',
    downloadUrl: '#',
    downloadCount: 98000,
    createdAt: Date.now() - 200_000,
    featured: true,
    description: 'Sacred mountain road leading to Ali Temple.',
  },
  {
    id: 'mock-3',
    name: 'Death Hill Challenge',
    category: 'indian',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop',
    thumbnail2: '',
    downloadUrl: '#',
    downloadCount: 76500,
    createdAt: Date.now() - 400_000,
    featured: false,
    description: 'Extreme steep hill with hairpin turns.',
  },
  {
    id: 'mock-4',
    name: 'Kelok 44 Sumatra',
    category: 'indonesian',
    thumbnail: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&auto=format&fit=crop',
    thumbnail2: '',
    downloadUrl: '#',
    downloadCount: 112000,
    createdAt: Date.now() - 800_000,
    featured: true,
    description: 'Navigate 44 legendary sharp turns of Sumatra.',
  },
  {
    id: 'mock-5',
    name: 'Delhi Mumbai Highway',
    category: 'indian',
    thumbnail: 'https://images.unsplash.com/photo-1558227976-59062eb1851e?w=600&auto=format&fit=crop',
    thumbnail2: '',
    downloadUrl: '#',
    downloadCount: 89300,
    createdAt: Date.now() - 1_200_000,
    featured: false,
    description: 'A massive highway stretch with authentic Indian scenery.',
  },
  {
    id: 'mock-6',
    name: 'Kathmandu Valley Hills',
    category: 'nepali',
    thumbnail: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=600&auto=format&fit=crop',
    thumbnail2: '',
    downloadUrl: '#',
    downloadCount: 45200,
    createdAt: Date.now() - 2_000_000,
    featured: false,
    description: 'Dangerous but beautiful hilly terrain of Nepal.',
  },
  {
    id: 'mock-7',
    name: 'Java Trans Toll Road',
    category: 'indonesian',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&auto=format&fit=crop',
    thumbnail2: '',
    downloadUrl: '#',
    downloadCount: 34000,
    createdAt: Date.now() - 3_000_000,
    featured: false,
    description: 'High-speed toll road across Java island.',
  },
  {
    id: 'mock-8',
    name: 'Pokhara Offroad',
    category: 'nepali',
    thumbnail: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&auto=format&fit=crop',
    thumbnail2: '',
    downloadUrl: '#',
    downloadCount: 28900,
    createdAt: Date.now() - 4_000_000,
    featured: false,
    description: 'Extreme muddy offroad tracks near Pokhara.',
  },
];

/* ─── Core hook — all maps, ordered newest first ─── */
export function useMaps(category?: string) {
  const [allMaps, setAllMaps] = useState<MapMod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'maps'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const data: MapMod[] = snapshot.docs.map((d) =>
            toMapMod(d.id, d.data() as FirestoreMap)
          );
          setAllMaps(data);
        } else {
          setAllMaps([...mockMaps]);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Firestore error:', err);
        setError(err);
        setAllMaps([...mockMaps]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const maps = useMemo(() => {
    if (!category || category === 'all') return allMaps;
    return allMaps.filter((m) => m.category === category.toLowerCase());
  }, [allMaps, category]);

  return { maps, allMaps, loading, error };
}

/* ─── Top N maps by download count (Featured section) ─── */
export function useTopMaps(limit = 6) {
  const { allMaps, loading, error } = useMaps();
  const maps = useMemo(
    () =>
      [...allMaps]
        .sort((a, b) => b.downloadCount - a.downloadCount)
        .slice(0, limit),
    [allMaps, limit]
  );
  return { maps, loading, error };
}

/* ─── IsHot/featured maps for hero carousel ─── */
export function useFeaturedMaps() {
  const { allMaps, loading, error } = useMaps();
  const maps = useMemo(
    () =>
      allMaps
        .filter((m) => m.featured)
        .sort((a, b) => b.downloadCount - a.downloadCount),
    [allMaps]
  );
  return { maps, loading, error };
}

/* ─── Single map by id ─── */
export function useMap(id: string) {
  const { allMaps, loading, error } = useMaps();
  const map = useMemo(() => allMaps.find((m) => m.id === id) ?? null, [allMaps, id]);
  return { map, loading, error };
}

/* ─── Firestore: increment download counter ─── */
export async function incrementDownloadCount(id: string) {
  try {
    if (id.startsWith('mock-')) return;
    // Write to both field names for full backward/forward compatibility
    await updateDoc(doc(db, 'maps', id), {
      DownloadCount: increment(1),
      'Download Count': increment(1),
    });
  } catch {
    // Non-critical — silently ignore
  }
}
