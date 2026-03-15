import { TrendingUp, Eye, MessageSquare, DollarSign, Building2, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['seller-analytics-full'],
    queryFn: async () => {
      const { data } = await api.get('/sellers/me/analytics/full');
      return data;
    }
  });

  const monthlyData = analytics?.monthlyData || [];
  const topProperties = analytics?.topProperties || [];
  const kpis = analytics?.kpis || {};
  const maxViews = monthlyData.length > 0 ? Math.max(...monthlyData.map(d => d.views)) : 1;
  const maxRevenue = monthlyData.length > 0 ? Math.max(...monthlyData.map(d => d.revenue)) : 35000;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Track your property performance</p>
        </div>
        <Select defaultValue="6m">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="3m">Last 3 months</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-slide-up">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Eye className="h-6 w-6" />
              </div>
              <Badge variant={kpis.viewsGrowth?.startsWith('-') ? 'destructive' : 'success'} className="gap-1">
                {kpis.viewsGrowth?.startsWith('-') ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
                {kpis.viewsGrowth?.replace('-', '')}
              </Badge>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Total Views</p>
            <p className="text-3xl font-bold">{kpis.totalViews?.toLocaleString() || 0}</p>
          </CardContent>
        </Card>
        <Card className="animate-slide-up" style={{ animationDelay: "50ms" }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
                <MessageSquare className="h-6 w-6" />
              </div>
              <Badge variant={kpis.leadsGrowth?.startsWith('-') ? 'destructive' : 'success'} className="gap-1">
                {kpis.leadsGrowth?.startsWith('-') ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
                {kpis.leadsGrowth?.replace('-', '')}
              </Badge>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Total Leads</p>
            <p className="text-3xl font-bold">{kpis.totalLeads?.toLocaleString() || 0}</p>
          </CardContent>
        </Card>
        <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
                <TrendingUp className="h-6 w-6" />
              </div>
              <Badge variant={kpis.conversionGrowth?.startsWith('-') ? 'destructive' : 'warning'} className="gap-1">
                {kpis.conversionGrowth?.startsWith('-') ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
                {kpis.conversionGrowth?.replace('-', '')}
              </Badge>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Conversion Rate</p>
            <p className="text-3xl font-bold">{kpis.conversionRate}</p>
          </CardContent>
        </Card>
        <Card className="animate-slide-up" style={{ animationDelay: "150ms" }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <DollarSign className="h-6 w-6" />
              </div>
              <Badge variant={kpis.revenueGrowth?.startsWith('-') ? 'destructive' : 'success'} className="gap-1">
                {kpis.revenueGrowth?.startsWith('-') ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
                {kpis.revenueGrowth?.replace('-', '')}
              </Badge>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Revenue</p>
            <p className="text-3xl font-bold">${kpis.revenue ? (kpis.revenue / 1000).toFixed(1) + 'K' : 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Views Chart */}
        <Card className="lg:col-span-2 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Monthly Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-end gap-3">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative w-full">
                    <div
                      className="mx-auto w-full max-w-12 rounded-t-lg bg-primary/20 transition-all duration-500 hover:bg-primary/30"
                      style={{ height: `${(data.views / maxViews) * 200}px` }}
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-12 rounded-t-lg bg-primary transition-all duration-700"
                        style={{ 
                          height: `${(data.leads / data.views) * 100}%`,
                          animationDelay: `${index * 100}ms`
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary/20" />
                <span className="text-muted-foreground">Total Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Converted to Leads</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Properties */}
        <Card className="animate-slide-up" style={{ animationDelay: "250ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Top Properties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProperties.length > 0 ? (
              topProperties.map((property, index) => (
                <div key={property.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{property.name}</p>
                      <p className="text-xs text-muted-foreground">{property.views} views</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{property.leads}</span>
                    {property.trend === "up" ? (
                      <ArrowUp className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8">
                No property data available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-success" />
            Revenue Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 overflow-x-auto pb-2">
            {monthlyData.length > 0 ? (
              monthlyData.map((data) => (
                <div key={data.month} className="flex min-w-[60px] flex-1 flex-col items-center gap-2">
                  <p className="text-sm font-medium">${(Math.round(data.revenue / 1000) || 0)}K</p>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-success/50 to-success/20 transition-all duration-500 hover:from-success/60 hover:to-success/30"
                    style={{ height: `${maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0}px` }}
                  />
                  <span className="text-xs text-muted-foreground">{data.month}</span>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-sm text-muted-foreground py-4">No revenue data available</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
