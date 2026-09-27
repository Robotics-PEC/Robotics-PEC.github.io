# Supabase Database & Auth Reference

## Overview
This documentation covers the Supabase local development workflow and production deployment.

**The Golden Rule:** Never make manual schema or auth changes via the production Supabase Dashboard. All changes must originate locally, be captured in migration files, and be deployed automatically via the GitHub integration.

## One-time Setup
1.  **Install Prerequisites:**
    - [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ensure it is running).
    - Supabase CLI installed via your package manager.
2. **Authenticate (Optional):**
    ```bash
    npx supabase login
    ```
    *Note: `supabase link` is NOT required for local development. It is only needed if you need to run `db pull` or `db push` directly against production (typically reserved for project maintainers).*
3. **Configure Environment for CLI:**
    Create a `.env.local` file in the root (gitignored) for CLI-read secrets:
    ```env
    GOOGLE_CLIENT_ID=<value>
    GOOGLE_CLIENT_SECRET=<value>
    ```
4. **Initialize Local Stack:**
    ```bash
    yarn db:start
    ```
    *Note: The first run will pull Docker images and may take several minutes.*

## Day-to-day Workflow
1.  **Sync:** `git pull && yarn db:reset` (ensures local matches latest migrations, no prod access required).
2.  **Develop:** Make changes in local Studio at `http://localhost:54323`.
3.  **Capture:** `yarn db:new <descriptive_name>` (generates SQL in `supabase/migrations/`).
4.  **Review:** Inspect the generated SQL file.
5.  **Ship:** `git add supabase/migrations && git commit && git push`.
    *GitHub Actions will auto-apply migrations to production.*

## Local Environment Details
- **Studio:** `http://localhost:54323`
- **API:** `http://localhost:54321`
- **Postgres:** `localhost:54322` (connection string: `postgresql://postgres:postgres@localhost:54322/postgres`)
- **Persistence:** Restarting Docker (`yarn db:stop` -> `yarn db:start`) is required after any `config.toml` or `.env.local` change. Changes are not picked up live.

## Auth (Google OAuth) Setup
1.  **config.toml:** Ensure `[auth.external.google]` block has `enabled = true` and references client_id/secret via `env()`. Set `redirect_uri` to `http://localhost:54321/auth/v1/callback`.
2.  **.env.local:** Must contain `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` matching the values in Google Cloud Console.
3.  **Google Cloud Console:** Add `http://localhost:54321/auth/v1/callback` to "Authorized redirect URIs".
4.  **Redirects:** `site_url` and `additional_redirect_urls` in `config.toml` should point to `http://localhost:3000`.
5.  **Restart:** Full `db:stop` -> `db:start` is required.

## Common Pitfalls

| Issue | Solution |
| :--- | :--- |
| **Env Confusion** | The CLI has been confirmed to resolve `env()` references in `config.toml` from `.env.local` in this project. If env values aren't picked up, verify by checking the generated `docker.env` file (see "Docker Stale" row below) rather than assuming either `.env` or `.env.local` as the sole source. |
| **Docker Stale** | Restart Docker stack after any `config.toml` or `.env.local` change. Verify pickup by checking `supabase/.temp/start-secrets/.../env/docker.env` (it should show actual values, not `env(...)`). |
| **Port Conflicts** | If port 5432 is blocked by corporate networks, use transaction pooler (port 6543) or `--db-url` connection string. |
| **Migration History** | After `db:pull`, answer "Yes" to "Update remote migration history table" so prod doesn't attempt to reapply schema. |
| **Manual Init** | Never run `supabase init` again; the `config.toml` is already committed. |

## CLI Commands Reference

| Command | Use Case |
| :--- | :--- |
| `yarn db:start` | Start local Dockerized Supabase stack. |
| `yarn db:stop` | Stop local Dockerized Supabase stack. |
| `yarn db:reset` | Reset local database to match current migration files. |
| `yarn db:new <name>` | Generate SQL migration from local schema changes. |
| `yarn db:pull` | Pull remote schema changes into local migration files (use carefully). |
| `yarn db:push` | (Rarely used) Manual force-push migrations to remote. |
