
export interface EvolutionConfig {
  dataset: 'MNIST' | 'Fashion-MNIST' | 'CIFAR-10' | 'CIFAR-100';
  model: 'Simple CNN' | 'ResNet-18';
  populationSize: number;
  generations: number;
  mutationRate: number;
  crossoverRate: number;
}

export interface FunctionPair {
  id: string;
  activation: string;
  loss: string;
  accuracy: number;
  f1: number;
  convergence: number;
}

export interface GenerationData {
  generation: number;
  bestPair: FunctionPair;
  avgAccuracy: number;
  avgF1: number;
  avgConvergence: number;
}

export interface FinalReport {
  config: EvolutionConfig;
  bestPair: FunctionPair;
  evolutionData: GenerationData[];
  summary: string;
}

export enum AppState {
  CONFIGURING = 'CONFIGURING',
  RUNNING = 'RUNNING',
  FINISHED = 'FINISHED'
}
