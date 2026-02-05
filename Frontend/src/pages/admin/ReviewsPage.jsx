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
import { mockReviews } from '../../data/mockData';
import { Search, Star, Check, X, EyeOff, Flag, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { format } from 'date-fns';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [showFlagDialog, setShowFlagDialog] = useState(false);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    flagged: reviews.filter(r => r.flagged).length,
    avgRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
  };

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

  const handleStatusChange = (reviewId, newStatus) => {
    setReviews(reviews.map(r => 
      r.id === reviewId 
        ? { ...r, status: newStatus, moderatedAt: new Date().toISOString(), moderatedBy: 'Admin' }
        : r
    ));
  };

  const handleFlag = () => {
    if (selectedReview && flagReason) {
      setReviews(reviews.map(r => 
        r.id === selectedReview.id 
          ? { ...r, flagged: true, flagReason }
          : r
      ));
      setShowFlagDialog(false);
      setFlagReason('');
    }
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
                <TableRow key={review.id} className={review.flagged ? 'bg-destructive/5' : ''}>
                  <TableCell className="font-medium">
                    {review.buyerName}
                    {review.flagged && <Flag className="inline h-3 w-3 ml-1 text-destructive" />}
                  </TableCell>
                  <TableCell>{review.sellerName}</TableCell>
                  <TableCell>{renderStars(review.rating)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{review.comment}</TableCell>
                  <TableCell>{getStatusBadge(review.status)}</TableCell>
                  <TableCell>{format(new Date(review.createdAt), 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedReview(review);
                          setShowDetails(true);
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      {review.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(review.id, 'approved')}
                          >
                            <Check className="h-4 w-4 text-success" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(review.id, 'rejected')}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </>
                      )}
                      {review.status !== 'hidden' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(review.id, 'hidden')}
                        >
                          <EyeOff className="h-4 w-4" />
                        </Button>
                      )}
                      {!review.flagged && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedReview(review);
                            setShowFlagDialog(true);
                          }}
                        >
                          <Flag className="h-4 w-4 text-warning" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {renderStars(selectedReview.rating)}
                {getStatusBadge(selectedReview.status)}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Buyer</p>
                  <p className="font-medium">{selectedReview.buyerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Seller</p>
                  <p className="font-medium">{selectedReview.sellerName}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Comment</p>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedReview.comment}</p>
              </div>
              {selectedReview.flagged && (
                <div className="bg-destructive/10 p-3 rounded-lg">
                  <p className="text-sm font-medium text-destructive flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    Flagged
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{selectedReview.flagReason}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p>{format(new Date(selectedReview.createdAt), 'PPP')}</p>
                </div>
                {selectedReview.moderatedAt && (
                  <div>
                    <p className="text-muted-foreground">Moderated</p>
                    <p>{format(new Date(selectedReview.moderatedAt), 'PPP')}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            {selectedReview?.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleStatusChange(selectedReview.id, 'rejected');
                    setShowDetails(false);
                  }}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    handleStatusChange(selectedReview.id, 'approved');
                    setShowDetails(false);
                  }}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flag Dialog */}
      <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please provide a reason for flagging this review.
            </p>
            <Textarea
              placeholder="Enter reason..."
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFlagDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleFlag} disabled={!flagReason}>
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
