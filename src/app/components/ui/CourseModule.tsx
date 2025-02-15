
"use client";

import { useState } from "react";
import { useCourseStore } from "@store/courseStore";
import { Button } from "./Button";

interface CourseModuleProps {
  id: string;
  title: string;
  content: string;
  order: number;
}

export function CourseModule({ id, title, content, order }: CourseModuleProps): JSX.Element {
  const { completedModules, setCompletedModules } = useCourseStore();
  const [isCompleting, setIsCompleting] = useState(false);
  const isCompleted = completedModules.includes(id);

  const handleCompletion = async () => {
    try {
      setIsCompleting(true);
      await setCompletedModules([...completedModules, id]);
    } catch (error) {
      console.error("Failed to mark module as complete:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 mb-4 bg-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          Module {order}: {title}
        </h3>
        {isCompleted ? (
          <span className="text-primary text-sm">✓ Completed</span>
        ) : (
          <Button
            label="Mark as Complete"
            onClick={handleCompletion}
            variant="secondary"
            disabled={isCompleting}
          />
        )}
      </div>
      <div className="prose dark:prose-invert max-w-none">
        {content}
      </div>
    </div>
  );
}
