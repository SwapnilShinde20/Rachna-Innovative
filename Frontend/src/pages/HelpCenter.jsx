import React from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Settings,
  Home,
  User,
  Wrench,
  FileText,
  LifeBuoy,
  ChevronRight,
  MessageCircle,
  HelpCircle,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "../components/buyer/Navbar";

// Using your specific color palette
const colors = {
  bg: "#F9FAFB",         // Neutral/Gray/50
  heroBg: "#0C1F55",     // Primary/Blue/900
  cardBorder: "#E5E7EB", // Neutral/Gray/200
  textMain: "#05070C",   // Text/Charcoal/900
  textSec: "#6B7280",    // Neutral/Gray/500
  primary: "#1F52D6",    // Primary/Blue/600
};

const helpCategories = [
  { icon: HelpCircle, title: "Popular Topics", desc: "Most frequently asked questions", bg: "#E6EFFF", color: "#1F52D6" }, // Blue/100 & Blue/600
  { icon: Settings, title: "Account Settings", desc: "Manage profile & preferences", bg: "#F1F3F5", color: "#4B5563" },     // Gray/100 & Gray/600
  { icon: Home, title: "Selling & Buying", desc: "Guides for transactions", bg: "#ECFDF5", color: "#059669" },             // Green/50 & Green/600
  { icon: User, title: "Your Account", desc: "Subscription & billing", bg: "#FEF3C7", color: "#D97706" },                  // Yellow/100 & Yellow/600
  { icon: FileText, title: "Legal & Policies", desc: "Terms & compliance", bg: "#EDEFF2", color: "#1F2937" },              // Charcoal/100 & Charcoal/600
  { icon: Wrench, title: "Technical Support", desc: "Troubleshoot issues", bg: "#CFE0FF", color: "#183EAA" },              // Blue/200 & Blue/700
];

const HelpCenter = () => {
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: colors.bg }}>
      <Navbar/>
      {/* --- HERO SECTION --- */}
      <div className="py-20 px-4 text-center" style={{ backgroundColor: colors.heroBg }}>
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#CFE0FF] text-xs font-bold uppercase tracking-widest mb-6">
            <LifeBuoy size={14} /> Support Hub
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-8">
            How can we help you?
          </h1>
          
          <div className="relative max-w-xl mx-auto flex items-center">
            <div className="absolute left-4 text-gray-400">
              <Search size={20} />
            </div>
            <input 
              type="text"
              placeholder="Search for articles (e.g. how to list...)"
              className="w-full pl-12 pr-4 py-4 rounded-lg border-0 shadow-lg text-base focus:ring-2 focus:ring-[#1F52D6] outline-none"
            />
            <Button className="absolute right-2 top-2 bottom-2" style={{ backgroundColor: colors.primary }}>
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        
        {/* --- TOP ACTIONS --- */}
        <div className="grid gap-6 md:grid-cols-3 mb-16">
          {/* Card 1: Live Chat */}
          <Card className="border shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: colors.cardBorder }}>
            <CardContent className="p-6">
              <div className="mb-4 p-3 w-fit rounded-lg bg-[#E6EFFF] text-[#1F52D6]">
                <MessageCircle size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: colors.textMain }}>Live Support</h3>
              <p className="text-sm mb-4" style={{ color: colors.textSec }}>
                Talk to our property experts right now.
              </p>
              <Button variant="outline" className="w-full border-gray-200 text-[#1F52D6]">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          {/* Card 2: Valuation */}
          <Card className="border shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: colors.cardBorder }}>
            <CardContent className="p-6">
              <div className="mb-4 p-3 w-fit rounded-lg bg-[#FFFBEB] text-[#D97706]">
                <Home size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: colors.textMain }}>Home Valuation</h3>
              <p className="text-sm mb-4" style={{ color: colors.textSec }}>
                Check your property's market value.
              </p>
              <Button variant="outline" className="w-full border-gray-200 text-[#374151]">
                Get Estimate
              </Button>
            </CardContent>
          </Card>

           {/* Card 3: Quick Start */}
           <Card className="border shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: colors.cardBorder }}>
            <CardContent className="p-6">
              <div className="mb-4 p-3 w-fit rounded-lg bg-[#F1F3F5] text-[#4B5563]">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: colors.textMain }}>Quick Guide</h3>
              <p className="text-sm mb-4" style={{ color: colors.textSec }}>
                Learn the basics of using the platform.
              </p>
              <Button variant="outline" className="w-full border-gray-200 text-[#374151]">
                Read Guide
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* --- CATEGORIES GRID --- */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold" style={{ color: colors.textMain }}>Browse Topics</h2>
          <Button variant="link" className="text-[#1F52D6]">View All</Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {helpCategories.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} to="#" className="group block h-full">
                <Card className="h-full border hover:border-[#9FC1FF] transition-colors shadow-sm" style={{ borderColor: colors.cardBorder }}>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="shrink-0 p-3 rounded-lg" style={{ backgroundColor: item.bg, color: item.color }}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1 group-hover:text-[#1F52D6] transition-colors" style={{ color: colors.textMain }}>
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: colors.textSec }}>
                        {item.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* --- SIMPLE FOOTER --- */}
      <div className="border-t py-16 bg-white" style={{ borderColor: colors.cardBorder }}>
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.textMain }}>Still have questions?</h2>
          <p className="mb-8" style={{ color: colors.textSec }}>
            Our support team is available 24/7 to help you.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" style={{ backgroundColor: colors.primary }}>
              Contact Support
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300">
              Visit Forum
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;