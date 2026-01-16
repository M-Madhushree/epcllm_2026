import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QueryInput } from './QueryInput';
import { ReasoningVisualization } from './ReasoningVisualization';
import { QueryHistory } from './QueryHistory';
import { ThemeToggle } from './ThemeToggle'
import { Brain, Home } from 'lucide-react';

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
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock EPC reasoning
    const result: QueryResult = generateMockResult(query);
    
    setCurrentResult(result);
    setHistory(prev => [result, ...prev]);
    setIsProcessing(false);
  };

  const handleHistorySelect = (result: QueryResult) => {
    setCurrentResult(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">EPC Reasoning Engine</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Event-Process-Condition Framework</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={handleBackToHome}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input and Current Result */}
          <div className="lg:col-span-2 space-y-6">
            <QueryInput onSubmit={handleQuerySubmit} isProcessing={isProcessing} />
            {(currentResult || isProcessing) && (
              <ReasoningVisualization result={currentResult} isProcessing={isProcessing} />
            )}
          </div>

          {/* Right Column - History */}
          <div className="lg:col-span-1">
            <QueryHistory history={history} onSelect={handleHistorySelect} />
          </div>
        </div>
      </main>
    </div>
  );
}

// Mock function to generate EPC reasoning
function generateMockResult(query: string): QueryResult {
  return {
    id: Date.now().toString(),
    query,
    timestamp: new Date(),
    epcSteps: [
      {
        event: 'User query received',
        process: 'Parse and tokenize input query',
        condition: 'Query complexity analyzed',
        reasoning: [
          'Identified key entities in the query',
          'Determined question type and intent',
          'Selected appropriate reasoning strategy'
        ]
      },
      {
        event: 'Context analysis triggered',
        process: 'Retrieve relevant domain knowledge',
        condition: 'Knowledge base relevance > 0.8',
        reasoning: [
          'Searched knowledge base for relevant information',
          'Matched domain-specific patterns',
          'Prioritized high-confidence sources'
        ]
      },
      {
        event: 'Reasoning chain initiated',
        process: 'Apply logical inference rules',
        condition: 'All premises validated',
        reasoning: [
          'Constructed logical argument chain',
          'Verified premise validity',
          'Applied deductive reasoning steps',
          'Cross-referenced with established facts'
        ]
      },
      {
        event: 'Solution synthesis required',
        process: 'Generate structured response',
        condition: 'Confidence threshold met',
        reasoning: [
          'Consolidated findings into coherent answer',
          'Verified answer consistency',
          'Calculated confidence score based on evidence strength'
        ]
      }
    ],
    finalAnswer: `Based on the structured analysis of your query "${query}", the system has processed the request through multiple EPC reasoning stages. Each stage involved specific events that triggered processes, which were then evaluated against conditions to ensure accuracy and reliability. The final answer is derived from a logical chain of reasoning that can be traced back through each step, providing full transparency and explainability.`,
    confidence: 0.92
  };
}