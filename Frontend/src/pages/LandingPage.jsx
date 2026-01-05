import { Link } from "react-router-dom";
import { 
  Search, 
  ShieldCheck, 
  Home, 
  Users, 
  Zap, 
  ArrowRight, 
  Star,
  MapPin,
  Building2,
  Handshake,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Featured properties data
const featuredProperties = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    title: "Sunset Villa",
    location: "Miami Beach, FL",
    price: "$4,500",
    rating: 4.9,
    type: "Villa",
    beds: 4,
    baths: 3,
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    title: "Ocean View Apartment",
    location: "Key Biscayne, FL",
    price: "$3,200",
    rating: 4.8,
    type: "Apartment",
    beds: 3,
    baths: 2,
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    title: "Modern Loft",
    location: "Downtown Miami, FL",
    price: "$2,800",
    rating: 4.7,
    type: "Loft",
    beds: 2,
    baths: 2,
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
    title: "Garden Estate",
    location: "Coral Gables, FL",
    price: "$5,800",
    rating: 5.0,
    type: "Estate",
    beds: 5,
    baths: 4,
  },
];

// Why choose us features
const features = [
  {
    icon: ShieldCheck,
    title: "Verified Agents",
    description: "All agents are background-checked and certified professionals",
    iconColor: "bg-primary/10 text-primary",
  },
  {
    icon: Home,
    title: "Premium Listings",
    description: "Curated selection of high-quality properties in top locations",
    iconColor: "bg-success/10 text-success",
  },
  {
    icon: Zap,
    title: "Smart Search",
    description: "AI-powered search to find your perfect property match",
    iconColor: "bg-warning/10 text-warning",
  },
  {
    icon: Users,
    title: "Trusted Platform",
    description: "Over 50,000 happy customers and growing every day",
    iconColor: "bg-accent text-accent-foreground",
  },
];

// How it works steps
const steps = [
  {
    number: "01",
    icon: Search,
    title: "Search Properties",
    description: "Browse our extensive collection of premium properties using smart filters",
  },
  {
    number: "02",
    icon: Handshake,
    title: "Connect with Agent",
    description: "Get in touch with verified agents who match your requirements",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Visit & Close Deal",
    description: "Schedule visits, negotiate terms, and finalize your dream property",
  },
];

// Testimonials
const testimonials = [
  {
    id: "1",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    name: "Sarah Johnson",
    role: "Home Buyer",
    rating: 5,
    quote: "EstateEase made finding our dream home so simple. The agents were professional and the process was seamless.",
  },
  {
    id: "2",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    name: "Michael Chen",
    role: "Property Investor",
    rating: 5,
    quote: "As an investor, I appreciate the detailed analytics and verified listings. Best platform I've used.",
  },
  {
    id: "3",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    name: "Emily Rodriguez",
    role: "First-time Buyer",
    rating: 5,
    quote: "The step-by-step guidance and responsive support team helped me navigate my first purchase confidently.",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">Rachna Innovative</span>
          </Link>
          
          <div className="hidden items-center gap-6 md:flex">
            <a href="#properties" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Properties</a>
            <a href="#why-us" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Why Us</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">How It Works</a>
            <a href="#testimonials" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Reviews</a>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 lg:px-6 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-in">
            <Badge variant="secondary" className="mb-4">
              #1 Real Estate Platform
            </Badge>
            <h1 className="text-4xl font-bold leading-tight text-foreground lg:text-5xl xl:text-6xl">
              Find Your
              <span className="text-primary"> Perfect </span>
              Home Today
            </h1>
            <p className="mt-4 text-lg text-muted-foreground lg:text-xl">
              Discover premium properties with verified agents. Your dream home is just a search away.
            </p>

            {/* Search Bar */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search by location, property type..." 
                  className="h-12 pl-12 text-base"
                />
              </div>
              <Button className="h-12 px-8">
                Browse Properties
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 flex flex-wrap gap-8">
              <div>
                <p className="text-2xl font-bold text-foreground">15K+</p>
                <p className="text-sm text-muted-foreground">Properties Listed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">2K+</p>
                <p className="text-sm text-muted-foreground">Verified Agents</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-slide-up">
            <div className="absolute -inset-4 rounded-3xl bg-primary/5" />
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
              alt="Luxury property"
              className="relative rounded-2xl shadow-elevated"
            />
            {/* Floating Card */}
            <Card className="absolute -bottom-6 -left-6 hidden animate-scale-in shadow-lg sm:block">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">200+ Properties</p>
                  <p className="text-xs text-muted-foreground">Sold this month</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="bg-secondary/30 px-4 py-16 lg:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Featured Properties</h2>
              <p className="mt-2 text-muted-foreground">Hand-picked premium listings for you</p>
            </div>
            <Button variant="ghost" className="hidden gap-2 sm:flex">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProperties.map((property, index) => (
              <Card 
                key={property.id} 
                className="group animate-slide-up overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <Badge className="absolute left-3 top-3 bg-card/90 text-foreground backdrop-blur-sm">
                    {property.type}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="truncate font-semibold text-foreground">{property.title}</h3>
                      <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{property.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="text-sm font-medium">{property.rating}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{property.beds} Beds</span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span>{property.baths} Baths</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
                    <p className="text-lg font-semibold text-primary">{property.price}</p>
                    <span className="text-xs text-muted-foreground">/ month</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="px-4 py-16 lg:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-foreground">Why Choose EstateEase</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              We provide the best real estate experience with our trusted platform
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="animate-slide-up text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="flex flex-col items-center p-6">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${feature.iconColor}`}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-secondary/30 px-4 py-16 lg:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              Three simple steps to find your dream property
            </p>
          </div>

          <div className="relative grid gap-8 lg:grid-cols-3">
            {/* Connecting Line */}
            <div className="absolute left-1/2 top-16 hidden h-0.5 w-2/3 -translate-x-1/2 bg-border lg:block" />
            
            {steps.map((step, index) => (
              <div 
                key={step.title} 
                className="relative animate-slide-up text-center"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                  <step.icon className="h-7 w-7" />
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-card text-xs font-bold text-primary shadow-md">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller CTA */}
      <section className="px-4 py-16 lg:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <Card className="gradient-primary overflow-hidden">
            <CardContent className="flex flex-col items-center gap-6 p-8 text-center lg:flex-row lg:p-12 lg:text-left">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-primary-foreground lg:text-3xl">
                  Are you a Property Owner or Agent?
                </h2>
                <p className="mt-2 text-primary-foreground/80">
                  List your properties on EstateEase and reach thousands of potential buyers
                </p>
              </div>
              <Button 
                variant="secondary" 
                size="lg" 
                className="gap-2 bg-card text-primary hover:bg-card/90"
                asChild
              >
                <Link to="/dashboard">
                  List Your Property <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-secondary/30 px-4 py-16 lg:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-foreground">What Our Customers Say</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              Trusted by thousands of happy homeowners and investors
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-12 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                  <Building2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold text-foreground">EstateEase</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                Your trusted partner in finding the perfect property. Premium listings, verified agents.
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-foreground">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#properties" className="hover:text-foreground">Properties</a></li>
                <li><a href="#why-us" className="hover:text-foreground">About Us</a></li>
                <li><Link to="/dashboard" className="hover:text-foreground">For Sellers</Link></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-foreground">Property Types</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Apartments</a></li>
                <li><a href="#" className="hover:text-foreground">Villas</a></li>
                <li><a href="#" className="hover:text-foreground">Commercial</a></li>
                <li><a href="#" className="hover:text-foreground">Land</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-foreground">Contact Us</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>hello@rachnainnovative.com</li>
                <li>+1 (555) 123-4567</li>
                <li>Andheri, Mumbai</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2026 RachnaInnovative. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
