import { useState } from "react";
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

const amenities = [
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

export default function AddProperty() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
  ]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Add New Property
        </h1>
        <p className="text-sm text-muted-foreground">
          Fill in the details to list your property
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
                  <Input id="title" placeholder="e.g., Luxury Beachfront Villa" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Property Type</Label>
                  <Select>
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
                <Input id="address" placeholder="123 Ocean Drive" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Miami Beach" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="FL" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" placeholder="33139" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="beds">Bedrooms</Label>
                  <Input id="beds" type="number" placeholder="4" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="baths">Bathrooms</Label>
                  <Input id="baths" type="number" placeholder="3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sqft">Square Feet</Label>
                  <Input id="sqft" type="number" placeholder="2500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parking">Parking Spots</Label>
                  <Input id="parking" type="number" placeholder="2" />
                </div>
              </div>
              <div className="space-y-3">
                <Label>Amenities</Label>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                        selectedAmenities.includes(amenity)
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
                <Label>Property Images</Label>
                <div className="grid gap-4 sm:grid-cols-3">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="group relative aspect-video overflow-hidden rounded-xl">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      <button
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-accent/50 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-accent">
                    <Upload className="h-8 w-8" />
                    <span className="text-sm font-medium">Upload Images</span>
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <Label>Video Tour (Optional)</Label>
                <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-accent/50 text-muted-foreground">
                  <Image className="h-8 w-8" />
                  <span className="text-sm font-medium">Drag & drop or click to upload video</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Monthly Rent ($)</Label>
                  <Input id="price" type="number" placeholder="4500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit">Security Deposit ($)</Label>
                  <Input id="deposit" type="number" placeholder="9000" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="available">Available From</Label>
                  <Input id="available" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lease">Minimum Lease</Label>
                  <Select>
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
                <Checkbox id="utilities" />
                <label htmlFor="utilities" className="text-sm font-medium">
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
            <Button variant="premium">Publish Property</Button>
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
