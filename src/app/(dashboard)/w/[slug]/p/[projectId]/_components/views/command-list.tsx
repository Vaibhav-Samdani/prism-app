// src/app/dashboard/w/[slug]/projects/[projectId]/_components/views/command-list.tsx
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Type, Heading1, Heading2, List, ListOrdered } from 'lucide-react';

export const CommandList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }
      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  return (
    <div className="z-50 min-w-[200px] overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md animate-in fade-in zoom-in-95">
      {props.items.length ? (
        props.items.map((item: any, index: number) => (
          <button
            key={index}
            className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors ${
              index === selectedIndex ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-muted'
            }`}
            onClick={() => selectItem(index)}
          >
            <item.icon className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col text-left">
              <span className="font-medium">{item.title}</span>
            </div>
          </button>
        ))
      ) : (
        <div className="p-2 text-sm text-muted-foreground">No results</div>
      )}
    </div>
  );
});

CommandList.displayName = 'CommandList';