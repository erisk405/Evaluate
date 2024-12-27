import { LevelFormVision } from "@/types/interface";
import { CategorizedFormResults, CommonFormResult, VISION_LEVEL_CONFIGS } from "./types";

export const adaptCategorizeFormResultsByVisionLevel = (
    formResults: CommonFormResult[]
  ): CategorizedFormResults => {
    const categorized: CategorizedFormResults = {
      formResults: {},
    };
    formResults.forEach((formResult) => {
      const level = formResult.level;
      // Type guard to ensure level is a valid LevelFormVision
      // console.log("level", level);

      if (Object.keys(VISION_LEVEL_CONFIGS).includes(level)) {
        const typedLevel = level as LevelFormVision;
        if (!categorized.formResults[typedLevel]) {
          categorized.formResults[typedLevel] = [];
        }
        categorized.formResults[typedLevel]!.push(formResult);
      }
    });
    return categorized;
  };