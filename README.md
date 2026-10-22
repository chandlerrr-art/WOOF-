# WOOF

#A pet rescue coordination platform.

## Project Status

#Initial project setup in progress.

## Planned Features


## Development

This project is currently in its initial setup phase.

## Deployment

The app is published to GitHub Pages at https://chandlerrr-art.github.io/WOOF-/.
Pushing to `main` builds and deploys the site automatically.

## Backend setup (Supabase)

The frontend connects to Supabase for shared rescue reports, live report updates,
responder accounts, and report-photo storage.

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql).
   This creates the report tables, row-level security policies, photo bucket,
   and realtime publication.
3. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` from the Supabase project API settings. These are
   the public client URL and publishable/anon key; never use a service-role key
   in the browser.
4. For the deployed site, add GitHub Actions repository secrets named
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then push to `main`.
5. Enable email sign-up in Supabase Authentication. Configure the Site URL and
   allowed redirect URL for `https://chandlerrr-art.github.io/WOOF-/`.

Reports are visible on the public rescue board. Reporter names and phone
numbers are stored separately and are visible only to the report author or
the responder who claims that report. Responder accounts are not independently
verified, and should not be presented as certified professionals.

Without Supabase settings, the app runs in local demo mode and stores tickets
only in the current browser.
