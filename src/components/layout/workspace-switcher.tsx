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
import Link from "next/link";
import { useSidebar } from "../ui/sidebar";

export default function WorkspaceSwitcher() {
  const { workspaces, isLoading } = useWorkspaces();
  const { activeWorkspaceId, setActiveWorkspaceId } = useWorkspaceStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const { open } = useSidebar();

  const current = workspaces?.find((w) => w.id === activeWorkspaceId);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between"
        >
          {/* The Icon stays visible in both states */}
          <div className="flex size-6 shrink-0 items-center justify-center rounded bg-primary/10 text-primary self-start">
            {current?.name?.charAt(0) || "W"}
          </div>

          {/* 🔑 The Logic: Only show text if expanded */}
          {open && (
            <div className="flex flex-col items-start text-left leading-tight">
              <span className="truncate font-semibold">
                {isLoading ? "Loading..." : current?.name}
              </span>
              {workspaces.length < 1 && !isLoading && (
                <span className="text-[10px] text-muted-foreground">Empty</span>
              )}
            </div>
          )}
          {open && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
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
                value={workspace.id}
                onSelect={(currentValue) => {
                  setActiveWorkspaceId(currentValue);
                  setIsOpen(false);
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
