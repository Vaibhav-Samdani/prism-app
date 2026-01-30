import { toast } from "react-toastify";

export default async function createWorkspace(name: string) {
  try {
    const res = await fetch("/api/workspaces", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error);
    } else {
      toast.success("Workspace created successfully");
      console.log("Workspace created:", data);
    }

    return data;
  } catch (error) {
    console.error("Error creating workspace:", error);
  }
};
