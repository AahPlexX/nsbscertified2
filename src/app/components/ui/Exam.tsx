
"use client";

import { useState } from "react";
import { useCourseStore } from "@store/courseStore";
import { Button } from "./Button";

interface ExamProps {
  examId: string;
  questions: Array<{
    id: string;
    text: string;
    options: string[];
    order: number;
  }>;
}

export function Exam({ examId, questions }: ExamProps): JSX.Element {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);

  const handleAnswerSelect = (questionId: string, selectedIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedIndex
    }));
  };

  const isAllQuestionsAnswered = questions.every(q => 
    typeof answers[q.id] === 'number'
  );

  const handleSubmit = async () => {
    if (!isAllQuestionsAnswered) return;

    try {
      setIsSubmitting(true);
      setHasError(false);

      // Submit answers to API
      const response = await fetch(`/api/exams/${examId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });

      if (!response.ok) throw new Error('Failed to submit exam');

      const result = await response.json();
      setScore(result.score);

    } catch (error) {
      console.error('Exam submission error:', error);
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (score !== null) {
    const passed = score >= 80;
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">
          Exam Result: {score}/100
        </h2>
        <p className={`text-lg ${passed ? 'text-green-600' : 'text-red-600'}`}>
          {passed ? 'Congratulations! You passed!' : 'Unfortunately, you did not pass.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {hasError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          An error occurred. Please try again.
        </div>
      )}
      
      {questions.sort((a, b) => a.order - b.order).map((question) => (
        <div key={question.id} className="border rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">
            {question.order}. {question.text}
          </h3>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label
                key={index}
                className="flex items-center space-x-3 p-3 rounded hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name={question.id}
                  checked={answers[question.id] === index}
                  onChange={() => handleAnswerSelect(question.id, index)}
                  className="h-4 w-4 text-primary"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="sticky bottom-0 bg-white p-4 border-t">
        <Button
          label="Submit Exam"
          onClick={handleSubmit}
          variant="primary"
          disabled={!isAllQuestionsAnswered || isSubmitting}
        />
      </div>
    </div>
  );
}
