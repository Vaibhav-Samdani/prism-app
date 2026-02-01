import { toast } from "react-toastify";

export default async function createWorkspace(name: string) {
  try {
    const res = await fetch("/api/workspace", {
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
    console.log("Data ------->", data);
    return data;
  } catch (error) {

    console.log("Error creating workspace:", error);

    throw new Error("Error creating workspace!!");

  }
}
