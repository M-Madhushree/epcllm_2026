import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QueryInput } from './QueryInput';
import { ReasoningVisualization } from './ReasoningVisualization';
import { QueryHistory } from './QueryHistory';
import { ThemeToggle } from './ThemeToggle';
import { Brain, Home } from 'lucide-react';

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
    await new Promise(resolve => setTimeout(resolve, 2000));

    const result = generateMockResult(query);
    setCurrentResult(result);
    setHistory(prev => [result, ...prev]);
    setIsProcessing(false);
  };

  return (
    <div className="app-container">

      {/* Header */}
      <header className="app-header">
        <div className="app-header-inner">

          <div className="app-logo">
            <div className="app-logo-icon">
              <Brain size={20} />
            </div>
            <div>
              <h1 className="app-title">EPC Reasoning Engine</h1>
              <p className="app-subtitle">Event-Process-Condition Framework</p>
            </div>
          </div>

          <div className="app-actions">
            <ThemeToggle />
            <button onClick={handleBackToHome} className="app-back-btn">
              <Home size={16} /> Back to Home
            </button>
          </div>

        </div>
      </header>

      {/* Main content */}
      <main className="app-main">
        <div className="app-grid">

          <div className="app-left">
            <QueryInput onSubmit={handleQuerySubmit} isProcessing={isProcessing} />
            {(currentResult || isProcessing) && (
              <ReasoningVisualization
                result={currentResult}
                isProcessing={isProcessing}
              />
            )}
          </div>

          <div className="app-right">
            <QueryHistory history={history} onSelect={setCurrentResult} />
          </div>

        </div>
      </main>
    </div>
  );
}

/* Mock generator */
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
          'Identified key entities',
          'Detected intent',
          'Selected strategy'
        ]
      },
      {
        event: 'Context analysis',
        process: 'Retrieve domain knowledge',
        condition: 'Relevance > 0.8',
        reasoning: [
          'Matched sources',
          'Filtered noise'
        ]
      }
    ],
    finalAnswer: `Structured EPC reasoning applied to "${query}".`,
    confidence: 0.92
  };
}
