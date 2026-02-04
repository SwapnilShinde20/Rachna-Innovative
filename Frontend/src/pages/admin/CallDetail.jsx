import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  Plus,
  User,
  Building2,
  Home,
  Clock,
  Calendar,
  Video,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import DealStatusBadge from "@/components/admin//video-calls/DealStatusBadge";
import TimelineItem from "@/components/admin//video-calls/TimelineItem";
import TimelineEntryForm from "@/components/admin//video-calls/TimelineEntryForm";

import {
  mockVideoCalls,
  mockTimelineEntries,
} from "@/data/mock-video-calls";

import { toast } from "sonner";

/**
 * Same labels as in types/video-calls
 * (kept identical to preserve UI text)
 */
const DEAL_STATUS_LABELS = {
  open: "Open",
  "in-discussion": "In Discussion",
  negotiation: "Negotiation",
  "deal-closed": "Deal Closed",
  "deal-dropped": "Deal Dropped",
};

export default function CallDetail() {
  const { id } = useParams();
  const call = mockVideoCalls.find((c) => c.id === id);

  const [entries, setEntries] = useState(
    mockTimelineEntries.filter((e) => e.videoCallId === id)
  );
  const [dealStatus, setDealStatus] = useState(call?.dealStatus || "open");
  const [formOpen, setFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(undefined);
  const [deleteId, setDeleteId] = useState(null);

  const sortedEntries = useMemo(() => {
    return [...entries].sort(
      (a, b) =>
        new Date(a.dateTime).getTime() -
        new Date(b.dateTime).getTime()
    );
  }, [entries]);

  if (!call) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-xl font-semibold">Call not found</h2>
          <p className="text-muted-foreground">
            The video call you're looking for doesn't exist.
          </p>
          <Button asChild className="mt-4">
            <Link to="/video-calls/completed">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Completed Calls
            </Link>
          </Button>
        </div>
      </>
    );
  }

  const handleSaveEntry = (data) => {
    if (editingEntry) {
      setEntries(
        entries.map((e) =>
          e.id === editingEntry.id
            ? { ...e, ...data, updatedAt: new Date().toISOString() }
            : e
        )
      );
      toast.success("Timeline entry updated");
    } else {
      const newEntry = {
        id: `te-${Date.now()}`,
        videoCallId: call.id,
        ...data,
        createdBy: "Admin User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setEntries([...entries, newEntry]);
      toast.success("Timeline entry added");
    }
    setEditingEntry(undefined);
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      setEntries(entries.filter((e) => e.id !== deleteId));
      toast.success("Timeline entry deleted");
      setDeleteId(null);
    }
  };

  const handleStatusChange = (status) => {
    setDealStatus(status);
    toast.success(
      `Deal status updated to ${DEAL_STATUS_LABELS[status]}`
    );
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
              <Link to="/admin/videocalls/completed">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {call.meetingTitle}
              </h1>
              <p className="text-muted-foreground">
                Video call completed on{" "}
                {format(new Date(call.callDate), "MMMM dd, yyyy")}
              </p>
            </div>
          </div>

          <Button
            onClick={() => {
              setEditingEntry(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Update
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>
                  Complete history of post-call activities
                </CardDescription>
              </CardHeader>

              <CardContent>
                {sortedEntries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Clock className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium">
                      No activity logged yet
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Start tracking post-call activities by adding
                      your first update.
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => setFormOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Update
                    </Button>
                  </div>
                ) : (
                  <div className="pl-1">
                    {sortedEntries.map((entry, index) => (
                      <TimelineItem
                        key={entry.id}
                        entry={entry}
                        isLast={
                          index === sortedEntries.length - 1
                        }
                        onEdit={handleEdit}
                        onDelete={(id) => setDeleteId(id)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Deal Status */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">
                  Deal Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DealStatusBadge
                  status={dealStatus}
                  className="text-sm"
                />
                <Select
                  value={dealStatus}
                  onValueChange={(v) =>
                    handleStatusChange(v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DEAL_STATUS_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Call Summary */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">
                  Call Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Buyer
                    </p>
                    <p className="font-medium">
                      {call.buyerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {call.buyerEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Seller
                    </p>
                    <p className="font-medium">
                      {call.sellerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {call.sellerCompany}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Home className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Property
                    </p>
                    <p className="font-mono text-sm font-medium">
                      {call.propertyReference}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Video className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Call Details
                    </p>
                    <p className="font-medium">
                      {call.duration} min
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(
                        new Date(call.callDate),
                        "MMM dd, yyyy 'at' h:mm a"
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Timeline Entry Dialog */}
      <TimelineEntryForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingEntry(undefined);
        }}
        entry={editingEntry}
        onSave={handleSaveEntry}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Timeline Entry
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this timeline
              entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
