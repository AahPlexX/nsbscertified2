
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@components/Card";
import { Button } from "@components/Button";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  slug: string;
}

export default function CourseCatalog(): JSX.Element {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('/api/courses');
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load courses');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive text-center">
          <h2 className="text-xl font-bold mb-2">Error Loading Courses</h2>
          <p>{error}</p>
          <Button 
            label="Try Again"
            onClick={() => window.location.reload()}
            variant="primary"
            className="mt-4"
          />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-8">Course Catalog</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card
              key={course.id}
              header={<h2 className="text-xl font-semibold">{course.title}</h2>}
              body={
                <div className="space-y-4">
                  <p className="text-muted-foreground">{course.description}</p>
                  <p className="text-lg font-medium">${(course.price / 100).toFixed(2)} USD</p>
                </div>
              }
              footer={
                <Link 
                  href={`/courseroute/coursedescription/${course.slug}`}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  View Course Details →
                </Link>
              }
            />
          ))}
        </div>
      </div>
    </main>
  );
}
