import { Loader2, CheckCircle2 } from 'lucide-react';
import type { QueryResult } from './MainApp';

interface ReasoningVisualizationProps {
  result: QueryResult | null;
  isProcessing: boolean;
}

export function ReasoningVisualization({
  result,
  isProcessing,
}: ReasoningVisualizationProps) {

  if (isProcessing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-center gap-3 text-blue-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-medium">
            Generating EPC AI response…
          </span>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 mb-1">
            EPC AI Answer
          </h3>
          <p className="text-xs text-slate-500">
            Generated using domain-specific EPC knowledge
          </p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="text-slate-700 leading-relaxed whitespace-pre-line">
          {result.finalAnswer}
        </div>
      </div>
    </div>
  );
}
