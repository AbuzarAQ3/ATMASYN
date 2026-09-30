import { CircleMarker, MapContainer, TileLayer, Tooltip } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { regions } from '@/data/mock';
import type { Region } from '@/data/types';

type IndiaMapProps = {
  selectedRegionId: string;
  onSelect?: (regionId: string) => void;
  getMeta?: (region: Region) => { label: string; value: string };
  className?: string;
};

const indiaCenter: LatLngExpression = [22.8, 79.2];

function riskColor(risk: Region['rainfallRisk']) {
  if (risk === 'High') return '#dc6254';
  if (risk === 'Elevated') return '#d28b3c';
  if (risk === 'Moderate') return '#0e8b79';
  return '#5d8a63';
}

export function IndiaMap({ selectedRegionId, onSelect, getMeta, className = '' }: IndiaMapProps) {
  return (
    <div className={`india-map ${className}`} data-testid="india-map">
      <MapContainer
        center={indiaCenter}
        zoom={4.5}
        minZoom={4}
        maxZoom={7}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
        className="h-full min-h-[310px] w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={0.35}
          attribution="&copy; OpenStreetMap contributors"
        />
        {regions.map((region) => {
          const selected = region.id === selectedRegionId;
          const meta = getMeta?.(region);
          return (
            <CircleMarker
              key={region.id}
              center={[region.latitude, region.longitude]}
              radius={selected ? 10 : 6}
              pathOptions={{
                color: selected ? '#f0a02d' : riskColor(region.rainfallRisk),
                fillColor: selected ? '#f0a02d' : riskColor(region.rainfallRisk),
                fillOpacity: selected ? 0.95 : 0.72,
                weight: selected ? 3 : 1.5,
              }}
              eventHandlers={onSelect ? { click: () => onSelect(region.id) } : undefined}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                <strong>{region.name}</strong>
                <br />
                {meta ? `${meta.label}: ${meta.value}` : `${region.state} · ${region.rainfallRisk} risk`}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
      <div className="map-legend" aria-label="Rainfall risk legend">
        <span><i className="risk-dot risk-low" />Low</span>
        <span><i className="risk-dot risk-moderate" />Moderate</span>
        <span><i className="risk-dot risk-high" />High</span>
      </div>
    </div>
  );
}