import { pgTable, serial, varchar, timestamp, foreignKey, integer, boolean, text, jsonb } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const medicalShowcaseRecentSearch = pgTable("medical-showcase_recent_search", {
	id: serial("id").primaryKey().notNull(),
	searchTerm: varchar("search_term", { length: 512 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const medicalShowcaseAssetAffiliate = pgTable("medical-showcase_asset_affiliate", {
	id: serial("id").primaryKey().notNull(),
	assetId: integer("asset_id"),
	affiliateId: integer("affiliate_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		medicalShowcaseAssetAffiliateAssetIdFk: foreignKey({
			columns: [table.assetId],
			foreignColumns: [medicalShowcaseAsset.id],
			name: "medical_showcase_asset_affiliate_asset_id_fk"
		}),
		medicalShowcaseAssetAffiliateAffiliateIdFk: foreignKey({
			columns: [table.affiliateId],
			foreignColumns: [medicalShowcaseAffiliate.id],
			name: "medical_showcase_asset_affiliate_affiliate_id_fk"
		}),
	}
});

export const medicalShowcaseAffiliate = pgTable("medical-showcase_affiliate", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const medicalShowcaseAsset = pgTable("medical-showcase_asset", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	description: text("description"),
	isFavorite: boolean("is_favorite").default(false),
	visualsAvailable: boolean("visuals_available").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	tags: jsonb("tags"),
	lastViewed: timestamp("last_viewed", { mode: 'string' }),
	viewCount: integer("view_count").default(0),
	type: varchar("type").notNull(),
});

export const medicalShowcaseLayout = pgTable("medical-showcase_layout", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	pageCount: integer("page_count").notNull(),
	kpisUsed: jsonb("kpis_used"),
	assetId: integer("asset_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		medicalShowcaseLayoutAssetIdMedicalShowcaseAssetIdFk: foreignKey({
			columns: [table.assetId],
			foreignColumns: [medicalShowcaseAsset.id],
			name: "medical-showcase_layout_asset_id_medical-showcase_asset_id_fk"
		}),
		medicalShowcaseLayoutAssetIdFk: foreignKey({
			columns: [table.assetId],
			foreignColumns: [medicalShowcaseAsset.id],
			name: "medical_showcase_layout_asset_id_fk"
		}),
	}
});

export const medicalShowcaseStoryboard = pgTable("medical-showcase_storyboard", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	coupledKpis: jsonb("coupled_kpis"),
	applicableAffiliates: jsonb("applicable_affiliates"),
	assetId: integer("asset_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	description: varchar("description", { length: 512 }).notNull(),
},
(table) => {
	return {
		medicalShowcaseStoryboardAssetIdFk: foreignKey({
			columns: [table.assetId],
			foreignColumns: [medicalShowcaseAsset.id],
			name: "medical_showcase_storyboard_asset_id_fk"
		}),
	}
});

export const medicalShowcaseAssetCategoryRelation = pgTable("medical-showcase_asset_category_relation", {
	id: serial("id").primaryKey().notNull(),
	assetId: integer("asset_id"),
	categoryId: integer("category_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const medicalShowcaseAssetCategory = pgTable("medical-showcase_asset_category", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	description: text("description"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const medicalShowcaseDataVisualization = pgTable("medical-showcase_data_visualization", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	chartType: varchar("chart_type", { length: 100 }),
	configuration: jsonb("configuration"),
	assetId: integer("asset_id"),
	metricId: integer("metric_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const medicalShowcaseAssetShare = pgTable("medical-showcase_asset_share", {
	id: serial("id").primaryKey().notNull(),
	assetId: integer("asset_id"),
	shareToken: varchar("share_token", { length: 64 }).notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	createdBy: varchar("created_by", { length: 256 }),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const medicalShowcaseAssetTag = pgTable("medical-showcase_asset_tag", {
	id: serial("id").primaryKey().notNull(),
	assetId: integer("asset_id"),
	name: varchar("name", { length: 100 }).notNull(),
},
(table) => {
	return {
		medicalShowcaseAssetTagAssetIdFk: foreignKey({
			columns: [table.assetId],
			foreignColumns: [medicalShowcaseAsset.id],
			name: "medical_showcase_asset_tag_asset_id_fk"
		}),
	}
});

export const medicalShowcaseAssetQuestion = pgTable("medical-showcase_asset_question", {
	id: serial("id").primaryKey().notNull(),
	assetId: integer("asset_id"),
	text: text("text").notNull(),
},
(table) => {
	return {
		medicalShowcaseAssetQuestionAssetIdFk: foreignKey({
			columns: [table.assetId],
			foreignColumns: [medicalShowcaseAsset.id],
			name: "medical_showcase_asset_question_asset_id_fk"
		}),
	}
});

export const medicalShowcaseMetric = pgTable("medical-showcase_metric", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	description: text("description"),
	calculation: text("calculation"),
	businessQuestions: jsonb("business_questions"),
	metricIds: jsonb("metric_ids"),
	affiliateApplicability: jsonb("affiliate_applicability"),
	assetId: integer("asset_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	visualType: varchar("visual_type", { length: 100 }),
	dataSource: text("data_source"),
	refreshFrequency: varchar("refresh_frequency", { length: 50 }),
},
(table) => {
	return {
		medicalShowcaseMetricAssetIdMedicalShowcaseAssetIdFk: foreignKey({
			columns: [table.assetId],
			foreignColumns: [medicalShowcaseAsset.id],
			name: "medical-showcase_metric_asset_id_medical-showcase_asset_id_fk"
		}),
		medicalShowcaseMetricAssetIdFk: foreignKey({
			columns: [table.assetId],
			foreignColumns: [medicalShowcaseAsset.id],
			name: "medical_showcase_metric_asset_id_fk"
		}),
	}
});