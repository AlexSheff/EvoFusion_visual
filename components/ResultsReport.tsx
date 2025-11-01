import React from 'react';
import type { FinalReport, GenerationData } from '../types';

interface ResultsReportProps {
  report: FinalReport | null;
  onRestart: () => void;
}

const TrophyIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 1011.64-8.03A9.75 9.75 0 0016.5 18.75z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V9.75m0 0l-2.25 2.25M12 9.75l2.25 2.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75l-3.75-3.75m3.75 3.75l3.75-3.75" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25" />
    </svg>
);


const ResultsReport: React.FC<ResultsReportProps> = ({ report, onRestart }) => {
  const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = (window as any).Recharts || {};

  if (!report) return null;

  const { config, bestPair, evolutionData, summary } = report;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
            <h1 className="text-5xl font-extrabold text-white tracking-tight">Evolution Complete</h1>
            <p className="mt-4 text-lg text-gray-300">Final report for the co-evolutionary run.</p>
        </div>

        {/* Summary Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-blue-300 mb-4">AI-Generated Summary</h2>
          <div className="prose prose-invert prose-p:text-gray-300 prose-strong:text-white text-gray-300">
            {summary.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
        </div>
        
        {/* Best Pair Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl p-8">
          <div className="flex items-center mb-6">
            <TrophyIcon className="w-8 h-8 text-yellow-400 mr-4"/>
            <h2 className="text-3xl font-bold text-white">Champion Pair</h2>
          </div>
           <div className="space-y-4 text-md">
                <div>
                    <p className="text-yellow-300 font-semibold">Activation Function:</p>
                    <code className="block bg-black/50 text-yellow-200 p-3 rounded-md mt-1 font-mono text-sm">{bestPair.activation}</code>
                </div>
                <div>
                    <p className="text-purple-300 font-semibold">Loss Function:</p>
                    <code className="block bg-black/50 text-purple-200 p-3 rounded-md mt-1 font-mono text-sm">{bestPair.loss}</code>
                </div>
            </div>
             <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-sm text-gray-400">Final Accuracy</p>
                    <p className="text-2xl font-bold text-white">{(bestPair.accuracy * 100).toFixed(2)}%</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Final F1 Score</p>
                    <p className="text-2xl font-bold text-white">{bestPair.f1.toFixed(3)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Convergence Speed (Epochs)</p>
                    <p className="text-2xl font-bold text-white">{bestPair.convergence.toFixed(0)}</p>
                </div>
            </div>
        </div>

        {/* Chart */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl p-8 h-[450px]">
          <h2 className="text-2xl font-bold text-white mb-4">Full Evolution History</h2>
           {LineChart ? (
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={evolutionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="generation" stroke="#A0AEC0" />
                    <YAxis yAxisId="left" stroke="#A0AEC0" />
                    <YAxis yAxisId="right" orientation="right" stroke="#A0AEC0" />
                    <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="avgAccuracy" name="Avg Accuracy" stroke="#48BB78" strokeWidth={2} />
                    <Line yAxisId="left" type="monotone" dataKey="avgF1" name="Avg F1 Score" stroke="#9F7AEA" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="avgConvergence" name="Convergence (epochs)" stroke="#3182CE" strokeWidth={2}/>
                </LineChart>
            </ResponsiveContainer>
           ) : (
            <div className="w-full h-[90%] flex items-center justify-center">
                <p className="text-gray-400">Loading chart...</p>
            </div>
           )}
        </div>

        <div className="text-center pt-4">
            <button
                onClick={onRestart}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-300 text-lg"
            >
                Run New Evolution
            </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsReport;