import { Link } from "wouter";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, MapPin, Building2 } from "lucide-react";
import type { Asset } from "@workspace/api-client-react";
import { formatCompactCurrency, formatPercent } from "@/lib/utils";

// Mock images for demonstration if imageUrl is missing
const getPlaceholderImage = (category: string) => {
  switch (category) {
    case 'real_estate': return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80';
    case 'commodities': return 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80';
    case 'art': return 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=800&q=80';
    case 'bonds': return 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80';
    default: return 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800&q=80';
  }
};

export function AssetCard({ asset }: { asset: Asset }) {
  const isPositive = (asset.priceChange24h || 0) >= 0;

  return (
    <Link href={`/assets/${asset.id}`}>
      <motion.div 
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className="group bg-card rounded-2xl border border-border/50 overflow-hidden cursor-pointer shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all"
      >
        <div className="h-48 relative overflow-hidden">
          {/* Unsplash image based on category */}
          <img 
            src={asset.imageUrl || getPlaceholderImage(asset.category)} 
            alt={asset.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-80" />
          
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="px-3 py-1 text-xs font-semibold rounded-full bg-background/80 backdrop-blur-md border border-white/10 text-foreground shadow-sm">
              {asset.symbol}
            </div>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium mb-1 uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              {asset.category.replace('_', ' ')}
            </div>
            <h3 className="text-xl font-display font-bold text-white leading-tight truncate">
              {asset.name}
            </h3>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1.5 opacity-70" />
            <span className="truncate">{asset.location}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background/50 p-3 rounded-xl border border-white/5">
              <div className="text-xs text-muted-foreground mb-1">Token Price</div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-foreground">
                  ${asset.tokenPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="bg-background/50 p-3 rounded-xl border border-white/5">
              <div className="text-xs text-muted-foreground mb-1">Total Value</div>
              <div className="text-lg font-bold text-foreground">
                {formatCompactCurrency(asset.totalValue)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Est. Yield (APY)</span>
              <span className="text-primary font-bold">{asset.annualYield}%</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground">24h Change</span>
              <span className={`flex items-center text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                {formatPercent(Math.abs(asset.priceChange24h || 0))}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
