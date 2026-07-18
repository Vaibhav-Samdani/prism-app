# Prism - AI-Powered Collaboration Workspace

Prism is a sophisticated, full-stack workspace management application designed to handle complex project workflows, documentation, and real-time visual collaboration[cite: 1]. It serves as an integrated "second brain" for engineering teams, bridging the gap between task management, structured documentation, and visual planning[cite: 1].

## 🚀 Core Features (v1)

*   **Multi-tenant Workspace Management**: Robust routing architecture supporting workspace segregation and team membership control via `/dashboard/w/[slug]`[cite: 1].
*   **Intelligent Task Boards**: Kanban-style project management with activity logging and status tracking[cite: 1].
*   **AI-Powered Documentation**: A rich-text editing environment (`docs-editor.tsx`) integrated with AI agents to rewrite, structure, and improve technical writing[cite: 1].
*   **Interactive Whiteboard**: Integrated visual canvas for project architecture and planning via Excalidraw[cite: 1].
*   **Agentic Workflows**: Advanced automation powered by LangGraph, enabling intelligent task generation and document structuring via custom agents[cite: 1].

## 🧠 Intelligence Layer

Prism utilizes custom LangGraph agents to streamline development productivity[cite: 1]:
*   **Task Agent** (`src/lib/langgraph/task-agent.ts`): Automates task requirements and sub-task generation[cite: 1].
*   **Document Agent** (`src/lib/langgraph/doc-agent.ts`): Provides "AI Write" capabilities to restructure and polish document content automatically[cite: 1].

## 🗺 v2 Roadmap: The "Pro" Upgrade

We are actively developing the following features to transform Prism into an enterprise-grade productivity suite:

### 💬 Collaborative Task Comments
*   **Persistent Threads**: Adding full CRUD support for task-specific discussions.
*   **Mentions**: Real-time tagging of team members to drive accountability.

### 📅 Google Ecosystem Integration
*   **Auto-Calendar Sync**: Bi-directional syncing with Google Calendar. Tasks with due dates automatically create calendar events, and rescheduling in the calendar updates the task deadline.
*   **Gmail Notifications**: Smart integration to push project update summaries and "due-soon" alerts directly to user inboxes.

### 🛡 Enterprise-Grade Security
*   **Granular RBAC**: Implementing dynamic role-based access control (Admin, Editor, Viewer) enforced via server-side middleware for every API operation.

### 🔍 Semantic Search (RAG)
*   **Contextual Knowledge**: Utilizing `pgvector` and vector embeddings to allow users to "chat with their project." Querying across documents and tasks to extract specific decision-making history.

---

## 🛠 Tech Stack

*   **Framework**: Next.js (App Router)[cite: 1].
*   **Styling**: Tailwind CSS with `shadcn/ui` component library[cite: 1].
*   **Database & ORM**: PostgreSQL with Prisma ORM[cite: 1].
*   **State Management**: Zustand for efficient global state[cite: 1].
*   **AI/LLM Integration**: LangGraph for agentic orchestration[cite: 1].
*   **Authentication**: NextAuth/Auth.js for secure session management[cite: 1].

## 📂 Project Structure

```text
/prisma
  /migrations           # Database migration history
  schema.prisma         # Prisma schema definition
  seed.ts               # Database seeding logic
/src
  /app
    /(auth)             # Authentication routes
    /(dashboard)        # Dashboard layout, workspace, and project routes
    /api                # Backend API routes (auth, workspaces, projects, tasks, docs)
    globals.css         # Global styles
    layout.tsx          # Root layout
    loading.tsx         # Loading states
  /components
    /auth               # Auth-related components
    /layout             # Dashboard headers, sidebars
    /projects           # Project-specific UI (modals, menus)
    /shared             # Shared reusable components
    /tasks              # Kanban and task-related components
    /ui                 # shadcn/ui library components
  /hooks                # Custom hooks (e.g., use-workspace-data, use-tasks)
  /lib
    /api                # API service wrappers
    /db                 # Database utility logic
    /langgraph          # AI Agent orchestrations (doc-agent, task-agent)
    /validations        # Zod schemas for validation
    auth.ts             # Auth configuration
    mail.ts             # Email utility
    utils.ts            # Helper functions
  /providers            # React providers (Zustand, Query)
  /store                # Zustand global state (auth, workspace, project)
  /types                # TypeScript type definitions
.gitignore              # Git ignore file
components.json         # shadcn/ui configuration
next.config.ts          # Next.js configuration
package.json            # Dependencies and scripts
tsconfig.json           # TypeScript configuration
```


## 🚀 Getting Started

1. **Clone the repository**

2. **Install dependencies**:
   ```bash
   npm install
   ```
3. Configure Environment Variables: Create a .env file in the root directory:
  ```Code snippet
  DATABASE_URL=...
  OPENROUTER_API_KEY=...
  GOOGLE_CLIENT_ID=...
  GOOGLE_CLIENT_SECRET=...
  ```
4. Run migrations:
  ```Bash
  npx prisma migrate dev
  ```
5. Start the development server:

  ```Bash
  npm run dev
  ```
