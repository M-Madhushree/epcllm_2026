export interface EpcStep {
    event: string;
    process: string;
    condition: string;
    reasoning: string[];
  }
  
  export interface QueryResult {
    id: string;
    query: string;
    timestamp: Date;
    epcSteps: EpcStep[];
    finalAnswer: string;
    confidence: number; // 0 to 1
  }
  