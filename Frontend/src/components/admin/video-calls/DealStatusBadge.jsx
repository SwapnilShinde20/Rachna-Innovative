import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Keep labels here (same values you had in types)
 * This preserves UI text exactly.
 */
const DEAL_STATUS_LABELS = {
  open: "Open",
  "in-discussion": "In Discussion",
  negotiation: "Negotiation",
  "deal-closed": "Deal Closed",
  "deal-dropped": "Deal Dropped",
};

const statusStyles = {
  open: "bg-primary/10 text-primary border-primary/20",
  "in-discussion":
    "bg-status-in-discussion/10 text-status-in-discussion border-status-in-discussion/20",
  negotiation:
    "bg-status-negotiation/10 text-status-negotiation border-status-negotiation/20",
  "deal-closed":
    "bg-status-deal-closed/10 text-status-deal-closed border-status-deal-closed/20",
  "deal-dropped":
    "bg-status-deal-dropped/10 text-status-deal-dropped border-status-deal-dropped/20",
};

export default function DealStatusBadge({ status, className }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border",
        statusStyles[status],
        className
      )}
    >
      {DEAL_STATUS_LABELS[status]}
    </Badge>
  );
}
