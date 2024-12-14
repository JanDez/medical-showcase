import { z } from "zod";

type ErrorContext = {
  endpoint?: string;
  method?: string;
  params?: Record<string, unknown>;
  error: unknown;
};

export class Logger {
  static error(message: string, context: ErrorContext) {
    const errorDetails = {
      message,
      timestamp: new Date().toISOString(),
      endpoint: context.endpoint,
      method: context.method,
      params: context.params,
      error: context.error,
      stack: context.error instanceof Error ? context.error.stack : undefined,
      errorMessage: context.error instanceof Error ? context.error.message : String(context.error),
      type: context.error instanceof z.ZodError ? 'validation' : 'runtime'
    };

    console.error(JSON.stringify(errorDetails, null, 2));
    return errorDetails;
  }
} 