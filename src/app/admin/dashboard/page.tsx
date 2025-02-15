
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@components/Card";
import { Button } from "@components/Button";
import type { UserStats, PaymentStats, ExamStats } from "@lib/types";
import { useUserStore } from "@store/userStore";

export default function AdminDashboard(): JSX.Element {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [examStats, setExamStats] = useState<ExamStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, userRole } = useUserStore();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [userStatsRes, paymentStatsRes, examStatsRes] = await Promise.all([
          fetch('/api/admin/stats/users'),
          fetch('/api/admin/stats/payments'),
          fetch('/api/admin/stats/exams')
        ]);

        if (!userStatsRes.ok || !paymentStatsRes.ok || !examStatsRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [userData, paymentData, examData] = await Promise.all([
          userStatsRes.json(),
          paymentStatsRes.json(),
          examStatsRes.json()
        ]);

        setUserStats(userData);
        setPaymentStats(paymentData);
        setExamStats(examData);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && userRole === 'ADMIN') {
      fetchDashboardData();
    }
  }, [isAuthenticated, userRole]);

  if (!isAuthenticated || userRole !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card>
          <div className="p-6 text-center">
            <h1 className="text-xl font-semibold text-destructive">Access Denied</h1>
            <p className="mt-2">You must be an admin to view this page.</p>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading dashboard data...</div>
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
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/course/create">
          <Button label="Create New Course" variant="primary" />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Statistics */}
        <Card>
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">User Statistics</h2>
            <div className="space-y-2">
              <p>Total Students: {userStats?.totalStudents}</p>
              <p>Active Enrollments: {userStats?.activeEnrollments}</p>
              <p>New Users (30d): {userStats?.newUsersLastMonth}</p>
            </div>
          </div>
        </Card>

        {/* Payment Statistics */}
        <Card>
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Payment Summary</h2>
            <div className="space-y-2">
              <p>Total Revenue: ${paymentStats?.totalRevenue.toFixed(2)}</p>
              <p>Recent Transactions: {paymentStats?.recentTransactions}</p>
            </div>
          </div>
        </Card>

        {/* Exam Statistics */}
        <Card>
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Exam Overview</h2>
            <div className="space-y-2">
              <p>Total Exams Taken: {examStats?.totalExams}</p>
              <p>Pass Rate: {examStats?.passRate}%</p>
              <p>Avg Score: {examStats?.averageScore}%</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
