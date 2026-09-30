import { ArrowDownUp, MapPinned, SlidersHorizontal } from 'lucide-react';
import { getRegion, models, leadTimes } from '@/data/mock';
import { buildBlend, buildWeights } from '@/lib/blending';
import { useScenario } from '@/lib/scenario-context';
import { Caveat, SectionHeading, WeightBars } from '@/components/Charts';
import { IndiaMap } from '@/components/IndiaMap';
import { PageFrame } from './PageFrame';

export default function Weights() {
  const { scenario, setScenario } = useScenario();
  const result = buildBlend(scenario);
  const region = getRegion(scenario.regionId);
  const comparison = leadTimes.map((leadTime) => ({ leadTime, weights: buildWeights({ ...scenario, leadTime }) }));
  return <PageFrame eyebrow="03 / model reliability map" title="Reliability moves with the context." description="The map is not a league table. It is a visual trace of how region, season, regime, variable, and lead time change the blend.">
    <section className="panel overflow-hidden">
      <div className="border-b border-[hsl(var(--border))] p-4 sm:p-5"><SectionHeading eyebrow="Reliability field / illustrative" title={`${region.name} · ${scenario.leadTime}h`} detail={`Highest current weight: ${result.weights[0]?.modelId?.toUpperCase()} · ${result.weights[0]?.weight}%`} action={<span className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]"><MapPinned size={13} /> 12 regional priors</span>} /></div>
      <div className="data-grid grid gap-5 bg-[hsl(var(--secondary)/.22)] p-4 sm:p-6 lg:grid-cols-[1.15fr_.85fr]">
        <div className="relative min-h-[300px] rounded border border-[hsl(var(--border))] bg-[hsl(var(--card)/.7)] p-4">
          <div className="absolute left-4 top-4"><p className="eyebrow text-[hsl(var(--muted-foreground))]">Selected model field</p><p className="mt-1 text-xs font-semibold">{scenario.regime} / {scenario.season}</p></div>
          <IndiaMap selectedRegionId={scenario.regionId} onSelect={(regionId) => setScenario({ regionId })} getMeta={(item) => { const lead = buildWeights({ ...scenario, regionId: item.id })[0]; const model = models.find((candidate) => candidate.id === lead?.modelId); return { label: 'lead', value: `${model?.shortName ?? 'model'} · ${lead?.weight ?? 0}%` }; }} />
        </div>
        <div className="rounded border border-[hsl(var(--border))] bg-[hsl(var(--card)/.75)] p-4"><div className="mb-4 flex items-center gap-2"><SlidersHorizontal size={15} className="text-[hsl(var(--primary))]" /><div><p className="eyebrow text-[hsl(var(--muted-foreground))]">Current blend</p><p className="text-sm font-semibold">Model contribution</p></div></div><WeightBars weights={result.weights} /></div>
      </div>
    </section>
    <section className="panel p-4 sm:p-5"><SectionHeading eyebrow="Lead-time comparison" title="Who leads as the horizon changes?" detail="Select a horizon to drive the global demo scenario." action={<ArrowDownUp size={16} className="text-[hsl(var(--muted-foreground))]" />} /><div className="overflow-x-auto"><div className="min-w-[700px]">{models.filter((model) => model.type !== 'BLEND').map((model) => <div className="mb-3 grid grid-cols-[110px_repeat(5,1fr)] items-center gap-2" key={model.id}><span className="text-xs font-medium">{model.shortName}</span>{comparison.map((item) => { const weight = item.weights.find((candidate) => candidate.modelId === model.id)?.weight ?? 0; const selected = item.leadTime === scenario.leadTime; return <button key={item.leadTime} type="button" onClick={() => setScenario({ leadTime: item.leadTime })} className={`group relative h-10 overflow-hidden rounded border text-right ${selected ? 'border-[hsl(var(--accent))]' : 'border-transparent'}`} data-testid={`button-weight-horizon-${model.id}-${item.leadTime}`}><span className="absolute inset-y-0 left-0 opacity-25 transition-all group-hover:opacity-40" style={{ width: `${weight * 2.4}%`, backgroundColor: model.color }} /><span className="relative z-10 pr-2 mono text-[11px] leading-10">{weight}%</span><span className="absolute bottom-0 left-2 text-[8px] text-[hsl(var(--muted-foreground))]">{item.leadTime}h</span></button>; })}</div>)}</div></div></section>
    <Caveat>The weighting methodology is MVP inverse-error / skill-weighted blending with illustrative region, season, lead-time, and weather-regime modifiers.</Caveat>
  </PageFrame>;
}