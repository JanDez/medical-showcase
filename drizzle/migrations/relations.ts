import { relations } from "drizzle-orm/relations";
import { medicalShowcaseAsset, medicalShowcaseAssetAffiliate, medicalShowcaseAffiliate, medicalShowcaseLayout, medicalShowcaseStoryboard, medicalShowcaseAssetTag, medicalShowcaseAssetQuestion, medicalShowcaseMetric } from "./schema";

export const medicalShowcaseAssetAffiliateRelations = relations(medicalShowcaseAssetAffiliate, ({one}) => ({
	medicalShowcaseAsset: one(medicalShowcaseAsset, {
		fields: [medicalShowcaseAssetAffiliate.assetId],
		references: [medicalShowcaseAsset.id]
	}),
	medicalShowcaseAffiliate: one(medicalShowcaseAffiliate, {
		fields: [medicalShowcaseAssetAffiliate.affiliateId],
		references: [medicalShowcaseAffiliate.id]
	}),
}));

export const medicalShowcaseAssetRelations = relations(medicalShowcaseAsset, ({many}) => ({
	medicalShowcaseAssetAffiliates: many(medicalShowcaseAssetAffiliate),
	medicalShowcaseLayouts_assetId: many(medicalShowcaseLayout, {
		relationName: "medicalShowcaseLayout_assetId_medicalShowcaseAsset_id"
	}),
	medicalShowcaseLayouts_otherId: many(medicalShowcaseLayout, {
		relationName: "medicalShowcaseLayout_otherId_medicalShowcaseAsset_id"
	}),
	medicalShowcaseStoryboards: many(medicalShowcaseStoryboard),
	medicalShowcaseAssetTags: many(medicalShowcaseAssetTag),
	medicalShowcaseAssetQuestions: many(medicalShowcaseAssetQuestion),
	medicalShowcaseMetrics_assetId: many(medicalShowcaseMetric, {
		relationName: "medicalShowcaseMetric_assetId_medicalShowcaseAsset_id"
	}),
	medicalShowcaseMetrics_otherId: many(medicalShowcaseMetric, {
		relationName: "medicalShowcaseMetric_otherId_medicalShowcaseAsset_id"
	}),
}));

export const medicalShowcaseAffiliateRelations = relations(medicalShowcaseAffiliate, ({many}) => ({
	medicalShowcaseAssetAffiliates: many(medicalShowcaseAssetAffiliate),
}));

export const medicalShowcaseLayoutRelations = relations(medicalShowcaseLayout, ({one}) => ({
	medicalShowcaseAsset_assetId: one(medicalShowcaseAsset, {
		fields: [medicalShowcaseLayout.assetId],
		references: [medicalShowcaseAsset.id],
		relationName: "medicalShowcaseLayout_assetId_medicalShowcaseAsset_id"
	}),
	medicalShowcaseAsset_assetId_2: one(medicalShowcaseAsset, {
		fields: [medicalShowcaseLayout.assetId],
		references: [medicalShowcaseAsset.id],
		relationName: "medicalShowcaseLayout_assetId_medicalShowcaseAsset_id"
	}),
}));

export const medicalShowcaseStoryboardRelations = relations(medicalShowcaseStoryboard, ({one}) => ({
	medicalShowcaseAsset: one(medicalShowcaseAsset, {
		fields: [medicalShowcaseStoryboard.assetId],
		references: [medicalShowcaseAsset.id]
	}),
}));

export const medicalShowcaseAssetTagRelations = relations(medicalShowcaseAssetTag, ({one}) => ({
	medicalShowcaseAsset: one(medicalShowcaseAsset, {
		fields: [medicalShowcaseAssetTag.assetId],
		references: [medicalShowcaseAsset.id]
	}),
}));

export const medicalShowcaseAssetQuestionRelations = relations(medicalShowcaseAssetQuestion, ({one}) => ({
	medicalShowcaseAsset: one(medicalShowcaseAsset, {
		fields: [medicalShowcaseAssetQuestion.assetId],
		references: [medicalShowcaseAsset.id]
	}),
}));

export const medicalShowcaseMetricRelations = relations(medicalShowcaseMetric, ({one}) => ({
	medicalShowcaseAsset_assetId: one(medicalShowcaseAsset, {
		fields: [medicalShowcaseMetric.assetId],
		references: [medicalShowcaseAsset.id],
		relationName: "medicalShowcaseMetric_assetId_medicalShowcaseAsset_id"
	}),
	medicalShowcaseAsset_assetId_2: one(medicalShowcaseAsset, {
		fields: [medicalShowcaseMetric.assetId],
		references: [medicalShowcaseAsset.id],
		relationName: "medicalShowcaseMetric_assetId_medicalShowcaseAsset_id"
	}),
}));