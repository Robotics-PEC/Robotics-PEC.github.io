# Getting Started

This guide covers cloning, installing, and running the project locally.

## Prerequisites

- **Node.js**: No specific version pinned in this repository; any current LTS version should work.
- **Package Manager**: [Yarn](https://yarnpkg.com/) (this project uses `yarn.lock`).
- **Docker Desktop**: Required for the local Supabase stack.
- **Git**

## Clone and Install

1. Clone the repository: `git clone <repo-url>`
2. Install dependencies:
    ```bash
      yarn install
    ```

## Supabase One-time Setup

Before running the application, you **must complete the setup in [SUPABASE.md](SUPABASE.md)**:

1. Ensure Docker Desktop is running.
2. Initialize the Supabase Docker stack.
3. Configure the required `.env.local` file.
4. Run the initial database reset.

## Environment Variables

The project requires a `.env.local` file in the root directory. Supabase-related keys and local auth credentials are **Required**, while feature-specific and admin keys are **Optional / Conditional**:

| Variable Name                       | Status                     | Purpose / Description                                                                                 |
| :---------------------------------- | :------------------------- | :---------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | **Required**               | Public anonymous API key for client-side Supabase queries.                                            |
| `NEXT_PUBLIC_SUPABASE_API_ENDPOINT` | **Required**               | Supabase project URL / API endpoint.                                                                  |
| `NEXT_PUBLIC_PROJECT_REF`           | **Required**               | Supabase project reference identifier.                                                                |
| `SUPABASE_SERVICE_ROLE_KEY`         | **Required**               | Privileged service role key for server-side operations (bypasses RLS).                                |
| `NEXT_SUPABASE_SECRET_KEY_SANCTION` | **Required**               | Supabase secret key from the Supabase dashboard for sanction API operations.                          |
| `GOOGLE_CLIENT_ID`                  | **Required**               | Google OAuth Client ID for local docker Supabase authentication (see [SUPABASE.md](SUPABASE.md)).     |
| `GOOGLE_CLIENT_SECRET`              | **Required**               | Google OAuth Client Secret for local docker Supabase authentication (see [SUPABASE.md](SUPABASE.md)). |
| `NEXT_PUBLIC_ADMIN_EMAIL`           | **Optional / Conditional** | Designated email address; required only if accessing the admin portal.                                |
| `NEXT_PUBLIC_PASSWORD_HASH`         | **Optional / Conditional** | Hashed password; required only if accessing the admin portal.                                         |
| `GAME_SECRET`                       | **Optional / Feature**     | Secret key required when trying to play the game.                                                     |
| `GOOGLE_APPS_SCRIPT_URL`            | **Optional / Feature**     | Web app URL required for the game / recruitment process.                                              |
| `ATTENDANCE_SECRET`                 | **Optional / Feature**     | Secret key required for generating the attendance code (timed OTP).                                   |
| `NEXT_PUBLIC_GA_ID`                 | **Optional**               | Google Analytics tracking ID (only required for analytics, not useful for local dev).                 |

_Note: For local development setup and stack credentials, refer to [SUPABASE.md](SUPABASE.md)._

## Running the App

1. Start the local Supabase stack (if not already running):
    ```bash
      yarn db:start
    ```
2. Start the Next.js development server:
    ```bash
      yarn dev
    ```
3. Access the app: `http://localhost:3000`
4. Access local Supabase Studio: `http://localhost:54323`

## Database Changes

For schema or database changes, see the **[SUPABASE.md](SUPABASE.md)** migration workflow.

## Available Scripts

| Script       | Description                                                       |
| :----------- | :---------------------------------------------------------------- |
| `yarn dev`   | Start development server                                          |
| `yarn build` | Build the project                                                 |
| `yarn start` | Start production build                                            |
| `yarn lint`  | Run ESLint                                                        |
| `yarn db:*`  | Database management commands (see **[SUPABASE.md](SUPABASE.md)**) |

## Project Structure

- `src/`: Core application source code.
    - `components/`: UI components (including Radix UI based components).
    - `lib/`: Utility functions and shared logic.
    - `pages/`: Next.js Page Router setup.
    - `styles/`: Global styles and Tailwind configuration.
- `public/`: Static assets (images, fonts, etc.).
- `supabase/`: Database migrations and local stack configuration.

## Day-to-day Dev Loop

1. `git pull`
2. `yarn install` (if `package.json` changed)
3. `yarn db:up` (if teammate added migrations)
4. `yarn dev` (start dev server)

## Troubleshooting

- **Port Conflicts**: Ensure ports 3000, 54321, 54322, 54323 are not in use.
- **Node Issues**: If experiencing odd build errors, try deleting `node_modules` and `yarn install` again.
- **Supabase/Auth Issues**: Refer to the "Common Pitfalls" in **[SUPABASE.md](SUPABASE.md)**.

## Related Docs

- [README.md](README.md): High-level project overview for non-developers.
- [SUPABASE.md](SUPABASE.md): In-depth guide for database and authentication management.
