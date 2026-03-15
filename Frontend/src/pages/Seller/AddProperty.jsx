import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  Image,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, name: "Details", description: "Property information" },
  { id: 2, name: "Features", description: "Rooms & amenities" },
  { id: 3, name: "Media", description: "Photos & videos" },
  { id: 4, name: "Pricing", description: "Price & availability" },
];

const amenitiesList = [
  "Swimming Pool",
  "Gym",
  "Parking",
  "Security",
  "Garden",
  "Balcony",
  "AC",
  "Heating",
  "Laundry",
  "Pet Friendly",
  "Furnished",
  "Smart Home",
  "Ocean View",
  "City View",
];

export default function AddProperty({ onSuccess, editProperty }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const isEditing = !!editProperty;

  // Form State
  const [formData, setFormData] = useState({
    title: editProperty?.title || "",
    type: editProperty?.type || "",
    address: editProperty?.location || "",
    city: editProperty?.city || "",
    state: editProperty?.state || "",
    zip: editProperty?.zip || "",
    description: editProperty?.description || "",
    bedrooms: editProperty?.bedrooms || "",
    bathrooms: editProperty?.bathrooms || "",
    area: editProperty?.area || "",
    parking: editProperty?.parking || "",
    amenities: editProperty?.amenities || [],
    price: editProperty?.price || "",
    deposit: editProperty?.deposit || "",
    availableFrom: editProperty?.availableFrom ? editProperty.availableFrom.slice(0, 10) : "",
    minLease: editProperty?.minLease || "",
    utilitiesIncluded: editProperty?.utilitiesIncluded || false,
    images: editProperty?.images || [],
  });

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageFiles = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 10) {
      toast({ title: "Maximum 10 images allowed", variant: "destructive" });
      return;
    }
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: `${file.name} is too large (max 5MB)`, variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
    // Reset file input so the same file can be re-selected
    e.target.value = '';
  };

  const removeImage = (index) => {
      setFormData(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index)
      }));
  };

  const mutation = useMutation({
      mutationFn: async (data) => {
          const payload = {
              title: data.title,
              description: data.description,
              type: data.type,
              price: Number(data.price),
              location: data.address,
              city: data.city,
              state: data.state,
              zip: data.zip,
              bedrooms: Number(data.bedrooms) || undefined,
              bathrooms: Number(data.bathrooms) || undefined,
              area: Number(data.area) || undefined,
              parking: Number(data.parking) || undefined,
              amenities: data.amenities,
              images: data.images,
              deposit: Number(data.deposit) || undefined,
              availableFrom: data.availableFrom || undefined,
              minLease: data.minLease || undefined,
              utilitiesIncluded: data.utilitiesIncluded,
          };
          return isEditing
            ? await api.put(`/properties/${editProperty._id}`, payload)
            : await api.post('/properties', payload);
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['properties'] });
          toast({ title: isEditing ? "Property updated!" : "Property submitted for verification!", description: isEditing ? "Changes saved successfully." : "Admin will review your property shortly." });
          if (onSuccess) {
            onSuccess();
          } else {
            navigate('/dashboard');
          }
      },
      onError: (error) => {
          console.error("Failed to submit property:", error);
          toast({ title: "Failed to submit property", description: error.response?.data?.message || "Something went wrong.", variant: "destructive" });
      }
  });

  const handleSubmit = () => {
      // Basic validation
      if (!formData.title || !formData.type || !formData.price) {
        toast({ title: "Please fill in required fields", description: "Title, Type, and Price are required.", variant: "destructive" });
        return;
      }
      mutation.mutate(formData);
  };


  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          {isEditing ? "Edit Property" : "Add New Property"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isEditing ? "Update your property details" : "Fill in the details to list your property"}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="relative">
        <div className="absolute left-0 top-5 h-0.5 w-full bg-border">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 bg-card text-sm font-medium transition-all",
                  currentStep > step.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : currentStep === step.id
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </div>

              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    currentStep >= step.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.name}
                </p>
                <p className="hidden text-xs text-muted-foreground sm:block">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
       <Card>
        <CardContent className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title</Label>
                  <Input id="title" placeholder="e.g., Luxury Beachfront Villa" value={formData.title} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Property Type</Label>
                  <Select onValueChange={(val) => handleSelectChange('type', val)} value={formData.type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" placeholder="123 Ocean Drive" value={formData.address} onChange={handleChange} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Miami Beach" value={formData.city} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="FL" value={formData.state} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" placeholder="33139" value={formData.zip} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property..."
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input id="bedrooms" type="number" placeholder="4" value={formData.bedrooms} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input id="bathrooms" type="number" placeholder="3" value={formData.bathrooms} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Square Feet</Label>
                  <Input id="area" type="number" placeholder="2500" value={formData.area} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parking">Parking Spots</Label>
                  <Input id="parking" type="number" placeholder="2" value={formData.parking} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-3">
                <Label>Amenities</Label>
                <div className="flex flex-wrap gap-2">
                  {amenitiesList.map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                        formData.amenities.includes(amenity)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-3">
                <Label>Property Images <span className="text-muted-foreground font-normal">({formData.images.length}/10)</span></Label>
                <div className="grid gap-4 sm:grid-cols-3">
                  {formData.images.map((img, index) => (
                    <div key={index} className="group relative aspect-video overflow-hidden rounded-xl">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      <button
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  {formData.images.length < 10 && (
                    <div 
                      className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-accent/50 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-accent p-4"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        accept="image/jpeg, image/png, image/webp"
                        multiple
                        onChange={handleImageFiles}
                      />
                      <Upload className="h-8 w-8" />
                      <p className="text-sm font-medium">Click to upload</p>
                      <p className="text-xs">JPEG, PNG or WEBP (max 5MB each)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Monthly Rent ($)</Label>
                  <Input id="price" type="number" placeholder="4500" value={formData.price} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit">Security Deposit ($)</Label>
                  <Input id="deposit" type="number" placeholder="9000" value={formData.deposit} onChange={handleChange} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="availableFrom">Available From</Label>
                  <Input id="availableFrom" type="date" value={formData.availableFrom} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minLease">Minimum Lease</Label>
                  <Select onValueChange={(val) => handleSelectChange('minLease', val)} value={formData.minLease}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="12">12 Months</SelectItem>
                      <SelectItem value="24">24 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="utilitiesIncluded" checked={formData.utilitiesIncluded} onCheckedChange={(checked) => setFormData(p => ({...p, utilitiesIncluded: checked}))}/>
                <label htmlFor="utilitiesIncluded" className="text-sm font-medium">
                  Utilities included in rent
                </label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button variant="outline">Save Draft</Button>
          {currentStep === steps.length ? (
            <Button variant="premium" onClick={handleSubmit} disabled={isSubmitting || mutation.isPending}>
              {isSubmitting || mutation.isPending ? "Submitting..." : isEditing ? "Update Property" : "Submit for Verification"}
            </Button>
          ) : (
            <Button onClick={() => setCurrentStep((prev) => prev + 1)}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
