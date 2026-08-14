import React, { useState } from "react";
import { Button, Card, Text } from "@seek/ui";

export function WorkflowCommentModal({
  title,
  onSubmit,
  onClose,
}: {
  title: string;
  onSubmit: (comment: string) => void;
  onClose: () => void;
}) {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(comment);
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-900/60 backdrop-blur-sm p-seek-4">
      <Card className="w-full max-w-md p-seek-6 shadow-2xl border-slate-200">
        <Text className="text-lg font-bold text-foreground mb-seek-3">{title}</Text>
        <form onSubmit={handleSubmit} className="space-y-seek-4">
          <div className="space-y-seek-1.5">
            <label className="text-sm font-semibold text-muted-foreground">Тайлбар / Шалтгаан</label>
            <textarea
              className="w-full min-h-[100px] border border-border rounded-seek-md p-seek-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/45 focus:border-primary/45 bg-surface text-foreground"
              placeholder="Энд тэмдэглэлээ бичнэ үү..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-seek-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Болих
            </Button>
            <Button type="submit" variant="primary">
              Илгээх
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
