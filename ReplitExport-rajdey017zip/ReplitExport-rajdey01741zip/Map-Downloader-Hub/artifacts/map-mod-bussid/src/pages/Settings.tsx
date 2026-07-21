import { PageShell } from '../components/Layout';
import { useTheme } from '../lib/theme-context';
import { Info, Globe, Shield, Mail, Moon, Sun } from 'lucide-react';

export default function Settings() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <PageShell>
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-foreground font-black text-2xl mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm mb-6">App info & support</p>

        <div className="space-y-3">

          {/* ── Dark Mode Toggle ── */}
          <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                darkMode ? 'bg-indigo-500/15' : 'bg-amber-500/15'
              }`}>
                {darkMode
                  ? <Moon className="w-4 h-4 text-indigo-400" />
                  : <Sun  className="w-4 h-4 text-amber-500" />
                }
              </div>
              <div>
                <p className="text-foreground font-bold text-sm">Dark Mode</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {darkMode ? 'Dark theme active' : 'Light theme active'}
                </p>
              </div>
            </div>

            {/* Toggle switch */}
            <button
              role="switch"
              aria-checked={darkMode}
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                darkMode ? 'bg-primary' : 'bg-slate-300'
              }`}
              style={{ width: 52 }}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform ${
                  darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* About */}
          <div className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-foreground font-bold text-sm">About</p>
              <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
                Map Mod Bussid Plazzugaming — your daily source for the best Bus Simulator Indonesia map mods. New maps uploaded every day at 8:00 PM.
              </p>
            </div>
          </div>

          {/* Version */}
          <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                <Globe className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-foreground font-bold text-sm">Version</p>
            </div>
            <span className="text-muted-foreground text-xs font-semibold">1.0.0</span>
          </div>

          {/* Privacy */}
          <div className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-foreground font-bold text-sm">Privacy</p>
              <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
                We do not collect personal data.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-500/15 flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <p className="text-foreground font-bold text-sm">Contact</p>
              <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
                For map submissions or business enquiries, reach out via the Plazzugaming YouTube channel.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-muted-foreground/40 text-xs mt-6">
          © 2026 Plazzugaming. All rights reserved.
        </p>
      </div>
    </PageShell>
  );
}
