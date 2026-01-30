"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useWorkspaceStore } from "@/store/workspace-store";
import { MorphingSquare } from "../ui/loader";
import Link from "next/link";

export default function WorkspaceSwitcher() {
  const { workspaces } = useWorkspaces();
  const { activeWorkspaceId, setActiveWorkspaceId } = useWorkspaceStore();
  const [open, setOpen] = React.useState(false);
   const [search, setSearch] = React.useState("");

  const current = workspaces?.find((w) => w.id === activeWorkspaceId);


  // 🔑 Filter workspaces based on search
  const filteredWorkspaces = React.useMemo(() => {
    if (!search.trim()) return workspaces;

    return workspaces.filter((workspace) =>
      workspace.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, workspaces]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {current?.name}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-60 p-0">
        <Command>
          <CommandInput placeholder="Switch workspace..." />
          <CommandEmpty>No workspace found.</CommandEmpty>

          <CommandGroup>
            {workspaces.map((workspace) => (
              <CommandItem
                key={workspace.name}
                value={workspace.name}
                onSelect={(currentValue) => {
                  setActiveWorkspaceId(currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    activeWorkspaceId === workspace.id
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />
                {workspace.name}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup>
            <CommandItem className="text-primary">
              <Link href="/dashboard/onboarding">+ Create workspace</Link>
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
