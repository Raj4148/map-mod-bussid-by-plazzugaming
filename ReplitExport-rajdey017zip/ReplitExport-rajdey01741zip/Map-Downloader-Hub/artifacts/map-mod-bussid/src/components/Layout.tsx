import { Link, useLocation } from 'wouter';
import { Home, Star, Settings } from 'lucide-react';

import { useTheme } from '../lib/theme-context';
import { AdsterraSocialBar } from './ads/AdsterraSocialBar';

/* ─── Bottom Navigation Bar ─── */
export function BottomNav() {
  const [location] = useLocation();
  const { darkMode } = useTheme();

  const tabs = [
    { href: '/',         label: 'Home',     icon: Home     },
    { href: '/maps',     label: 'Popular',  icon: Star     },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t flex items-center justify-around px-4 py-2 pb-safe transition-colors ${
      darkMode
        ? 'bg-[#1a1a2e] border-white/10'
        : 'bg-white border-slate-200 shadow-[0_-1px_6px_rgba(0,0,0,0.06)]'
    }`}>
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = location === href || (href !== '/' && location.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 min-w-[60px]"
          >
            <div className={`w-12 h-8 flex items-center justify-center rounded-full transition-all ${
              active ? 'bg-primary/20' : ''
            }`}>
              <Icon className={`w-5 h-5 transition-colors ${
                active ? 'text-primary' : darkMode ? 'text-white/40' : 'text-slate-400'
              }`} />
            </div>
            <span className={`text-[10px] font-semibold transition-colors ${
              active ? 'text-primary' : darkMode ? 'text-white/40' : 'text-slate-400'
            }`}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

/* ─── Page wrapper with bottom nav spacing ─── */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen bg-background pb-20 transition-colors">
        {children}
      </div>
      <BottomNav />
      <AdsterraSocialBar />
    </>
  );
}
