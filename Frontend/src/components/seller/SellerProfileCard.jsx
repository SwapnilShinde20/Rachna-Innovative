import {
  Star,
  MapPin,
  Calendar,
  BadgeCheck,
  Mail,
  Phone,
  CircleUserRound,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "../../stores/authStore";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function SellerProfileCard({ onEditProfile }) {
  const { user } = useAuthStore();
  
  const { data: seller } = useQuery({
    queryKey: ['seller', 'me'],
    queryFn: async () => {
      const { data } = await api.get('/sellers/me');
      return data;
    },
    retry: false
  });

  return (
    <Card className="overflow-hidden">
      <div className="gradient-primary h-24" />

      <CardContent className="relative pt-0">
        <div className="-mt-12 flex flex-col items-center text-center sm:flex-row sm:items-end sm:text-left">
          <div className="relative">
            {seller?.logoUrl ? (
              <img 
                src={seller.logoUrl} 
                alt="Company Logo" 
                className="h-24 w-24 object-cover border-4 border-card rounded-2xl shadow-lg bg-white" 
              />
            ) : (
              <CircleUserRound className="h-24 w-24 text-muted-foreground border-4 border-card rounded-2xl shadow-lg bg-white" strokeWidth={1} />
            )}
            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-md">
              <BadgeCheck className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>

          <div className="mt-4 flex-1 sm:ml-5 sm:mt-0">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {seller?.companyName || user?.name || 'Seller'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {seller?.contactName ? `Contact: ${seller.contactName}` : 'Verified Property Agent'}
                </p>
              </div>
              <Badge variant={seller?.status === 'approved' ? 'success' : 'secondary'} className="sm:ml-auto">
                {seller?.status ? seller.status.charAt(0).toUpperCase() + seller.status.slice(1) : 'Active'}
              </Badge>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{seller?.address || 'Location Unavailable'}</span>
              </div>
              {seller?.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  <span>{seller.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-medium text-foreground">4.9</span>
                <span>(128 reviews)</span>
              </div>
              {seller?.yearsExperience && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{seller.yearsExperience} years experience</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-2 sm:mt-0">
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4" />
              Contact Support
            </Button>
            <Button size="sm" onClick={onEditProfile}>Edit Profile</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
