import { cn } from "@/lib/utils";

type Props = {
  content: string;
  className?: string;
};

export default function RichTextViewer({ content, className }: Props) {
  if (!content) return null;

  return (
    <div
      className={cn("prose prose-sm max-w-none text-white dark:prose-invert prose-headings:text-foreground", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
