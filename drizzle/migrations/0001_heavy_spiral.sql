CREATE TABLE IF NOT EXISTS "medical-showcase_asset_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medical-showcase_asset_category_relation" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_id" integer,
	"category_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medical-showcase_asset_share" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_id" integer,
	"share_token" varchar(64) NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medical-showcase_data_visualization" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"chart_type" varchar(100),
	"configuration" jsonb,
	"asset_id" integer,
	"metric_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "medical-showcase_asset" ADD COLUMN "tags" jsonb;--> statement-breakpoint
ALTER TABLE "medical-showcase_asset" ADD COLUMN "last_viewed" timestamp;--> statement-breakpoint
ALTER TABLE "medical-showcase_asset" ADD COLUMN "view_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "medical-showcase_metric" ADD COLUMN "visual_type" varchar(100);--> statement-breakpoint
ALTER TABLE "medical-showcase_metric" ADD COLUMN "data_source" text;--> statement-breakpoint
ALTER TABLE "medical-showcase_metric" ADD COLUMN "refresh_frequency" varchar(50);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medical-showcase_asset_category_relation" ADD CONSTRAINT "medical-showcase_asset_category_relation_asset_id_medical-showcase_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."medical-showcase_asset"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medical-showcase_asset_category_relation" ADD CONSTRAINT "medical-showcase_asset_category_relation_category_id_medical-showcase_asset_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."medical-showcase_asset_category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medical-showcase_asset_share" ADD CONSTRAINT "medical-showcase_asset_share_asset_id_medical-showcase_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."medical-showcase_asset"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medical-showcase_data_visualization" ADD CONSTRAINT "medical-showcase_data_visualization_asset_id_medical-showcase_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."medical-showcase_asset"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medical-showcase_data_visualization" ADD CONSTRAINT "medical-showcase_data_visualization_metric_id_medical-showcase_metric_id_fk" FOREIGN KEY ("metric_id") REFERENCES "public"."medical-showcase_metric"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
