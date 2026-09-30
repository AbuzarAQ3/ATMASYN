import type { ElementType } from 'react';
import { ArrowRight, CloudRain, Gauge, ShieldAlert, Target, Thermometer, Wind } from 'lucide-react';
import { Link } from 'wouter';
import { getRegion } from '@/data/mock';
import { buildBlend } from '@/lib/blending';
import { useScenario } from '@/lib/scenario-context';
import { Caveat, Kpi, SectionHeading, Sparkline, WeightBars } from '@/components/Charts';
import { IndiaMap } from '@/components/IndiaMap';
import { PageFrame } from './PageFrame';

export default function Overview() {
  const { scenario, setScenario } = useScenario();
  const result = buildBlend(scenario);
  const region = getRegion(scenario.regionId);
  const roles = [
    { role: 'Disaster Management', text: 'Escalate rainfall watch if agreement holds', Icon: ShieldAlert },
    { role: 'Agri Advisory', text: 'Use confidence envelope for field timing', Icon: CloudRain },
    { role: 'Aviation', text: 'Cross-check wind spread before dispatch', Icon: Wind },
  ];
  return <PageFrame eyebrow="01 / operational view" title="Which model should we trust here?" description="ATMASYN turns regional context, lead time, and weather regime into an auditable blend for the next operational decision.">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Kpi label="Blend confidence" value={`${result.confidence}%`} detail={`at ${scenario.leadTime}h · illustrative`} accent icon={Gauge} />
      <Kpi label="Expected rainfall" value={`${result.forecast.rainfall} mm`} detail={`${scenario.leadTime}h accumulation · demo`} icon={CloudRain} />
      <Kpi label="Leading model" value={result.weights[0]?.modelId === 'bharatfs' ? 'BharatFS' : result.weights[0]?.modelId?.toUpperCase() ?? 'IFS'} detail={`${result.weights[0]?.weight}% illustrative weight`} icon={Target} />
      <Kpi label="Uncertainty" value={`±${result.uncertainty}%`} detail="spread estimate · not calibrated" icon={ShieldAlert} />
    </div>
    <div className="grid gap-5 xl:grid-cols-[1.35fr_.85fr]">
      <section className="panel overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[hsl(var(--border))] p-4 sm:p-5"><div><p className="eyebrow text-[hsl(var(--primary))]">India / location view</p><h2 className="mt-1 text-lg font-semibold">{region.name}, {region.state}</h2><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{region.latitude.toFixed(2)}°N · {region.longitude.toFixed(2)}°E · rainfall risk <b className="text-[hsl(var(--accent))]">{region.rainfallRisk}</b></p></div><div className="rounded border border-[hsl(var(--primary)/.3)] bg-[hsl(var(--primary)/.06)] px-2.5 py-1.5 text-right"><p className="eyebrow text-[hsl(var(--primary))]">Context</p><p className="text-xs font-semibold">{scenario.season} / {scenario.regime}</p></div></div>
        <div className="data-grid relative overflow-hidden bg-[hsl(var(--secondary)/.25)] p-4">
          <IndiaMap selectedRegionId={scenario.regionId} onSelect={(regionId) => setScenario({ regionId })} />
          <div className="pointer-events-none absolute bottom-4 left-4 text-[10px] text-[hsl(var(--muted-foreground))]">Click a marker to update the deterministic scenario · 12 location priors</div>
        </div>
      </section>
      <section className="panel p-4 sm:p-5">
        <SectionHeading eyebrow="Adaptive weight engine" title="Why ATMASYN?" detail={`For ${region.name} at ${scenario.leadTime}h`} />
        <div className="mb-5 rounded border border-[hsl(var(--primary)/.25)] bg-[hsl(var(--primary)/.05)] p-3"><p className="text-sm font-semibold">Trust {result.weights[0]?.modelId === 'bharatfs' ? 'BharatFS' : result.weights[0]?.modelId?.toUpperCase()} first, then blend.</p><p className="mt-1 text-xs leading-5 text-[hsl(var(--muted-foreground))]">Inverse-error prior is adjusted for {scenario.season.toLowerCase()} and {scenario.regime.toLowerCase()}. No single model is treated as universally best.</p></div>
        <WeightBars weights={result.weights} compact />
        <Link href="/weights" className="mt-5 flex items-center justify-between border-t border-[hsl(var(--border))] pt-3 text-xs font-semibold text-[hsl(var(--primary))]" data-testid="link-view-weights">Inspect regional weights <ArrowRight size={14} /></Link>
      </section>
    </div>
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <section className="panel p-4 sm:p-5"><SectionHeading eyebrow="Selected location / forecast summary" title={`${scenario.variable} signal · ${scenario.leadTime}h`} detail="Output of the current deterministic blend run." /><div className="grid grid-cols-3 gap-2"><Summary icon={CloudRain} label="Rainfall" value={`${result.forecast.rainfall} mm`} /><Summary icon={Thermometer} label="Temperature" value={`${result.forecast.temperature} °C`} /><Summary icon={Wind} label="Wind" value={`${result.forecast.wind} m/s`} /></div><div className="mt-5 border-t border-[hsl(var(--border))] pt-3"><div className="mb-1 flex justify-between text-[10px] text-[hsl(var(--muted-foreground))]"><span>Illustrative confidence envelope</span><span className="mono">{result.confidence}%</span></div><Sparkline values={[72, 76, 73, 81, 77, result.confidence]} /></div></section>
      <section className="panel p-4 sm:p-5"><SectionHeading eyebrow="Role emphasis" title="Decision handoff" /><div className="space-y-2">{roles.map(({ role, text, Icon }) => <div key={role} className="flex items-center gap-3 rounded border border-[hsl(var(--border))] p-3"><span className="flex h-8 w-8 items-center justify-center rounded bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><Icon size={15} /></span><div><p className="text-xs font-semibold">{role}</p><p className="text-[11px] text-[hsl(var(--muted-foreground))]">{text}</p></div></div>)}</div></section>
    </div>
    <Caveat>Metrics are deterministic demo values for a hackathon prototype. They do not represent live connectivity, operational guidance, or proven accuracy.</Caveat>
  </PageFrame>;
}

function Summary({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string }) {
  return <div className="rounded border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3"><Icon size={15} className="text-[hsl(var(--primary))]" /><p className="eyebrow mt-3 text-[hsl(var(--muted-foreground))]">{label}</p><p className="mono mt-1 text-base font-medium">{value}</p></div>;
}