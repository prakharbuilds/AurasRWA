import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateAsset } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ShieldCheck, UploadCloud, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TokenizeAsset() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { mutate: createAsset, isPending } = useCreateAsset({
    mutation: {
      onSuccess: (data) => {
        toast({
          title: "Asset Submitted Successfully",
          description: "Your asset is now being reviewed for tokenization.",
        });
        setLocation(`/assets/${data.id}`);
      },
      onError: () => {
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your asset. Please check the fields.",
          variant: "destructive"
        });
      }
    }
  });

  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    category: "real_estate",
    description: "",
    totalValue: "",
    tokenPrice: "",
    totalTokens: "",
    annualYield: "",
    location: "",
    riskLevel: "medium",
    minimumInvestment: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTokens = () => {
    const val = parseFloat(formData.totalValue);
    const price = parseFloat(formData.tokenPrice);
    if (val && price && price > 0) {
      setFormData(prev => ({ ...prev, totalTokens: Math.floor(val / price).toString() }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAsset({
      data: {
        name: formData.name,
        symbol: formData.symbol,
        category: formData.category,
        description: formData.description,
        totalValue: parseFloat(formData.totalValue),
        tokenPrice: parseFloat(formData.tokenPrice),
        totalTokens: parseInt(formData.totalTokens),
        annualYield: parseFloat(formData.annualYield),
        location: formData.location,
        riskLevel: formData.riskLevel,
        minimumInvestment: parseFloat(formData.minimumInvestment)
      }
    });
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto pb-12">
        
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Tokenize an Asset</h1>
          <p className="text-muted-foreground text-lg">Submit your real-world asset for evaluation and tokenization on the platform.</p>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex items-start gap-4 mb-8">
          <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
          <div>
            <h3 className="font-bold text-foreground text-lg mb-1">Institutional Grade Verification</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              All submitted assets go through a rigorous legal and financial auditing process. By submitting this form, you initiate the preliminary assessment phase. Ensure all valuations and details provided are accurate and verifiable.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl">
          
          <div className="space-y-8">
            
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-display font-bold mb-4 pb-2 border-b border-border/50 text-foreground">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Asset Name *</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all" placeholder="e.g. The Grand Plaza Hotel" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Asset Symbol *</label>
                  <input required name="symbol" value={formData.symbol} onChange={handleChange} maxLength={6} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all uppercase" placeholder="e.g. GPLZ" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Category *</label>
                  <select required name="category" value={formData.category} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all appearance-none">
                    <option value="real_estate">Real Estate</option>
                    <option value="commodities">Commodities</option>
                    <option value="bonds">Bonds</option>
                    <option value="art">Fine Art</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="private_equity">Private Equity</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Location / Jurisdiction *</label>
                  <input required name="location" value={formData.location} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all" placeholder="e.g. New York, USA" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Description *</label>
                  <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all resize-none" placeholder="Provide a detailed description of the asset..." />
                </div>
              </div>
            </div>

            {/* Financials */}
            <div>
              <h3 className="text-lg font-display font-bold mb-4 pb-2 border-b border-border/50 text-foreground flex items-center justify-between">
                Financial Details
                <span className="text-xs font-normal text-muted-foreground flex items-center gap-1"><Info className="w-3.5 h-3.5"/> All values in USD</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Total Valuation ($) *</label>
                  <input required type="number" min="1000" name="totalValue" value={formData.totalValue} onChange={handleChange} onBlur={calculateTokens} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Target Token Price ($) *</label>
                  <input required type="number" step="0.01" min="0.01" name="tokenPrice" value={formData.tokenPrice} onChange={handleChange} onBlur={calculateTokens} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Calculated Total Tokens</label>
                  <input readOnly value={formData.totalTokens} className="w-full bg-secondary/50 border border-transparent rounded-xl px-4 py-3 text-foreground font-mono opacity-70 cursor-not-allowed" placeholder="Auto-calculated" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Est. Annual Yield (%) *</label>
                  <input required type="number" step="0.1" name="annualYield" value={formData.annualYield} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all" placeholder="e.g. 5.5" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Minimum Investment ($) *</label>
                  <input required type="number" min="1" name="minimumInvestment" value={formData.minimumInvestment} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all" placeholder="100.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Risk Level *</label>
                  <select required name="riskLevel" value={formData.riskLevel} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all appearance-none">
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Documents placeholder */}
            <div>
              <h3 className="text-lg font-display font-bold mb-4 pb-2 border-b border-border/50 text-foreground">Supporting Documents</h3>
              <div className="border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-background/50 hover:bg-background/80 transition-colors cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-medium text-foreground mb-1">Upload Appraisals & Legal Docs</h4>
                <p className="text-sm text-muted-foreground max-w-sm">Drag and drop PDF files here, or click to browse. (Simulation only)</p>
              </div>
            </div>

          </div>

          <div className="mt-10 pt-6 border-t border-border/50 flex justify-end gap-4">
            <button type="button" className="px-6 py-3 rounded-xl font-bold text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="px-8 py-3 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Submitting..." : "Submit for Review"}
            </button>
          </div>
        </form>

      </div>
    </AppLayout>
  );
}
