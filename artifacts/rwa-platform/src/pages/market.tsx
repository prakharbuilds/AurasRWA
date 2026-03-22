import { useState } from "react";
import { useListAssets } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AssetCard } from "@/components/shared/AssetCard";
import { Filter, SlidersHorizontal, Search } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = [
  { id: "all", label: "All Assets" },
  { id: "real_estate", label: "Real Estate" },
  { id: "commodities", label: "Commodities" },
  { id: "bonds", label: "Bonds" },
  { id: "art", label: "Fine Art" },
  { id: "private_equity", label: "Private Equity" },
];

export default function Market() {
  const [activeCategory, setActiveCategory] = useState("all");
  
  const { data, isLoading } = useListAssets({ 
    category: activeCategory === "all" ? undefined : activeCategory 
  });

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 pb-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Marketplace</h1>
            <p className="text-muted-foreground">Discover and invest in fractionalized real-world assets.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search assets..." 
                className="bg-card border border-border/80 rounded-xl pl-10 pr-4 py-2.5 text-sm w-64 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border/80 rounded-xl text-sm font-medium hover:bg-background transition-colors">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              Filters
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                  : 'bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Asset Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[400px] bg-card border border-border/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {data?.assets.map((asset, i) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <AssetCard asset={asset} />
              </motion.div>
            ))}
            {data?.assets.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 border border-border">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No assets found</h3>
                <p className="text-muted-foreground max-w-md">There are currently no active assets in this category. Try selecting a different filter.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </AppLayout>
  );
}
