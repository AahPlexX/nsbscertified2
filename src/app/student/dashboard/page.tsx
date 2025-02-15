
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@components/Card";
import { Button } from "@components/Button";
import { ProgressTracker } from "@components/ProgressTracker";
import { CertificateDownload } from "@components/CertificateDownload";
import type { Enrollment, ExamAttempt } from "@prisma/client";
import { useUserStore } from "@store/userStore";

interface EnrollmentWithCourse extends Enrollment {
  course: { title: string; id: string };
}

interface ExamAttemptWithCourse extends ExamAttempt {
  course: { title: string };
}

export default function StudentDashboard(): JSX.Element {
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [examHistory, setExamHistory] = useState<ExamAttemptWithCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, userId } = useUserStore();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [enrollmentsRes, examHistoryRes] = await Promise.all([
          fetch('/api/student/enrollments'),
          fetch('/api/student/exam-history')
        ]);

        if (!enrollmentsRes.ok || !examHistoryRes.ok) {
          throw new Error('Failed to fetch student data');
        }

        const [enrollmentsData, examHistoryData] = await Promise.all([
          enrollmentsRes.json(),
          examHistoryRes.json()
        ]);

        setEnrollments(enrollmentsData);
        setExamHistory(examHistoryData);
      } catch (err) {
        console.error('Student data fetch error:', err);
        setError('Failed to load student data');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && userId) {
      fetchStudentData();
    }
  }, [isAuthenticated, userId]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card>
          <div className="p-6 text-center">
            <h1 className="text-xl font-semibold text-destructive">Access Denied</h1>
            <p className="mt-2">Please log in to view your dashboard.</p>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading your dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card>
          <div className="p-6 text-center">
            <h1 className="text-xl font-semibold text-destructive">Error</h1>
            <p className="mt-2">{error}</p>
            <Button
              label="Retry"
              onClick={() => window.location.reload()}
              variant="primary"
              className="mt-4"
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Dashboard</h1>

      {/* Enrolled Courses */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">My Courses</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id}>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-medium">
                  {enrollment.course.title}
                </h3>
                <div className="mb-4">
                  <ProgressTracker enrollmentId={enrollment.id} />
                </div>
                <div className="flex justify-between">
                  <Link 
                    href={`/courseroute/coursedescription/${enrollment.course.id}`}
                  >
                    <Button label="Continue Learning" variant="secondary" />
                  </Link>
                  {enrollment.passed && (
                    <CertificateDownload
                      studentName={enrollment.studentName}
                      courseName={enrollment.course.title}
                      completionDate={enrollment.completedAt}
                      certificateId={enrollment.certificateId}
                    />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Exam History */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Exam History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Course</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Score</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {examHistory.map((attempt) => (
                <tr key={attempt.id} className="border-b">
                  <td className="px-4 py-2">{attempt.course.title}</td>
                  <td className="px-4 py-2">
                    {new Date(attempt.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{attempt.score}%</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block rounded px-2 py-1 text-sm ${
                        attempt.passed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {attempt.passed ? 'Passed' : 'Failed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
