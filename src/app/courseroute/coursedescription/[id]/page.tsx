
"use client";

import { useParams } from "next/navigation";
import { Link } from "next/link";
import { ProgressTracker } from "@components/ProgressTracker";
import { CourseModule } from "@components/CourseModule";
import { useCourseStore } from "@store/courseStore";

interface Course {
  id: string;
  title: string;
  description: string;
  modules: Array<{
    id: string;
    title: string;
    content: string;
    order: number;
  }>;
}

export default function CourseDescription(): JSX.Element {
  const params = useParams();
  const courseId = params.id as string;
  const { setCurrentCourse, completedModules } = useCourseStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        if (!response.ok) throw new Error('Failed to fetch course');
        const data = await response.json();
        setCourse(data);
        setCurrentCourse(courseId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [courseId, setCurrentCourse]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading course details...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive text-center">
          <h2 className="text-xl font-bold mb-2">Error Loading Course</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Get payment link based on course ID
  const paymentLinks = {
    "cmp": "https://buy.stripe.com/cN24gT15K07Y8dG4gg",
    "rmp": "https://buy.stripe.com/bIY3cP9Cg4oefG8eUW",
    "lsscp-yb": "https://buy.stripe.com/28obJl4hW1c265y5kn",
    "lsscp-gb": "https://buy.stripe.com/28ofZBcOsaMC9hKbIM",
    "lsscp-bb": "https://buy.stripe.com/5kAdRt7u807Y65y6ot"
  };

  const paymentUrl = paymentLinks[courseId as keyof typeof paymentLinks] || `/api/stripe/checkout?courseId=${courseId}`;

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-8">{course.title}</h1>
        <p className="text-muted-foreground mb-8">{course.description}</p>
        
        <ProgressTracker />

        <div className="grid gap-6 mt-8">
          {course.modules.map((module) => (
            <CourseModule
              key={module.id}
              id={module.id}
              title={module.title}
              content={module.content}
              order={module.order}
            />
          ))}
        </div>

        <div className="mt-8">
          <Link
            href={paymentUrl}
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
          >
            Enroll Now
          </Link>
        </div>

        {completedModules.length === course.modules.length && (
          <div className="mt-8">
            <Link
              href={`/exam/${courseId}`}
              className="inline-block bg-secondary text-secondary-foreground px-6 py-3 rounded-md hover:bg-secondary/80 transition-colors"
            >
              Take Final Exam
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
