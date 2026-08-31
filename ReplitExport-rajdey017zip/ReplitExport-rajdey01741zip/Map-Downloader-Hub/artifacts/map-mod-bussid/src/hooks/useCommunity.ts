import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface CommunityPost {
  id: string;
  content: string;
  author: string;
  createdAt: Timestamp;
}

export function useCommunity() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time Posts
    const postsQuery = query(
      collection(db, 'community_posts'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
      const psts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CommunityPost[];
      setPosts(psts);
      setLoading(false);
    });

    return () => {
      unsubscribePosts();
    };
  }, []);

  const createPost = async (content: string, author: string) => {
    if (!content.trim()) return;
    await addDoc(collection(db, 'community_posts'), {
      content,
      author,
      createdAt: serverTimestamp()
    });
  };

  return { posts, loading, createPost };
}
