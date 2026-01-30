"use client";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";

export default function DashboardPage() {
  useEffect(() => {
    const createWorkspace = async () => {
      try {
        const res = await fetch("/api/workspaces", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "My First Workspace.",
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error);
          console.log(res);
        } else {
          toast.success("Workspace created successfully");
          console.log("Workspace created:", data);
        }
      } catch (error) {
        console.error("Error creating workspace:", error);
      }
    };

    createWorkspace();
  }, []);

  return (
    <div className="p-6">
      Dashboard
      <ToastContainer />
    </div>
  );
}
