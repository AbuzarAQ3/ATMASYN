import { getRegion, models } from '@/data/mock';
import type { BlendResult, Forecast, ModelWeight, Regime, Season, WeatherAlert, WeatherVariable } from '@/data/types';

export interface Scenario {
  regionId: string;
  variable: WeatherVariable;
  season: Season;
  regime: Regime;
  leadTime: number;
}

const modelBias: Record<string, number> = { gfs: 0.8, ifs: 1.6, aifs: 2.3, icon: 0.2, bharatfs: 2.8 };
const regimeBoost: Record<Regime, string> = { 'Heavy Rainfall': 'aifs', Heatwave: 'bharatfs', 'High Wind': 'ifs', Clear: 'icon' };
const hash = (value: string) => [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0);

export function buildWeights(scenario: Scenario): ModelWeight[] {
  const region = getRegion(scenario.regionId);
  const focusModel = regimeBoost[scenario.regime];
  const raw = models.filter((model) => model.type !== 'BLEND').map((model, index) => {
    const seasonModifier = scenario.season === 'Monsoon' && (model.id === 'aifs' || model.id === 'bharatfs') ? 1.18 : 1;
    const leadPenalty = 1 / (1 + scenario.leadTime / 420);
    const regionalModifier = 1 + ((hash(region.id + model.id) % 9) - 4) / 70;
    const regimeModifier = model.id === focusModel ? 1.32 : 1;
    const variableModifier = scenario.variable === 'Wind' && model.id === 'ifs' ? 1.12 : scenario.variable === 'Temperature' && model.id === 'bharatfs' ? 1.1 : 1;
    return { modelId: model.id, score: (modelBias[model.id] + index + 1) * seasonModifier * leadPenalty * regionalModifier * regimeModifier * variableModifier };
  });
  const total = raw.reduce((sum, value) => sum + value.score, 0);
  return raw.map((item) => {
    const weight = Math.round((item.score / total) * 100);
    const model = models.find((candidate) => candidate.id === item.modelId);
    const rationale = item.modelId === focusModel ? `Regime skill uplift for ${scenario.regime.toLowerCase()}` : `${scenario.leadTime}h decay and regional skill prior`;
    return { modelId: item.modelId, weight, rationale, modelName: model?.shortName };
  }).sort((a, b) => b.weight - a.weight);
}

export function buildForecast(scenario: Scenario, weights: ModelWeight[]): Forecast {
  const region = getRegion(scenario.regionId);
  const seed = hash(`${scenario.regionId}-${scenario.season}-${scenario.regime}-${scenario.variable}`);
  const leadFactor = scenario.leadTime / 24;
  const rainBase = 22 + (seed % 31) + (scenario.regime === 'Heavy Rainfall' ? 62 : scenario.regime === 'Clear' ? -13 : 8);
  const temperatureBase = 21 + (seed % 12) + (scenario.regime === 'Heatwave' ? 9 : 0);
  const windBase = 9 + (seed % 13) + (scenario.regime === 'High Wind' ? 16 : 0);
  const adjustment = weights[0]?.weight ? weights[0].weight / 24 : 2;
  const confidence = Math.max(56, Math.min(94, Math.round(91 - leadFactor * 4.2 + adjustment)));
  const uncertainty = Math.round(100 - confidence + leadFactor * 1.3);
  return {
    horizon: scenario.leadTime,
    rainfall: Math.max(0, Math.round(rainBase - leadFactor * 3 + (region.latitude % 4))),
    temperature: Math.round((temperatureBase + leadFactor * .35) * 10) / 10,
    wind: Math.round((windBase + leadFactor * .8) * 10) / 10,
    confidence,
    uncertainty,
  };
}

export function buildBlend(scenario: Scenario): BlendResult {
  const selectedRegion = getRegion(scenario.regionId);
  const weights = buildWeights(scenario);
  const forecast = buildForecast(scenario, weights);
  return { selectedRegion, variable: scenario.variable, leadTime: scenario.leadTime, regime: scenario.regime, weights, forecast, confidence: forecast.confidence, uncertainty: forecast.uncertainty };
}

export function buildForecastSeries(scenario: Scenario) {
  return [24, 48, 72, 96, 120, 144, 168].map((horizon) => {
    const blend = buildBlend({ ...scenario, leadTime: horizon });
    const spread = Math.round(3 + horizon / 31 + (hash(scenario.regionId) % 4));
    return { horizon, blend: blend.forecast, spread };
  });
}

export function buildAlerts(scenario: Scenario): WeatherAlert[] {
  const result = buildBlend(scenario);
  const rainfall = result.forecast.rainfall;
  const heat = result.forecast.temperature;
  const wind = result.forecast.wind;
  return [
    { type: 'Heavy rainfall', status: rainfall > 68 ? 'ACTION' : rainfall > 45 ? 'WATCH' : 'MONITOR', severity: rainfall > 68 ? 'High' : rainfall > 45 ? 'Moderate' : 'Low', metric: `${rainfall} mm / ${scenario.leadTime}h`, confidence: result.confidence, agreement: rainfall > 68 ? '5 / 5 models above threshold' : '3 / 5 models above threshold', guidance: rainfall > 68 ? 'Review drainage, river gauge, and low-lying settlement readiness.' : 'Continue district watch; no immediate escalation in demo signal.' },
    { type: 'Heatwave', status: heat > 39 ? 'ACTION' : heat > 34 ? 'WATCH' : 'MONITOR', severity: heat > 39 ? 'High' : heat > 34 ? 'Moderate' : 'Low', metric: `${heat} °C / ${scenario.leadTime}h`, confidence: result.confidence - 3, agreement: heat > 34 ? '4 / 5 models above threshold' : '2 / 5 models above threshold', guidance: heat > 39 ? 'Coordinate public health messaging and cooling-centre capacity.' : 'Track daytime maximum; advisory threshold not crossed in demo.' },
    { type: 'High wind', status: wind > 27 ? 'ACTION' : wind > 19 ? 'WATCH' : 'MONITOR', severity: wind > 27 ? 'High' : wind > 19 ? 'Moderate' : 'Low', metric: `${wind} m/s / ${scenario.leadTime}h`, confidence: result.confidence - 5, agreement: wind > 27 ? '4 / 5 models above threshold' : '2 / 5 models above threshold', guidance: wind > 27 ? 'Check aviation crosswind, crane, and coastal asset protocols.' : 'Maintain standard aviation and infrastructure watch.' },
  ];
}