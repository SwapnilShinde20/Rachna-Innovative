import { useState } from "react";
import { format } from "date-fns";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Same labels you had in types/video-calls
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

export default function TimelineEntryForm({
  open,
  onOpenChange,
  entry,
  onSave,
}) {
  const [activityType, setActivityType] = useState(
    entry?.activityType || "phone-call"
  );

  const [dateTime, setDateTime] = useState(
    entry?.dateTime
      ? format(new Date(entry.dateTime), "yyyy-MM-dd'T'HH:mm")
      : format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );

  const [notes, setNotes] = useState(entry?.notes || "");
  const [nextActionDate, setNextActionDate] = useState(
    entry?.nextActionDate || ""
  );
  const [attachments, setAttachments] = useState(entry?.attachments || []);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      activityType,
      dateTime: new Date(dateTime).toISOString(),
      notes,
      nextActionDate: nextActionDate || undefined,
      attachments,
    });

    onOpenChange(false);
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments = Array.from(files).map((file, i) => ({
      id: `new-${Date.now()}-${i}`,
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      size: file.size,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {entry ? "Edit Timeline Entry" : "Add Timeline Entry"}
          </DialogTitle>
          <DialogDescription>
            Log an activity that occurred after the video call.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Activity + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Activity Type</Label>
              <Select
                value={activityType}
                onValueChange={(v) => setActivityType(v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ACTIVITY_TYPE_LABELS).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date & Time</Label>
              <Input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Detailed Notes</Label>
            <Textarea
              placeholder="Describe what happened during this activity..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Next Action */}
          <div className="space-y-2">
            <Label>Next Action Date (Optional)</Label>
            <Input
              type="date"
              value={nextActionDate}
              onChange={(e) => setNextActionDate(e.target.value)}
            />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label>Attachments (Optional)</Label>
            <div className="flex flex-wrap gap-2">
              {attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm"
                >
                  <span className="max-w-[150px] truncate">
                    {file.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => removeAttachment(file.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}

              <Label
                htmlFor="file-upload"
                className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
              >
                <Upload className="h-4 w-4" />
                Add Files
              </Label>

              <Input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {entry ? "Save Changes" : "Add Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
