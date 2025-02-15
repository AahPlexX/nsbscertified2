
"use client";

import { useEffect } from "react";
import { useCourseStore } from "@store/courseStore";

export function ProgressTracker(): JSX.Element {
  const { completedModules, totalModulesCount } = useCourseStore();

  if (!totalModulesCount) {
    return (
      <div className="text-muted-foreground">
        Progress data unavailable
      </div>
    );
  }

  const progressPercentage = Math.round((completedModules.length / totalModulesCount) * 100);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-sm">
        <span>{completedModules.length} of {totalModulesCount} Modules Complete</span>
        <span>{progressPercentage}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
