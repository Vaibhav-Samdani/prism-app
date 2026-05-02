import createWorkspace from "@/lib/api/createWorkspace";
import { useWorkspaceStore } from "@/store/workspace-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const useCreateWorkspace = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  const { setActiveWorkspaceId } = useWorkspaceStore();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createWorkspace,
    onSuccess: (workspace) => {
      setActiveWorkspaceId(workspace.data.id);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      setName("");
      setDescription("");
      router.push("/dashboard");
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    console.log(name,description);

    mutate({ name: name.trim(), description });
  };

  return {
    name,
    setName,
    handleSubmit,
    isPending,
    isError,
    description,
    setDescription,
  };
};

export default useCreateWorkspace;
