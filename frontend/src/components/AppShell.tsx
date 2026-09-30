import type { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { BarChart3, BellRing, BookOpen, CircleHelp, GitBranch, Gauge, Layers3, Map, Menu, Satellite, ShieldCheck, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { href: '/', label: 'Overview', hi: 'सारांश', icon: Gauge },
  { href: '/forecast', label: 'Forecast', hi: 'पूर्वानुमान', icon: BarChart3 },
  { href: '/weights', label: 'Weights', hi: 'भार', icon: Map },
  { href: '/verification', label: 'Verification', hi: 'सत्यापन', icon: ShieldCheck },
  { href: '/alerts', label: 'Alerts', hi: 'चेतावनी', icon: BellRing },
  { href: '/workflow', label: 'Workflow', hi: 'प्रवाह', icon: GitBranch },
  { href: '/sources', label: 'Sources', hi: 'स्रोत', icon: Satellite },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="app-noise min-h-[100dvh] bg-[hsl(var(--background))]">
      <aside className={`fixed inset-y-0 left-0 z-40 w-[246px] border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] text-[hsl(var(--sidebar-foreground))] transition-transform md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col p-4">
          <div className="mb-7 flex items-start justify-between">
            <Link href="/" className="flex items-center gap-3" data-testid="link-brand">
              <span className="flex h-9 w-9 items-center justify-center border border-[hsl(var(--accent))] text-[hsl(var(--accent))]"><Layers3 size={19} /></span>
              <span><span className="block text-base font-bold tracking-[.19em]">ATMASYN</span><span className="mono block text-[8px] tracking-[.08em] text-[hsl(var(--sidebar-foreground)/.62)]">ADAPTIVE ATMOSPHERIC FORECAST SYNTHESIS</span></span>
            </Link>
            <button className="md:hidden" onClick={() => setMobileOpen(false)} data-testid="button-close-menu"><X size={18} /></button>
          </div>
          <div className="mb-5 border-y border-[hsl(var(--sidebar-border))] py-3">
            <p className="eyebrow text-[hsl(var(--sidebar-foreground)/.5)]">Operations console</p>
            <p className="mt-1 text-xs leading-5 text-[hsl(var(--sidebar-foreground)/.78)]">Trust the right model.<br />Blend with evidence.</p>
          </div>
          <nav className="space-y-1" aria-label="Primary navigation">
            {navigation.map(({ href, label, hi, icon: Icon }) => {
              const active = href === '/' ? location === '/' : location.startsWith(href);
              return <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={`group flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors ${active ? 'bg-[hsl(var(--primary)/.2)] text-[hsl(var(--accent))]' : 'text-[hsl(var(--sidebar-foreground)/.7)] hover:bg-[hsl(var(--sidebar-foreground)/.07)] hover:text-[hsl(var(--sidebar-foreground))]'}`} data-testid={`link-nav-${label.toLowerCase()}`}><Icon size={16} /><span className="flex-1">{label}</span><span className="text-[10px] opacity-45">{hi}</span></Link>;
            })}
          </nav>
          <div className="mt-auto space-y-3">
            <div className="rounded border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-foreground)/.04)] p-3">
              <div className="mb-2 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[hsl(var(--accent))]" /><span className="eyebrow text-[hsl(var(--sidebar-foreground)/.68)]">Prototype status</span></div>
              <p className="text-[11px] leading-4 text-[hsl(var(--sidebar-foreground)/.62)]">No live feeds connected. All values are deterministic demo data.</p>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[hsl(var(--sidebar-foreground)/.45)]"><span>SIH 2026 / MVP</span><CircleHelp size={14} /></div>
          </div>
        </div>
      </aside>
      {mobileOpen && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-[hsl(var(--sidebar)/.55)] md:hidden" onClick={() => setMobileOpen(false)} data-testid="button-overlay-menu" />}
      <main className="min-w-0 md:pl-[246px]">
        <header className="sticky top-0 z-20 flex h-[62px] items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/.93)] px-4 backdrop-blur sm:px-6">
          <button className="rounded p-2 md:hidden" onClick={() => setMobileOpen(true)} data-testid="button-open-menu"><Menu size={19} /></button>
          <div className="hidden items-center gap-2 md:flex"><span className="eyebrow text-[hsl(var(--muted-foreground))]">Decision support / भारत</span><span className="h-1 w-1 rounded-full bg-[hsl(var(--accent))]" /><span className="mono text-[10px] text-[hsl(var(--muted-foreground))]">RUN 26.07</span></div>
          <div className="ml-auto flex items-center gap-3"><div className="hidden items-center gap-1.5 text-[10px] text-[hsl(var(--muted-foreground))] sm:flex"><SlidersHorizontal size={13} /> Roles: <b className="text-foreground">DM</b> / <b className="text-foreground">AG</b> / <b className="text-foreground">AV</b></div><span className="rounded border border-[hsl(var(--border))] px-2 py-1 mono text-[10px] text-[hsl(var(--muted-foreground))]">DEMO ONLY</span></div>
        </header>
        <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}