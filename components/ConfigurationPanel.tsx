
import React from 'react';
import type { EvolutionConfig } from '../types';
import { DATASETS, MODELS } from '../constants';

interface ConfigurationPanelProps {
  config: EvolutionConfig;
  setConfig: React.Dispatch<React.SetStateAction<EvolutionConfig>>;
  onStart: (config: EvolutionConfig) => void;
  isLoading: boolean;
}

const GearIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-.95.54.056 1.007.519 1.056 1.056.048.541-.41 1.006-.95 1.11a7.5 7.5 0 01-1.22 1.22c-.542.09-1.007.56-1.11.95-.056.54-.519 1.007-1.056 1.056-.541.048-1.006-.41-1.11-.95a7.5 7.5 0 01-1.22-1.22c-.09-.542-.56-1.007-1.11-.95-.54-.056-1.007-.519-1.056-1.056-.048-.541.41-1.006.95-1.11a7.5 7.5 0 011.22-1.22c.542-.09 1.007-.56 1.11-.95.056-.54.519-1.007 1.056-1.056.541-.048 1.006.41 1.11.95.293.172.556.386.79.643a.75.75 0 001.06-1.06 9 9 0 00-1.518-1.32M14.406 19.06c-.09.542-.56 1.007-1.11.95-.54-.056-1.007-.519-1.056-1.056-.048-.541.41-1.006.95-1.11a7.5 7.5 0 011.22-1.22c.542-.09 1.007-.56 1.11-.95.056-.54.519-1.007 1.056-1.056.541-.048 1.006.41 1.11.95a7.5 7.5 0 011.22 1.22c.09.542.56 1.007 1.11.95.54.056 1.007.519 1.056 1.056.048.541-.41 1.006-.95-1.11a7.5 7.5 0 01-1.22 1.22c-.542.09-1.007.56-1.11.95-.056.54-.519 1.007-1.056-1.056-.541-.048-1.006.41-1.11-.95a9 9 0 00-1.518 1.32.75.75 0 001.06 1.061 7.5 7.5 0 001.286-1.286zM12 15a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
);


const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ config, setConfig, onStart, isLoading }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['populationSize', 'generations', 'mutationRate', 'crossoverRate'].includes(name);
    setConfig(prev => ({ ...prev, [name]: isNumeric ? Number(value) : value }));
  };

  const handleSliderChange = (name: keyof EvolutionConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
     setConfig(prev => ({ ...prev, [name]: Number(e.target.value) }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(config);
  };

  const renderSelect = (name: keyof EvolutionConfig, label: string, options: readonly string[]) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-blue-200">{label}</label>
      <select
        id={name}
        name={name}
        value={config[name] as string}
        onChange={handleInputChange}
        className="mt-1 block w-full bg-gray-700/50 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
      >
        {options.map(option => <option key={option}>{option}</option>)}
      </select>
    </div>
  );

  const renderSlider = (name: keyof EvolutionConfig, label: string, min: number, max: number, step: number) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-blue-200">{label}: <span className="font-bold text-white">{config[name]}</span></label>
        <input
            type="range"
            id={name}
            name={name}
            min={min}
            max={max}
            step={step}
            value={config[name]}
            onChange={handleSliderChange(name)}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <GearIcon className="w-8 h-8 text-blue-400 mr-3"/>
            <h1 className="text-3xl font-bold text-white tracking-wider">EvoFusion Configuration</h1>
          </div>
          <p className="text-gray-400 mb-8">
            Set the parameters for the co-evolutionary run. The algorithm will discover optimal activation and loss functions for your selected dataset and model.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderSelect('dataset', 'Dataset', DATASETS)}
              {renderSelect('model', 'Neural Network Model', MODELS)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderSlider('populationSize', 'Population Size', 10, 100, 2)}
              {renderSlider('generations', 'Generations', 5, 50, 1)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderSlider('mutationRate', 'Mutation Rate', 0.01, 0.5, 0.01)}
              {renderSlider('crossoverRate', 'Crossover Rate', 0.1, 0.9, 0.05)}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 transition-all duration-300 disabled:bg-blue-800 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Initializing...
                  </>
                ) : (
                  <span className="group-hover:scale-105 transform transition-transform">Start Evolution</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPanel;
