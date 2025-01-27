// src/lib/adapters/results/evaluate-adapter.ts
import { getResultEvaluateType } from '@/types/interface';
import { CommonResultFormat } from './types';

export const adaptEvaluateResult = (data: getResultEvaluateType): CommonResultFormat => {
  return {
    formResults: data.formResults.map(form => ({
      id: form.formId,
      formName: form.formName,
      level: form.questions[0]?.level || 'UNSET', // Assuming all questions in a form have same level
      questions: form.questions.map(q => ({
        id: q.questionId,
        name: q.questionName,
        scores: q.scores?.map(s => ({
          type: s.type,
          average: s.average,
          sd: s.sd
        })) || [],
        summary: {
          average: q.sumScore.average,
          sd: q.sumScore.standardDeviation
        }
      })),
      totals: {
        average: form.totalAvgPerForm,
        sd: form.totalSDPerForm,
        byType: form.total?.map(t => ({
          type: t.total,
          average: t.average,
          sd: t.sd
        })) || [] // ถ้า total เป็น undefined ให้ return array ว่าง
      }
    })),
    headData: {
      userName: data.headData.evaluatorName || '',
      department: data.headData.department || '',
      periodName: data.headData.periodName,
      roleName: data.headData.roleName || '',
      totalAverage: data.headData.totalAvg || data.headData.totalAVG,
      totalSD: data.headData.totalSD,
      totalEvaluated: data.headData.totalEvaluated
    }
  };
};
