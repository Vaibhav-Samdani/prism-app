"use client";

import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";

export default function DashboardPage() {
  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const id = "26944905-168b-49e8-9489-80bc7ad02781"; // be4bf979-79dc-4fbc-ac2c-070a5978ad6f
        const slug = "ganpati-sanitary"; // vaibhav-samdani

        const res = await fetch(
          `/api/workspace?id=${id}&slug=${slug}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to fetch workspace");
          console.log(res);
        } else {
          toast.success("Workspace fetched successfully");
          console.log("Workspace data:", data);
        }
      } catch (error) {
        console.error("Error fetching workspace:", error);
        toast.error("Something went wrong");
      }
    };

    fetchWorkspace();
  }, []);

  return (
    <div className="p-6">
      Dashboard
      <ToastContainer />
    </div>
  );
}
