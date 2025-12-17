"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Comment = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  parentCommentId: string | null;
};

export default function TaskComments({
  comments: initialComments,
}: {
  comments: Comment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const parents = comments.filter((c) => c.parentCommentId === null);

  const replies = (id: string) =>
    comments.filter((c) => c.parentCommentId === id);

  function submitReply(parentId: string) {
    if (!replyText.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        author: "Vaibhav",
        content: replyText,
        createdAt: "just now",
        parentCommentId: parentId,
      },
    ]);

    setReplyText("");
    setReplyTo(null);
  }

  return (
    <div className="space-y-6">
      {parents.map((comment) => (
        <div key={comment.id} className="space-y-3">
          {/* Parent comment */}
          <div className="rounded-md border border-border px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{comment.author}</span>
              <span className="text-muted-foreground">{comment.createdAt}</span>
            </div>

            <p className="text-sm mt-2 text-muted-foreground">
              {comment.content}
            </p>

            <Button
              variant="ghost"
              size="sm"
              className="mt-2 px-0 text-muted-foreground hover:text-foreground"
              onClick={() =>
                setReplyTo(replyTo === comment.id ? null : comment.id)
              }
            >
              Reply
            </Button>
          </div>

          {/* Replies */}
          <div className="ml-6 pl-4 border-l border-border space-y-3">
            {replies(comment.id).map((reply) => (
              <div key={reply.id} className="rounded-md bg-muted/30 px-4 py-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{reply.author}</span>
                  <span className="text-muted-foreground">
                    {reply.createdAt}
                  </span>
                </div>

                <p className="text-sm mt-2 text-muted-foreground">
                  {reply.content}
                </p>
              </div>
            ))}

            {/* Inline reply box */}
            {replyTo === comment.id && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Write a reply…"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="resize-none"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setReplyTo(null)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => submitReply(comment.id)}>
                    Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* New top-level comment */}
      <div className="space-y-3">
        <Textarea placeholder="Write a comment…" className="resize-none" />
        <div className="flex justify-end">
          <Button size="sm">Comment</Button>
        </div>
      </div>
    </div>
  );
}
