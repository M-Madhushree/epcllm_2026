import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isProcessing: boolean;
}

export function QueryInput({ onSubmit, isProcessing }: QueryInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isProcessing) {
      onSubmit(query.trim());
      setQuery('');
    }
  };

  const sampleQueries = [
    "What are the environmental impacts of renewable energy?",
    "Explain the process of protein synthesis in cells",
    "How does blockchain technology ensure security?",
    "Analyze the factors contributing to urban heat islands"
  ];

  const handleSampleClick = (sample: string) => {
    if (!isProcessing) {
      setQuery(sample);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="font-semibold text-slate-900 mb-4">Ask a Question</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your query here... The system will analyze it using the EPC framework and provide a structured, explainable response."
            className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!query.trim() || isProcessing}
            className="absolute bottom-3 right-3 w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        <div>
          <p className="text-xs text-slate-600 mb-2">Try these sample queries:</p>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((sample, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSampleClick(sample)}
                disabled={isProcessing}
                className="px-3 py-1.5 text-xs bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
