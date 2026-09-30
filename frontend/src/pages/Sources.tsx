import type { ElementType } from 'react';
import { useState } from 'react';
import { ExternalLink, FileText, RadioTower, Satellite, Signal, Database, Check } from 'lucide-react';
import { Caveat, SectionHeading } from '@/components/Charts';
import { PageFrame } from './PageFrame';

type Source = { id: string; name: string; description: string; type: string; cadence: string; Icon: ElementType };
const sources: Source[] = [
  { id: 'gfs', name: 'NOAA GFS', description: 'Global Forecast System', type: 'Global NWP', cadence: '0.25° / 3-hourly', Icon: RadioTower },
  { id: 'ifs', name: 'ECMWF IFS', description: 'Integrated Forecasting System', type: 'Global NWP', cadence: 'High-resolution global', Icon: Satellite },
  { id: 'aifs', name: 'ECMWF AIFS', description: 'Artificial Intelligence Forecasting System', type: 'AI-NWP', cadence: 'Experimental AI guidance', Icon: Signal },
  { id: 'icon', name: 'DWD ICON', description: 'Icosahedral Nonhydrostatic Model', type: 'Regional NWP', cadence: 'Global + regional grids', Icon: Database },
  { id: 'bharatfs', name: 'BharatFS', description: 'India-focused forecast system', type: 'AI-NWP', cadence: 'Prototype integration', Icon: FileText },
  { id: 'imd', name: 'IMD observations', description: 'India Meteorological Department', type: 'Observation', cadence: 'Station reference layer', Icon: Check },
  { id: 'gpm', name: 'GPM-IMERG', description: 'Global Precipitation Measurement', type: 'Satellite precipitation', cadence: 'Near-real-time reference', Icon: Satellite },
];

export default function Sources() {
  const [selected, setSelected] = useState('bharatfs');
  const selectedSource = sources.find((source) => source.id === selected);
  return <PageFrame eyebrow="07 / data foundations" title="The blend begins with provenance." description="Every contributor is named, typed, and marked as a prototype integration. This is the inventory a production connector would implement.">
    <section className="panel p-4 sm:p-5"><SectionHeading eyebrow="Source registry" title="Prototype integration catalogue" detail="Select a source to inspect its intended role." /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{sources.map((source) => { const active = selected === source.id; const Icon = source.Icon; return <button type="button" onClick={() => setSelected(source.id)} key={source.id} className={`group relative rounded border p-4 text-left transition-all hover:-translate-y-0.5 ${active ? 'border-[hsl(var(--primary)/.55)] bg-[hsl(var(--primary)/.06)]' : 'border-[hsl(var(--border))] bg-[hsl(var(--background)/.35)]'}`} data-testid={`button-source-${source.id}`}><div className="flex items-start justify-between"><span className={`flex h-9 w-9 items-center justify-center rounded ${active ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]'}`}><Icon size={17} /></span><span className="flex items-center gap-1 rounded border border-[hsl(var(--border))] px-1.5 py-1 text-[9px] text-[hsl(var(--muted-foreground))]"><i className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-[hsl(var(--accent))]' : 'bg-[hsl(var(--muted-foreground))]'}`} />Prototype integration</span></div><h2 className="mt-4 text-sm font-semibold">{source.name}</h2><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{source.description}</p><div className="mt-4 flex items-center justify-between border-t border-[hsl(var(--border))] pt-3"><span className="eyebrow text-[hsl(var(--primary))]">{source.type}</span><span className="text-[10px] text-[hsl(var(--muted-foreground))]">{source.cadence}</span></div></button>; })}</div></section>
    <section className="panel flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5"><div><p className="eyebrow text-[hsl(var(--primary))]">Selected source</p><h2 className="mt-1 text-lg font-semibold">{selectedSource?.name}</h2><p className="mt-1 max-w-2xl text-xs leading-5 text-[hsl(var(--muted-foreground))]">Connector contract would include retrieval timestamp, grid metadata, license, quality flags, and missing-field behavior. No source is connected in this build.</p></div><span className="flex items-center gap-2 rounded border border-[hsl(var(--border))] px-3 py-2 text-xs text-[hsl(var(--muted-foreground))]"><ExternalLink size={13} /> Integration pending</span></section><Caveat>These cards communicate intended system architecture only. ATMASYN has no live external connectivity in this frontend-only prototype.</Caveat>
  </PageFrame>;
}