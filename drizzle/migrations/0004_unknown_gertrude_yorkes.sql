-- Check if the "type" column exists before adding it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='medical-showcase_asset' 
        AND column_name='type'
    ) THEN
        ALTER TABLE "medical-showcase_asset" ADD COLUMN "type" varchar NOT NULL;
    END IF;
END $$;

-- Create other tables and constraints as needed
CREATE TABLE IF NOT EXISTS "medical-showcase_affiliate" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar(256) NOT NULL,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "medical-showcase_asset_affiliate" (
    "id" serial PRIMARY KEY NOT NULL,
    "asset_id" integer,
    "affiliate_id" integer,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "medical-showcase_asset" (
    "id" uuid PRIMARY KEY NOT NULL,
    "name" varchar(256) NOT NULL,
    "description" text,
    "type" varchar(100),
    "is_favorite" boolean DEFAULT false,
    "visuals_available" boolean DEFAULT false,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    "tags" jsonb,
    "last_viewed" timestamp,
    "view_count" integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "medical-showcase_layout" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar(256) NOT NULL,
    "page_count" integer NOT NULL,
    "kpis_used" jsonb,
    "asset_id" integer,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "medical-showcase_metric" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar(256) NOT NULL,
    "description" text,
    "calculation" text,
    "business_questions" jsonb,
    "metric_ids" jsonb,
    "affiliate_applicability" jsonb,
    "asset_id" integer,
    "visual_type" varchar(100),
    "data_source" text,
    "refresh_frequency" varchar(50),
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "medical-showcase_recent_search" (
    "id" serial PRIMARY KEY NOT NULL,
    "search_term" varchar(512) NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "medical-showcase_storyboard" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar(256) NOT NULL,
    "coupled_kpis" jsonb,
    "applicable_affiliates" jsonb,
    "asset_id" integer,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "medical-showcase_asset_question" (
    "id" serial PRIMARY KEY NOT NULL,
    "asset_id" integer,
    "text" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "medical-showcase_asset_tag" (
    "id" serial PRIMARY KEY NOT NULL,
    "asset_id" integer,
    "name" varchar(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS "medical-showcase_asset_share" (
    "id" serial PRIMARY KEY NOT NULL,
    "asset_id" integer,
    "share_token" varchar(64) NOT NULL,
    "expires_at" timestamp,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "created_by" varchar(256)
);

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

-- Foreign Key Constraints
DO $$ BEGIN
    ALTER TABLE "medical-showcase_asset_affiliate" ADD CONSTRAINT "medical_showcase_asset_affiliate_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "medical-showcase_asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "medical-showcase_asset_affiliate" ADD CONSTRAINT "medical_showcase_asset_affiliate_affiliate_id_fk" FOREIGN KEY ("affiliate_id") REFERENCES "medical-showcase_affiliate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "medical-showcase_layout" ADD CONSTRAINT "medical_showcase_layout_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "medical-showcase_asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "medical-showcase_metric" ADD CONSTRAINT "medical_showcase_metric_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "medical-showcase_asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "medical-showcase_storyboard" ADD CONSTRAINT "medical_showcase_storyboard_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "medical-showcase_asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "medical-showcase_asset_question" ADD CONSTRAINT "medical_showcase_asset_question_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "medical-showcase_asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "medical-showcase_asset_tag" ADD CONSTRAINT "medical_showcase_asset_tag_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "medical-showcase_asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "medical-showcase_asset_share" ADD CONSTRAINT "medical_showcase_asset_share_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "medical-showcase_asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "medical-showcase_data_visualization" ADD CONSTRAINT "medical_showcase_data_visualization_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "medical-showcase_asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "medical-showcase_asset_share" 
ALTER COLUMN "asset_id" TYPE uuid USING "asset_id"::uuid;