"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATUS_OPTIONS = [
  { key: "todo", label: "Todo" },
  { key: "in_progress", label: "In Progress" },
  { key: "working", label: "Working" },
  { key: "blocked", label: "Blocked" },
  { key: "delayed", label: "Delayed" },
  { key: "done", label: "Done" },
];

export default function TaskStatusDropdown({
  onStatusChange,
}: {
  onStatusChange?: (newStatus: string) => void;
}) {
  const [status, setStatus] = useState("in_progress");

  const current = STATUS_OPTIONS.find((s) => s.key === status);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="secondary">
          {current?.label}
          <ChevronDown className="ml-2 h-4 w-4 opacity-60" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        {STATUS_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.key}
            onClick={() => {
              setStatus(option.key);
              onStatusChange?.(option.label);
            }}
          >
            {option.label}
            {status === option.key && (
              <Check className="ml-auto h-4 w-4 opacity-70" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
