import { useGetMarketStats, useListAssets } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AssetCard } from "@/components/shared/AssetCard";
import { formatCompactCurrency, formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { Activity, Users, DollarSign, Briefcase } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetMarketStats();
  const { data: assets, isLoading: assetsLoading } = useListAssets({ limit: 4 });

  return (
    <AppLayout>
      <div className="flex flex-col gap-10">
        
        {/* Hero Banner */}
        <section className="relative rounded-3xl overflow-hidden h-[340px] flex items-center shadow-2xl border border-white/10 group">
          <div className="absolute inset-0 bg-background">
            <img 
              src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
              alt="Network"
              className="w-full h-full object-cover opacity-60 mix-blend-screen transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          </div>
          
          <div className="relative z-10 p-10 max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-display font-bold leading-tight mb-4"
            >
              Invest in the real world, <br/><span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-300">on-chain.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Access fractional ownership of premium real estate, fine art, commodities, and private equity with instant liquidity.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/market" className="px-8 py-4 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all inline-block">
                Explore Marketplace
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Market Stats */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Market Cap" 
              value={stats ? formatCurrency(stats.totalMarketCap) : "---"} 
              icon={DollarSign}
              loading={statsLoading}
            />
            <StatCard 
              title="24h Trading Volume" 
              value={stats ? formatCompactCurrency(stats.totalVolume24h) : "---"} 
              icon={Activity}
              loading={statsLoading}
            />
            <StatCard 
              title="Total Assets" 
              value={stats ? stats.totalAssets.toLocaleString() : "---"} 
              icon={Briefcase}
              loading={statsLoading}
            />
            <StatCard 
              title="Active Investors" 
              value={stats ? stats.activeInvestors.toLocaleString() : "---"} 
              icon={Users}
              loading={statsLoading}
            />
          </div>
        </section>

        {/* Featured Assets */}
        <section className="flex flex-col gap-6 pb-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold">Trending Assets</h2>
            <Link href="/market" className="text-primary font-medium hover:underline flex items-center gap-1">
              View all
            </Link>
          </div>
          
          {assetsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-96 bg-card border border-border/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {assets?.assets.map((asset, i) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <AssetCard asset={asset} />
                </motion.div>
              ))}
            </div>
          )}
        </section>

      </div>
    </AppLayout>
  );
}

function StatCard({ title, value, icon: Icon, loading }: { title: string, value: string, icon: any, loading: boolean }) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:border-border transition-colors">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <div className="text-sm font-medium text-muted-foreground mb-1">{title}</div>
        {loading ? (
          <div className="h-8 w-24 bg-background rounded animate-pulse" />
        ) : (
          <div className="text-2xl font-display font-bold text-foreground">{value}</div>
        )}
      </div>
    </div>
  );
}
