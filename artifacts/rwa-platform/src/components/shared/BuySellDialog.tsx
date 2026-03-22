import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, ArrowRight } from "lucide-react";
import type { AssetDetail } from "@workspace/api-client-react";
import { useCreateTransaction } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetPortfolioQueryKey, getListTransactionsQueryKey, getListHoldingsQueryKey } from "@workspace/api-client-react";

interface BuySellDialogProps {
  asset: AssetDetail;
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'buy' | 'sell';
}

export function BuySellDialog({ asset, isOpen, onClose, defaultType = 'buy' }: BuySellDialogProps) {
  const [type, setType] = useState<'buy' | 'sell'>(defaultType);
  const [amount, setAmount] = useState<string>("");
  const queryClient = useQueryClient();

  const { mutate: createTx, isPending } = useCreateTransaction({
    mutation: {
      onSuccess: () => {
        // Invalidate relevant queries after successful transaction
        queryClient.invalidateQueries({ queryKey: getGetPortfolioQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListTransactionsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListHoldingsQueryKey() });
        onClose();
        setAmount("");
      }
    }
  });

  const numAmount = parseFloat(amount) || 0;
  const totalCost = numAmount * asset.tokenPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || numAmount <= 0) return;
    
    createTx({
      data: {
        assetId: asset.id,
        type: type,
        tokens: numAmount
      }
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/90 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-card rounded-3xl border border-border/50 shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-border/50 flex items-center justify-between">
            <h2 className="text-xl font-display font-bold">Trade {asset.symbol}</h2>
            <button onClick={onClose} className="p-2 bg-background rounded-full text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
            <div className="flex bg-background p-1 rounded-xl border border-border/50">
              <button
                type="button"
                onClick={() => setType('buy')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  type === 'buy' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setType('sell')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  type === 'sell' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sell
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Amount (Tokens)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-background border-2 border-border rounded-xl px-4 py-4 text-2xl font-display font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30"
                    placeholder="0"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-primary font-bold px-2 py-1 bg-primary/10 rounded-md text-sm">
                      {asset.symbol}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-background/50 rounded-xl p-4 border border-border/50 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price per token</span>
                  <span className="font-medium">${asset.tokenPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Network Fee</span>
                  <span className="font-medium text-green-400">Free</span>
                </div>
                <div className="h-px bg-border/50 w-full my-1" />
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Total {type === 'buy' ? 'Cost' : 'Value'}</span>
                  <span className="text-2xl font-display font-bold text-foreground">
                    ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending || numAmount <= 0}
              className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-amber-500 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isPending ? (
                "Processing..."
              ) : (
                <>
                  {type === 'buy' ? 'Confirm Purchase' : 'Confirm Sale'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
