import { MapPin, Pencil, Eye, Trash2, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusConfig = {
  active: { label: "Active", variant: "active" },
  pending: { label: "Pending", variant: "pending" },
  sold: { label: "Sold", variant: "sold" },
};

export function PropertyCard({
  image,
  title,
  location,
  price,
  status,
  beds,
  baths,
  sqft,
  delay = 0,
}) {
  const statusInfo = statusConfig[status];

  return (
    <Card
      className="group animate-slide-up overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <Badge
          variant={statusInfo.variant}
          className="absolute left-3 top-3"
        >
          {statusInfo.label}
        </Badge>

        <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-card/90 backdrop-blur-sm"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-card/90 backdrop-blur-sm"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 overflow-hidden">
            <h3 className="truncate font-semibold text-foreground">
              {title}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{location}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Listing
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{beds} Beds</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{baths} Baths</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{sqft} sqft</span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
          <p className="text-lg font-semibold text-primary">{price}</p>
          <span className="text-xs text-muted-foreground">/ month</span>
        </div>
      </CardContent>
    </Card>
  );
}
