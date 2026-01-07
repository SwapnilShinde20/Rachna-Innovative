import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Share2, 
  Quote, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Copy,
  Check,
  ChevronRight,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "../components/buyer/Navbar";

// --- COLORS CONSTANTS ---
const colors = {
  bg: "#F9FAFB",         // Neutral/Gray/50
  cardBg: "#FFFFFF",
  primary: "#1F52D6",    // Blue/600
  primaryDark: "#0C1F55", // Blue/900
  textMain: "#05070C",   // Charcoal/900
  textBody: "#4B5563",   // Gray/600
  textLight: "#9CA3AF",  // Gray/400
  accentBg: "#F2F7FF",   // Blue/50
  border: "#E5E7EB",     // Gray/200
  quoteBorder: "#1F52D6",
};

const blogPost = {
  id: "1",
  title: "Unlocking Value: 5 Smart Upgrades Before Selling",
  subtitle: "Strategic renovations that yield the highest return on investment in today's shifting market.",
  author: "Johnathan Doe",
  authorRole: "Senior Property Analyst",
  date: "Jan 12, 2024",
  readTime: "6 min read",
  category: "Selling Guide",
  tags: ["Renovation", "Market Value", "Selling Tips"],
  image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=600&fit=crop",
  content: [
    "Maximizing your property's value doesn't always require a total overhaul. Often, the most significant returns come from strategic minor upgrades that catch the modern buyer's eye. The goal is to eliminate friction points that might give a buyer pause.",
    "First, focus on 'Curb Appeal'. Statistics show that landscaping and exterior lighting can increase perceived value by up to 7%. It is the first thing a buyer sees, and it sets the emotional tone for the entire viewing.",
    "Inside, consider updating fixtures in the kitchen and bathroom—the two rooms that hold the most weight in a buyer's decision. You don't need to replace the cabinets; often, new handles, a modern faucet, and fresh lighting can make a 10-year-old kitchen look brand new.",
    "Finally, emphasize smart home integration. Installing a smart thermostat or security system suggests a well-maintained, modern home that is ready for the future."
  ],
  galleryImages: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&fit=crop",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&fit=crop",
  ],
  quote: "The key to selling fast is creating a space where buyers can immediately see their own future, not your past.",
};

const relatedPosts = [
  { title: "Understanding Closing Costs", date: "Jan 10, 2024", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&fit=crop" },
  { title: "Is 2024 the Right Time to Buy?", date: "Jan 05, 2024", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&fit=crop" }
];

const BlogDetail = () => {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-[#CFE0FF] selection:text-[#0C1F55]" style={{ backgroundColor: colors.bg }}>
      <Navbar />

      {/* --- READING PROGRESS BAR --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
        style={{ scaleX, backgroundColor: colors.primary }}
      />

      {/* --- HERO HEADER --- */}
      <div className="pt-2 pb-12 lg:pt-12">
        
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <Link to="/blogs" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-8 transition-colors group">
          <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Insights
        </Link>
          <div className="flex justify-center mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#E6EFFF] text-[#1F52D6]">
              {blogPost.category}
            </span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] mb-6 tracking-tight"
            style={{ color: colors.textMain }}
          >
            {blogPost.title}
          </motion.h1>

          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: colors.textBody }}>
            {blogPost.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm border-t border-b py-6" style={{ borderColor: colors.border, color: colors.textBody }}>
            
             <div className="flex items-center gap-2">
               <div className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                  <img src="https://i.pravatar.cc/100?img=11" alt="Author" />
               </div>
               <div className="text-left">
                  <p className="font-bold text-[#05070C] leading-none">{blogPost.author}</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">{blogPost.authorRole}</p>
               </div>
             </div>
             <div className="hidden md:block w-px h-8 bg-gray-200" />
             <div className="flex items-center gap-2">
               <Calendar size={16} className="text-[#1F52D6]" /> <span>{blogPost.date}</span>
             </div>
             <div className="flex items-center gap-2">
               <Clock size={16} className="text-[#1F52D6]" /> <span>{blogPost.readTime}</span>
             </div>
          </div>
        </div>
      </div>

      {/* --- FEATURED IMAGE --- */}
      <div className="mx-auto max-w-6xl px-4 lg:px-8 mb-16">
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.2 }}
           className="rounded-[2rem] overflow-hidden shadow-2xl relative"
        >
          <img src={blogPost.image} alt="Hero" className="w-full h-[400px] lg:h-[600px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </motion.div>
      </div>

      {/* --- MAIN CONTENT LAYOUT --- */}
      <div className="mx-auto max-w-6xl px-4 lg:px-8 pb-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          
          {/* LEFT: SOCIAL SIDEBAR (Desktop) / TOP (Mobile) */}
          <div className="hidden lg:block lg:col-span-1">
             <div className="sticky top-32 flex flex-col gap-4 items-center">
                <button className="p-3 rounded-full bg-white shadow-sm border border-gray-100 text-gray-500 hover:text-[#1F52D6] hover:-translate-y-1 transition-all">
                  <Facebook size={20} />
                </button>
                <button className="p-3 rounded-full bg-white shadow-sm border border-gray-100 text-gray-500 hover:text-[#1F52D6] hover:-translate-y-1 transition-all">
                  <Twitter size={20} />
                </button>
                <button className="p-3 rounded-full bg-white shadow-sm border border-gray-100 text-gray-500 hover:text-[#1F52D6] hover:-translate-y-1 transition-all">
                  <Linkedin size={20} />
                </button>
                <div className="w-8 h-px bg-gray-200 my-2" />
                <button onClick={handleCopy} className="p-3 rounded-full bg-white shadow-sm border border-gray-100 text-gray-500 hover:text-[#1F52D6] transition-all relative">
                  {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                </button>
             </div>
          </div>

          {/* MIDDLE: ARTICLE CONTENT */}
          <div className="lg:col-span-8">
            <div className="prose prose-lg prose-slate max-w-none">
              <p className="lead text-xl md:text-2xl font-medium leading-relaxed mb-10" style={{ color: colors.textMain }}>
                 {blogPost.content[0]}
              </p>
              
              <p className="text-[#4B5563] mb-8">{blogPost.content[1]}</p>
              
              {/* Pull Quote */}
              <div className="my-12 relative p-8 md:p-12 bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#1F52D6]" />
                <Quote className="absolute top-8 left-8 text-[#E6EFFF] h-16 w-16 -z-0" />
                <p className="relative z-10 text-2xl font-bold italic leading-relaxed" style={{ color: colors.textMain }}>
                  "{blogPost.quote}"
                </p>
              </div>

              <p className="text-[#4B5563] mb-8">{blogPost.content[2]}</p>
              
              {/* Mini Gallery */}
              <div className="grid md:grid-cols-2 gap-6 my-12">
                {blogPost.galleryImages.map((img, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-2xl shadow-md">
                    <img src={img} className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Interior" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              <p className="text-[#4B5563] mb-8">{blogPost.content[3]}</p>

              {/* Tags */}
              <div className="mt-12 flex flex-wrap gap-2">
                {blogPost.tags.map(tag => (
                  <span key={tag} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-[#1F52D6] hover:text-white transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Author Box */}
            <div className="mt-16 p-8 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
               <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 shrink-0">
                 <img src="https://i.pravatar.cc/100?img=11" alt="Author" className="w-full h-full object-cover" />
               </div>
               <div className="flex-1">
                 <h3 className="text-xl font-bold text-[#05070C] mb-2">Written by {blogPost.author}</h3>
                 <p className="text-gray-500 mb-4">
                   Specializing in residential market analysis and strategic property enhancements. Helping homeowners maximize value for over 10 years.
                 </p>
                 <Button variant="link" className="text-[#1F52D6] p-0 h-auto font-semibold">
                   View Profile <ArrowRightIcon className="ml-1 w-4 h-4" />
                 </Button>
               </div>
            </div>

            {/* CTA Block */}
            <div className="mt-12 rounded-[2rem] p-10 md:p-12 text-center relative overflow-hidden" style={{ backgroundColor: colors.primaryDark }}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#1F52D6] rounded-full blur-[100px] opacity-40 pointer-events-none" />
              
              <h3 className="text-3xl font-bold text-white mb-4 relative z-10">Thinking of selling your home?</h3>
              <p className="text-[#CFE0FF] mb-8 max-w-md mx-auto relative z-10">
                Get a comprehensive, data-driven valuation from our expert agents today.
              </p>
              <Button className="bg-[#1F52D6] hover:bg-[#2F6BFF] text-white rounded-full px-10 py-6 font-bold text-lg shadow-lg relative z-10">
                Get Free Valuation
              </Button>
            </div>
          </div>

          {/* RIGHT: RELATED CONTENT SIDEBAR */}
          <div className="mt-12 lg:mt-0 lg:col-span-3">
             <div className="sticky top-32">
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">More Insights</h4>
                <div className="space-y-6">
                  {relatedPosts.map((post, index) => (
                    <Link to="#" key={index} className="group block">
                      <div className="rounded-xl overflow-hidden mb-3 h-32 relative">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <h5 className="font-bold text-[#05070C] group-hover:text-[#1F52D6] transition-colors leading-snug mb-1">
                        {post.title}
                      </h5>
                      <span className="text-xs text-gray-500">{post.date}</span>
                    </Link>
                  ))}
                </div>
                
                <div className="mt-12 p-6 bg-[#F2F7FF] rounded-2xl border border-[#CFE0FF]">
                   <h5 className="font-bold text-[#0C1F55] mb-2">Newsletter</h5>
                   <p className="text-xs text-[#1F52D6] mb-4">Market trends straight to your inbox.</p>
                   <input type="email" placeholder="Email address" className="w-full px-3 py-2 rounded-lg text-sm border-none focus:ring-2 focus:ring-[#1F52D6] mb-2" />
                   <Button size="sm" className="w-full bg-[#1F52D6] hover:bg-[#183EAA]">Subscribe</Button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Icon for the button
const ArrowRightIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

export default BlogDetail;