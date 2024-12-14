import { z } from "zod";
import { Logger } from "./logger";

export function handleApiError(error: unknown, message: string, context?: { endpoint?: string; method?: string; params?: Record<string, unknown> }) {
  if (error instanceof z.ZodError) {
    Logger.error("Validation error", { error, ...context });
    return Response.json({ error: "Invalid parameters" }, { status: 400 });
  }
  
  Logger.error(message, { error, ...context });
  return Response.json({ error: message }, { status: 500 });
}

export function handleNotFound(message: string) {
  return Response.json({ error: message }, { status: 404 });
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export function formatResponse<T>(
  result: T[] | PaginatedResponse<T>
): PaginatedResponse<T> {
  if (Array.isArray(result)) {
    return {
      data: result,
      total: result.length,
      page: 1,
      pageSize: result.length
    };
  }
  return result;
} 