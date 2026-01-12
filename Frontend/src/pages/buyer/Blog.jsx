import React from "react";
import { Link } from "react-router-dom";
import { Building2, TrendingUp, ArrowRight, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "../../components/buyer/Navbar";

const featuredPost = {
  id: "1",
  title: "Market Trends: What to Expect in 2024",
  excerpt: "Discover the emerging patterns in luxury real estate and how shifting interest rates are creating new opportunities for savvy investors.",
  image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
};

const blogPosts = [
  { id: "2", title: "Market Futures: What to Evaluate Before Investing", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop", category: "Investing" },
  { id: "3", title: "5 Tips for First-Time Dashboard 2024", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop", category: "Guides" },
  { id: "4", title: "Investing Sectors: Future Projections and Trends", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop", category: "Buying" },
  { id: "5", title: "Digital Strategies for Modern Property Flipping", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop", category: "Design" },
  { id: "6", title: "Residential vs Commercial: Which fits your Portfolio?", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop", category: "Investing" },
  { id: "7", title: "Interior Design Trends for the Modern Villa", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=400&fit=crop", category: "Design" },
];

const categories = ["All Insights", "Guides", "Buying", "Market Trends", "Design", "Investing"];

const Blog = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
        <Navbar/>
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 max-w-2xl">
          <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase">Insights</span>
          <h1 className="text-5xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Estate & Insights
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Stay ahead of the curve with expert analysis on property markets, 
            investment strategies, and luxury living.
          </p>
        </div>

        {/* Featured Post Card */}
        <div className="mb-16">
          <Card className="overflow-hidden border-none shadow-xl bg-white rounded-3xl">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 lg:p-14 flex flex-col justify-center">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                  <TrendingUp size={24} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="mt-4 text-slate-600 text-lg leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="mt-8">
                  <Button className="rounded-full bg-slate-900 hover:bg-slate-800 px-8 py-6" asChild>
                    <Link to={`/blog/${featuredPost.id}`}>Read Full Article</Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-[300px] lg:h-auto">
                <img src={featuredPost.image} alt="Featured" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            </div>
          </Card>
        </div>

        {/* Content Layout */}
        <div className="grid gap-12 lg:grid-cols-[1fr_260px]">
          
          {/* Main Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="group">
                <div className="h-full flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-4 shadow-sm">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="mt-auto pt-4 flex items-center text-blue-600 font-semibold text-sm">
                    Read Post <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="space-y-10">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Explore Topics</h3>
              <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {categories.map((cat, i) => (
                  <button key={i} className={`text-left px-4 py-2 rounded-lg text-sm transition-colors ${i === 0 ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-2xl p-6 text-white">
              <h4 className="font-bold text-lg mb-2">Newsletter</h4>
              <p className="text-slate-400 text-sm mb-4">Get the latest market insights delivered weekly.</p>
              <input type="email" placeholder="Your email" className="w-full bg-slate-800 border-none rounded-lg px-4 py-2 text-sm mb-3 focus:ring-1 ring-blue-500" />
              <Button className="w-full bg-blue-600 hover:bg-blue-500 text-sm">Subscribe</Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Blog;