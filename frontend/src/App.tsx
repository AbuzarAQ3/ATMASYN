import { type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Overview from '@/pages/Overview';
import Forecast from '@/pages/Forecast';
import Weights from '@/pages/Weights';
import Verification from '@/pages/Verification';
import Alerts from '@/pages/Alerts';
import Workflow from '@/pages/Workflow';
import Sources from '@/pages/Sources';
import { AppShell } from '@/components/AppShell';
import { ScenarioContext, defaultScenario } from '@/lib/scenario-context';
import type { Scenario } from '@/lib/blending';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Overview} />
        <Route path="/forecast" component={Forecast} />
        <Route path="/weights" component={Weights} />
        <Route path="/verification" component={Verification} />
        <Route path="/alerts" component={Alerts} />
        <Route path="/workflow" component={Workflow} />
        <Route path="/sources" component={Sources} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  const [scenario, setScenarioState] = useState<Scenario>(defaultScenario);
  const setScenario = (next: Partial<Scenario>) => setScenarioState((current) => ({ ...current, ...next }));
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ScenarioContext.Provider value={{ scenario, setScenario }}>
            <AppShell><Router /></AppShell>
          </ScenarioContext.Provider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
