
"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CourseCreationSchema } from "@lib/validations";

interface QuestionInput {
  text: string;
  options: string[];
  correctIndex: number;
  order: number;
}

interface ModuleInput {
  title: string;
  content: string;
  order: number;
}

interface TopicInput {
  title: string;
  order: number;
  modules: ModuleInput[];
}

export function CourseCreationCanvas(): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topics, setTopics] = useState<TopicInput[]>([]);
  const [questions, setQuestions] = useState<QuestionInput[]>([]);

  const { register, handleSubmit, formState: { errors } } = useForm<CourseCreationSchema>({
    resolver: zodResolver(courseCreationSchema)
  });

  const handleTopicAdd = () => {
    setTopics([...topics, { title: "", order: topics.length + 1, modules: [] }]);
  };

  const handleModuleAdd = (topicIndex: number) => {
    const updatedTopics = [...topics];
    const topic = updatedTopics[topicIndex];
    topic.modules.push({
      title: "",
      content: "",
      order: topic.modules.length + 1
    });
    setTopics(updatedTopics);
  };

  const handleQuestionAdd = () => {
    if (questions.length < 100) {
      setQuestions([
        ...questions,
        {
          text: "",
          options: ["", "", "", ""],
          correctIndex: 0,
          order: questions.length + 1
        }
      ]);
    }
  };

  const onSubmit = async (data: CourseCreationSchema) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/admin/courses/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, topics, questions })
      });

      if (!response.ok) throw new Error("Failed to create course");
      
    } catch (error) {
      console.error("Error creating course:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto p-6">
      <div className="space-y-4">
        <input
          {...register("title")}
          type="text"
          placeholder="Course Title"
          className="w-full p-2 border rounded"
        />
        {errors.title && (
          <p className="text-red-500">{errors.title.message}</p>
        )}

        <textarea
          {...register("description")}
          placeholder="Course Description"
          className="w-full p-2 border rounded min-h-[100px]"
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Topics</h2>
        {topics.map((topic, topicIndex) => (
          <div key={topicIndex} className="border p-4 rounded space-y-4">
            <input
              type="text"
              value={topic.title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const updatedTopics = [...topics];
                updatedTopics[topicIndex].title = e.target.value;
                setTopics(updatedTopics);
              }}
              placeholder="Topic Title"
              className="w-full p-2 border rounded"
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Modules</h3>
              {topic.modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="border p-4 rounded space-y-4">
                  <input
                    type="text"
                    value={module.title}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const updatedTopics = [...topics];
                      updatedTopics[topicIndex].modules[moduleIndex].title = e.target.value;
                      setTopics(updatedTopics);
                    }}
                    placeholder="Module Title"
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    value={module.content}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                      const updatedTopics = [...topics];
                      updatedTopics[topicIndex].modules[moduleIndex].content = e.target.value;
                      setTopics(updatedTopics);
                    }}
                    placeholder="Module Content"
                    className="w-full p-2 border rounded min-h-[100px]"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleModuleAdd(topicIndex)}
                className="text-primary hover:text-primary/80"
              >
                Add Module
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleTopicAdd}
          className="text-primary hover:text-primary/80"
        >
          Add Topic
        </button>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Exam Questions ({questions.length}/100)</h2>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="border p-4 rounded space-y-4">
            <textarea
              value={question.text}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                const updatedQuestions = [...questions];
                updatedQuestions[questionIndex].text = e.target.value;
                setQuestions(updatedQuestions);
              }}
              placeholder="Question Text"
              className="w-full p-2 border rounded"
            />
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${questionIndex}`}
                    checked={question.correctIndex === optionIndex}
                    onChange={() => {
                      const updatedQuestions = [...questions];
                      updatedQuestions[questionIndex].correctIndex = optionIndex;
                      setQuestions(updatedQuestions);
                    }}
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const updatedQuestions = [...questions];
                      updatedQuestions[questionIndex].options[optionIndex] = e.target.value;
                      setQuestions(updatedQuestions);
                    }}
                    placeholder={`Option ${optionIndex + 1}`}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        {questions.length < 100 && (
          <button
            type="button"
            onClick={handleQuestionAdd}
            className="text-primary hover:text-primary/80"
          >
            Add Question
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full p-3 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
      >
        {isSubmitting ? "Creating Course..." : "Create Course"}
      </button>
    </form>
  );
}
