import type React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <main className={`flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </main>
  );
}
