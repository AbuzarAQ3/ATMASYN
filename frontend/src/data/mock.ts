import type { ForecastModel, Region, Season, Regime, SkillScore, WeatherVariable } from './types';

export const models: ForecastModel[] = [
  { id: 'gfs', name: 'NOAA GFS', shortName: 'GFS', type: 'NWP', color: '#2f6f88' },
  { id: 'ifs', name: 'ECMWF IFS', shortName: 'IFS', type: 'NWP', color: '#875d9c' },
  { id: 'aifs', name: 'ECMWF AIFS', shortName: 'AIFS', type: 'AI-NWP', color: '#d36b4c' },
  { id: 'icon', name: 'DWD ICON', shortName: 'ICON', type: 'NWP', color: '#5d8a63' },
  { id: 'bharatfs', name: 'BharatFS', shortName: 'BFS', type: 'AI-NWP', color: '#c98b3b' },
  { id: 'blend', name: 'ATMASYN Blend', shortName: 'ATMASYN', type: 'BLEND', color: '#0e8b79' },
];

export const regions: Region[] = [
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', latitude: 26.85, longitude: 80.95, season: 'Monsoon', regime: 'Heavy Rainfall', rainfallRisk: 'High' },
  { id: 'delhi', name: 'Delhi NCR', state: 'Delhi', latitude: 28.61, longitude: 77.21, season: 'Monsoon', regime: 'Heavy Rainfall', rainfallRisk: 'Elevated' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', latitude: 19.07, longitude: 72.88, season: 'Monsoon', regime: 'Heavy Rainfall', rainfallRisk: 'High' },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', latitude: 22.57, longitude: 88.36, season: 'Monsoon', regime: 'Heavy Rainfall', rainfallRisk: 'High' },
  { id: 'guwahati', name: 'Guwahati', state: 'Assam', latitude: 26.14, longitude: 91.74, season: 'Monsoon', regime: 'Heavy Rainfall', rainfallRisk: 'High' },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', latitude: 26.91, longitude: 75.79, season: 'Pre-monsoon', regime: 'Heatwave', rainfallRisk: 'Low' },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', latitude: 23.02, longitude: 72.57, season: 'Pre-monsoon', regime: 'Heatwave', rainfallRisk: 'Moderate' },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', latitude: 12.97, longitude: 77.59, season: 'Post-monsoon', regime: 'Clear', rainfallRisk: 'Moderate' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', latitude: 13.08, longitude: 80.27, season: 'Post-monsoon', regime: 'Heavy Rainfall', rainfallRisk: 'Elevated' },
  { id: 'bhubaneswar', name: 'Bhubaneswar', state: 'Odisha', latitude: 20.30, longitude: 85.82, season: 'Monsoon', regime: 'High Wind', rainfallRisk: 'Elevated' },
  { id: 'srinagar', name: 'Srinagar', state: 'Jammu & Kashmir', latitude: 34.08, longitude: 74.80, season: 'Winter', regime: 'Clear', rainfallRisk: 'Low' },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', latitude: 17.38, longitude: 78.49, season: 'Monsoon', regime: 'Heatwave', rainfallRisk: 'Moderate' },
];

export const seasons: Season[] = ['Winter', 'Pre-monsoon', 'Monsoon', 'Post-monsoon'];
export const regimes: Regime[] = ['Heavy Rainfall', 'Heatwave', 'High Wind', 'Clear'];
export const variables: WeatherVariable[] = ['Rainfall', 'Temperature', 'Wind'];
export const leadTimes = [24, 48, 72, 120, 168];

export const baseSkill: SkillScore[] = [
  { modelId: 'gfs', rmse: 14.8, ets: 0.42, status: 'DEMO DATA' },
  { modelId: 'ifs', rmse: 12.9, ets: 0.49, status: 'DEMO DATA' },
  { modelId: 'aifs', rmse: 11.8, ets: 0.55, status: 'ILLUSTRATIVE PROTOTYPE' },
  { modelId: 'icon', rmse: 15.4, ets: 0.38, status: 'DEMO DATA' },
  { modelId: 'bharatfs', rmse: 10.9, ets: 0.58, status: 'ILLUSTRATIVE PROTOTYPE' },
  { modelId: 'blend', rmse: 9.4, ets: 0.64, status: 'ILLUSTRATIVE PROTOTYPE' },
];

export const getRegion = (id: string) => regions.find((region) => region.id === id) ?? regions[0];