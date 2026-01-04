import { TrendingUp, Eye, MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const analyticsData = [
  { month: "Jan", views: 120, inquiries: 24 },
  { month: "Feb", views: 180, inquiries: 32 },
  { month: "Mar", views: 240, inquiries: 45 },
  { month: "Apr", views: 200, inquiries: 38 },
  { month: "May", views: 320, inquiries: 56 },
  { month: "Jun", views: 280, inquiries: 48 },
];

const maxViews = Math.max(...analyticsData.map((d) => d.views));

export function AnalyticsPanel() {
  return (
    <Card className="animate-slide-up" style={{ animationDelay: "400ms" }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Performance
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Mini Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-accent p-3">
            <div className="flex items-center gap-2 text-accent-foreground">
              <Eye className="h-4 w-4" />
              <span className="text-xs font-medium">Monthly Views</span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-foreground">1,847</p>
            <p className="text-xs text-success">+23% from last month</p>
          </div>

          <div className="rounded-xl bg-accent p-3">
            <div className="flex items-center gap-2 text-accent-foreground">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs font-medium">Inquiries</span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-foreground">243</p>
            <p className="text-xs text-success">+18% from last month</p>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Views over time
          </p>
          <div className="flex items-end gap-2">
            {analyticsData.map((data) => (
              <div
                key={data.month}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-t-md bg-primary/20 transition-all duration-500 hover:bg-primary/40"
                  style={{
                    height: `${(data.views / maxViews) * 80}px`,
                  }}
                >
                  <div
                    className="h-full w-full rounded-t-md bg-primary transition-all duration-300"
                    style={{
                      height: `${(data.inquiries / data.views) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {data.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Summary */}
        <div className="mt-6 rounded-xl border border-border/50 p-3">
          <p className="text-xs font-medium text-muted-foreground">
            Seller Rating
          </p>
          <div className="mt-2 flex items-center gap-3">
            <div className="text-3xl font-bold text-foreground">4.9</div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`h-5 w-5 ${
                    star <= 4
                      ? "fill-warning text-warning"
                      : "fill-warning/50 text-warning/50"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              (128 reviews)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
