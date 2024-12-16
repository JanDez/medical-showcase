'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect } from 'react';
import 'swagger-ui-react/swagger-ui.css';

// Suppress React strict mode warnings in development
const originalConsoleError = console.error;
if (process.env.NODE_ENV === 'development') {
  console.error = (...args: any[]) => {
    if (args[0]?.includes('UNSAFE_')) return;
    originalConsoleError(...args);
  };
}

const SwaggerUI = dynamic(
  () => import('swagger-ui-react').then(mod => mod.default),
  { ssr: false }
);

export default function ApiDocs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading API documentation...</div>}>
        <SwaggerUI url="/api/docs" />
      </Suspense>
    </div>
  );
} 