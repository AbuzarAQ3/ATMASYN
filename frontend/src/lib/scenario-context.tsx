import { createContext, useContext } from 'react';
import type { Scenario } from './blending';

export const defaultScenario: Scenario = { regionId: 'lucknow', variable: 'Rainfall', season: 'Monsoon', regime: 'Heavy Rainfall', leadTime: 24 };
export interface ScenarioContextValue {
  scenario: Scenario;
  setScenario: (next: Partial<Scenario>) => void;
}
export const ScenarioContext = createContext<ScenarioContextValue>({ scenario: defaultScenario, setScenario: () => undefined });
export function useScenario() { return useContext(ScenarioContext); }