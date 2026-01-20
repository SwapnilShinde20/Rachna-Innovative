import { DashboardHeader } from '../../components/admin/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/admin/ui/card';
import {
  mockAnalytics,
  mockMeetings,
  mockSellers,
  mockVideoCallRequests,
  mockTransactions,
  mockReviews,
} from '../../data/mockData';
import {
  Users,
  UserCheck,
  Video,
  Calendar,
  TrendingUp,
  DollarSign,
  Star,
} from 'lucide-react';
import { Badge } from '../../components/admin/ui/badge';

export default function AdminDashboard() {
  const upcomingMeetings = mockMeetings
    .filter((m) => m.status === 'scheduled')
    .slice(0, 3);

  const pendingRequests = mockVideoCallRequests.filter(
    (r) => r.status === 'pending'
  );

  const pendingSellers = mockSellers.filter(
    (s) => s.status === 'submitted' || s.status === 'under_review'
  );

  const pendingReviews = mockReviews.filter(
    (r) => r.status === 'pending'
  );

  return (
    <div>
      <DashboardHeader
        title="Admin Dashboard"
        subtitle="Overview of platform activity"
      />

      <div className="p-6 space-y-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sellers</p>
                  <p className="text-3xl font-bold">
                    {mockAnalytics.totalSellers}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-success">
                  {mockAnalytics.verifiedSellers} verified
                </span>{' '}
                · {mockAnalytics.pendingSellers} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold">
                    ₹{(mockAnalytics.totalRevenue / 100000).toFixed(1)}L
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-success" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {mockAnalytics.totalTransactions} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Meetings</p>
                  <p className="text-3xl font-bold">
                    {mockAnalytics.totalMeetings}
                  </p>
                </div>
                <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-info" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {mockAnalytics.completedMeetings} completed ·{' '}
                {mockAnalytics.scheduledMeetings} scheduled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Conversion Rate
                  </p>
                  <p className="text-3xl font-bold">
                    {mockAnalytics.conversionRate}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Call Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Video className="w-5 h-5" />
                Pending Call Requests
                <Badge variant="secondary">
                  {pendingRequests.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No pending requests
                </p>
              ) : (
                pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {req.buyerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        wants to call {req.sellerCompany}
                      </p>
                    </div>
                    <Badge>Pending</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Upcoming Meetings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Meetings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingMeetings.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No upcoming meetings
                </p>
              ) : (
                upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {meeting.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          meeting.scheduledAt
                        ).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {meeting.duration} min
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Pending Sellers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Pending Seller Verifications
                <Badge variant="secondary">
                  {pendingSellers.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingSellers.slice(0, 3).map((seller) => (
                  <div
                    key={seller.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {seller.companyName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {seller.contactName} · {seller.email}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">
                        {seller.documents.length} docs
                      </Badge>
                      <Badge className="bg-warning text-warning-foreground">
                        Pending
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="w-5 h-5" />
                Pending Reviews
                <Badge variant="secondary">
                  {pendingReviews.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingReviews.slice(0, 3).map((review) => (
                  <div
                    key={review.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">
                          {review.buyerName}
                        </p>
                        <div className="flex items-center">
                          {Array.from({
                            length: review.rating,
                          }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3 fill-warning text-warning"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Review for {review.sellerName}
                      </p>
                    </div>
                    {review.flagged && (
                      <Badge variant="destructive">
                        Flagged
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
