// src/lib/adapters/results/types.ts
export interface CommonResultFormat {
    formResults: CommonFormResult[];
    headData: CommonHeadData;
  }
  
  export interface CommonFormResult {
    id: string;
    formName: string;
    level: string;
    questions: CommonQuestion[];
    totals: {
      average: number;
      sd: number;
      byType?: { type: string; average: number; sd: number }[];
    };
  }
  
  export interface CommonQuestion {
    id: string;
    name: string;
    scores: CommonScore[];
    summary: {
      average: number;
      sd: number;
    };
  }
  
  export interface CommonScore {
    type: string;
    average: number;
    sd: number;
  }
  
  export interface CommonHeadData {
    department: string;
    periodName: string;
    roleName: string;
    totalAverage: number;
    totalSD: number;
    userName?: string;
    totalEvaluated?: number;
  }
  
  // src/lib/adapters/results/history-adapter.ts
  
  
 

