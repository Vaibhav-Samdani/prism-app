"use client";

import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import RichTextViewer from "@/components/ui/rich-text-viewer";

export default function DashboardPage() {
  const [desc, setDesc] = useState("");
  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const id = "902e8ed8-4c90-42de-bf06-741e28829e85"; // be4bf979-79dc-4fbc-ac2c-070a5978ad6f
        const slug = "testing"; // vaibhav-samdani

        const res = await fetch(`/api/workspace?id=${id}&slug=${slug}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to fetch workspace");
          console.log(res);
        } else {
          toast.success("Workspace fetched successfully");
          console.log("Workspace data:", data);
        }

        setDesc(data.data.workspace.description);
      } catch (error) {
        console.error("Error fetching workspace:", error);
        toast.error("Something went wrong");
      }
    };

    fetchWorkspace();
  }, []);

  return (
    <div className="p-6 text-white">
      Dashboard
      <ToastContainer />
      <RichTextViewer content={desc}   />
    </div>
  );
}
