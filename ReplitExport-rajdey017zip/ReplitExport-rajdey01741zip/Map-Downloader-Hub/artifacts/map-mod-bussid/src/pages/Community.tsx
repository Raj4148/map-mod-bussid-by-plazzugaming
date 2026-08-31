import { useState } from 'react';
import { PageShell } from '../components/Layout';
import { useCommunity } from '../hooks/useCommunity';
import { User, Clock, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Community() {
  const { posts, loading, createPost } = useCommunity();
  const [nickname, setNickname] = useState(() => localStorage.getItem('community_nickname') || '');
  const [isSettingNickname, setIsSettingNickname] = useState(!nickname);
  const [tempNickname, setTempNickname] = useState('');
  const [newPost, setNewPost] = useState('');

  const handleSetNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempNickname.trim()) {
      localStorage.setItem('community_nickname', tempNickname.trim());
      setNickname(tempNickname.trim());
      setIsSettingNickname(false);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim()) {
      createPost(newPost, nickname);
      setNewPost('');
    }
  };

  if (isSettingNickname) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-black text-foreground mb-2">Community Forum</h1>
          <p className="text-muted-foreground text-sm mb-8">Choose a name to start posting and interacting with other users.</p>

          <form onSubmit={handleSetNickname} className="w-full max-w-sm space-y-4">
            <input
              type="text"
              placeholder="Enter your nickname"
              className="w-full px-4 py-4 rounded-2xl bg-card border border-border focus:border-primary outline-none text-foreground font-bold"
              value={tempNickname}
              onChange={(e) => setTempNickname(e.target.value)}
              maxLength={15}
              required
            />
            <button
              type="submit"
              className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all"
            >
              JOIN COMMUNITY
            </button>
          </form>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-foreground uppercase tracking-tight">Community Feed</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase">Share and see posts from other players</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
            <User className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase">{nickname}</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 pb-24">
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Create Post Form */}
          <form onSubmit={handleCreatePost} className="bg-card border border-border rounded-3xl p-5 shadow-sm">
            <textarea
              placeholder="What's happening in your BUSSID world?"
              className="w-full bg-transparent border-none outline-none text-sm font-medium text-foreground resize-none min-h-[80px]"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                {newPost.length}/500 Characters
              </span>
              <button
                type="submit"
                disabled={!newPost.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-black rounded-full shadow-lg active:scale-95 transition-all disabled:opacity-50"
              >
                POST <Send className="w-3 h-3" />
              </button>
            </div>
          </form>

          {/* Posts Feed */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 w-full bg-muted animate-pulse rounded-3xl" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-muted-foreground font-bold text-sm">No posts yet. Be the first to share something!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-card border border-border rounded-3xl p-5 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                      {post.author[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-foreground uppercase tracking-tight">{post.author}</h4>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                      </p>
                    </div>
                  </div>
                  <div className="text-[14px] text-foreground/90 leading-relaxed font-semibold whitespace-pre-wrap break-words">
                    {post.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
