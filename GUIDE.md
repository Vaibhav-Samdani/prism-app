# Prism App Guide

## Project Overview

`prism-app` is a Next.js 16 project built as a workspace-centric project management tool. The app is designed to support:

- authenticated users
- workspaces with members
- projects inside workspaces
- task tracking and a kanban board
- invite-based workspace access
- workspace dashboards and quick access panels

The app uses:

- `next` 16
- `react` 19
- `@tanstack/react-query` for data fetching
- `prisma` with PostgreSQL via `@prisma/client`
- `tailwindcss` v4 for styling
- `zod` + `react-hook-form` for validation and forms
- `lucide-react`, Radix UI, and custom UI components

## Key Features

- Global dashboard showing tasks, overdue counts, and workspace summary
- Workspace page with workspace details, members, stats, and workspace actions
- Workspace list page for selecting a workspace
- Project listing and project detail pages
- Kanban board for project task management
- Invite token route for accepting invitations
- Auth sign-in flow under `/sign-in`

## Project Structure

- `src/app/` - app router pages and API routes
- `src/components/` - reusable UI components and layout building blocks
- `src/hooks/` - custom hooks for auth, workspace, projects, tasks
- `src/lib/` - utilities, auth client, database client, validations
- `src/store/` - Zustand stores for auth and workspace state
- `prisma/` - Prisma schema, migrations, and seed data

## Current Position

The app is in an early-to-mid MVP stage with working UI and some backend integration, but several parts are incomplete or inconsistent.

### What is already working

- Core workspace list and workspace detail pages
- Global dashboard page that fetches `/api/dashboard`
- Workspace CRUD endpoints via `/api/workspaces`
- Workspace creation in the API
- Basic workspace navigation and project listing UX
- Invite flow page and auth page structure

### Incomplete / placeholder areas

- `src/app/(dashboard)/dashboard/project/[projectId]/page.tsx` is a placeholder returning `Page`
- Project detail page under `/dashboard/w/[slug]/[projectId]` uses mock static data and is not connected to backend data
- Some routes are duplicated or inconsistent:
  - `/dashboard/w/[slug]/projects` and `/w/[slug]/projects`
  - `/dashboard/project/[projectId]` vs `/dashboard/w/[slug]/[projectId]` vs `/w/[slug]/projects/[projectSlug]`
- There are test-only pages in `src/app/(dashboard)/test/page.tsx` and `src/app/(dashboard)/test-project/page.tsx`
- API route `/api/workspace` seems redundant with `/api/workspaces`
- The project page breadcrumbs contain broken or inconsistent route references such as `/dashboard/projects`
- Some UI actions use placeholder buttons or links without backend handlers

### Current stability

- The workspace API and workspace detail page appear stable and working
- Project/task sections are partially scaffolded and need full data integration
- Most of the app is built as client-side pages; server-side data fetching is limited to API calls

## Routes Overview

### Main page routes

- `/` - root page from `src/app/page.tsx`
- `/home` - marketing/landing page
- `/sign-in` - auth sign-in page
- `/invite/[token]` - invite acceptance page
- `/dashboard` - global dashboard page
- `/dashboard/workspaces` - workspace listing page
- `/dashboard/onboarding` - onboarding / create workspace UI
- `/dashboard/tasks/[taskId]` - task detail page
- `/dashboard/w/[slug]` - workspace detail page
- `/dashboard/w/[slug]/[projectId]` - project detail page (mocked)
- `/dashboard/w/[slug]/[projectId]/kanban-board` - project kanban board page
- `/dashboard/w/[slug]/projects` - workspace project list page
- `/w/[slug]/members` - workspace members page
- `/w/[slug]/projects` - alternate workspace project list page
- `/w/[slug]/projects/[projectSlug]` - alternate project detail page
- `/dashboard/project/[projectId]` - placeholder route
- `/test` and `/test-project` - development/test pages

### API routes

- `/api/workspaces`
- `/api/dashboard`
- `/api/invites/accept`
- `/api/workspace`
- `/api/workspaces/[workspaceId]/leave`
- `/api/workspaces/[workspaceId]/projects`
- `/api/workspaces/[workspaceId]/projects/[projectId]`
- `/api/workspaces/[workspaceId]/projects/[projectId]/tasks`
- `/api/workspaces/[workspaceId]/projects/[projectId]/tasks/[taskId]`
- `/api/auth/[...all]`
- `/api/projects`
- `/api/workspaces/[workspaceId]/invites`
- `/api/workspaces/[workspaceId]/invites/[inviteId]`
- `/api/workspaces/[workspaceId]/invites/[inviteId]/resend`
- `/api/workspaces/[workspaceId]/members`
- `/api/workspaces/[workspaceId]/members/[memberId]`

## Recommended Next Steps

1. Remove development-only pages:
   - `/test`
   - `/test-project`
2. Consolidate duplicate route patterns:
   - choose one workspace project listing route
   - choose one project detail route
   - keep workspace-focused routing under `/dashboard/w/[slug]`
3. Replace mock project detail data with real API data
4. Migrate repeated or stale API endpoints into consistent REST paths
5. Add a project settings/profile route if needed, or remove unused placeholders
6. Validate navigation and breadcrumbs for all dashboard/workspace pages
7. Add README content relevant to Prism and remove the default Next.js starter text

## How to Run

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run seed` (seed database if needed)

## Suggested Priorities

1. Fix route consistency and remove redundant page routes
2. Wire project/task pages to live backend data
3. Confirm invite and auth flows work end-to-end
4. Clean up placeholder pages and unused API routes
5. Improve UX around workspace creation and project navigation

## Current Position Summary

The project is beyond initial scaffolding and has a solid workspace dashboard foundation. It is currently in an early MVP phase: workspace and dashboard flows are the strongest parts, while project detail/task management still require real data integration and cleanup.

The best next move is to stabilize the workspace/project routing, replace mock pages with backend-driven views, and remove redundant or development-only pages.
