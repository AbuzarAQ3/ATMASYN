export type WeatherVariable = 'Rainfall' | 'Temperature' | 'Wind';
export type Season = 'Winter' | 'Pre-monsoon' | 'Monsoon' | 'Post-monsoon';
export type Regime = 'Heavy Rainfall' | 'Heatwave' | 'High Wind' | 'Clear';

export interface Region {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  season: Season;
  regime: Regime;
  rainfallRisk: 'Low' | 'Moderate' | 'Elevated' | 'High';
}

export interface Forecast {
  horizon: number;
  rainfall: number;
  temperature: number;
  wind: number;
  confidence: number;
  uncertainty: number;
}

export interface ForecastModel {
  id: string;
  name: string;
  shortName: string;
  type: 'NWP' | 'AI-NWP' | 'BLEND';
  color: string;
}

export interface ModelWeight {
  modelId: string;
  weight: number;
  rationale: string;
}

export interface SkillScore {
  modelId: string;
  rmse: number;
  ets: number;
  status: 'DEMO DATA' | 'ILLUSTRATIVE PROTOTYPE';
}

export interface WeatherAlert {
  type: string;
  status: 'MONITOR' | 'WATCH' | 'ACTION';
  severity: 'Low' | 'Moderate' | 'High';
  metric: string;
  confidence: number;
  agreement: string;
  guidance: string;
}

export interface BlendResult {
  selectedRegion: Region;
  variable: WeatherVariable;
  leadTime: number;
  regime: Regime;
  weights: ModelWeight[];
  forecast: Forecast;
  confidence: number;
  uncertainty: number;
}