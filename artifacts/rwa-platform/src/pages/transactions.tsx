import { useListTransactions } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function Transactions() {
  const { data: transactions, isLoading } = useListTransactions();

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 pb-12">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Transaction History</h1>
          <p className="text-muted-foreground">View all your past investments and sales.</p>
        </div>

        <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/50 border-b border-border/50">
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading ? (
                  [1,2,3,4].map(i => (
                    <tr key={i}>
                      <td colSpan={6} className="px-6 py-4 h-16 bg-white/[0.01] animate-pulse" />
                    </tr>
                  ))
                ) : transactions?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions?.map((tx) => {
                    const isBuy = tx.type === 'buy';
                    return (
                      <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                          {formatDate(tx.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                            isBuy ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {isBuy ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                            {tx.type}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/assets/${tx.assetId}`} className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2">
                            {tx.assetName}
                            <span className="text-xs text-muted-foreground font-normal bg-background px-1.5 py-0.5 rounded border border-border">{tx.assetSymbol}</span>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="font-bold text-foreground">
                            {formatCurrency(tx.totalAmount)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {tx.tokens.toLocaleString()} tokens @ ${tx.pricePerToken}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-400">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {tx.txHash ? (
                            <a href={`#`} className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 text-sm font-mono bg-background px-2 py-1 rounded-md border border-border/50">
                              {tx.txHash.substring(0, 6)}...{tx.txHash.substring(tx.txHash.length - 4)}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : '-'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
