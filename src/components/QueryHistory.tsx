import { Clock, TrendingUp } from 'lucide-react';
import type { QueryResult } from '../types/query'

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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sticky top-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        <h2 className="font-semibold text-slate-900 dark:text-white">Query History</h2>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">No queries yet</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Your query history will appear here</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-slate-700 transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm text-slate-900 dark:text-slate-200 line-clamp-2 flex-1 group-hover:text-blue-700 dark:group-hover:text-blue-400">
                  {item.query}
                </p>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">{formatTime(item.timestamp)}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      style={{ width: `${item.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    {(item.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
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