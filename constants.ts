
import { EvolutionConfig } from './types';

export const DATASETS = ['MNIST', 'Fashion-MNIST', 'CIFAR-10', 'CIFAR-100'] as const;
export const MODELS = ['Simple CNN', 'ResNet-18'] as const;

export const DEFAULT_CONFIG: EvolutionConfig = {
  dataset: 'CIFAR-10',
  model: 'Simple CNN',
  populationSize: 20,
  generations: 15,
  mutationRate: 0.1,
  crossoverRate: 0.6
};
