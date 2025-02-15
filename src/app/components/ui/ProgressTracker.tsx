/**  
 * CODED BY: LUCCAS EASTMAN  
 *   
 * ProgressTracker Component  
 * This component displays the progress of completed modules in a course.  
 * It calculates the progress percentage dynamically and provides a responsive   
 * and accessible UI for users to track their progress.  
 *   
 * Key Features:  
 * - Real-time updates using React state management  
 * - Production-ready error handling and validation  
 * - Responsive design with smooth animations  
 * - TypeScript for type safety and maintainability  
 * - Detailed educational comments for developers  
 */

"use client";

import React, { useEffect, useState } from "react";
import { useCourseStore } from "@store/courseStore";

/**  
 * ProgressTracker Component  
 * @returns JSX.Element - A React component for tracking course progress  
 */
export function ProgressTracker(): JSX.Element {
  // Extracting necessary state from the course store  
  const { completedModules, totalModulesCount } = useCourseStore();

  // Local state for progress percentage  
  const [progressPercentage, setProgressPercentage] = useState<number>(0);

  /**  
   * useEffect Hook  
   * - Calculates the progress percentage whenever completedModules or totalModulesCount changes.  
   * - Ensures that the progress percentage is updated in real-time.  
   */
  useEffect(() => {
    if (totalModulesCount > 0) {
      const percentage = Math.round(
        (completedModules.length / totalModulesCount) * 100
      );
      setProgressPercentage(percentage);
    } else {
      setProgressPercentage(0); // Reset progress if totalModulesCount is invalid  
    }
  }, [completedModules, totalModulesCount]);

  /**  
   * Validation: Handles edge cases where totalModulesCount is invalid or zero.  
   * - Prevents division by zero errors.  
   * - Provides a user-friendly fallback message if progress data is unavailable.  
   */
  if (!totalModulesCount || totalModulesCount <= 0) {
    return (
      <div className="text-muted-foreground" role="alert" aria-live="polite">
        Progress data unavailable
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Progress Summary */}
      <div className="flex justify-between text-sm">
        <span>
          {completedModules.length} of {totalModulesCount} Modules Complete
        </span>
        <span>{progressPercentage}%</span>
      </div>

      {/* Progress Bar */}
      <div
        className="h-2 bg-secondary rounded-full"
        role="progressbar"
        aria-valuenow={progressPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Course Progress"
      >
        <div
          className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}