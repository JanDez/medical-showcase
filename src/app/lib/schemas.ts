import { z } from "zod";

// Base search params
export const baseSearchParamsSchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Asset schemas
export const assetBaseSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(["storyboard", "layout", "kpi"]),
  isFavorite: z.boolean().default(false),
  visualsAvailable: z.boolean().default(false),
  viewCount: z.number().default(0),
});

export const createAssetSchema = assetBaseSchema;
export const updateAssetSchema = assetBaseSchema.partial();

// Metric schemas
export const metricSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  calculation: z.string().optional(),
  businessQuestions: z.array(z.string()).default([]),
  metricIds: z.array(z.string()).default([]),
  affiliateApplicability: z.array(z.string()).default([]),
  visualType: z.string().optional(),
  dataSource: z.string().optional(),
  refreshFrequency: z.string().optional(),
});

// Layout schemas
export const layoutSchema = z.object({
  name: z.string(),
  pageCount: z.number(),
  kpisUsed: z.array(z.string()).default([]),
});

// Storyboard schemas
export const storyboardSchema = z.object({
  name: z.string(),
  coupledKpis: z.array(z.string()).default([]),
  applicableAffiliates: z.array(z.string()).default([]),
});

// Data visualization schemas
export const dataVisualizationSchema = z.object({
  name: z.string(),
  chartType: z.string().optional(),
  configuration: z.record(z.unknown()).optional(),
});

// Library view schemas
export const librarySearchParamsSchema = baseSearchParamsSchema.extend({
  type: z.enum(["storyboard", "layout", "kpi"]).optional(),
  sortBy: z.enum(["name", "updatedAt", "viewCount"]).default("updatedAt"),
});

// Modal schemas
export const kpiModalSchema = z.object({
  metricIds: z.array(z.string()),
  businessQuestions: z.array(z.string()),
  description: z.string(),
  calculation: z.string(),
  visualsAvailable: z.boolean(),
  affiliateApplicability: z.array(z.string())
});

export const layoutModalSchema = z.object({
  amountOfPages: z.number(),
  kpisBeingUsed: z.array(z.string()),
  previewLayout: z.boolean()
});

export const storyboardModalSchema = z.object({
  coupledKpisFilters: z.array(z.string()),
  applicableAffiliates: z.array(z.string())
});

export const assetSearchParamsSchema = baseSearchParamsSchema.extend({
  type: z.enum(["storyboard", "layout", "kpi"]).optional(),
  sortBy: z.enum(["name", "createdAt", "updatedAt", "viewCount"]).default("createdAt"),
});