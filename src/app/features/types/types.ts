// Base type for common fields
interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// Asset Types
export type Asset = {
  id: number;
  name: string;
  description: string | null;
  type: 'storyboard' | 'layout' | 'kpi';
  isFavorite: boolean | null;
  visualsAvailable: boolean | null;
  tags: string[] | null;
  lastViewed: Date | null;
  viewCount: number | null;
  createdAt: Date;
  updatedAt: Date;
  questions?: string[];
  usageCount?: number;
  pagesCount?: number;
}

// Metric Types
export interface Metric extends BaseEntity {
  name: string;
  description?: string;
  calculation?: string;
  businessQuestions: string[];
  metricIds: string[];
  affiliateApplicability: string[];
  assetId?: number;
  visualType?: string;
  dataSource?: string;
  refreshFrequency?: string;
}

// Layout Types
export interface Layout extends BaseEntity {
  name: string;
  pageCount: number;
  kpisUsed: string[];
  assetId?: number;
}

// Storyboard Types
export interface Storyboard extends Asset {
  name: string;
  coupledKpis: string[];
  applicableAffiliates: string[];
  assetId?: number;
}

// Affiliate Types
export interface Affiliate extends BaseEntity {
  name: string;
  isActive: boolean;
}

// Data Visualization Types
export interface DataVisualization extends BaseEntity {
  name: string;
  chartType?: string;
  configuration?: Record<string, unknown>;
  assetId?: number;
  metricId?: number;
}

// Category Types
export interface AssetCategory extends BaseEntity {
  name: string;
  description?: string;
}

// Search Types
export interface RecentSearch {
  id: number;
  searchTerm: string;
  createdAt: Date;
}

// Response Types
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Request Types
export type SearchParams = {
  query?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  categories?: string[];
}

// Modal Types
export interface KPIModalProps {
  metricId: number;
  onClose: () => void;
}

export interface DataVizModalProps {
  assetId: number;
  onClose: () => void;
}

export interface LayoutModalProps {
  layoutId?: number;
  assetId: number;
  onClose: () => void;
}

export interface StoryboardModalProps {
  storyboardId?: number;
  assetId: number;
  onClose: () => void;
}

export interface KPI {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
