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

export interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  createdAt: Timestamp;
}

export interface CommunityPost {
  id: string;
  content: string;
  author: string;
  createdAt: Timestamp;
  likes: number;
}

export function useCommunity() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time Chat
    const chatQuery = query(
      collection(db, 'community_chat'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribeChat = onSnapshot(chatQuery, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];
      setMessages(msgs.reverse());
      setLoading(false);
    });

    // Real-time Posts
    const postsQuery = query(
      collection(db, 'community_posts'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
      const psts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CommunityPost[];
      setPosts(psts);
    });

    return () => {
      unsubscribeChat();
      unsubscribePosts();
    };
  }, []);

  const sendMessage = async (text: string, sender: string) => {
    if (!text.trim()) return;
    await addDoc(collection(db, 'community_chat'), {
      text,
      sender,
      createdAt: serverTimestamp()
    });
  };

  const createPost = async (content: string, author: string) => {
    if (!content.trim()) return;
    await addDoc(collection(db, 'community_posts'), {
      content,
      author,
      likes: 0,
      createdAt: serverTimestamp()
    });
  };

  return { messages, posts, loading, sendMessage, createPost };
}
