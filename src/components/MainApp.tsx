import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QueryInput } from './QueryInput';
import { ReasoningVisualization } from './ReasoningVisualization';
import { QueryHistory } from './QueryHistory';
import { ThemeToggle } from './ThemeToggle';
import { Brain, Home } from 'lucide-react';
import { askEpcBackend } from '../api/epcBackend';

import './MainApp.css';

export interface EPCStep {
  event: string;
  process: string;
  condition: string;
  reasoning: string[];
}

export interface QueryResult {
  id: string;
  query: string;
  timestamp: Date;
  epcSteps: EPCStep[];
  finalAnswer: string;
  confidence: number;
}

export function MainApp() {
  const navigate = useNavigate();
  const [currentResult, setCurrentResult] = useState<QueryResult | null>(null);
  const [history, setHistory] = useState<QueryResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBackToHome = () => navigate('/');

  const handleQuerySubmit = async (query: string) => {
    setIsProcessing(true);

    try {
      const aiAnswer = await askEpcBackend(query);

      const result: QueryResult = {
        id: Date.now().toString(),
        query,
        timestamp: new Date(),
        epcSteps: [
          {
            event: 'User query received',
            process: 'Parse and classify query',
            condition: 'Query is valid and EPC-relevant',
            reasoning: [
              'Detected pre-construction context',
              'Identified structural design intent',
            ],
          },
          {
            event: 'Context retrieval triggered',
            process: 'Retrieve relevant EPC domain knowledge',
            condition: 'Relevant knowledge available',
            reasoning: [
              'Matched cost vs safety considerations',
              'Retrieved pre-construction risk factors',
            ],
          },
          {
            event: 'AI reasoning executed',
            process: 'Apply conservative engineering reasoning',
            condition: 'Safety-first constraints satisfied',
            reasoning: [
              'Evaluated serviceability and deflection risks',
              'Balanced cost savings against long-term risks',
            ],
          },
        ],
        finalAnswer: aiAnswer,
        confidence: 0.85, // static for demo safety
      };

      setCurrentResult(result);
      setHistory(prev => [result, ...prev]);

    } catch (error) {
      console.error(error);
      alert('Failed to get response from EPC backend.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-container">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                EPC Reasoning Engine
              </h1>
              <p className="text-sm text-slate-600">
                Event-Process-Condition Framework
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={handleBackToHome} className="app-back-btn">
              <Home size={16} /> Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <QueryInput
              onSubmit={handleQuerySubmit}
              isProcessing={isProcessing}
            />

            {(currentResult || isProcessing) && (
              <ReasoningVisualization
                result={currentResult}
                isProcessing={isProcessing}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <QueryHistory
              history={history}
              onSelect={setCurrentResult}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
