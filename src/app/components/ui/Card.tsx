
"use client";

import type { ReactNode } from "react";

interface CardProps {
  header?: ReactNode;
  body: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Card({ header, body, footer, className = "" }: CardProps): JSX.Element {
  return (
    <div className={`bg-card text-card-foreground rounded-lg border shadow-sm ${className}`}>
      {header && (
        <div className="px-6 py-4 border-b font-semibold">
          {header}
        </div>
      )}
      <div className="px-6 py-4">
        {body}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t text-sm text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}
