import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from '@/lib/theme-context';

const Home = lazy(() => import('./pages/Home'));
const Maps = lazy(() => import('./pages/Maps'));
const MapDetail = lazy(() => import('./pages/MapDetail'));
const Settings = lazy(() => import('./pages/Settings'));
const SafeMode = lazy(() => import('./pages/SafeMode'));

const queryClient = new QueryClient();

function PageLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-primary font-bold tracking-widest uppercase text-sm">Loading Mod Hub...</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/maps" component={Maps} />
        <Route path="/map/:id" component={MapDetail} />
        <Route path="/settings" component={Settings} />
        <Route path="/raju" component={SafeMode} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
