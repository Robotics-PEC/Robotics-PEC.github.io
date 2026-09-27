

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  if new.email like '%@pec.edu.in' then
    insert into public.profiles (
      "userId",
      email,
      "fullName",
      "avatarUrl"
    )
    values (
      new.id,
      new.email,
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'avatar_url'
    )
    on conflict ("userId") do nothing;
  end if;


  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."hasRole"("_userId" "uuid", "_role" "text") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select exists (
    select 1
    from public."userRoles" ur
    join public.roles r on r.id = ur."roleId"
    join public.profiles p on p.id = ur."userId"
    where p."userId" = "_userId"
      and r.slug = _role
  )
$$;


ALTER FUNCTION "public"."hasRole"("_userId" "uuid", "_role" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin_or_panel"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM "userRoles" ur
    JOIN roles r ON ur."roleId" = r.id
    JOIN profiles p ON ur."userId" = p.id  -- 1. Bridge the gap to the profiles table
    WHERE p."userId" = auth.uid()          -- 2. Check the Auth ID against the profile
    AND (r.slug = 'admin' OR r.slug ILIKE '%panel%')
  );
END;
$$;


ALTER FUNCTION "public"."is_admin_or_panel"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."mark_self_present"("p_event_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  if not exists (
    select 1 from public.events where id = p_event_id and "attendanceOpen" = true
  ) then
    raise exception 'Attendance window is closed';
  end if;

  update public.registrations
  set "attendedAt" = now()
  where "eventId" = p_event_id
    and "userId" = auth.uid()
    and "attendedAt" is null;
end;
$$;


ALTER FUNCTION "public"."mark_self_present"("p_event_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_missing_profiles"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
    INSERT INTO public.profiles (
        "userId",
        email,
        "fullName",
        "avatarUrl"
    )
    SELECT
        u.id,
        u.email,
        u.raw_user_meta_data ->> 'full_name',
        u.raw_user_meta_data ->> 'avatar_url'
    FROM auth.users AS u
    WHERE u.email LIKE '%@pec.edu.in'
      AND NOT EXISTS (
          SELECT 1
          FROM public.profiles AS p
          WHERE p."userId" = u.id
      )
    ON CONFLICT ("userId") DO NOTHING;
END;
$$;


ALTER FUNCTION "public"."sync_missing_profiles"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."activities" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" character varying,
    "shortDescription" character varying,
    "date" character varying,
    "participants" smallint,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."activities" OWNER TO "postgres";


COMMENT ON TABLE "public"."activities" IS 'Events hosted by Robotics Society of PEC';



CREATE TABLE IF NOT EXISTS "public"."applicant_response" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "applicantId" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "branch" "text" NOT NULL,
    "responses" "jsonb"
);


ALTER TABLE "public"."applicant_response" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."applicants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "name" "text" NOT NULL,
    "sid" "text" NOT NULL,
    "phone" "text",
    "isWalkin" boolean DEFAULT false,
    "status" "text" DEFAULT 'PENDING'::"text",
    "remarks" "text",
    "reviewedBy" "text",
    "reviewedAt" timestamp with time zone,
    "userId" "uuid",
    "gender" character varying(10),
    "isHostellers" boolean,
    "reviewScore" "jsonb",
    CONSTRAINT "applicants_gender_check" CHECK ((("gender")::"text" = ANY ((ARRAY['male'::character varying, 'female'::character varying])::"text"[]))),
    CONSTRAINT "applicants_status_check" CHECK (("status" = ANY (ARRAY['PENDING'::"text", 'ACCEPTED'::"text", 'REJECTED'::"text"])))
);


ALTER TABLE "public"."applicants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."applicants_backup_2026" (
    "id" "uuid",
    "created_at" timestamp with time zone,
    "name" "text",
    "sid" "text",
    "phone" "text",
    "isWalkin" boolean,
    "status" "text",
    "remarks" "text",
    "reviewedBy" "text",
    "reviewedAt" timestamp with time zone,
    "userId" "uuid",
    "gender" character varying(10),
    "isHostellers" boolean,
    "reviewScore" "jsonb"
);


ALTER TABLE "public"."applicants_backup_2026" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."blogs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sid" character varying NOT NULL,
    "name" character varying,
    "branch" character varying NOT NULL,
    "email" "text" NOT NULL,
    "bio" "text",
    "content" "text" NOT NULL,
    "image" "text" NOT NULL
);


ALTER TABLE "public"."blogs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."events" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" character varying,
    "description" character varying,
    "date" character varying,
    "time" character varying,
    "location" character varying,
    "capacity" smallint,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "attendanceOpen" boolean DEFAULT false,
    "formConfigJson" "jsonb",
    "registrationOpen" boolean DEFAULT false NOT NULL,
    "attendanceFormConfigJson" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "public"."events" OWNER TO "postgres";


COMMENT ON TABLE "public"."events" IS 'Events being hosted by Robotics Society of PEC';



CREATE TABLE IF NOT EXISTS "public"."featureFlags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "isEnabled" boolean DEFAULT true NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."featureFlags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."hero" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "heading" "text",
    "description" "text"
);


ALTER TABLE "public"."hero" OWNER TO "postgres";


COMMENT ON TABLE "public"."hero" IS 'Hero section data for Robotics Society of PEC';



CREATE TABLE IF NOT EXISTS "public"."panelists" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "name" "text",
    "panelNumber" integer NOT NULL,
    "isOccupied" boolean DEFAULT false
);


ALTER TABLE "public"."panelists" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "userId" "uuid" NOT NULL,
    "email" "text",
    "fullName" "text",
    "avatarUrl" "text",
    "created_At" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" character varying,
    "description" character varying,
    "longDescription" character varying,
    "category" character varying,
    "technologies" character varying,
    "image" character varying,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


COMMENT ON TABLE "public"."projects" IS 'Projects of Robotics Society of PEC';



CREATE TABLE IF NOT EXISTS "public"."registrations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "eventId" "uuid" NOT NULL,
    "userId" "uuid" NOT NULL,
    "responseJson" "jsonb" NOT NULL,
    "screenshotPath" "text",
    "attendedAt" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "markedBy" "text",
    "attendanceResponseJson" "jsonb",
    CONSTRAINT "attendance_markedby_check" CHECK (("markedBy" = ANY (ARRAY['self'::"text", 'admin_override'::"text"])))
);


ALTER TABLE "public"."registrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."resources" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" character varying,
    "url" character varying
);


ALTER TABLE "public"."resources" OWNER TO "postgres";


COMMENT ON TABLE "public"."resources" IS 'Resources for anyone to follow';



CREATE TABLE IF NOT EXISTS "public"."roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "isDefault" boolean DEFAULT false NOT NULL,
    "isSystem" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."team" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "firstName" character varying,
    "lastName" character varying,
    "role" character varying,
    "image" character varying,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category" character varying
);


ALTER TABLE "public"."team" OWNER TO "postgres";


COMMENT ON TABLE "public"."team" IS 'Robotics Society Team';



CREATE TABLE IF NOT EXISTS "public"."techTalk" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "societyName" "text" NOT NULL,
    "showName" "text" NOT NULL,
    "tagline" "text" NOT NULL,
    "episodeNumber" bigint NOT NULL,
    "channelId" "text" NOT NULL,
    "channelUrl" "text" NOT NULL,
    "currentVideoId" "text",
    "challenge" "jsonb" NOT NULL,
    "socials" "jsonb" NOT NULL
);


ALTER TABLE "public"."techTalk" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."techTalkSubmissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "episodeNumber" bigint NOT NULL,
    "link" "text" NOT NULL
);


ALTER TABLE "public"."techTalkSubmissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."userRoles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "userId" "uuid" NOT NULL,
    "roleId" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."userRoles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."activities"
    ADD CONSTRAINT "activities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."applicant_response"
    ADD CONSTRAINT "applicant_response_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."applicants"
    ADD CONSTRAINT "applicants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."applicants"
    ADD CONSTRAINT "applicants_userid_unique" UNIQUE ("userId");



ALTER TABLE ONLY "public"."blogs"
    ADD CONSTRAINT "blogs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."featureFlags"
    ADD CONSTRAINT "featureFlags_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."featureFlags"
    ADD CONSTRAINT "featureFlags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hero"
    ADD CONSTRAINT "hero_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."panelists"
    ADD CONSTRAINT "panelists_panelNumber_key" UNIQUE ("panelNumber");



ALTER TABLE ONLY "public"."panelists"
    ADD CONSTRAINT "panelists_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_userid_unique" UNIQUE ("userId");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."registrations"
    ADD CONSTRAINT "registrations_eventId_userId_key" UNIQUE ("eventId", "userId");



ALTER TABLE ONLY "public"."registrations"
    ADD CONSTRAINT "registrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."resources"
    ADD CONSTRAINT "resources_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."team"
    ADD CONSTRAINT "team_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."techTalkSubmissions"
    ADD CONSTRAINT "techTalkEvents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."techTalk"
    ADD CONSTRAINT "techTalk_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."userRoles"
    ADD CONSTRAINT "userRoles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."userRoles"
    ADD CONSTRAINT "userRoles_userId_key" UNIQUE ("userId");



CREATE UNIQUE INDEX "roles_single_default" ON "public"."roles" USING "btree" ("isDefault") WHERE "isDefault";



ALTER TABLE ONLY "public"."applicant_response"
    ADD CONSTRAINT "applicant_response_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."applicants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."applicants"
    ADD CONSTRAINT "applicants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_userid_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."registrations"
    ADD CONSTRAINT "registrations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id");



ALTER TABLE ONLY "public"."registrations"
    ADD CONSTRAINT "registrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."userRoles"
    ADD CONSTRAINT "userRoles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."userRoles"
    ADD CONSTRAINT "userRoles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "Admin Can update" ON "public"."techTalk" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM (("public"."userRoles" "ur"
     JOIN "public"."roles" "r" ON (("r"."id" = "ur"."roleId")))
     JOIN "public"."profiles" "p" ON (("p"."id" = "ur"."userId")))
  WHERE (("p"."userId" = ( SELECT "auth"."uid"() AS "uid")) AND ("r"."slug" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM (("public"."userRoles" "ur"
     JOIN "public"."roles" "r" ON (("r"."id" = "ur"."roleId")))
     JOIN "public"."profiles" "p" ON (("p"."id" = "ur"."userId")))
  WHERE (("p"."userId" = ( SELECT "auth"."uid"() AS "uid")) AND ("r"."slug" = 'admin'::"text")))));



CREATE POLICY "Admin can insert" ON "public"."techTalk" FOR INSERT WITH CHECK (((( SELECT "auth"."uid"() AS "uid") IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM (("public"."userRoles" "ur"
     JOIN "public"."roles" "r" ON (("r"."id" = "ur"."roleId")))
     JOIN "public"."profiles" "p" ON (("p"."id" = "ur"."userId")))
  WHERE (("p"."userId" = ( SELECT "auth"."uid"() AS "uid")) AND ("r"."slug" = 'admin'::"text"))))));



CREATE POLICY "Admin can insert featureFlags" ON "public"."featureFlags" FOR INSERT TO "authenticated" WITH CHECK (((( SELECT "auth"."uid"() AS "uid") IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM (("public"."userRoles" "ur"
     JOIN "public"."roles" "r" ON (("r"."id" = "ur"."roleId")))
     JOIN "public"."profiles" "p" ON (("p"."id" = "ur"."userId")))
  WHERE (("p"."userId" = ( SELECT "auth"."uid"() AS "uid")) AND ("r"."slug" = 'admin'::"text"))))));



CREATE POLICY "Admin can read featureFlags" ON "public"."featureFlags" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "Admin can update featureFlags" ON "public"."featureFlags" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM (("public"."userRoles" "ur"
     JOIN "public"."roles" "r" ON (("r"."id" = "ur"."roleId")))
     JOIN "public"."profiles" "p" ON (("p"."id" = "ur"."userId")))
  WHERE (("p"."userId" = ( SELECT "auth"."uid"() AS "uid")) AND ("r"."slug" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM (("public"."userRoles" "ur"
     JOIN "public"."roles" "r" ON (("r"."id" = "ur"."roleId")))
     JOIN "public"."profiles" "p" ON (("p"."id" = "ur"."userId")))
  WHERE (("p"."userId" = ( SELECT "auth"."uid"() AS "uid")) AND ("r"."slug" = 'admin'::"text")))));



CREATE POLICY "Admins have full access to registrations" ON "public"."registrations" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM (("public"."userRoles" "ur"
     JOIN "public"."roles" "r" ON (("r"."id" = "ur"."roleId")))
     JOIN "public"."profiles" "p" ON (("p"."id" = "ur"."userId")))
  WHERE (("p"."userId" = "auth"."uid"()) AND ("r"."slug" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM (("public"."userRoles" "ur"
     JOIN "public"."roles" "r" ON (("r"."id" = "ur"."roleId")))
     JOIN "public"."profiles" "p" ON (("p"."id" = "ur"."userId")))
  WHERE (("p"."userId" = "auth"."uid"()) AND ("r"."slug" = 'admin'::"text")))));



CREATE POLICY "Allow admin and panel write" ON "public"."featureFlags" USING ("public"."is_admin_or_panel"()) WITH CHECK ("public"."is_admin_or_panel"());



CREATE POLICY "Allow anyone to insert" ON "public"."profiles" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow anyone to select" ON "public"."applicant_response" FOR SELECT USING (true);



CREATE POLICY "Allow only authenticated users to Delete profiles" ON "public"."profiles" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "Allow public read" ON "public"."featureFlags" FOR SELECT USING (true);



CREATE POLICY "Allow users to update their entry" ON "public"."registrations" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE ("p"."userId" = "auth"."uid"())))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE ("p"."userId" = "auth"."uid"()))));



CREATE POLICY "Authenticated users can delete activities" ON "public"."activities" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "Authenticated users can delete blogs" ON "public"."blogs" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "Authenticated users can delete events" ON "public"."events" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "Authenticated users can delete resources" ON "public"."resources" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "Authenticated users can delete team data" ON "public"."team" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "Authenticated users can insert activities" ON "public"."activities" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert events" ON "public"."events" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert into blogs" ON "public"."blogs" FOR INSERT WITH CHECK (true);



CREATE POLICY "Authenticated users can insert into resources" ON "public"."resources" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can update activities" ON "public"."activities" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "Authenticated users can update blogs" ON "public"."blogs" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL)) WITH CHECK (true);



CREATE POLICY "Authenticated users can update events" ON "public"."events" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "Authenticated users can update hero data" ON "public"."hero" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "Authenticated users can update resources" ON "public"."resources" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL)) WITH CHECK (true);



CREATE POLICY "Authenticated users can update team data" ON "public"."team" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."applicant_response" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."applicants" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."panelists" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."applicant_response" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."applicants" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."panelists" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."projects" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."team" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."activities" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."applicants" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "Enable read access for all users" ON "public"."blogs" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."events" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."hero" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."panelists" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "Enable read access for all users" ON "public"."projects" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."resources" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."team" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."techTalk" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."techTalkSubmissions" FOR SELECT USING (true);



CREATE POLICY "Enable remove for authenticated users only" ON "public"."projects" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "Enable update for authenticated users only" ON "public"."projects" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL)) WITH CHECK (true);



CREATE POLICY "Insert For Everyone" ON "public"."techTalkSubmissions" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can insert their own registration" ON "public"."registrations" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE ("p"."userId" = "auth"."uid"()))));



CREATE POLICY "Users can read own userRoles" ON "public"."userRoles" FOR SELECT USING (("userId" IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."userId" = "auth"."uid"()))));



CREATE POLICY "Users can read their own registration rows" ON "public"."registrations" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE ("p"."userId" = "auth"."uid"()))));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "userId")) WITH CHECK (("auth"."uid"() = "userId"));



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "userId"));



ALTER TABLE "public"."activities" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "admins assign roles" ON "public"."userRoles" TO "authenticated" USING ("public"."hasRole"("auth"."uid"(), 'admin'::"text")) WITH CHECK ("public"."hasRole"("auth"."uid"(), 'admin'::"text"));



CREATE POLICY "admins manage roles" ON "public"."roles" TO "authenticated" USING ("public"."hasRole"("auth"."uid"(), 'admin'::"text")) WITH CHECK ("public"."hasRole"("auth"."uid"(), 'admin'::"text"));



CREATE POLICY "allow auth users to update" ON "public"."applicant_response" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "allow auth users to update" ON "public"."applicants" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



CREATE POLICY "allow auth users to update" ON "public"."panelists" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL));



ALTER TABLE "public"."applicant_response" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."applicants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."applicants_backup_2026" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blogs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."featureFlags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."hero" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."panelists" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "read own profile" ON "public"."profiles" FOR SELECT TO "authenticated" USING ((("id" = "auth"."uid"()) OR "public"."hasRole"("auth"."uid"(), 'admin'::"text")));



CREATE POLICY "read own role" ON "public"."userRoles" FOR SELECT TO "authenticated" USING ((("userId" = "auth"."uid"()) OR "public"."hasRole"("auth"."uid"(), 'admin'::"text")));



ALTER TABLE "public"."registrations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."resources" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."roles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "roles readable by signed-in users" ON "public"."roles" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."team" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."techTalk" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."techTalkSubmissions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "update own profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("id" = "auth"."uid"())) WITH CHECK (("id" = "auth"."uid"()));



ALTER TABLE "public"."userRoles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."applicants";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."panelists";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






































































































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."hasRole"("_userId" "uuid", "_role" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."hasRole"("_userId" "uuid", "_role" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hasRole"("_userId" "uuid", "_role" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin_or_panel"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin_or_panel"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin_or_panel"() TO "service_role";



GRANT ALL ON FUNCTION "public"."mark_self_present"("p_event_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."mark_self_present"("p_event_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."mark_self_present"("p_event_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_missing_profiles"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_missing_profiles"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_missing_profiles"() TO "service_role";
























GRANT ALL ON TABLE "public"."activities" TO "anon";
GRANT ALL ON TABLE "public"."activities" TO "authenticated";
GRANT ALL ON TABLE "public"."activities" TO "service_role";



GRANT ALL ON TABLE "public"."applicant_response" TO "anon";
GRANT ALL ON TABLE "public"."applicant_response" TO "authenticated";
GRANT ALL ON TABLE "public"."applicant_response" TO "service_role";



GRANT ALL ON TABLE "public"."applicants" TO "anon";
GRANT ALL ON TABLE "public"."applicants" TO "authenticated";
GRANT ALL ON TABLE "public"."applicants" TO "service_role";



GRANT ALL ON TABLE "public"."applicants_backup_2026" TO "anon";
GRANT ALL ON TABLE "public"."applicants_backup_2026" TO "authenticated";
GRANT ALL ON TABLE "public"."applicants_backup_2026" TO "service_role";



GRANT ALL ON TABLE "public"."blogs" TO "anon";
GRANT ALL ON TABLE "public"."blogs" TO "authenticated";
GRANT ALL ON TABLE "public"."blogs" TO "service_role";



GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";



GRANT ALL ON TABLE "public"."featureFlags" TO "anon";
GRANT ALL ON TABLE "public"."featureFlags" TO "authenticated";
GRANT ALL ON TABLE "public"."featureFlags" TO "service_role";



GRANT ALL ON TABLE "public"."hero" TO "anon";
GRANT ALL ON TABLE "public"."hero" TO "authenticated";
GRANT ALL ON TABLE "public"."hero" TO "service_role";



GRANT ALL ON TABLE "public"."panelists" TO "anon";
GRANT ALL ON TABLE "public"."panelists" TO "authenticated";
GRANT ALL ON TABLE "public"."panelists" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";



GRANT ALL ON TABLE "public"."registrations" TO "anon";
GRANT ALL ON TABLE "public"."registrations" TO "authenticated";
GRANT ALL ON TABLE "public"."registrations" TO "service_role";



GRANT ALL ON TABLE "public"."resources" TO "anon";
GRANT ALL ON TABLE "public"."resources" TO "authenticated";
GRANT ALL ON TABLE "public"."resources" TO "service_role";



GRANT ALL ON TABLE "public"."roles" TO "anon";
GRANT ALL ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";



GRANT ALL ON TABLE "public"."team" TO "anon";
GRANT ALL ON TABLE "public"."team" TO "authenticated";
GRANT ALL ON TABLE "public"."team" TO "service_role";



GRANT ALL ON TABLE "public"."techTalk" TO "anon";
GRANT ALL ON TABLE "public"."techTalk" TO "authenticated";
GRANT ALL ON TABLE "public"."techTalk" TO "service_role";



GRANT ALL ON TABLE "public"."techTalkSubmissions" TO "anon";
GRANT ALL ON TABLE "public"."techTalkSubmissions" TO "authenticated";
GRANT ALL ON TABLE "public"."techTalkSubmissions" TO "service_role";



GRANT ALL ON TABLE "public"."userRoles" TO "anon";
GRANT ALL ON TABLE "public"."userRoles" TO "authenticated";
GRANT ALL ON TABLE "public"."userRoles" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























drop extension if exists "pg_net";

alter table "public"."applicants" drop constraint "applicants_gender_check";

alter table "public"."applicants" add constraint "applicants_gender_check" CHECK (((gender)::text = ANY ((ARRAY['male'::character varying, 'female'::character varying])::text[]))) not valid;

alter table "public"."applicants" validate constraint "applicants_gender_check";

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


  create policy "Auth_Delete 1ps738_0"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) IS NOT NULL));



  create policy "Auth_Insert 1ps738_0"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Auth_Update 1ps738_0"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) IS NOT NULL));



  create policy "all 1ps738_0"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'media'::text));



