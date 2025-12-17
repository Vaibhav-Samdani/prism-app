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

const WORKSPACES = [
  { id: "1", name: "Personal" },
  { id: "2", name: "College Project" },
  { id: "3", name: "Startup Idea" },
];

export default function WorkspaceSwitcher() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(WORKSPACES[0].id);

  const current = WORKSPACES.find((w) => w.id === value);

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

      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Switch workspace..." />
          <CommandEmpty>No workspace found.</CommandEmpty>

          <CommandGroup>
            {WORKSPACES.map((workspace) => (
              <CommandItem
                key={workspace.id}
                value={workspace.id}
                onSelect={(currentValue) => {
                  setValue(currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    value === workspace.id ? "opacity-100" : "opacity-0"
                  }`}
                />
                {workspace.name}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup>
            <CommandItem className="text-primary">
              + Create workspace
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
