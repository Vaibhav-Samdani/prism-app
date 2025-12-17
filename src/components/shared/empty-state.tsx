'use client'


import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-4">
      <h3 className="text-lg font-medium">
        {title}
      </h3>

      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        {description}
      </p>

      {actionLabel && onAction && (
        <>
          <Separator className="my-6 w-24" />
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        </>
      )}
    </div>
  );
}










