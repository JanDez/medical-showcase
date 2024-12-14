import {
  pgTable,
  serial,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
  jsonb,
  index,
  uuid,
} from "drizzle-orm/pg-core";

const createTable = <T extends string>(name: T) => `medical-showcase_${name}`;

export const assets = pgTable(
  createTable("asset"),
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    type: varchar("type", { enum: ["storyboard", "layout", "kpi"] }).notNull(),
    isFavorite: boolean("is_favorite").default(false),
    visualsAvailable: boolean("visuals_available").default(false),
    lastViewed: timestamp("last_viewed"),
    viewCount: integer("view_count").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    tags: jsonb("tags")
  }
);

export const metrics = pgTable(
  createTable("metric"),
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    calculation: text("calculation"),
    businessQuestions: jsonb("business_questions").$type<string[]>(),
    metricIds: jsonb("metric_ids").$type<string[]>(),
    affiliateApplicability: jsonb("affiliate_applicability").$type<string[]>(),
    assetId: integer("asset_id").references(() => assets.id),
    visualType: varchar("visual_type", { length: 100 }),
    dataSource: text("data_source"),
    refreshFrequency: varchar("refresh_frequency", { length: 50 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }
);

export const layouts = pgTable(
  createTable("layout"),
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    pageCount: integer("page_count").notNull(),
    kpisUsed: jsonb("kpis_used").$type<string[]>(),
    assetId: integer("asset_id").references(() => assets.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }
);

export const storyboards = pgTable(
  createTable("storyboard"),
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 512 }).notNull(),
    coupledKpis: jsonb("coupled_kpis").$type<string[]>(),
    applicableAffiliates: jsonb("applicable_affiliates").$type<string[]>(),
    assetId: integer("asset_id").references(() => assets.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }
);

export const affiliates = pgTable(
  createTable("affiliate"),
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }
);

export const assetAffiliates = pgTable(
  createTable("asset_affiliate"),
  {
    id: serial("id").primaryKey(),
    assetId: integer("asset_id").references(() => assets.id),
    affiliateId: integer("affiliate_id").references(() => affiliates.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  }
);

export const recentSearches = pgTable(
  createTable("recent_search"),
  {
    id: serial("id").primaryKey(),
    searchTerm: varchar("search_term", { length: 512 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  }
);

export const dataVisualizations = pgTable(
  createTable("data_visualization"),
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    chartType: varchar("chart_type", { length: 100 }),
    configuration: jsonb("configuration"),
    assetId: integer("asset_id").references(() => assets.id),
    metricId: integer("metric_id").references(() => metrics.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }
);

export const assetCategories = pgTable(
  createTable("asset_category"),
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }
);

export const assetCategoryRelations = pgTable(
  createTable("asset_category_relation"),
  {
    id: serial("id").primaryKey(),
    assetId: integer("asset_id").references(() => assets.id),
    categoryId: integer("category_id").references(() => assetCategories.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  }
);

export const assetShares = pgTable(
  createTable("asset_share"),
  {
    id: serial("id").primaryKey(),
    assetId: integer("asset_id").references(() => assets.id),
    shareToken: varchar("share_token", { length: 64 }).notNull(),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    createdBy: varchar("created_by", { length: 256 }),
  }
);

export const shares = pgTable('shares', {
  id: uuid('id').defaultRandom().primaryKey(),
  assetId: uuid('asset_id').references(() => assets.id),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const assetTags = pgTable(
  createTable("asset_tag"),
  {
    id: serial("id").primaryKey(),
    assetId: integer("asset_id").references(() => assets.id),
    name: varchar("name", { length: 100 }).notNull(),
  }
);

export const assetQuestions = pgTable(
  createTable("asset_question"),
  {
    id: serial("id").primaryKey(),
    assetId: integer("asset_id").references(() => assets.id),
    text: text("text").notNull(),
  }
);

export const assetRequests = pgTable('asset_requests', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})