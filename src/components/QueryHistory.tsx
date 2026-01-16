import { Clock, TrendingUp } from 'lucide-react';
import type { QueryResult } from '../types/query';
import './Queryhistory.css'
interface QueryHistoryProps {
  history: QueryResult[];
  onSelect: (result: QueryResult) => void;
}

export function QueryHistory({ history, onSelect }: QueryHistoryProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="qh-card">
      <div className="qh-header">
        <Clock className="qh-icon" />
        <h2>Query History</h2>
      </div>
  
      {history.length === 0 ? (
        <div className="qh-empty">
          <div className="qh-empty-icon">
            <TrendingUp />
          </div>
          <p>No queries yet</p>
          <small>Your query history will appear here</small>
        </div>
      ) : (
        <div className="qh-list">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="qh-item"
            >
              <p className="qh-query">{item.query}</p>
  
              <div className="qh-meta">
                <span>{formatTime(item.timestamp)}</span>
  
                <div className="qh-confidence">
                  <div className="qh-bar">
                    <div
                      className="qh-bar-fill"
                      style={{ width: `${item.confidence * 100}%` }}
                    />
                  </div>
                  <span>{(item.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
  
              <div className="qh-steps">
                {item.epcSteps.length} steps
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
  
}