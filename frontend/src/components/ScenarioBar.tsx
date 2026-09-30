import { useState } from 'react';
import { Activity, Check, ChevronDown, RefreshCw } from 'lucide-react';
import { getRegion, leadTimes, regions, regimes, seasons, variables } from '@/data/mock';
import { useScenario } from '@/lib/scenario-context';

export function ScenarioBar() {
  const { scenario, setScenario } = useScenario();
  const [generated, setGenerated] = useState(false);
  const update = (key: keyof typeof scenario, value: string | number) => {
    setScenario({ [key]: value } as never);
    setGenerated(false);
  };
  return (
    <section className="panel relative z-10 grid gap-3 p-3 sm:p-4" data-testid="scenario-controls">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"><Activity size={15} /></span>
          <div><p className="eyebrow text-[hsl(var(--muted-foreground))]">Decision context</p><p className="text-sm font-semibold">Set the question before blending</p></div>
        </div>
        <span className="mono text-[10px] text-[hsl(var(--muted-foreground))]">DEMO SCENARIO · DETERMINISTIC</span>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
        <Field label="REGION / क्षेत्र" value={scenario.regionId} onChange={(value) => update('regionId', value)} options={regions.map((r) => ({ value: r.id, label: `${r.name} · ${r.state}` }))} testId="select-region" />
        <Field label="VARIABLE / चर" value={scenario.variable} onChange={(value) => update('variable', value)} options={variables.map((value) => ({ value, label: value }))} testId="select-variable" />
        <Field label="SEASON / ऋतु" value={scenario.season} onChange={(value) => update('season', value)} options={seasons.map((value) => ({ value, label: value }))} testId="select-season" />
        <Field label="REGIME / मौसम" value={scenario.regime} onChange={(value) => update('regime', value)} options={regimes.map((value) => ({ value, label: value }))} testId="select-regime" />
        <Field label="LEAD TIME / अवधि" value={String(scenario.leadTime)} onChange={(value) => update('leadTime', Number(value))} options={leadTimes.map((value) => ({ value: String(value), label: `${value} hours` }))} testId="select-lead-time" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[hsl(var(--border))] pt-3">
        <p className="text-xs text-[hsl(var(--muted-foreground))]">Selected: <span className="font-semibold text-foreground">{getRegion(scenario.regionId).name}, {scenario.variable}, {scenario.regime}</span></p>
        <button type="button" onClick={() => setGenerated(true)} className="transition-soft flex items-center gap-2 rounded bg-[hsl(var(--primary))] px-3 py-2 text-xs font-semibold text-[hsl(var(--primary-foreground))] hover:-translate-y-px hover:bg-[hsl(var(--primary)/.88)]" data-testid="button-generate-blend">
          {generated ? <Check size={14} /> : <RefreshCw size={14} />} {generated ? 'Blend generated' : 'Generate blended forecast'}
        </button>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, options, testId }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; testId: string }) {
  return (
    <label className="group relative">
      <span className="eyebrow mb-1 block text-[hsl(var(--muted-foreground))]">{label}</span>
      <span className="relative block">
        <select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 w-full appearance-none rounded border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-2.5 pr-7 text-xs font-medium outline-none transition-colors focus:border-[hsl(var(--primary))]" data-testid={testId}>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <ChevronDown size={13} className="pointer-events-none absolute right-2 top-3 text-[hsl(var(--muted-foreground))]" />
      </span>
    </label>
  );
}