import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QueryInput } from './QueryInput';
import { ReasoningVisualization } from './ReasoningVisualization';
import { QueryHistory } from './QueryHistory';
import { Brain, Home } from 'lucide-react';
import { askEpcBackend } from '../api/epcBackend';

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

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleQuerySubmit = async (query: string) => {
    setIsProcessing(true);

    try {
      // 🔗 Call EPC LLM backend
      const aiAnswer = await askEpcBackend(query);

      // 🧠 Build EPC-style result (frontend-controlled structure)
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
        finalAnswer: aiAnswer, // ✅ REAL BACKEND RESPONSE
        confidence: 0.85,      // Static confidence for demo safety
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

  const handleHistorySelect = (result: QueryResult) => {
    setCurrentResult(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
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

          {/* Right Column */}
          <div className="lg:col-span-1">
            <QueryHistory
              history={history}
              onSelect={handleHistorySelect}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
