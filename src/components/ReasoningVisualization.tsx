import { CheckCircle2, Circle, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import type { QueryResult } from '../types/query'

interface ReasoningVisualizationProps {
  result: QueryResult | null;
  isProcessing: boolean;
}

export function ReasoningVisualization({ result, isProcessing }: ReasoningVisualizationProps) {
  if (isProcessing) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
        <div className="flex items-center justify-center gap-3 text-blue-600 dark:text-blue-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-medium">Processing query through EPC framework...</span>
        </div>
        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* EPC Steps */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Circle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Reasoning Process
        </h2>

        <div className="space-y-4">
          {result.epcSteps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Container */}
              <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Event */}
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                      <div className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1 uppercase tracking-wide">
                        Event
                      </div>
                      <div className="text-sm text-slate-900 dark:text-slate-200">{step.event}</div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    </div>

                    {/* Process */}
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 border border-indigo-200 dark:border-indigo-700 md:col-start-2">
                      <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1 uppercase tracking-wide">
                        Process
                      </div>
                      <div className="text-sm text-slate-900 dark:text-slate-200">{step.process}</div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    </div>

                    {/* Condition */}
                    <div className="bg-violet-50 dark:bg-violet-900/30 rounded-lg p-3 border border-violet-200 dark:border-violet-700 md:col-start-3">
                      <div className="text-xs font-semibold text-violet-700 dark:text-violet-400 mb-1 uppercase tracking-wide">
                        Condition
                      </div>
                      <div className="text-sm text-slate-900 dark:text-slate-200">{step.condition}</div>
                    </div>
                  </div>
                </div>

                {/* Reasoning Details */}
                <div className="ml-11 bg-white dark:bg-slate-700 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Detailed Reasoning
                  </div>
                  <ul className="space-y-1.5">
                    {step.reasoning.map((reason, rIndex) => (
                      <li key={rIndex} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Connector Line */}
              {index < result.epcSteps.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="w-0.5 h-6 bg-gradient-to-b from-blue-400 to-indigo-400"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Final Answer */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-sm border border-green-200 dark:border-green-800 p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-green-600 dark:bg-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Final Answer</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-400">Confidence Score:</span>
              <div className="flex-1 max-w-xs h-2 bg-white dark:bg-slate-700 rounded-full overflow-hidden border border-green-300 dark:border-green-700">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                  style={{ width: `${result.confidence * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                {(result.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{result.finalAnswer}</p>
        </div>

        <div className="mt-4 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg p-3 border border-green-200 dark:border-green-800">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            This answer was generated through {result.epcSteps.length} distinct EPC reasoning stages, 
            each validated against logical conditions and domain knowledge.
          </p>
        </div>
      </div>
    </div>
  );
}