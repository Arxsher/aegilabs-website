# Auth And Database Setup

1. Create a Clerk project.
2. Copy `.env.example` to `.env.local`.
3. Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` from Clerk.
4. Create a Supabase project.
5. In Supabase SQL Editor, run `supabase/schema.sql`.
6. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`.
7. Add the same variables to Vercel Project Settings before deployment.

Routes added:
- `/sign-in` for Clerk login.
- `/sign-up` for Clerk registration.
- `/onboarding` for first agent configuration.
- `/dashboard` for agent status and configuration.
- `/dashboard/agent` for the mock chat sandbox.

The sandbox is intentionally mocked for now. The next step is connecting it to Vercel AI SDK and a model provider.
