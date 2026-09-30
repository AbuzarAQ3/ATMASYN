import type { ElementType, ReactNode } from 'react';
import { ArrowUpRight, Info } from 'lucide-react';
import { models } from '@/data/mock';
import type { ModelWeight } from '@/data/types';

export function WeightBars({ weights, compact = false }: { weights: ModelWeight[]; compact?: boolean }) {
  return <div className={compact ? 'space-y-2' : 'space-y-3'} data-testid="chart-model-weights">
    {weights.map((weight, index) => {
      const model = models.find((item) => item.id === weight.modelId);
      return <div key={weight.modelId} data-testid={`row-weight-${weight.modelId}`}>
        <div className="mb-1 flex items-center justify-between text-xs"><span className="flex items-center gap-2 font-medium"><span className="h-2 w-2 rounded-sm" style={{ backgroundColor: model?.color }} />{model?.shortName}</span><span className="mono font-medium">{weight.weight}%</span></div>
        <div className="h-2 overflow-hidden rounded-sm bg-[hsl(var(--muted))]"><div className="h-full rounded-sm transition-all duration-500" style={{ width: `${weight.weight}%`, backgroundColor: model?.color }} /></div>
        {!compact && <p className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">{index === 0 ? 'Highest illustrative reliability in selected context' : weight.rationale}</p>}
      </div>;
    })}
  </div>;
}

export function Sparkline({ values, color = '#0e8b79' }: { values: number[]; color?: string }) {
  const min = Math.min(...values); const max = Math.max(...values); const range = max - min || 1;
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${34 - ((value - min) / range) * 28}`).join(' ');
  return <svg viewBox="0 0 100 38" preserveAspectRatio="none" className="h-10 w-full overflow-visible" aria-label="Illustrative trend chart"><polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" /><circle cx="100" cy={34 - ((values[values.length - 1] - min) / range) * 28} r="2.2" fill={color} /></svg>;
}

export function SectionHeading({ eyebrow, title, detail, action }: { eyebrow: string; title: string; detail?: string; action?: ReactNode }) {
  return <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="eyebrow text-[hsl(var(--primary))]">{eyebrow}</p><h2 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">{title}</h2>{detail && <p className="mt-1 max-w-2xl text-xs text-[hsl(var(--muted-foreground))]">{detail}</p>}</div>{action}</div>;
}

export function Kpi({ label, value, detail, accent = false, icon: Icon }: { label: string; value: string; detail: string; accent?: boolean; icon?: ElementType }) {
  return <div className={`panel p-4 ${accent ? 'border-[hsl(var(--primary)/.45)] bg-[hsl(var(--primary)/.06)]' : ''}`} data-testid={`kpi-${label.toLowerCase().replaceAll(' ', '-')}`}><div className="flex items-start justify-between"><p className="eyebrow text-[hsl(var(--muted-foreground))]">{label}</p>{Icon && <Icon size={15} className={accent ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'} />}</div><p className="mono mt-3 text-2xl font-medium tracking-tight">{value}</p><p className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">{detail}</p></div>;
}

export function Caveat({ children = 'Illustrative prototype only · validation against observations is pending.' }: { children?: ReactNode }) {
  return <div className="flex items-start gap-2 border-l-2 border-[hsl(var(--accent))] bg-[hsl(var(--accent)/.08)] px-3 py-2.5 text-[11px] leading-4 text-[hsl(var(--muted-foreground))]" data-testid="caveat-prototype"><Info size={14} className="mt-0.5 shrink-0 text-[hsl(var(--accent))]" /> <span><b className="font-semibold text-foreground">DEMO DATA.</b> {children}</span></div>;
}

export function LinkHint({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-1 text-[10px] text-[hsl(var(--primary))]">{children}<ArrowUpRight size={11} /></span>;
}