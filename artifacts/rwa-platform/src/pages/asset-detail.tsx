import { useState } from "react";
import { useRoute } from "wouter";
import { useGetAsset, useGetPriceHistory } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { BuySellDialog } from "@/components/shared/BuySellDialog";
import { formatCurrency, formatCompactCurrency, formatPercent, formatDate } from "@/lib/utils";
import { 
  Building2, MapPin, FileText, AlertTriangle, 
  ShieldAlert, ChevronRight, BarChart3, CheckCircle2, ChevronLeft
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

export default function AssetDetail() {
  const [, params] = useRoute("/assets/:id");
  const assetId = parseInt(params?.id || "0");
  
  const { data: asset, isLoading, error } = useGetAsset(assetId);
  const { data: priceHistory } = useGetPriceHistory(assetId, { days: 30 });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tradeType, setTradeType] = useState<'buy'|'sell'>('buy');

  const openTrade = (type: 'buy'|'sell') => {
    setTradeType(type);
    setIsDialogOpen(true);
  };

  if (isLoading) return <AppLayout><div className="flex h-96 items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div></AppLayout>;
  
  if (error || !asset) return <AppLayout><div className="py-20 text-center text-red-400">Failed to load asset details.</div></AppLayout>;

  // Mock Unsplash image if none
  const heroImage = asset.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80';

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 pb-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/market" className="hover:text-foreground transition-colors flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Marketplace
          </Link>
          <ChevronRight className="w-4 h-4 opacity-50" />
          <span className="text-foreground">{asset.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Header Image & Title */}
            <div className="bg-card rounded-3xl border border-border/50 overflow-hidden">
              <div className="h-64 md:h-80 relative">
                <img src={heroImage} alt={asset.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                <div className="absolute top-4 left-4">
                  <div className="px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 shadow-lg">
                    <Building2 className="w-3.5 h-3.5" />
                    {asset.category.replace('_', ' ')}
                  </div>
                </div>
              </div>
              <div className="p-8 -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 leading-tight">{asset.name}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm font-medium">
                      <span className="px-2 py-0.5 bg-secondary rounded text-foreground font-mono">{asset.symbol}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {asset.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Active Status
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {asset.description}
                </p>
              </div>
            </div>

            {/* Price Chart */}
            <div className="bg-card rounded-3xl border border-border/50 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-display font-bold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Price History
                </h3>
              </div>
              <div className="h-[300px] w-full">
                {priceHistory && priceHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceHistory}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <YAxis 
                        tickFormatter={(val) => `$${val}`}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickMargin={10}
                        axisLine={false}
                        tickLine={false}
                        domain={['dataMin - 5', 'dataMax + 5']}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                        itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                        labelFormatter={(val) => formatDate(val as string)}
                        formatter={(val: number) => [formatCurrency(val), 'Price']}
                      />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl">
                    No price data available
                  </div>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Highlights */}
              <div className="bg-card rounded-3xl border border-border/50 p-8">
                <h3 className="text-xl font-display font-bold mb-6">Key Highlights</h3>
                <ul className="space-y-4">
                  {asset.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="text-muted-foreground leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Documents */}
              <div className="bg-card rounded-3xl border border-border/50 p-8">
                <h3 className="text-xl font-display font-bold mb-6">Documents</h3>
                <div className="space-y-3">
                  {asset.documents.map((doc) => (
                    <a 
                      key={doc.id} 
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium text-foreground truncate">{doc.name}</span>
                        <span className="text-xs text-muted-foreground uppercase">{doc.type}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-6">
            
            {/* Trade Action Card */}
            <div className="bg-card rounded-3xl border border-border/50 p-6 sticky top-24 shadow-2xl shadow-black/40">
              <div className="mb-6">
                <div className="text-sm font-medium text-muted-foreground mb-1">Current Token Price</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-bold text-foreground">
                    ${asset.tokenPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm font-semibold text-green-400">+{formatPercent(Math.abs(asset.priceChange24h || 0))}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-3 border-b border-border/50">
                  <span className="text-muted-foreground">Total Valuation</span>
                  <span className="font-bold">{formatCompactCurrency(asset.totalValue)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border/50">
                  <span className="text-muted-foreground">Est. Annual Yield</span>
                  <span className="font-bold text-primary">{asset.annualYield}% APY</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border/50">
                  <span className="text-muted-foreground">Min. Investment</span>
                  <span className="font-bold">{formatCurrency(asset.minimumInvestment)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border/50">
                  <span className="text-muted-foreground">Available Tokens</span>
                  <span className="font-bold">{asset.availableTokens.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => openTrade('buy')}
                  className="w-full py-4 rounded-xl font-bold text-lg bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  Buy {asset.symbol}
                </button>
                <button 
                  onClick={() => openTrade('sell')}
                  className="w-full py-4 rounded-xl font-bold text-lg bg-background border border-border text-foreground hover:bg-secondary hover:border-border transition-all"
                >
                  Sell {asset.symbol}
                </button>
              </div>

              <div className="mt-6 flex items-start gap-3 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-500/90 leading-relaxed">
                  Investing in real-world assets carries risk. The value of your investment may go down as well as up.
                </p>
              </div>
            </div>

            {/* Token Distribution */}
            <div className="bg-card rounded-3xl border border-border/50 p-6">
              <h3 className="text-lg font-display font-bold mb-6">Token Distribution</h3>
              <div className="h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={asset.tokenDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="percentage"
                      stroke="none"
                    >
                      {asset.tokenDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: number) => [`${val}%`, 'Allocation']}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {asset.tokenDistribution.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-muted-foreground">{entry.label}</span>
                    </div>
                    <span className="font-bold">{entry.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Profile */}
            <div className="bg-card rounded-3xl border border-border/50 p-6 flex flex-col gap-4">
              <h3 className="text-lg font-display font-bold">Risk Profile</h3>
              <div className="flex items-center gap-3 p-4 bg-background border border-border rounded-xl">
                <ShieldAlert className={`w-8 h-8 ${
                  asset.riskLevel === 'low' ? 'text-green-500' : 
                  asset.riskLevel === 'medium' ? 'text-amber-500' : 'text-red-500'
                }`} />
                <div>
                  <div className="font-bold capitalize">{asset.riskLevel} Risk</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Assessed by independent auditors</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <BuySellDialog 
        asset={asset} 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        defaultType={tradeType}
      />
    </AppLayout>
  );
}
