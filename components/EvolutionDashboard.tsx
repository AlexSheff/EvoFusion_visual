import React from 'react';
import type { GenerationData, FunctionPair, EvolutionConfig } from '../types';

interface EvolutionDashboardProps {
  config: EvolutionConfig;
  evolutionData: GenerationData[];
  onStop: () => void;
  isLoadingNextGen: boolean;
}

const ChartIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-12a2.25 2.25 0 01-2.25-2.25V3M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12l-1.21-1.21a.75.75 0 00-1.06 0l-1.97 1.97-1.97-1.97a.75.75 0 00-1.06 0L9 12m6.75 0h.008v.008h-.008V12z" />
  </svg>
);

const FunctionIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
);

const BestPairCard: React.FC<{ pair: FunctionPair | null }> = ({ pair }) => {
    if (!pair) return null;
    return (
        <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-lg p-6 shadow-lg h-full flex flex-col">
            <div className="flex items-center mb-4">
                <FunctionIcon className="w-6 h-6 text-green-400 mr-3"/>
                <h3 className="text-xl font-semibold text-white">Best Performing Pair</h3>
            </div>
            <div className="flex-grow space-y-4 text-sm">
                <div>
                    <p className="text-green-300 font-medium">Activation Fn:</p>
                    <code className="block bg-black/50 text-green-400 p-2 rounded-md mt-1 font-mono text-xs overflow-x-auto whitespace-nowrap">{pair.activation}</code>
                </div>
                <div>
                    <p className="text-purple-300 font-medium">Loss Fn:</p>
                    <code className="block bg-black/50 text-purple-400 p-2 rounded-md mt-1 font-mono text-xs overflow-x-auto whitespace-nowrap">{pair.loss}</code>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-xs text-gray-400">Accuracy</p>
                    <p className="text-lg font-bold text-white">{(pair.accuracy * 100).toFixed(2)}%</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">F1 Score</p>
                    <p className="text-lg font-bold text-white">{pair.f1.toFixed(3)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Convergence</p>
                    <p className="text-lg font-bold text-white">{pair.convergence.toFixed(0)}</p>
                </div>
            </div>
        </div>
    );
};

const MetricsChart: React.FC<{ data: GenerationData[] }> = ({ data }) => {
    const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = (window as any).Recharts || {};

    return (
        <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-lg p-6 shadow-lg h-[400px]">
            <div className="flex items-center mb-4">
                <ChartIcon className="w-6 h-6 text-blue-400 mr-3"/>
                <h3 className="text-xl font-semibold text-white">Performance Metrics Over Generations</h3>
            </div>
            {LineChart ? (
                <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="generation" stroke="#A0AEC0" />
                        <YAxis yAxisId="left" stroke="#A0AEC0" />
                        <YAxis yAxisId="right" orientation="right" stroke="#A0AEC0" />
                        <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="avgAccuracy" name="Avg Accuracy" stroke="#48BB78" strokeWidth={2} dot={false} />
                        <Line yAxisId="left" type="monotone" dataKey="avgF1" name="Avg F1 Score" stroke="#9F7AEA" strokeWidth={2} dot={false}/>
                        <Line yAxisId="right" type="monotone" dataKey="avgConvergence" name="Convergence (epochs)" stroke="#3182CE" strokeWidth={2} dot={false}/>
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                 <div className="w-full h-[90%] flex items-center justify-center">
                    <p className="text-gray-400">Loading chart...</p>
                </div>
            )}
        </div>
    );
};

const EvolutionDashboard: React.FC<EvolutionDashboardProps> = ({ config, evolutionData, onStop, isLoadingNextGen }) => {
  const currentGeneration = evolutionData.length;
  const bestOverallPair = evolutionData.reduce((best, current) => {
    return (current.bestPair.accuracy > (best?.accuracy || 0)) ? current.bestPair : best;
  }, evolutionData[0]?.bestPair || null);

  const progressPercentage = (currentGeneration / config.generations) * 100;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-4xl font-bold text-white">EvoFusion Dashboard</h1>
                <p className="text-gray-400 mt-1">Tracking co-evolution for <span className="font-semibold text-blue-300">{config.dataset}</span> on <span className="font-semibold text-blue-300">{config.model}</span></p>
            </div>
            <button
              onClick={onStop}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-300"
            >
              Stop & Finalize
            </button>
        </div>

        {/* Progress Bar and Stats */}
        <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-medium text-white">
                    Generation: {currentGeneration} / {config.generations}
                </span>
                {isLoadingNextGen && (
                  <div className="flex items-center text-sm text-blue-300">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Evolving next generation...
                  </div>
                )}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MetricsChart data={evolutionData} />
          </div>
          <BestPairCard pair={bestOverallPair} />
        </div>
      </div>
    </div>
  );
};

export default EvolutionDashboard;