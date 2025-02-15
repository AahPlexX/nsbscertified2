"use client";

import { useState, useEffect } from 'react';
import { Link } from 'next/link';
import { ProgressTracker } from '@components/ui/ProgressTracker';
import { CertificateDownload } from '@components/ui/CertificateDownload';
import { useCourseStore } from '@store/courseStore';
import { useUserStore } from '@store/userStore';

interface EnrolledCourse {
  id: string;
  title: string;
  enrollmentDate: string;
  startDate?: string;
  progress: number;
  moduleCount: number;
  completedModules: string[];
  examAttempts: Array<{
    date: string;
    score: number;
    passed: boolean;
  }>;
}

export default function StudentDashboard() {
  const { isAuthenticated } = useUserStore();
  const { completedModules, totalModulesCount } = useCourseStore();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        const response = await fetch('/api/student/enrollments');
        if (!response.ok) throw new Error('Failed to fetch enrollments');
        const data = await response.json();
        setEnrolledCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load enrollments');
        console.error('Error fetching enrollments:', err);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchEnrollments();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <h1 className="text-xl font-semibold text-red-600">Access Denied</h1>
          <p className="mt-2">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <h1 className="text-xl font-semibold text-red-600">Error</h1>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Courses</h1>

        <div className="grid gap-6">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">{course.title}</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Enrolled: {new Date(course.enrollmentDate).toLocaleDateString()}</p>
                  {course.startDate && (
                    <p className="text-sm text-gray-600">Started: {new Date(course.startDate).toLocaleDateString()}</p>
                  )}
                </div>

                <ProgressTracker />

                {course.completedModules.length === course.moduleCount && (
                  <div className="mt-4">
                    <Link
                      href={`/exam/${course.id}`}
                      className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors"
                    >
                      Take Final Exam
                    </Link>
                  </div>
                )}

                {course.examAttempts.length > 0 && course.examAttempts.some(attempt => attempt.passed) && (
                  <div className="mt-4">
                    <CertificateDownload />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}