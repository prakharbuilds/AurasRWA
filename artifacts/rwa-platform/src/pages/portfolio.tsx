import { useGetPortfolio, useListHoldings } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { formatCurrency, formatPercent, formatDate } from "@/lib/utils";
import { Wallet, ArrowUpRight, ArrowDownRight, PieChart as PieChartIcon } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Portfolio() {
  const { data: portfolio, isLoading: loadingPort } = useGetPortfolio();
  const { data: holdings, isLoading: loadingHoldings } = useListHoldings();

  if (loadingPort || loadingHoldings) {
    return <AppLayout><div className="animate-pulse flex gap-8 flex-col"><div className="h-40 bg-card rounded-3xl" /><div className="h-96 bg-card rounded-3xl" /></div></AppLayout>;
  }

  if (!portfolio) return <AppLayout><div>Failed to load portfolio</div></AppLayout>;

  const isPositive = portfolio.totalGainLoss >= 0;

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 pb-12">
        
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">My Portfolio</h1>
          <p className="text-muted-foreground">Track your real-world asset performance.</p>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-card to-card border border-border/50 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/10 rounded-full blur-[40px]" />
            <div className="flex items-center gap-3 mb-4 text-muted-foreground">
              <Wallet className="w-5 h-5 text-primary" />
              <span className="font-medium">Total Balance</span>
            </div>
            <div className="text-4xl lg:text-5xl font-display font-bold text-foreground mb-2">
              {formatCurrency(portfolio.totalValue)}
            </div>
            <div className="text-sm text-muted-foreground border-t border-border/50 pt-4 mt-4">
              Invested: {formatCurrency(portfolio.totalInvested)}
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-3xl p-8 flex flex-col justify-center">
            <div className="text-muted-foreground font-medium mb-3">All-Time Return</div>
            <div className="flex items-end gap-3">
              <div className="text-3xl font-display font-bold text-foreground">
                {isPositive ? '+' : ''}{formatCurrency(portfolio.totalGainLoss)}
              </div>
              <div className={`flex items-center px-2 py-1 rounded-md text-sm font-bold mb-1 ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {formatPercent(Math.abs(portfolio.totalGainLossPercent))}
              </div>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-3xl p-8 flex flex-col justify-center">
            <div className="text-muted-foreground font-medium mb-3">Pending Yield</div>
            <div className="text-3xl font-display font-bold text-primary">
              {formatCurrency(portfolio.totalPendingYield)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Available to claim in next distribution
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-card border border-border/50 rounded-3xl p-6 md:p-8">
            <h3 className="text-xl font-display font-bold mb-6">Performance History</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolio.performanceHistory}>
                  <defs>
                    <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month: 'short'})}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis 
                    tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickMargin={10}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                    labelFormatter={(val) => formatDate(val as string)}
                    formatter={(val: number) => [formatCurrency(val), 'Value']}
                  />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorPerf)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Allocation */}
          <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 flex flex-col">
            <h3 className="text-xl font-display font-bold mb-2 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-primary" />
              Allocation
            </h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolio.allocationByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="percentage"
                    stroke="none"
                  >
                    {portfolio.allocationByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: number) => [`${val}%`, 'Allocation']}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-card border border-border/50 rounded-3xl overflow-hidden">
          <div className="p-6 md:p-8 border-b border-border/50">
            <h3 className="text-xl font-display font-bold">My Assets</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/50 border-b border-border/50">
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Balance</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Value</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Return</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {holdings?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No assets in portfolio yet. <Link href="/market" className="text-primary hover:underline">Explore market</Link>.
                    </td>
                  </tr>
                ) : (
                  holdings?.map((holding, i) => (
                    <motion.tr 
                      key={holding.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-sm border border-border">
                            {holding.assetSymbol.substring(0,2)}
                          </div>
                          <div>
                            <div className="font-bold text-foreground">{holding.assetName}</div>
                            <div className="text-xs text-muted-foreground">{holding.assetCategory.replace('_', ' ')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-medium text-foreground">{holding.tokensOwned.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{holding.assetSymbol}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-bold text-foreground">{formatCurrency(holding.currentValue)}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`font-medium ${holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {holding.gainLoss >= 0 ? '+' : ''}{formatCurrency(holding.gainLoss)}
                        </div>
                        <div className={`text-xs ${holding.gainLoss >= 0 ? 'text-green-400/70' : 'text-red-400/70'}`}>
                          {holding.gainLoss >= 0 ? '+' : ''}{formatPercent(holding.gainLossPercent)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link href={`/assets/${holding.assetId}`}>
                          <button className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground font-medium rounded-lg text-sm transition-colors border border-border/50">
                            Manage
                          </button>
                        </Link>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
