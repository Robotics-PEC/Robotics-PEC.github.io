CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "extensions";

ALTER TABLE "public"."events" ADD COLUMN "event_geo_location" geography(point, 4326);
