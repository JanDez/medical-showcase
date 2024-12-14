CREATE TABLE IF NOT EXISTS "medical-showcase_asset_question" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_id" integer,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medical-showcase_asset_tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_id" integer,
	"name" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shares" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "shares_token_unique" UNIQUE("token")
);
--> statement-breakpoint
DROP INDEX IF EXISTS "asset_name_idx";--> statement-breakpoint
ALTER TABLE "medical-showcase_asset" ADD COLUMN "type" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "medical-showcase_storyboard" ADD COLUMN "description" varchar(512) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medical-showcase_asset_question" ADD CONSTRAINT "medical-showcase_asset_question_asset_id_medical-showcase_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."medical-showcase_asset"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medical-showcase_asset_tag" ADD CONSTRAINT "medical-showcase_asset_tag_asset_id_medical-showcase_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."medical-showcase_asset"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shares" ADD CONSTRAINT "shares_asset_id_medical-showcase_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."medical-showcase_asset"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "medical-showcase_asset" DROP COLUMN IF EXISTS "tags";