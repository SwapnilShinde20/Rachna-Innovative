import {
  Star,
  MapPin,
  Calendar,
  BadgeCheck,
  Mail,
  Phone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SellerProfileCard() {
  return (
    <Card className="overflow-hidden">
      <div className="gradient-primary h-24" />

      <CardContent className="relative pt-0">
        <div className="-mt-12 flex flex-col items-center text-center sm:flex-row sm:items-end sm:text-left">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
              alt="James Wilson"
              className="h-24 w-24 rounded-2xl border-4 border-card object-cover shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-md">
              <BadgeCheck className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>

          <div className="mt-4 flex-1 sm:ml-5 sm:mt-0">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  James Wilson
                </h2>
                <p className="text-sm text-muted-foreground">
                  Verified Property Agent
                </p>
              </div>
              <Badge variant="success" className="sm:ml-auto">
                Active
              </Badge>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>Miami, FL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-medium text-foreground">4.9</span>
                <span>(128 reviews)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>8 years experience</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2 sm:mt-0">
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4" />
              Contact Support
            </Button>
            <Button size="sm">Edit Profile</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
