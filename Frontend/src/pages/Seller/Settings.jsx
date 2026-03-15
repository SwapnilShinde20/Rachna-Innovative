import { useState, useEffect, useRef } from "react";
import { User, Shield, Bell, CreditCard, Palette, Camera, Save, CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "preferences", label: "Preferences", icon: Palette },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const { data: seller, isLoading: isFetching } = useQuery({
    queryKey: ['seller', 'me'],
    queryFn: async () => {
      const { data } = await api.get('/sellers/me');
      return data;
    },
    retry: false
  });

  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    phone: "",
    address: "",
    gstNumber: "",
    licenseNumber: "",
    yearsExperience: "",
    logoUrl: "",
  });

  // Effect to load initial data
  useEffect(() => {
    if (seller) {
      setFormData({
        companyName: seller.companyName || "",
        contactName: seller.contactName || "",
        phone: seller.phone || "",
        address: seller.address || "",
        gstNumber: seller.gstNumber || "",
        licenseNumber: seller.licenseNumber || "",
        yearsExperience: seller.yearsExperience || "",
        logoUrl: seller.logoUrl || "",
      });
    }
  }, [seller]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Image must be under 5MB", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, logoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/sellers', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'me'] });
      toast({
        title: "Profile Updated",
        description: "Your business profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <Card className="lg:w-64">
          <CardContent className="p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* PROFILE */}
          {activeTab === "profile" && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal details and public profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef} 
                      accept="image/jpeg, image/png, image/webp"
                      onChange={handleImageChange}
                    />
                    {formData.logoUrl ? (
                      <img
                        src={formData.logoUrl}
                        alt="Company Logo"
                        className="h-20 w-20 rounded-2xl object-cover border-2 border-primary/20 bg-white"
                      />
                    ) : (
                      <CircleUserRound className="h-20 w-20 text-muted-foreground border-2 border-primary/20 rounded-2xl shadow-sm bg-white" strokeWidth={1} />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                    <button type="button" className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg lg:hidden pointer-events-none">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <p className="font-medium">Company Logo</p>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </div>

                <Separator />

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company / Agency Name</Label>
                      <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Person Name</Label>
                      <Input id="contactName" name="contactName" value={formData.contactName} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearsExperience">Years of Experience</Label>
                      <Input id="yearsExperience" name="yearsExperience" type="number" value={formData.yearsExperience} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Office Address</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="gstNumber">GST Number</Label>
                      <Input id="gstNumber" name="gstNumber" value={formData.gstNumber} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">RERA / License Number</Label>
                      <Input id="licenseNumber" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} />
                    </div>
                  </div>

                  <Button type="submit" variant="premium" className="gap-2" disabled={updateProfileMutation.isPending || isFetching}>
                    <Save className="h-4 w-4" />
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* SECURITY */}
          {activeTab === "security" && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Account & Security</CardTitle>
                <CardDescription>
                  Manage your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Change Password</h4>
                  <div className="space-y-3">
                    <Input placeholder="Current Password" type="password" />
                    <Input placeholder="New Password" type="password" />
                    <Input placeholder="Confirm New Password" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between rounded-xl border p-4">
                  <div>
                    <p className="font-medium">Enable 2FA</p>
                    <p className="text-sm text-muted-foreground">
                      Add extra security to your account
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "New Leads",
                  "Messages",
                  "Property Views",
                  "Marketing Emails",
                  "Price Alerts",
                ].map((title, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border p-4"
                  >
                    <p className="font-medium">{title}</p>
                    <Switch defaultChecked={index < 3} />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* BILLING */}
          {activeTab === "billing" && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Payment & Billing</CardTitle>
                <CardDescription>
                  Manage your subscription and payment methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-xl border bg-accent/50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Pro Plan</p>
                    <Button variant="outline">Manage Plan</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* PREFERENCES */}
          {activeTab === "preferences" && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Select defaultValue="en">
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="premium" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
