import { useState } from 'react';
import { DashboardHeader } from '../../components/admin/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/admin/ui/card';
import { Button } from '../../components/admin/ui/button';
import { Badge } from '../../components/admin/ui/badge';
import { Input } from '../../components/admin/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/admin/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/admin/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/admin/ui/dialog';
import { Textarea } from '../../components/admin/ui/textarea';
import { Search, Star, Check, X, EyeOff, Flag, MessageSquare, ThumbsUp, ThumbsDown, Trash2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { useToast } from '../../hooks/use-toast';

export default function ReviewsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ── Fetch Reviews ──
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const res = await api.get('/data/reviews');
      return res.data;
    },
  });

  // ── Modarate Review Mutation ──
  const moderateMutation = useMutation({
    mutationFn: async ({ id, status, flagged, flagReason }) => {
      const payload = {};
      if (status !== undefined) payload.status = status;
      if (flagged !== undefined) payload.flagged = flagged;
      if (flagReason !== undefined) payload.flagReason = flagReason;

      const { data } = await api.put(`/admin/reviews/${id}/moderate`, payload);
      return data;
    },
    onSuccess: (updatedReview) => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      // Update selected review if dialog is open
      if (selectedReview && selectedReview._id === updatedReview._id) {
        setSelectedReview(updatedReview);
      }
      toast({ title: 'Review updated successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to update review', variant: 'destructive' });
    }
  });

  // ── Delete Review Mutation ──
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/data/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      setShowDetails(false);
      setSelectedReview(null);
      toast({ title: 'Review deleted permanently' });
    },
  });

  // ── State ──
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [showFlagDialog, setShowFlagDialog] = useState(false);

  // ── Filtering ──
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      (review.buyerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (review.sellerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (review.comment || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    flagged: reviews.filter(r => r.flagged).length,
    avgRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : '0.0',
  };

  // ── Helpers ──
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success/10 text-success border-success/20">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'hidden':
        return <Badge variant="secondary">Hidden</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'fill-warning text-warning' : 'text-muted'}`}
        />
      ))}
    </div>
  );

  // ── Action Handlers ──
  const handleStatusChange = (reviewId, newStatus) => {
    moderateMutation.mutate({ id: reviewId, status: newStatus });
  };

  const handleFlag = () => {
    if (selectedReview && flagReason.trim()) {
      moderateMutation.mutate({ 
        id: selectedReview._id, 
        flagged: true, 
        flagReason: flagReason.trim() 
      });
      setShowFlagDialog(false);
      setFlagReason('');
    }
  };

  const handleUnflag = (reviewId) => {
    moderateMutation.mutate({ 
      id: reviewId, 
      flagged: false, 
      flagReason: '' 
    });
  };

  return (
    <div>
      <DashboardHeader title="Reviews & Ratings" subtitle="Moderate and manage user reviews" />
      <div className="p-6 space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
              <p className="text-2xl font-bold">{stats.avgRating}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
              <ThumbsUp className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Flag className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Flagged</p>
              <p className="text-2xl font-bold">{stats.flagged}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews ({filteredReviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              Loading reviews...
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No reviews found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review._id} className={review.flagged ? 'bg-destructive/5' : ''}>
                    <TableCell className="font-medium">
                      {review.buyerName}
                      {review.flagged && <Flag className="inline h-3 w-3 ml-1 text-destructive" title="Flagged" />}
                    </TableCell>
                    <TableCell>{review.sellerName}</TableCell>
                    <TableCell>{renderStars(review.rating)}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={review.comment}>{review.comment}</TableCell>
                    <TableCell>{getStatusBadge(review.status)}</TableCell>
                    <TableCell>{format(new Date(review.createdAt || new Date()), 'MMM dd, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {/* View Details */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedReview(review);
                            setShowDetails(true);
                          }}
                          title="View Details"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>

                        {/* Quick Approve (if not approved) */}
                        {review.status !== 'approved' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(review._id, 'approved')}
                            title="Approve Review"
                            disabled={moderateMutation.isPending}
                          >
                            <Check className="h-4 w-4 text-success" />
                          </Button>
                        )}

                        {/* Quick Reject (if pending) */}
                        {review.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(review._id, 'rejected')}
                            title="Reject Review"
                            disabled={moderateMutation.isPending}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                        
                        {/* Hide Review (if approved/pending) */}
                        {(review.status === 'approved' || review.status === 'pending') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(review._id, 'hidden')}
                            title="Hide Review"
                            disabled={moderateMutation.isPending}
                          >
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )}

                        {/* Flag / Unflag */}
                        {!review.flagged ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedReview(review);
                              setFlagReason('');
                              setShowFlagDialog(true);
                            }}
                            title="Flag Review"
                          >
                            <Flag className="h-4 w-4 text-warning" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnflag(review._id)}
                            title="Unflag Review"
                            disabled={moderateMutation.isPending}
                          >
                            <Flag className="h-4 w-4 fill-destructive text-destructive" />
                          </Button>
                        )}
                        
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ────────── Review Details Dialog ────────── */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Review Details
            </DialogTitle>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg border">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Rating</p>
                  {renderStars(selectedReview.rating)}
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs text-muted-foreground">Current Status</p>
                  {getStatusBadge(selectedReview.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Buyer (Author)</p>
                  <p className="font-medium">{selectedReview.buyerName || 'Unknown'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Seller (Subject)</p>
                  <p className="font-medium">{selectedReview.sellerName || 'Unknown'}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Comment</p>
                <div className="text-sm bg-muted p-4 rounded-lg border whitespace-pre-wrap">
                  {selectedReview.comment || <span className="text-muted-foreground italic">No comment provided.</span>}
                </div>
              </div>

              {selectedReview.flagged && (
                <div className="bg-destructive/10 border-destructive/20 border p-3 rounded-lg">
                  <p className="text-sm font-medium text-destructive flex items-center gap-2">
                    <Flag className="h-4 w-4 fill-destructive" />
                    Flagged Content
                  </p>
                  <p className="text-sm text-destructive/80 mt-1">{selectedReview.flagReason}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm mt-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Created At</p>
                  <p className="font-medium">{format(new Date(selectedReview.createdAt || new Date()), 'PPp')}</p>
                </div>
                {selectedReview.moderatedAt && (
                  <div>
                    <p className="text-xs text-muted-foreground">Last Moderated</p>
                    <p className="font-medium">{format(new Date(selectedReview.moderatedAt), 'PPp')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="flex-wrap gap-2 sm:justify-between mt-6">
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm('Are you sure you want to completely delete this review? This cannot be undone.')) {
                    deleteMutation.mutate(selectedReview._id);
                  }
                }}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Permanently
              </Button>
            </div>

            <div className="flex gap-2">
              {selectedReview?.status !== 'rejected' && (
                <Button
                  variant="outline"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleStatusChange(selectedReview._id, 'rejected')}
                  disabled={moderateMutation.isPending}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              )}
              {selectedReview?.status !== 'approved' && (
                <Button
                  className="bg-success text-success-foreground hover:bg-success/90"
                  onClick={() => handleStatusChange(selectedReview._id, 'approved')}
                  disabled={moderateMutation.isPending}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ────────── Flag Dialog ────────── */}
      <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-warning" />
              Flag Review
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please provide a reason for flagging this review. This helps in moderation audits.
            </p>
            <Textarea
              placeholder="E.g. Contains inappropriate language, fake review, spam..."
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFlagDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-warning text-warning-foreground hover:bg-warning/90" 
              onClick={handleFlag} 
              disabled={!flagReason.trim() || moderateMutation.isPending}
            >
              <Flag className="h-4 w-4 mr-2" />
              Flag Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
