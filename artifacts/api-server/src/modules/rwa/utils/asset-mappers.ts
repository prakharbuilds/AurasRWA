export function mapAssetNumbers<T extends {
  totalValue: string;
  tokenPrice: string;
  annualYield: string;
  priceChange24h: string | null;
  minimumInvestment: string;
  imageUrl?: string | null;
}>(asset: T) {
  return {
    ...asset,
    totalValue: Number(asset.totalValue),
    tokenPrice: Number(asset.tokenPrice),
    annualYield: Number(asset.annualYield),
    priceChange24h: Number(asset.priceChange24h ?? 0),
    minimumInvestment: Number(asset.minimumInvestment),
    imageUrl: asset.imageUrl ?? null,
  };
}
