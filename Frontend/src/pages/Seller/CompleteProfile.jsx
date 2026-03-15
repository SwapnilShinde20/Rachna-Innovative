import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import api from "@/lib/api";
import { Building2, Phone, MapPin, FileText, User, ArrowRight, CheckCircle, Camera, CircleUserRound, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function CompleteProfile() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    companyName: "",
    contactName: user?.name || "",
    phone: "",
    email: user?.email || "",
    address: "",
    gstNumber: "",
    licenseNumber: "",
    yearsExperience: "",
    logoUrl: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/sellers", formData);

      // Update the auth store to reflect profileCompleted
      useAuthStore.setState((state) => ({
        user: { ...state.user, profileCompleted: true },
      }));

      toast({
        title: "Profile Completed!",
        description: "Your seller profile has been set up successfully.",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { name: "companyName", label: "Company / Agency Name", icon: Building2, placeholder: "e.g. Rachna Properties Pvt. Ltd.", required: true },
    { name: "contactName", label: "Contact Person Name", icon: User, placeholder: "Full name" },
    { name: "phone", label: "Phone Number", icon: Phone, placeholder: "+91 98765 43210", required: true },
    { name: "email", label: "Business Email", icon: null, placeholder: "business@example.com", type: "email" },
    { name: "address", label: "Office Address", icon: MapPin, placeholder: "Full office address", required: true },
    { name: "yearsExperience", label: "Years of Experience", icon: Calendar, placeholder: "e.g. 5", type: "number" },
    { name: "gstNumber", label: "GST Number", icon: FileText, placeholder: "e.g. 22AAAAA0000A1Z5" },
    { name: "licenseNumber", label: "RERA / License Number", icon: FileText, placeholder: "e.g. MAHARERA P12345678" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-500 mt-2">
            Set up your seller profile to start listing properties
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-lg">Business Information</CardTitle>
            <CardDescription>
              Fill in your business details. This information will be visible on your dashboard and listings.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Logo Upload Section */}
              <div className="flex flex-col items-center justify-center mb-6">
                <div 
                  className="relative group cursor-pointer" 
                  onClick={() => fileInputRef.current?.click()}
                >
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
                      className="h-24 w-24 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
                    />
                  ) : (
                    <CircleUserRound className="h-24 w-24 text-muted-foreground border-4 border-white rounded-2xl shadow-lg bg-white" strokeWidth={1} />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <button type="button" className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg lg:hidden pointer-events-none">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-3 font-medium">Upload Company Logo</p>
              </div>

              {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name} className="text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <div className="relative">
                    {field.icon && (
                      <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    )}
                    <Input
                      id={field.name}
                      name={field.name}
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required={field.required}
                      className={field.icon ? "pl-10" : ""}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full gap-2 h-12 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Saving..."
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Complete Profile & Continue
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
