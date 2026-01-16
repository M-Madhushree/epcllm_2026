import { CheckCircle2, Circle, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import type { QueryResult } from '../types/query';
import "./ReasoningVisualization.css";

interface ReasoningVisualizationProps {
  result: QueryResult | null;
  isProcessing: boolean;
}

export function ReasoningVisualization({ result, isProcessing }: ReasoningVisualizationProps) {

  if (isProcessing) {
    return (
      <div className="rv-card rv-loading">
        <div className="rv-loading-row">
          <Loader2 className="rv-spinner" />
          <span>Processing query through EPC framework...</span>
        </div>

        <div className="rv-skeleton">
          {[1,2,3,4].map(i => (
            <div key={i} className="rv-skeleton-row">
              <div className="rv-skeleton-circle"></div>
              <div className="rv-skeleton-line"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="rv-wrapper">

      <div className="rv-card">
        <h2 className="rv-title">
          <Circle size={18}/> Reasoning Process
        </h2>

        {result.epcSteps.map((step, index) => (
          <div key={index} className="rv-step">

            <div className="rv-step-header">
              <div className="rv-step-number">{index+1}</div>

              <div className="rv-step-grid">

                <div className="rv-box event">
                  <b>Event</b>
                  <p>{step.event}</p>
                </div>

                <ArrowRight className="rv-arrow"/>

                <div className="rv-box process">
                  <b>Process</b>
                  <p>{step.process}</p>
                </div>

                <ArrowRight className="rv-arrow"/>

                <div className="rv-box condition">
                  <b>Condition</b>
                  <p>{step.condition}</p>
                </div>

              </div>
            </div>

            <div className="rv-reasoning">
              <b>Detailed Reasoning</b>
              <ul>
                {step.reasoning.map((r,i)=>(
                  <li key={i}>
                    <CheckCircle2 size={14}/> {r}
                  </li>
                ))}
              </ul>
            </div>

            {index < result.epcSteps.length-1 && <div className="rv-connector"></div>}
          </div>
        ))}
      </div>

      <div className="rv-final">
        <div className="rv-final-header">
          <CheckCircle2/>
          <h3>Final Answer</h3>
        </div>

        <div className="rv-confidence">
          <span>Confidence:</span>
          <div className="rv-bar">
            <div className="rv-bar-fill" style={{width:`${result.confidence*100}%`}}/>
          </div>
          <span>{(result.confidence*100).toFixed(1)}%</span>
        </div>

        <div className="rv-answer">{result.finalAnswer}</div>

        <div className="rv-note">
          <AlertCircle size={14}/>
          Generated through {result.epcSteps.length} EPC stages
        </div>
      </div>

    </div>
  );
}
