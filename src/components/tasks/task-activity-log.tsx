import { Separator } from "@/components/ui/separator";

type ActivityLog = {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
};

export default function TaskActivityLog({
  logs,
}: {
  logs: ActivityLog[];
}) {
  if (logs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No activity yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log, index) => (
        <div key={log.id} className="space-y-1">
          <p className="text-sm">
            <span className="font-medium">{log.actor}</span>{" "}
            {log.action}
          </p>

          <p className="text-xs text-muted-foreground">
            {log.timestamp}
          </p>

          {index < logs.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
}
