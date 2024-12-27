import { LevelFormVision } from "@/types/interface";

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


interface VisionLevelConfig {
  showScoreTypes: boolean;
  label: string;
}

export interface CategorizedFormResults {
  formResults: {
    [level in LevelFormVision]?: CommonFormResult[];
  };
}

export const VISION_LEVEL_CONFIGS: Record<LevelFormVision, VisionLevelConfig> = {
  VISION_1: {
    showScoreTypes: false,
    label: "ผลโดยรวมของตาราง",
  },
  VISION_2: {
    showScoreTypes: true,
    label: "จำแนกแต่ละหน่วยงาน",
  },
  UNSET: {
    showScoreTypes: false,
    label: "ยังไม่ถูกกำหนด VISION",
  },
};



