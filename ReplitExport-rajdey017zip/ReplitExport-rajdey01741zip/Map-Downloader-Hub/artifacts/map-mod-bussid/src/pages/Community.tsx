import { useState, useRef, useEffect } from 'react';
import { PageShell } from '../components/Layout';
import { useCommunity } from '../hooks/useCommunity';
import { MessageSquare, Send, User, Clock, Heart, PlusCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Community() {
  const { messages, posts, loading, sendMessage, createPost } = useCommunity();
  const [activeTab, setActiveTab] = useState<'posts' | 'chat'>('posts');
  const [nickname, setNickname] = useState(() => localStorage.getItem('community_nickname') || '');
  const [isSettingNickname, setIsSettingNickname] = useState(!nickname);
  const [tempNickname, setTempNickname] = useState('');

  const [newMessage, setNewMessage] = useState('');
  const [newPost, setNewPost] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const handleSetNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempNickname.trim()) {
      localStorage.setItem('community_nickname', tempNickname.trim());
      setNickname(tempNickname.trim());
      setIsSettingNickname(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage, nickname);
      setNewMessage('');
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
          <h1 className="text-2xl font-black text-foreground mb-2">Welcome to Community</h1>
          <p className="text-muted-foreground text-sm mb-8">Please choose a nickname to join the discussion.</p>

          <form onSubmit={handleSetNickname} className="w-full max-w-sm space-y-4">
            <input
              type="text"
              placeholder="Your Nickname"
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
              START CHATTING
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
          <h1 className="text-xl font-black text-foreground">Community</h1>
          <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
            <User className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground">{nickname}</span>
          </div>
        </div>

        <div className="flex px-4 gap-6">
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-3 text-sm font-black transition-all border-b-2 ${
              activeTab === 'posts' ? 'text-primary border-primary' : 'text-muted-foreground border-transparent'
            }`}
          >
            POSTS
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-3 text-sm font-black transition-all border-b-2 ${
              activeTab === 'chat' ? 'text-primary border-primary' : 'text-muted-foreground border-transparent'
            }`}
          >
            LIVE CHAT
          </button>
        </div>
      </div>

      <div className="px-4 py-6 pb-24">
        {activeTab === 'posts' ? (
          <div className="space-y-6">
            {/* Create Post */}
            <form onSubmit={handleCreatePost} className="bg-card border border-border rounded-3xl p-4 shadow-sm">
              <textarea
                placeholder="What's on your mind about BUSSID?"
                className="w-full bg-transparent border-none outline-none text-sm font-medium text-foreground resize-none min-h-[100px]"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                maxLength={280}
              />
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
                <span className="text-[10px] text-muted-foreground font-bold uppercase">{newPost.length}/280</span>
                <button
                  type="submit"
                  disabled={!newPost.trim()}
                  className="px-6 py-2 bg-primary text-white text-xs font-black rounded-full shadow-lg active:scale-95 transition-all disabled:opacity-50"
                >
                  POST
                </button>
              </div>
            </form>

            {/* Posts List */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-card border border-border rounded-3xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-black text-sm uppercase">
                      {post.author[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-foreground">{post.author}</h4>
                      <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'just now'}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed font-medium whitespace-pre-wrap">
                    {post.content}
                  </p>
                  <div className="mt-4 pt-4 border-t border-border/30 flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-muted-foreground hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-[10px] font-black">{post.likes || 0}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-muted-foreground transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-[10px] font-black">Reply</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[65vh]">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === nickname ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[9px] font-black text-muted-foreground uppercase">{msg.sender}</span>
                    <span className="text-[8px] text-muted-foreground/50 font-bold">
                      {msg.createdAt ? formatDistanceToNow(msg.createdAt.toDate(), { addSuffix: true }) : ''}
                    </span>
                  </div>
                  <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm font-bold leading-tight ${
                    msg.sender === nickname
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-card border border-border text-foreground rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="mt-4 sticky bottom-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full pl-4 pr-12 py-4 rounded-2xl bg-card border border-border focus:border-primary outline-none text-sm font-bold text-foreground shadow-lg"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </PageShell>
  );
}
