CREATE TABLE IF NOT EXISTS "medical-showcase_affiliate" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medical-showcase_asset_affiliate" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_id" integer,
	"affiliate_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medical-showcase_asset" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"is_favorite" boolean DEFAULT false,
	"visuals_available" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medical-showcase_layout" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"page_count" integer NOT NULL,
	"kpis_used" jsonb,
	"asset_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medical-showcase_metric" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"calculation" text,
	"business_questions" jsonb,
	"metric_ids" jsonb,
	"affiliate_applicability" jsonb,
	"asset_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medical-showcase_recent_search" (
	"id" serial PRIMARY KEY NOT NULL,
	"search_term" varchar(512) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medical-showcase_storyboard" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"coupled_kpis" jsonb,
	"applicable_affiliates" jsonb,
	"asset_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medical-showcase_asset_affiliate" ADD CONSTRAINT "medical-showcase_asset_affiliate_asset_id_medical-showcase_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."medical-showcase_asset"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medical-showcase_asset_affiliate" ADD CONSTRAINT "medical-showcase_asset_affiliate_affiliate_id_medical-showcase_affiliate_id_fk" FOREIGN KEY ("affiliate_id") REFERENCES "public"."medical-showcase_affiliate"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medical-showcase_layout" ADD CONSTRAINT "medical-showcase_layout_asset_id_medical-showcase_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."medical-showcase_asset"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medical-showcase_metric" ADD CONSTRAINT "medical-showcase_metric_asset_id_medical-showcase_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."medical-showcase_asset"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medical-showcase_storyboard" ADD CONSTRAINT "medical-showcase_storyboard_asset_id_medical-showcase_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."medical-showcase_asset"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "asset_name_idx" ON "medical-showcase_asset" USING btree ("name");