// src/app/dashboard/w/[slug]/projects/[projectId]/_components/views/docs-editor.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  MoreHorizontal,
  FileText,
  Plus,
  Clock,
  Loader2,
} from "lucide-react";
import { SlashCommand } from "./slash-command";
import { getSuggestionItems, renderItems } from "./suggestion";

export function DocsEditor({
  workspaceId,
  projectId,
}: {
  workspaceId: string;
  projectId: string;
}) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [activeDoc, setActiveDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isAIWriting, setIsAIWriting] = useState(false);

  const handleAIWrite = async () => {
    if (!editor || !activeDoc) return;

    setIsAIWriting(true);
    try {
      const res = await fetch(
        `/api/workspaces/${workspaceId}/projects/${projectId}/documents/${activeDoc.id}/ai-rewrite`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editor.getHTML() }),
        },
      );

      const result = await res.json();
      if (result.success) {
        editor.commands.setContent(result.data); // Updates the document with structured HTML
      }
    } catch (err) {
      console.error("AI Write failed:", err);
    } finally {
      setIsAIWriting(false);
    }
  };

  // Fetch documents belonging to this project on mount
  const fetchDocs = useCallback(
    async (selectId?: string) => {
      try {
        const res = await fetch(
          `/api/workspaces/${workspaceId}/projects/${projectId}/documents`,
        );
        const data = await res.json();

        // Defensive check: if data isn't an array, fall back to empty array
        const verifiedData = Array.isArray(data) ? data : [];

        const textDocs = verifiedData.filter((d: any) => d.type === "TEXT");
        setDocuments(textDocs);

        if (textDocs.length > 0) {
          const target = selectId
            ? textDocs.find((d: any) => d.id === selectId)
            : textDocs[0];
          setActiveDoc(target || textDocs[0]);
        } else {
          setActiveDoc(null);
        }
      } catch (err) {
        console.error("Failed to load documents:", err);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    },
    [workspaceId, projectId],
  );

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  // Initialize Tiptap Instance
  const editor = useEditor({
    extensions: [
      StarterKit,
      SlashCommand.configure({
        suggestion: { items: getSuggestionItems, render: renderItems },
      }),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none min-h-[500px] pb-32",
      },
    },
  });

  // Re-load content whenever the active document selection switches
  useEffect(() => {
    if (editor && activeDoc) {
      const currentContent = editor.getJSON();
      if (
        JSON.stringify(currentContent) !== JSON.stringify(activeDoc.content)
      ) {
        editor.commands.setContent(
          activeDoc.content || "<p>Start writing...</p>",
        );
      }
    }
  }, [activeDoc, editor]);

  // Debounced auto-save handler for document content
  const triggerAutoSave = useCallback(
    (updatedFields: { title?: string; content?: any }) => {
      if (!activeDoc?.id) return;

      if (saveTimeout.current) clearTimeout(saveTimeout.current);

      saveTimeout.current = setTimeout(async () => {
        try {
          await fetch(
            `/api/workspaces/${workspaceId}/projects/${projectId}/documents/${activeDoc.id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedFields),
            },
          );
        } catch (err) {
          console.error("Failed auto-saving document updates:", err);
        }
      }, 1000); // 1-second auto-save debounce
    },
    [activeDoc, workspaceId, projectId],
  );

  // Monitor text changes inside Tiptap
  useEffect(() => {
    if (!editor) return;
    const handleUpdate = () => {
      const newContent = editor.getJSON();
      triggerAutoSave({ content: newContent });
    };

    editor.on("update", handleUpdate);
    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, triggerAutoSave]);

  // Create a brand new document record
  const createNewDocument = async () => {
    try {
      const res = await fetch(
        `/api/workspaces/${workspaceId}/projects/${projectId}/documents`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Untitled Document",
            type: "TEXT",
            content: {
              type: "doc",
              content: [{ type: "paragraph", content: [] }],
            },
          }),
        },
      );
      const newDoc = await res.json();
      await fetchDocs(newDoc.id);
    } catch (err) {
      console.error("Could not append new text block asset:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full bg-background overflow-hidden">
      {/* Left Sidebar: Live Document Layout Navigation */}
      <div className="w-64 shrink-0 border-r border-border bg-[#FCFCFD] dark:bg-zinc-950/50 flex flex-col hidden md:flex">
        <div className="p-4 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pages
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={createNewDocument}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-0.5">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setActiveDoc(doc)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors text-left ${
                  activeDoc?.id === doc.id
                    ? "bg-muted/80 text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span className="truncate">{doc.title}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Content Stream: Text Processing Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {activeDoc ? (
          <>
            <div className="h-12 border-b border-border/50 flex items-center justify-between px-6 bg-background/95 backdrop-blur z-10">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>Auto-saving live updates to Prism</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAIWrite}
                  disabled={isAIWriting}
                  className="h-7 text-xs gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
                >
                  {isAIWriting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  AI Write
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 h-[calc(100vh-48px)] w-full bg-background">
              <div className="max-w-[750px] w-full mx-auto p-8 lg:p-16 lg:pt-12">
                {/* Real-time Document Title Input */}
                <div className="mb-8 group relative">
                  <input
                    type="text"
                    value={activeDoc.title}
                    onChange={(e) => {
                      const updatedTitle = e.target.value;
                      setActiveDoc((prev: any) => ({
                        ...prev,
                        title: updatedTitle,
                      }));
                      setDocuments((prevList) =>
                        prevList.map((d) =>
                          d.id === activeDoc.id
                            ? { ...d, title: updatedTitle }
                            : d,
                        ),
                      );
                      triggerAutoSave({ title: updatedTitle });
                    }}
                    className="w-full text-4xl font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/30 resize-none overflow-hidden"
                    placeholder="Untitled Document"
                  />
                </div>

                <Separator className="mb-8 opacity-50" />
                <EditorContent editor={editor} className="cursor-text" />
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground gap-4">
            <p className="text-sm">
              No text documents inside this project yet.
            </p>
            <Button size="sm" onClick={createNewDocument}>
              Create your first page
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
