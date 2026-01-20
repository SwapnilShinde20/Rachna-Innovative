import { useState } from 'react';
import { DashboardHeader } from '../../components/admin/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/admin/ui/card';
import { Button } from '../../components/admin/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/admin/ui/select';
import { mockAnalytics } from '../../data/mockData';
import {
  TrendingUp,
  Users,
  Calendar,
  Video,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/* Chart Data */
const sellersGrowthData = [
  { month: 'Jul', sellers: 12 },
  { month: 'Aug', sellers: 18 },
  { month: 'Sep', sellers: 25 },
  { month: 'Oct', sellers: 31 },
  { month: 'Nov', sellers: 42 },
  { month: 'Dec', sellers: 52 },
  { month: 'Jan', sellers: 65 },
];

const meetingsPerMonthData = [
  { month: 'Jul', meetings: 45 },
  { month: 'Aug', meetings: 62 },
  { month: 'Sep', meetings: 58 },
  { month: 'Oct', meetings: 78 },
  { month: 'Nov', meetings: 85 },
  { month: 'Dec', meetings: 72 },
  { month: 'Jan', meetings: 92 },
];

const callCompletionData = [
  {
    name: 'Completed',
    value: mockAnalytics.completedMeetings,
    color: 'hsl(142, 76%, 36%)',
  },
  {
    name: 'Cancelled',
    value: mockAnalytics.cancelledMeetings,
    color: 'hsl(0, 84%, 60%)',
  },
  {
    name: 'Scheduled',
    value: mockAnalytics.scheduledMeetings,
    color: 'hsl(217, 91%, 60%)',
  },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('6m');
  const [sellerFilter, setSellerFilter] = useState('all');

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Analytics"
        subtitle="Platform performance and insights"
      />

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="3m">Last 3 months</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sellerFilter} onValueChange={setSellerFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter seller" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sellers</SelectItem>
            {mockAnalytics.topSellers.map((seller) => (
              <SelectItem key={seller.id} value={seller.id}>
                {seller.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sellers</p>
                <div className="text-3xl font-bold">
                  {mockAnalytics.totalSellers}
                </div>
                <div className="flex items-center text-sm text-success mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +12% from last month
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Verified Sellers
                </p>
                <div className="text-3xl font-bold">
                  {mockAnalytics.verifiedSellers}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {Math.round(
                    (mockAnalytics.verifiedSellers /
                      mockAnalytics.totalSellers) *
                      100
                  )}
                  % approval rate
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Meetings
                </p>
                <div className="text-3xl font-bold">
                  {mockAnalytics.totalMeetings}
                </div>
                <div className="flex items-center text-sm text-success mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +8% from last month
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Avg Call Duration
                </p>
                <div className="text-3xl font-bold">
                  {mockAnalytics.avgCallDuration}m
                </div>
                <div className="flex items-center text-sm text-destructive mt-1">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  -2 min from last month
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sellers Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sellersGrowthData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sellers"
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Meetings Per Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={meetingsPerMonthData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="meetings"
                  fill="hsl(217, 91%, 60%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Conversion Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="text-4xl font-bold text-primary">
                {mockAnalytics.totalBuyers}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Total Inquiries
              </p>
            </div>
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="text-4xl font-bold text-info">
                {mockAnalytics.scheduledMeetings +
                  mockAnalytics.completedMeetings}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Converted to Meetings
              </p>
            </div>
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="text-4xl font-bold text-success">
                {mockAnalytics.conversionRate}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Inquiry → Meeting Rate
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
