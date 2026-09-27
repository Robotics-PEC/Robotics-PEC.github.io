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
The project uses `.env.local` for configuration.

| Variable Type | Purpose | How to manage |
| :--- | :--- | :--- |
| Next.js Public | Client-side app config (`NEXT_PUBLIC_*`) | Define in `.env.local` |
| Supabase CLI | CLI-read secrets (`GOOGLE_CLIENT_ID`, etc.) | Define in `.env.local` |

*Note: Required Supabase URL and Anon Key are deterministic for the local stack; refer to `SUPABASE.md` for details.*

## Running the App
1. Start the local Supabase stack (if not already running):
   ```bash
   yarn db:start
   ```
2. Start the Next.js development server:
   ```bash
   yarn dev
   ```
3. Access the app: **`http://localhost:3000`**
4. Access local Supabase Studio: **`http://localhost:54323`**

## Database Changes
For schema or database changes, see the **[SUPABASE.md](SUPABASE.md)** migration workflow.

## Available Scripts
| Script | Description |
| :--- | :--- |
| `yarn dev` | Start development server |
| `yarn build` | Build the project |
| `yarn start` | Start production build |
| `yarn lint` | Run ESLint |
| `yarn db:*` | Database management commands (see **[SUPABASE.md](SUPABASE.md)**) |

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
3. `yarn db:reset` (if teammate added migrations)
4. `yarn dev` (start dev server)

## Troubleshooting
- **Port Conflicts**: Ensure ports 3000, 54321, 54322, 54323 are not in use.
- **Node Issues**: If experiencing odd build errors, try deleting `node_modules` and `yarn install` again.
- **Supabase/Auth Issues**: Refer to the "Common Pitfalls" in **[SUPABASE.md](SUPABASE.md)**.

## Related Docs
- [README.md](README.md): High-level project overview for non-developers.
- [SUPABASE.md](SUPABASE.md): In-depth guide for database and authentication management.
