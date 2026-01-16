import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import "./QueryInput.css";

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

  return (
    <div className="qi-card">
      <h2 className="qi-title">Ask a Question</h2>

      <form onSubmit={handleSubmit} className="qi-form">
        <div className="qi-textarea-wrapper">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your query here... The system will analyze it using the EPC framework and provide a structured, explainable response."
            className="qi-textarea"
            rows={4}
            disabled={isProcessing}
          />

          <button
            type="submit"
            disabled={!query.trim() || isProcessing}
            className="qi-send-btn"
          >
            {isProcessing ? (
              <Loader2 className="qi-spinner" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>

        <div className="qi-samples">
          <p>Try these sample queries:</p>

          <div className="qi-sample-list">
            {sampleQueries.map((sample, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setQuery(sample)}
                disabled={isProcessing}
                className="qi-sample-btn"
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
