import { Clock, TrendingUp } from 'lucide-react';
import type { QueryResult } from '../App';

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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-slate-600" />
        <h2 className="font-semibold text-slate-900">Query History</h2>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-sm text-slate-600">No queries yet</p>
          <p className="text-xs text-slate-500 mt-1">Your query history will appear here</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm text-slate-900 line-clamp-2 flex-1 group-hover:text-blue-700">
                  {item.query}
                </p>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{formatTime(item.timestamp)}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      style={{ width: `${item.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-slate-600 font-medium">
                    {(item.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                  {item.epcSteps.length} steps
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
