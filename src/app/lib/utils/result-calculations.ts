import { CommonFormResult } from "../adapters/results";


  // src/lib/utils/result-calculations.ts
  export const calculateCharacteristics = (totalAvg: number | undefined): string => {
    if (!totalAvg) return '';
    
    if (totalAvg >= 4.5) return '10';
    if (totalAvg >= 3.5) return '9';
    if (totalAvg >= 2.5) return '8';
    if (totalAvg >= 1.5) return '7';
    return '6';
  };
  
  export const extractScoreTypes = (results: CommonFormResult[]): string[] => {
    const types = new Set<string>();
    results.forEach(form =>
      form.questions.forEach(question =>
        question.scores.forEach(score => types.add(score.type))
      )
    );
    return Array.from(types);
  };