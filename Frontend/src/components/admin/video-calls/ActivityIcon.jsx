import {
  MapPin,
  Phone,
  Handshake,
  FileText,
  IndianRupee,
  TrendingUp,
  Clock,
  MoreHorizontal,
} from "lucide-react";

const iconConfig = {
  "site-visit": {
    icon: MapPin,
    className: "bg-timeline-site-visit/10 text-timeline-site-visit",
  },
  "phone-call": {
    icon: Phone,
    className: "bg-timeline-phone-call/10 text-timeline-phone-call",
  },
  negotiation: {
    icon: Handshake,
    className: "bg-timeline-negotiation/10 text-timeline-negotiation",
  },
  "document-shared": {
    icon: FileText,
    className: "bg-timeline-document/10 text-timeline-document",
  },
  "price-discussion": {
    icon: IndianRupee,
    className: "bg-timeline-price/10 text-timeline-price",
  },
  "deal-progress": {
    icon: TrendingUp,
    className: "bg-timeline-deal/10 text-timeline-deal",
  },
  "follow-up": {
    icon: Clock,
    className: "bg-timeline-followup/10 text-timeline-followup",
  },
  other: {
    icon: MoreHorizontal,
    className: "bg-timeline-other/10 text-timeline-other",
  },
};

export default function ActivityIcon({ type, className = "" }) {
  const config = iconConfig[type] || iconConfig.other;
  const Icon = config.icon;

  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full ${config.className} ${className}`}
    >
      <Icon className="h-5 w-5" />
    </div>
  );
}
