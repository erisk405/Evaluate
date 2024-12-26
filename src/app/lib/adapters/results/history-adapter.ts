import { historyResult } from '@/types/interface';
  import { CommonResultFormat } from './types';
  
  export const adaptHistoryResult = (data: historyResult): CommonResultFormat => {
    return {
      formResults: data.formResults.map(form => ({
        id: form.detailId,
        formName: form.formName,
        level: form.level,
        questions: form.questions.map(q => ({
          id: q.id,
          name: q.questionName,
          scores: q.scores.map(s => ({
            type: s.type,
            average: s.average,
            sd: s.sd
          })),
          summary: {
            average: q.sumScore.average,
            sd: q.sumScore.sd
          }
        })),
        totals: {
          average: form.sumTotal.average_per_form,
          sd: form.sumTotal.sd_per_form,
          byType: form.total.map(t => ({
            type: t.type,
            average: t.average_per_type,
            sd: t.sd_per_type
          }))
        }
      })),
      headData: {
        department: data.headData.department,
        periodName: data.headData.periodName,
        roleName: data.headData.roleName,
        totalAverage: data.headData.total_mean,
        totalSD: data.headData.total_SD,
        userName: data.headData.userName
      }
    };
  };