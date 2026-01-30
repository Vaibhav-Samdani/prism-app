"use client";


import useCreateWorkspace from "@/hooks/use-create-workspace";

export default function OnboardingPage() {
  const { name, setName, handleSubmit, isPending, isError } =
    useCreateWorkspace();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create your workspace
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Workspaces help you organize projects, tasks, and collaborators.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Workspace name
            </label>
            <input
              type="text"
              placeholder="Acme Inc"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? "Creating workspace..." : "Create workspace"}
          </button>
        </form>

        {isError && (
          <p className="mt-3 text-sm text-red-500">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
