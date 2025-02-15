
"use client";

import { Link } from "next/link";

export default function HomePage(): JSX.Element {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          National Society of Business Sciences
        </h1>
        <div className="grid gap-6">
          <Link 
            href="/courseroute/courselist"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            View Course Catalog
          </Link>
          <Link 
            href="/about"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            About NSBS
          </Link>
          <Link 
            href="/contact"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
