// src/app/dashboard/w/[slug]/projects/[projectId]/_components/views/docs-editor.tsx
"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sparkles, MoreHorizontal, FileText, Plus, Clock } from 'lucide-react';
import { SlashCommand } from './slash-command';
import { getSuggestionItems, renderItems } from './suggestion';

const mockDocs = [
  { id: '1', title: 'Product Requirements', active: true },
  { id: '2', title: 'API Endpoints Design', active: false },
  { id: '3', title: 'Meeting Notes - Oct 12', active: false },
];

export function DocsEditor() {
  const editor = useEditor({
    extensions: [StarterKit,
        SlashCommand.configure({
        suggestion: {
          items: getSuggestionItems,
          render: renderItems,
        },
      }),
    ],
    content: `
      <p>Start typing here or press '/' for commands.</p>
      <ul>
        <li>Define user schema</li>
        <li>Setup auth routing</li>
      </ul>
    `,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none min-h-[500px] pb-32',
      },
    },
  });

  return (
    <div className="flex-1 flex h-full bg-background overflow-hidden">
      
      {/* Left Sidebar: Document Tree */}
      <div className="w-64 shrink-0 border-r border-border bg-[#FCFCFD] dark:bg-zinc-950/50 flex flex-col hidden md:flex">
        <div className="p-4 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pages</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="w-4 h-4" /></Button>
        </div>
        
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-0.5">
            {mockDocs.map((doc) => (
              <button
                key={doc.id}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors text-left ${
                  doc.active 
                    ? 'bg-muted/80 text-foreground font-medium' 
                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span className="truncate">{doc.title}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Canvas: Editor Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Editor Toolbar / Meta */}
        <div className="h-12 border-b border-border/50 flex items-center justify-between px-6 bg-background/95 backdrop-blur z-10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>Last edited 2 mins ago by Vaibhav</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="h-7 text-xs gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              AI Write
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* The Writing Surface */}
        <ScrollArea className="flex-1 bg-background">
          <div className="max-w-[750px] w-full mx-auto p-8 lg:p-16 lg:pt-12">
            
            {/* Notion-style Title Area */}
            <div className="mb-8 group relative">
              {/* Optional: Add cover button appears on hover */}
              <div className="absolute -top-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground gap-1">
                  <FileText className="w-3 h-3" /> Add icon
                </Button>
              </div>
              <input 
                type="text" 
                defaultValue="Product Requirements"
                className="w-full text-4xl font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/30 resize-none overflow-hidden"
                placeholder="Untitled"
              />
            </div>
            
            <Separator className="mb-8 opacity-50" />

            {/* TipTap Content */}
            <EditorContent editor={editor} className="cursor-text" />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}