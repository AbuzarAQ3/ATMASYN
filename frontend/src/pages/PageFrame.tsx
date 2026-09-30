import type { ReactNode } from 'react';
import { ScenarioBar } from '@/components/ScenarioBar';

export function PageFrame({ eyebrow, title, description, children, controls = true }: { eyebrow: string; title: string; description: string; children: ReactNode; controls?: boolean }) {
  return <div className="space-y-6 rise-in">{controls && <ScenarioBar />}<div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow text-[hsl(var(--primary))]">{eyebrow}</p><h1 className="mt-1 max-w-3xl text-2xl font-semibold tracking-[-.03em] sm:text-3xl">{title}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-[hsl(var(--muted-foreground))]">{description}</p></div><div className="hidden text-right sm:block"><p className="eyebrow text-[hsl(var(--muted-foreground))]">Evidence posture</p><p className="mono mt-1 text-xs text-[hsl(var(--accent))]">ILLUSTRATIVE / NOT LIVE</p></div></div>{children}</div>;
}