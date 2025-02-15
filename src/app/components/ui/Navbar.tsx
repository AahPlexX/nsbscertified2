
"use client";

import { Link } from "next/link";
import { useUserStore } from "@store/userStore";

export function Navbar(): JSX.Element {
  const { isAuthenticated, userRole } = useUserStore();

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            NSBS
          </Link>

          <div className="flex items-center space-x-8">
            <Link 
              href="/courseroute/courselist"
              className="text-foreground hover:text-primary transition-colors"
            >
              Course Catalog
            </Link>

            {isAuthenticated && userRole === "ADMIN" && (
              <Link 
                href="/admin/dashboard"
                className="text-foreground hover:text-primary transition-colors"
              >
                Admin Dashboard
              </Link>
            )}

            {isAuthenticated && userRole === "STUDENT" && (
              <Link 
                href="/student/dashboard"
                className="text-foreground hover:text-primary transition-colors"
              >
                Student Dashboard
              </Link>
            )}

            {!isAuthenticated ? (
              <Link 
                href="/auth/signin"
                className="text-foreground hover:text-primary transition-colors"
              >
                Sign In
              </Link>
            ) : (
              <button
                onClick={() => {/* Add sign out logic */}}
                className="text-foreground hover:text-primary transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
