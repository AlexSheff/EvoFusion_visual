
import React, { useState, useCallback, useEffect } from 'react';
import ConfigurationPanel from './components/ConfigurationPanel';
import EvolutionDashboard from './components/EvolutionDashboard';
import ResultsReport from './components/ResultsReport';
import { DEFAULT_CONFIG } from './constants';
import { generateSymbolicFunctions, generateReportSummary } from './services/geminiService';
import { AppState } from './types';
import type { EvolutionConfig, GenerationData, FunctionPair, FinalReport } from './types';

// Main App Component
const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.CONFIGURING);
  const [config, setConfig] = useState<EvolutionConfig>(DEFAULT_CONFIG);
  const [evolutionData, setEvolutionData] = useState<GenerationData[]>([]);
  const [finalReport, setFinalReport] = useState<FinalReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stopSignal, setStopSignal] = useState(false);

  useEffect(() => {
    // Reset stop signal when starting a new configuration
    if (appState === AppState.CONFIGURING) {
      setStopSignal(false);
    }
  }, [appState]);

  const runSimulation = useCallback(async (currentConfig: EvolutionConfig) => {
    setIsLoading(true);
    setAppState(AppState.RUNNING);
    
    let allGeneratedPairs: FunctionPair[] = [];
    let evolutionLog: GenerationData[] = [];
    
    // Initial Population
    const initialFunctions = await generateSymbolicFunctions(currentConfig.populationSize);
    allGeneratedPairs = initialFunctions.map((pair, index) => ({
      id: `gen0-${index}`,
      ...pair,
      accuracy: 0.5 + Math.random() * 0.1, // Start with lower accuracy
      f1: 0.4 + Math.random() * 0.1,
      convergence: 80 + Math.random() * 20, // Slower convergence
    }));
    
    for (let gen = 1; gen <= currentConfig.generations; gen++) {
      if (stopSignal) {
        console.log("Stopping simulation early.");
        break;
      }
      
      // Simulate evolution: selection, crossover, mutation
      allGeneratedPairs.sort((a, b) => b.accuracy - a.accuracy);
      const elite = allGeneratedPairs.slice(0, Math.ceil(currentConfig.populationSize * 0.2)); // Keep top 20%
      
      const newFunctionsCount = currentConfig.populationSize - elite.length;
      const newFunctions = await generateSymbolicFunctions(Math.ceil(newFunctionsCount / 2)); // Generate half, duplicate/mix for full count
      
      const newPairs: FunctionPair[] = newFunctions.flatMap((pair, i) => ([
        {
          id: `gen${gen}-a-${i}`,
          ...pair,
          accuracy: Math.min(0.98, elite[0].accuracy * (0.98 + Math.random() * 0.05)), // New ones are slightly better/worse
          f1: Math.min(0.98, elite[0].f1 * (0.98 + Math.random() * 0.05)),
          convergence: Math.max(10, elite[0].convergence * (1 - Math.random() * 0.1)),
        },
         {
          id: `gen${gen}-b-${i}`,
          activation: newFunctions[newFunctions.length - 1 - i].activation,
          loss: pair.loss,
          accuracy: Math.min(0.98, elite[0].accuracy * (0.98 + Math.random() * 0.05)),
          f1: Math.min(0.98, elite[0].f1 * (0.98 + Math.random() * 0.05)),
          convergence: Math.max(10, elite[0].convergence * (1 - Math.random() * 0.1)),
        }
      ])).slice(0, newFunctionsCount);

      allGeneratedPairs = [...elite, ...newPairs];

      const bestPairOfGen = allGeneratedPairs[0];

      const genData: GenerationData = {
        generation: gen,
        bestPair: bestPairOfGen,
        avgAccuracy: allGeneratedPairs.reduce((sum, p) => sum + p.accuracy, 0) / allGeneratedPairs.length,
        avgF1: allGeneratedPairs.reduce((sum, p) => sum + p.f1, 0) / allGeneratedPairs.length,
        avgConvergence: allGeneratedPairs.reduce((sum, p) => sum + p.convergence, 0) / allGeneratedPairs.length,
      };

      evolutionLog = [...evolutionLog, genData];
      setEvolutionData([...evolutionLog]);

      // simulate generation time
      await new Promise(resolve => setTimeout(resolve, 1500)); 
    }

    const bestOverallPair = evolutionLog.reduce((best, current) => 
        (current.bestPair.accuracy > (best?.accuracy || 0)) ? current.bestPair : best, 
    evolutionLog[0]?.bestPair) || allGeneratedPairs[0];

    setIsLoading(true); // show loading for report generation
    const summary = await generateReportSummary({ config: currentConfig, bestPair: bestOverallPair, evolutionData: evolutionLog });
    
    setFinalReport({
      config: currentConfig,
      bestPair: bestOverallPair,
      evolutionData: evolutionLog,
      summary,
    });

    setAppState(AppState.FINISHED);
    setIsLoading(false);

  }, [stopSignal]);

  const handleStart = (newConfig: EvolutionConfig) => {
    setConfig(newConfig);
    setEvolutionData([]);
    setFinalReport(null);
    setStopSignal(false);
    runSimulation(newConfig);
  };
  
  const handleStop = () => {
    setStopSignal(true);
  };

  const handleRestart = () => {
    setAppState(AppState.CONFIGURING);
    setEvolutionData([]);
    setFinalReport(null);
    setConfig(DEFAULT_CONFIG);
  };
  
  const renderContent = () => {
    switch (appState) {
      case AppState.RUNNING:
        return <EvolutionDashboard config={config} evolutionData={evolutionData} onStop={handleStop} isLoadingNextGen={!stopSignal}/>;
      case AppState.FINISHED:
        return <ResultsReport report={finalReport} onRestart={handleRestart} />;
      case AppState.CONFIGURING:
      default:
        return <ConfigurationPanel config={config} setConfig={setConfig} onStart={handleStart} isLoading={isLoading && appState === AppState.CONFIGURING} />;
    }
  };

  return (
    <main className="bg-gray-900 text-white min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        {renderContent()}
    </main>
  );
};

export default App;
