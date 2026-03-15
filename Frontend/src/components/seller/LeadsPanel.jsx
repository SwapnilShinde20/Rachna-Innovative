import { Clock, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";



const statusStyles = {
  new: { label: "New", variant: "new" },
  contacted: { label: "Contacted", variant: "warning" },
  closed: { label: "Closed", variant: "success" },
};

export function LeadsPanel() {
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['seller-leads'],
    queryFn: async () => {
      const { data } = await api.get('/sellers/me/leads');
      return data;
    }
  });
  return (
    <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Recent Leads</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="text-center text-sm text-muted-foreground p-4">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground p-4">
            No leads yet. Keep optimizing your listings!
          </div>
        ) : (
          leads.map((lead) => {
            const status = statusStyles[lead.status] || statusStyles.new;
            return (
              <div
                key={lead._id}
                className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-accent"
              >
                <img
                  src={lead.buyerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(lead.buyerName)}&background=random`}
                  alt={lead.buyerName}
                  className="h-10 w-10 rounded-full object-cover"
                />

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">
                      {lead.buyerName}
                    </p>
                    <Badge variant={status.variant} className="text-[10px]">
                      {status.label}
                    </Badge>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    Interested in {lead.propertyName}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
