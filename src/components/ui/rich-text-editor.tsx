"use client";

import React, { useEffect, useCallback, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Placeholder from "@tiptap/extension-placeholder";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Eraser,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Link as LinkIcon,
  Superscript as SuperIcon,
  Subscript as SubIcon,
  Strikethrough,
  Terminal,
  ALargeSmall,
  TextQuote,
  Code,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: Props) {
  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // 🔑 SOLUTION: Remove hardcoded text-white.
        // We handle colors through the 'prose' class for better theme compatibility.
        heading: { levels: [1, 2, 3], HTMLAttributes: { class: "" } },
        paragraph: { HTMLAttributes: { class: "text-white" } },
        codeBlock: {
          HTMLAttributes: {
            class:
              "rounded-xl bg-muted/50 p-4 font-mono text-sm border border-border/50",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-primary/20 pl-4 italic text-white",
          },
        },
      }),
      Underline,
      Superscript,
      Subscript,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-primary underline underline-offset-4 cursor-pointer font-medium",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Write something brilliant...",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          // 🔑 SOLUTION: prose-headings class ensures headers aren't just 'black'
          // We use text-foreground/90 to keep them sharp but themed.
          "prose prose-sm max-w-none min-h-[250px] focus:outline-none px-4 py-6 sm:px-10",
          "prose-headings:text-white prose-headings:tracking-tighter prose-headings:font-bold",
          "prose-p:text-white prose-p:leading-relaxed",
          "prose-pre:bg-transparent prose-pre:p-0",
          "selection:bg-primary/10 selection:text-primary",
          "prose-strong:text-white",
        ),
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // We use a guard clause to only update content if it's different 
  // from the current editor HTML to prevent infinite loops.
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false); // 'false' prevents cursor jumping
    }
  }, [value, editor]);

  

  const handleLinkOpen = () => {
    setLinkUrl(editor?.getAttributes("link").href || "");
    setIsLinkDialogOpen(true);
  };

  const handleLinkSubmit = () => {
    if (linkUrl === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    setIsLinkDialogOpen(false);
    setLinkUrl("");
  };

  const handleCase = useCallback(
    (type: "upper" | "lower" | "sentence") => {
      if (!editor) return;
      const { from, to, empty } = editor.state.selection;
      if (empty) return;
      const selectedText = editor.state.doc.textBetween(from, to);

      let transformed = selectedText.toLowerCase();
      if (type === "upper") transformed = selectedText.toUpperCase();
      if (type === "sentence") {
        transformed = transformed.replace(/(^\s*\w|[.!?]\s+\w)/g, (m) =>
          m.toUpperCase(),
        );
      }

      editor.chain().focus().insertContentAt({ from, to }, transformed).run();
    },
    [editor],
  );


  if (!editor) return null;

  return (
    <div
      className={cn(
        "group flex flex-col rounded-lg border bg-card shadow-sm transition-all focus-within:ring-4 focus-within:ring-primary/5",
        className,
      )}
    >
      <TooltipProvider delayDuration={0}>
        {/* Toolbar: Responsive flex-wrap ensures it works on mobile */}
        <div className="flex flex-wrap items-center gap-1 border-b bg-muted/20 p-2 sm:p-2.5">
          <ToolbarGroup>
            <ToolbarBtn
              icon={<Heading1 className="h-4 w-4" />}
              label="H1"
              on={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              active={editor.isActive("heading", { level: 1 })}
            />
            <ToolbarBtn
              icon={<Heading2 className="h-4 w-4" />}
              label="H2"
              on={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              active={editor.isActive("heading", { level: 2 })}
            />
            <ToolbarBtn
              icon={<Heading3 className="h-4 w-4" />}
              label="H3"
              on={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              active={editor.isActive("heading", { level: 3 })}
            />
          </ToolbarGroup>

          <Divider />

          <ToolbarGroup>
            <ToolbarBtn
              icon={<Bold className="h-4 w-4" />}
              label="Bold"
              on={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive("bold")}
            />
            <ToolbarBtn
              icon={<Italic className="h-4 w-4" />}
              label="Italic"
              on={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive("italic")}
            />
            <ToolbarBtn
              icon={<UnderlineIcon className="h-4 w-4" />}
              label="Underline"
              on={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive("underline")}
            />
            <ToolbarBtn
              icon={<Strikethrough className="h-4 w-4" />}
              label="Strike"
              on={() => editor.chain().focus().toggleStrike().run()}
              active={editor.isActive("strike")}
            />
            <ToolbarBtn
              icon={<Highlighter className="h-4 w-4" />}
              label="Highlight"
              on={() => editor.chain().focus().toggleHighlight().run()}
              active={editor.isActive("highlight")}
            />
          </ToolbarGroup>

          <Divider />

          <ToolbarGroup>
            <ToolbarBtn
              icon={<ALargeSmall className="h-4 w-4" />}
              label="Sentence Case"
              on={() => handleCase("sentence")}
            />
            <ToolbarBtn
              icon={<AlignLeft className="h-4 w-4" />}
              label="Left"
              on={() => editor.chain().focus().setTextAlign("left").run()}
              active={editor.isActive({ textAlign: "left" })}
            />
            <ToolbarBtn
              icon={<AlignCenter className="h-4 w-4" />}
              label="Center"
              on={() => editor.chain().focus().setTextAlign("center").run()}
              active={editor.isActive({ textAlign: "center" })}
            />
            <ToolbarBtn
              icon={<AlignRight className="h-4 w-4" />}
              label="Right"
              on={() => editor.chain().focus().setTextAlign("right").run()}
              active={editor.isActive({ textAlign: "right" })}
            />
            <ToolbarBtn
              icon={<AlignJustify className="h-4 w-4" />}
              label="Justify"
              on={() => editor.chain().focus().setTextAlign("justify").run()}
              active={editor.isActive({ textAlign: "justify" })}
            />
          </ToolbarGroup>

          <Divider />

          <ToolbarGroup>
            <ToolbarBtn
              icon={<SuperIcon className="h-4 w-4" />}
              label="Super"
              on={() => editor.chain().focus().toggleSuperscript().run()}
              active={editor.isActive("superscript")}
            />
            <ToolbarBtn
              icon={<SubIcon className="h-4 w-4" />}
              label="Sub"
              on={() => editor.chain().focus().toggleSubscript().run()}
              active={editor.isActive("subscript")}
            />
            <ToolbarBtn
              icon={<LinkIcon className="h-4 w-4" />}
              label="Link"
              on={handleLinkOpen}
              active={editor.isActive("link")}
            />
          </ToolbarGroup>

          <Divider />

          <ToolbarGroup>
            <ToolbarBtn
              icon={<List className="h-4 w-4" />}
              label="Bullets"
              on={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive("bulletList")}
            />
            <ToolbarBtn
              icon={<ListOrdered className="h-4 w-4" />}
              label="Numbers"
              on={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive("orderedList")}
            />
            <ToolbarBtn
              icon={<TextQuote className="h-4 w-4" />}
              label="Quote"
              on={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive("blockquote")}
            />
            <ToolbarBtn
              icon={<Code className="h-4 w-4" />}
              label="Inline"
              on={() => editor.chain().focus().toggleCode().run()}
              active={editor.isActive("code")}
            />
            <ToolbarBtn
              icon={<Terminal className="h-4 w-4" />}
              label="Block"
              on={() => editor.chain().focus().toggleCodeBlock().run()}
              active={editor.isActive("codeBlock")}
            />
          </ToolbarGroup>

          <div className="ml-auto flex items-center gap-1">
            <ToolbarBtn
              icon={<Eraser className="h-4 w-4" />}
              label="Clear"
              on={() =>
                editor.chain().focus().unsetAllMarks().clearNodes().run()
              }
            />
          </div>
        </div>
      </TooltipProvider>

      <div className="p-1">
        <EditorContent editor={editor} />
      </div>

      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">
              Insert Link
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <Input
              placeholder="https://prism.app"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLinkSubmit()}
              className="rounded-xl focus-visible:ring-primary/20"
            />
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button
              variant="ghost"
              className="rounded-xl"
              onClick={() => setIsLinkDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-xl px-8 shadow-lg shadow-primary/10"
              onClick={handleLinkSubmit}
            >
              Save Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* --- Local Atomic Components --- */

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function ToolbarBtn({
  icon,
  label,
  on,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  on: () => void;
  active?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant={active ? "secondary" : "ghost"}
          className={cn(
            "h-9 w-9 p-0 rounded-xl transition-all",
            active && "bg-primary/10 text-primary hover:bg-primary/20",
          )}
          onClick={on}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-foreground text-background border-none"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function Divider() {
  return (
    <Separator
      orientation="vertical"
      className="mx-1 h-7 bg-border/40 hidden sm:block"
    />
  );
}
