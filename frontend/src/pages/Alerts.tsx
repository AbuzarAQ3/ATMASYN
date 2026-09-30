import { AlertTriangle, ArrowRight, CheckCircle2, CloudRain, Thermometer, Wind } from 'lucide-react';
import { buildAlerts } from '@/lib/blending';
import { useScenario } from '@/lib/scenario-context';
import { Caveat, SectionHeading } from '@/components/Charts';
import { PageFrame } from './PageFrame';

export default function Alerts() {
  const { scenario } = useScenario();
  const alerts = buildAlerts(scenario);
  return <PageFrame eyebrow="05 / extreme weather guidance" title="Turn forecast signals into a cautious handoff." description="Alert cards update with the selected region and forecast context. Status language is demo-only and deliberately avoids implying an issued warning.">
    <div className="grid gap-4 md:grid-cols-3">{alerts.map((alert) => <AlertCard key={alert.type} alert={alert} />)}</div>
    <section className="panel p-4 sm:p-5"><SectionHeading eyebrow="Operational reading" title="Use agreement to decide the next check." detail={`${scenario.regime} signal · ${scenario.leadTime}h horizon`} /><div className="grid gap-3 md:grid-cols-3">{alerts.map((alert) => <div key={alert.type} className="flex gap-3 rounded border border-[hsl(var(--border))] p-3"><span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded ${alert.status === 'ACTION' ? 'bg-[hsl(var(--destructive)/.12)] text-[hsl(var(--destructive))]' : 'bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]'}`}><ArrowRight size={14} /></span><div><p className="text-xs font-semibold">{alert.type}</p><p className="mt-1 text-[11px] leading-4 text-[hsl(var(--muted-foreground))]">{alert.guidance}</p></div></div>)}</div></section><Caveat>All alert status and guidance strings are demo-only. They are not issued warnings, advisories, or a substitute for official IMD channels.</Caveat>
  </PageFrame>;
}
function AlertCard({ alert }: { alert: ReturnType<typeof buildAlerts>[number] }) {
  const Icon = alert.type === 'Heavy rainfall' ? CloudRain : alert.type === 'Heatwave' ? Thermometer : Wind;
  const action = alert.status === 'ACTION';
  return <article className={`panel relative overflow-hidden p-4 sm:p-5 ${action ? 'border-[hsl(var(--destructive)/.42)]' : ''}`} data-testid={`alert-card-${alert.type.toLowerCase().replace(' ', '-')}`}><div className={`absolute left-0 top-0 h-1 w-full ${action ? 'bg-[hsl(var(--destructive))]' : alert.status === 'WATCH' ? 'bg-[hsl(var(--accent))]' : 'bg-[hsl(var(--primary))]'}`} /><div className="flex items-start justify-between"><span className={`flex h-9 w-9 items-center justify-center rounded ${action ? 'bg-[hsl(var(--destructive)/.12)] text-[hsl(var(--destructive))]' : 'bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]'}`}><Icon size={18} /></span><span className="flex items-center gap-1 rounded border border-[hsl(var(--border))] px-2 py-1 text-[10px] font-semibold"><i className={`h-1.5 w-1.5 rounded-full ${action ? 'bg-[hsl(var(--destructive))]' : 'bg-[hsl(var(--accent))]'}`} />{alert.status}</span></div><h2 className="mt-4 text-base font-semibold">{alert.type}</h2><p className="mono mt-1 text-lg">{alert.metric}</p><div className="mt-4 grid grid-cols-2 gap-2 border-y border-[hsl(var(--border))] py-3"><div><p className="eyebrow text-[hsl(var(--muted-foreground))]">Confidence</p><p className="mono mt-1 text-xs">{alert.confidence}%</p></div><div><p className="eyebrow text-[hsl(var(--muted-foreground))]">Agreement</p><p className="mt-1 text-[10px] leading-3">{alert.agreement}</p></div></div><p className="mt-3 text-[11px] leading-5 text-[hsl(var(--muted-foreground))]">{alert.guidance}</p></article>;
}