import { format } from "date-fns";
import { Download, Calendar, Pencil, Trash2 } from "lucide-react";

import ActivityIcon from "./ActivityIcon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Same labels as in types/video-calls
 * (kept identical to preserve UI text)
 */
const ACTIVITY_TYPE_LABELS = {
  "phone-call": "Phone Call",
  "site-visit": "Site Visit",
  negotiation: "Negotiation",
  "document-shared": "Document Shared",
  "price-discussion": "Price Discussion",
  "deal-progress": "Deal Progress",
  "follow-up": "Follow Up",
  other: "Other",
};

export default function TimelineItem({
  entry,
  isLast,
  onEdit,
  onDelete,
}) {
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024)
      return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="relative flex gap-4 pb-8">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-5 top-12 h-full w-0.5 bg-timeline-line" />
      )}

      {/* Icon */}
      <ActivityIcon
        type={entry.activityType}
        className="relative z-10 shrink-0"
      />

      {/* Content */}
      <Card className="flex-1 shadow-sm">
        <CardContent className="p-4">
          {/* Header */}
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-medium">
                  {ACTIVITY_TYPE_LABELS[entry.activityType]}
                </Badge>

                {entry.nextActionDate && (
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="mr-1 h-3 w-3" />
                    Follow-up:{" "}
                    {format(
                      new Date(entry.nextActionDate),
                      "MMM dd"
                    )}
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                {format(
                  new Date(entry.dateTime),
                  "EEEE, MMM dd, yyyy 'at' h:mm a"
                )}{" "}
                • Added by {entry.createdBy}
              </p>
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(entry)}
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(entry.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Notes */}
          <p className="text-sm leading-relaxed text-foreground">
            {entry.notes}
          </p>

          {/* Attachments */}
          {entry.attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Attachments
              </p>

              <div className="flex flex-wrap gap-2">
                {entry.attachments.map((file) => (
                  <Button
                    key={file.id}
                    variant="outline"
                    size="sm"
                    className="h-auto gap-2 px-3 py-2"
                    asChild
                  >
                    <a href={file.url} download>
                      <Download className="h-4 w-4" />
                      <div className="text-left">
                        <p className="text-xs font-medium">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
