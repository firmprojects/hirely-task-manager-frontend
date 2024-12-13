import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className={cn(
        "container mx-auto px-4 py-10",
        "max-w-screen-xl", // Maximum width for larger screens
        "lg:px-8", // Larger padding on desktop
        className
      )}>
        {children}
      </div>
    </div>
  );
}