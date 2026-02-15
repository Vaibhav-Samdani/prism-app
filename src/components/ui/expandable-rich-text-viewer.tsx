"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import RichTextViewer from "./rich-text-viewer";
import { ChevronDown, CircleChevronDown } from "lucide-react";

interface Props {
  content: string;
  maxHeight?: number;
}

export default function ExpandableRichText({
  content,
  maxHeight = 100,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (el.scrollHeight > maxHeight) {
      setIsOverflowing(true);
    }
  }, [content, maxHeight]);

  return (
    <div className="max-w-xl">
      <div
        ref={containerRef}
        className={cn(
          "relative transition-all duration-300",
          !isExpanded && isOverflowing && "overflow-hidden",
        )}
        style={
          !isExpanded && isOverflowing ? { maxHeight: `${maxHeight}px` } : {}
        }
      >
        <RichTextViewer content={content} />
      </div>

      {isOverflowing && (
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="
    mt-4 inline-flex items-center gap-1.5
    rounded-md px-2 py-1
    text-xs font-medium
    text-muted-foreground
    hover:text-foreground
    hover:bg-muted/70
    active:bg-muted/90
    transition-all duration-200
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-ring
    focus-visible:ring-offset-2
    focus-visible:ring-offset-background
  "
        >
          {isExpanded ? "Show less" : "Show more"}

          <span
            className={cn(
              "transition-transform duration-200 ease-out",
              isExpanded ? "rotate-180" : "rotate-0",
            )}
          >
            <CircleChevronDown className="h-4 w-4" />
          </span>
        </button>
      )}
    </div>
  );
}
