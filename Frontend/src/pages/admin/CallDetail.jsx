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
  Video,
  RefreshCw,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/admin/ui/card";
import { Button } from "../../components/admin/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/admin/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/admin/ui/alert-dialog";

import DealStatusBadge from "../../components/admin/video-calls/DealStatusBadge";
import TimelineItem from "../../components/admin/video-calls/TimelineItem";
import TimelineEntryForm from "../../components/admin/video-calls/TimelineEntryForm";

import { DashboardHeader } from "../../components/admin/dashboard/DashboardHeader";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { useToast } from '../../hooks/use-toast';

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formOpen, setFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(undefined);
  const [deleteId, setDeleteId] = useState(null);

  // Queries
  const { data: call, isLoading: isLoadingCall } = useQuery({
    queryKey: ['admin-meeting', id],
    queryFn: async () => {
      const res = await api.get(`/admin/meetings/${id}`);
      return res.data;
    }
  });

  const { data: entries = [], isLoading: isLoadingEntries } = useQuery({
    queryKey: ['timeline', id],
    queryFn: async () => {
      const res = await api.get(`/admin/meetings/${id}/timeline`);
      return res.data;
    }
  });

  // Mutations
  const dealStatusMutation = useMutation({
    mutationFn: async (newStatus) => {
      const res = await api.put(`/admin/meetings/${id}/deal-status`, { dealStatus: newStatus });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-meeting', id] });
      queryClient.invalidateQueries({ queryKey: ['completed-meetings'] });
      toast({ title: 'Deal status updated' });
    },
    onError: () => toast({ title: 'Failed to update status', variant: 'destructive' })
  });

  const timelineAddMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post(`/admin/meetings/${id}/timeline`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline', id] });
      toast({ title: 'Timeline entry added' });
      setFormOpen(false);
    },
    onError: () => toast({ title: 'Failed to add entry', variant: 'destructive' })
  });

  const timelineUpdateMutation = useMutation({
    mutationFn: async ({ entryId, data }) => {
      const res = await api.put(`/admin/meetings/timeline/${entryId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline', id] });
      toast({ title: 'Timeline entry updated' });
      setFormOpen(false);
    },
    onError: () => toast({ title: 'Failed to update entry', variant: 'destructive' })
  });

  const timelineDeleteMutation = useMutation({
    mutationFn: async (entryId) => {
      await api.delete(`/admin/meetings/timeline/${entryId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline', id] });
      toast({ title: 'Timeline entry deleted' });
      setDeleteId(null);
    },
    onError: () => toast({ title: 'Failed to delete entry', variant: 'destructive' })
  });

  const sortedEntries = useMemo(() => {
    return [...entries].sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
    );
  }, [entries]);

  if (isLoadingCall) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Loading call details...</p>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-semibold">Call not found</h2>
        <p className="text-muted-foreground">
          The video call you're looking for doesn't exist.
        </p>
        <Button asChild className="mt-4">
          <Link to="/admin/videocalls/completed">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Completed Calls
          </Link>
        </Button>
      </div>
    );
  }

  const handleSaveEntry = (data) => {
    if (editingEntry) {
      timelineUpdateMutation.mutate({ entryId: editingEntry._id || editingEntry.id, data });
    } else {
      timelineAddMutation.mutate(data);
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      timelineDeleteMutation.mutate(deleteId);
    }
  };

  const handleStatusChange = (status) => {
    dealStatusMutation.mutate(status);
  };

  return (
    <div>
      <DashboardHeader
        title={call.title || "Untitled Meeting"}
        subtitle={`Video call completed on ${" "}
                ${format(new Date(call.scheduledAt || new Date()), "MMMM dd, yyyy")}`}
      />
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
              <Link to="/admin/videocalls/completed">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
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
                {isLoadingEntries ? (
                  <div className="flex justify-center p-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : sortedEntries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Clock className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium">No activity logged yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Start tracking post-call activities by adding your first
                      update.
                    </p>
                    <Button className="mt-4" onClick={() => setFormOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Update
                    </Button>
                  </div>
                ) : (
                  <div className="pl-1">
                    {sortedEntries.map((entry, index) => (
                      <TimelineItem
                        key={entry._id || entry.id}
                        entry={{...entry, id: entry._id || entry.id}} // compat with TimelineItem
                        isLast={index === sortedEntries.length - 1}
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
                <CardTitle className="text-base">Deal Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DealStatusBadge status={call.dealStatus || 'open'} className="text-sm" />
                <Select
                  value={call.dealStatus || 'open'}
                  onValueChange={(v) => handleStatusChange(v)}
                  disabled={dealStatusMutation.isPending}
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
                      ),
                    )}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Call Summary */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Call Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Buyer</p>
                    <p className="font-medium">{call.buyerId?.name || call.buyerName || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">
                      {call.buyerId?.email || ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Seller</p>
                    <p className="font-medium">{call.sellerId?.name || call.sellerName || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">
                      {call.sellerId?.companyName || ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Home className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Property</p>
                    <p className="font-mono text-sm font-medium">
                      {call.propertyId?.propertyId || 'N/A'}
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
                    <p className="font-medium">{call.duration || 0} min</p>
                    <p className="text-xs text-muted-foreground">
                      {format(
                        new Date(call.scheduledAt || new Date()),
                        "MMM dd, yyyy 'at' h:mm a",
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
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Timeline Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this timeline entry? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={timelineDeleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={timelineDeleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
