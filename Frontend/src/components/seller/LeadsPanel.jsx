import { Clock, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const leads = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    property: "Sunset Villa",
    date: "2 hours ago",
    status: "new",
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    property: "Ocean View Apartment",
    date: "5 hours ago",
    status: "contacted",
  },
  {
    id: "3",
    name: "Emily Davis",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    property: "Modern Loft",
    date: "1 day ago",
    status: "closed",
  },
  {
    id: "4",
    name: "Robert Martinez",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    property: "Garden Estate",
    date: "2 days ago",
    status: "new",
  },
];

const statusStyles = {
  new: { label: "New", variant: "new" },
  contacted: { label: "Contacted", variant: "warning" },
  closed: { label: "Closed", variant: "success" },
};

export function LeadsPanel() {
  return (
    <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Recent Leads</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {leads.map((lead) => {
          const status = statusStyles[lead.status];

          return (
            <div
              key={lead.id}
              className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-accent"
            >
              <img
                src={lead.avatar}
                alt={lead.name}
                className="h-10 w-10 rounded-full object-cover"
              />

              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {lead.name}
                  </p>
                  <Badge variant={status.variant} className="text-[10px]">
                    {status.label}
                  </Badge>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  Interested in {lead.property}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{lead.date}</span>
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
        })}
      </CardContent>
    </Card>
  );
}
