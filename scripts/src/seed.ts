import {
  db,
  assetsTable,
  assetDocumentsTable,
  assetHighlightsTable,
  tokenDistributionTable,
  transactionsTable,
  holdingsTable,
} from "@workspace/db";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("Seeding RWA platform...");

  await db.execute(sql`DELETE FROM holdings`);
  await db.execute(sql`DELETE FROM transactions`);
  await db.execute(sql`DELETE FROM token_distribution`);
  await db.execute(sql`DELETE FROM asset_highlights`);
  await db.execute(sql`DELETE FROM asset_documents`);
  await db.execute(sql`DELETE FROM assets`);

  const assetData = [
    {
      name: "Manhattan Office Tower",
      symbol: "MNHT",
      category: "real_estate",
      description:
        "A premium Grade-A office tower in Midtown Manhattan, offering stable rental income from blue-chip tenants including Fortune 500 companies. The property features state-of-the-art amenities and LEED Platinum certification.",
      totalValue: "285000000",
      tokenPrice: "285.00",
      totalTokens: 1000000,
      availableTokens: 680000,
      annualYield: "6.8",
      status: "active",
      location: "New York, USA",
      priceChange24h: "1.24",
      riskLevel: "low",
      minimumInvestment: "285.00",
      highlights: [
        "LEED Platinum certified building",
        "100% occupancy for last 5 years",
        "Prime Midtown Manhattan location",
        "Blue-chip tenant roster",
        "Long-term leases averaging 8 years",
      ],
      documents: [
        { name: "Property Valuation Report", type: "PDF", url: "#" },
        { name: "Lease Agreements Summary", type: "PDF", url: "#" },
        { name: "Financial Projections", type: "XLSX", url: "#" },
        { name: "Legal Due Diligence", type: "PDF", url: "#" },
      ],
      distribution: [
        { label: "Public Float", percentage: "68", color: "#f59e0b" },
        { label: "Developer Reserve", percentage: "20", color: "#d97706" },
        { label: "Platform Treasury", percentage: "7", color: "#b45309" },
        { label: "Team & Advisors", percentage: "5", color: "#92400e" },
      ],
    },
    {
      name: "Gold Reserve Fund",
      symbol: "GRFT",
      category: "commodities",
      description:
        "Direct exposure to physical gold bullion stored in Swiss vaults. Each token represents fractional ownership of allocated gold bars, providing a store of value and inflation hedge.",
      totalValue: "120000000",
      tokenPrice: "1920.50",
      totalTokens: 62500,
      availableTokens: 41000,
      annualYield: "2.1",
      status: "active",
      location: "Zurich, Switzerland",
      priceChange24h: "0.87",
      riskLevel: "low",
      minimumInvestment: "1920.50",
      highlights: [
        "Physical gold in Swiss vault",
        "Full audit trail and verification",
        "Institutional-grade storage",
        "Daily liquidity windows",
        "No counterparty risk",
      ],
      documents: [
        { name: "Vault Audit Certificate", type: "PDF", url: "#" },
        { name: "Custody Agreement", type: "PDF", url: "#" },
        { name: "Token Structure Overview", type: "PDF", url: "#" },
      ],
      distribution: [
        { label: "Public Float", percentage: "65.6", color: "#10b981" },
        { label: "Reserve", percentage: "25", color: "#059669" },
        { label: "Operations", percentage: "9.4", color: "#047857" },
      ],
    },
    {
      name: "US Infrastructure Bond",
      symbol: "USIB",
      category: "bonds",
      description:
        "Tokenized US government infrastructure bonds providing fixed-income returns. Backed by transportation, energy, and water infrastructure projects across multiple states.",
      totalValue: "500000000",
      tokenPrice: "100.00",
      totalTokens: 5000000,
      availableTokens: 2200000,
      annualYield: "4.75",
      status: "active",
      location: "United States",
      priceChange24h: "0.12",
      riskLevel: "low",
      minimumInvestment: "100.00",
      highlights: [
        "Government-backed infrastructure",
        "Fixed 4.75% annual coupon",
        "5-year maturity with quarterly payments",
        "AAA credit rating",
        "Tax-advantaged structure",
      ],
      documents: [
        { name: "Bond Prospectus", type: "PDF", url: "#" },
        { name: "Credit Rating Report", type: "PDF", url: "#" },
        { name: "Quarterly Income Statement", type: "PDF", url: "#" },
      ],
      distribution: [
        { label: "Public Float", percentage: "44", color: "#3b82f6" },
        { label: "Institutional", percentage: "40", color: "#2563eb" },
        { label: "Reserve Fund", percentage: "16", color: "#1d4ed8" },
      ],
    },
    {
      name: "Banksy Collection NFT",
      symbol: "BNKY",
      category: "art",
      description:
        "Fractional ownership of authenticated Banksy artworks including 'Girl with Balloon' and 'Flower Thrower'. Stored in climate-controlled vaults in London with institutional insurance.",
      totalValue: "45000000",
      tokenPrice: "450.00",
      totalTokens: 100000,
      availableTokens: 72000,
      annualYield: "8.2",
      status: "active",
      location: "London, UK",
      priceChange24h: "3.41",
      riskLevel: "high",
      minimumInvestment: "450.00",
      highlights: [
        "Authenticated Banksy originals",
        "Lloyd's of London insured",
        "Climate-controlled vault storage",
        "Strong secondary market liquidity",
        "Art market outperforming stocks",
      ],
      documents: [
        { name: "Authentication Certificates", type: "PDF", url: "#" },
        { name: "Insurance Policy", type: "PDF", url: "#" },
        { name: "Art Valuation Report", type: "PDF", url: "#" },
      ],
      distribution: [
        { label: "Public Float", percentage: "72", color: "#8b5cf6" },
        { label: "Original Seller", percentage: "20", color: "#7c3aed" },
        { label: "Platform", percentage: "8", color: "#6d28d9" },
      ],
    },
    {
      name: "Solar Energy Portfolio",
      symbol: "SOLP",
      category: "infrastructure",
      description:
        "Tokenized shares in a diversified portfolio of utility-scale solar farms across the US Sunbelt. Revenue generated from long-term power purchase agreements with utilities.",
      totalValue: "180000000",
      tokenPrice: "180.00",
      totalTokens: 1000000,
      availableTokens: 550000,
      annualYield: "7.4",
      status: "active",
      location: "Texas & Arizona, USA",
      priceChange24h: "2.18",
      riskLevel: "medium",
      minimumInvestment: "180.00",
      highlights: [
        "25-year power purchase agreements",
        "550MW total installed capacity",
        "ESG compliant investment",
        "Federal tax credits secured",
        "Diversified across 12 sites",
      ],
      documents: [
        { name: "PPA Contracts Summary", type: "PDF", url: "#" },
        { name: "Environmental Impact Report", type: "PDF", url: "#" },
        { name: "Technical Due Diligence", type: "PDF", url: "#" },
        { name: "Revenue Projections", type: "XLSX", url: "#" },
      ],
      distribution: [
        { label: "Public Float", percentage: "55", color: "#ef4444" },
        { label: "Developer", percentage: "30", color: "#dc2626" },
        { label: "ESG Fund", percentage: "10", color: "#b91c1c" },
        { label: "Reserve", percentage: "5", color: "#991b1b" },
      ],
    },
    {
      name: "TechVenture Fund III",
      symbol: "TVF3",
      category: "private_equity",
      description:
        "Access institutional-grade private equity in high-growth technology companies. Portfolio includes pre-IPO stakes in AI, fintech, and climate tech startups with proven track records.",
      totalValue: "320000000",
      tokenPrice: "1000.00",
      totalTokens: 320000,
      availableTokens: 95000,
      annualYield: "18.5",
      status: "active",
      location: "San Francisco, USA",
      priceChange24h: "5.72",
      riskLevel: "high",
      minimumInvestment: "5000.00",
      highlights: [
        "Portfolio of 24 pre-IPO companies",
        "Led by top-tier VC partners",
        "2.8x historical fund multiple",
        "Access to Series B+ rounds",
        "Quarterly liquidity windows",
      ],
      documents: [
        { name: "Fund Overview", type: "PDF", url: "#" },
        { name: "Portfolio Company List", type: "PDF", url: "#" },
        { name: "Historical Performance", type: "XLSX", url: "#" },
        { name: "Legal Structure", type: "PDF", url: "#" },
      ],
      distribution: [
        { label: "LP Investors", percentage: "29.7", color: "#06b6d4" },
        { label: "GP Reserve", percentage: "60", color: "#0891b2" },
        { label: "Management", percentage: "5", color: "#0e7490" },
        { label: "Carry Pool", percentage: "5.3", color: "#155e75" },
      ],
    },
    {
      name: "Paris Luxury Hotel",
      symbol: "PLHX",
      category: "real_estate",
      description:
        "Five-star luxury hotel on the Champs-Élysées offering stable hospitality income. Benefits from Paris's status as the world's most visited city with 50M+ tourists annually.",
      totalValue: "195000000",
      tokenPrice: "390.00",
      totalTokens: 500000,
      availableTokens: 320000,
      annualYield: "5.9",
      status: "active",
      location: "Paris, France",
      priceChange24h: "-0.34",
      riskLevel: "medium",
      minimumInvestment: "390.00",
      highlights: [
        "Prime Champs-Élysées location",
        "190-room five-star property",
        "85% average occupancy rate",
        "Michelin-starred restaurant on-site",
        "Revenue from events and F&B",
      ],
      documents: [
        { name: "Hotel Valuation", type: "PDF", url: "#" },
        { name: "Revenue Analysis", type: "PDF", url: "#" },
        { name: "Management Agreement", type: "PDF", url: "#" },
      ],
      distribution: [
        { label: "Public Float", percentage: "64", color: "#f59e0b" },
        { label: "Original Owner", percentage: "25", color: "#d97706" },
        { label: "Platform", percentage: "6", color: "#b45309" },
        { label: "Reserve", percentage: "5", color: "#92400e" },
      ],
    },
    {
      name: "Dubai Marina Tower",
      symbol: "DBMT",
      category: "real_estate",
      description:
        "Mixed-use residential tower in Dubai Marina, one of the world's most sought-after waterfront developments. High rental yields with capital appreciation potential.",
      totalValue: "98000000",
      tokenPrice: "196.00",
      totalTokens: 500000,
      availableTokens: 280000,
      annualYield: "8.1",
      status: "active",
      location: "Dubai, UAE",
      priceChange24h: "1.85",
      riskLevel: "medium",
      minimumInvestment: "196.00",
      highlights: [
        "Waterfront luxury development",
        "Tax-free jurisdiction",
        "Strong expat demand",
        "Professional property management",
        "Growing short-term rental market",
      ],
      documents: [
        { name: "Property Assessment", type: "PDF", url: "#" },
        { name: "Legal Title Documents", type: "PDF", url: "#" },
        { name: "Rental Income Analysis", type: "PDF", url: "#" },
      ],
      distribution: [
        { label: "Public Float", percentage: "56", color: "#f59e0b" },
        { label: "Developer Hold", percentage: "30", color: "#d97706" },
        { label: "Reserve", percentage: "14", color: "#b45309" },
      ],
    },
  ];

  const insertedAssets = [];
  for (const asset of assetData) {
    const [inserted] = await db
      .insert(assetsTable)
      .values({
        name: asset.name,
        symbol: asset.symbol,
        category: asset.category,
        description: asset.description,
        totalValue: asset.totalValue,
        tokenPrice: asset.tokenPrice,
        totalTokens: asset.totalTokens,
        availableTokens: asset.availableTokens,
        annualYield: asset.annualYield,
        status: asset.status,
        location: asset.location,
        priceChange24h: asset.priceChange24h,
        riskLevel: asset.riskLevel,
        minimumInvestment: asset.minimumInvestment,
      })
      .returning();

    insertedAssets.push({ ...inserted, meta: asset });

    for (let i = 0; i < asset.documents.length; i++) {
      await db.insert(assetDocumentsTable).values({
        assetId: inserted.id,
        name: asset.documents[i].name,
        type: asset.documents[i].type,
        url: asset.documents[i].url,
      });
    }

    for (let i = 0; i < asset.highlights.length; i++) {
      await db.insert(assetHighlightsTable).values({
        assetId: inserted.id,
        text: asset.highlights[i],
        sortOrder: i,
      });
    }

    for (const dist of asset.distribution) {
      await db.insert(tokenDistributionTable).values({
        assetId: inserted.id,
        label: dist.label,
        percentage: dist.percentage,
        color: dist.color,
      });
    }
  }

  const asset1 = insertedAssets[0];
  const asset3 = insertedAssets[2];
  const asset5 = insertedAssets[4];

  await db.insert(holdingsTable).values([
    {
      assetId: asset1.id,
      tokensOwned: 50,
      purchaseValue: "13500.00",
      pendingYield: "229.50",
    },
    {
      assetId: asset3.id,
      tokensOwned: 10000,
      purchaseValue: "9800.00",
      pendingYield: "116.00",
    },
    {
      assetId: asset5.id,
      tokensOwned: 200,
      purchaseValue: "34800.00",
      pendingYield: "642.00",
    },
  ]);

  const txData = [
    { asset: asset1, type: "buy", tokens: 50, price: "270.00", days: 45 },
    { asset: asset3, type: "buy", tokens: 10000, price: "98.00", days: 30 },
    { asset: asset5, type: "buy", tokens: 200, price: "174.00", days: 20 },
    { asset: asset1, type: "buy", tokens: 10, price: "280.00", days: 10 },
    { asset: asset1, type: "sell", tokens: 10, price: "283.00", days: 8 },
    { asset: asset3, type: "yield", tokens: 0, price: "0.00", days: 5 },
  ];

  for (const tx of txData) {
    if (tx.tokens === 0) continue;
    const date = new Date();
    date.setDate(date.getDate() - tx.days);
    await db.insert(transactionsTable).values({
      assetId: tx.asset.id,
      type: tx.type,
      tokens: tx.tokens,
      pricePerToken: tx.price,
      totalAmount: String(tx.tokens * Number(tx.price)),
      status: "completed",
      txHash: "0x" + Math.random().toString(16).substr(2, 64).padEnd(64, "0"),
      createdAt: date,
    });
  }

  console.log(`Seeded ${insertedAssets.length} assets with documents, highlights, and distribution`);
  console.log("Seeded holdings and transactions");
  console.log("Done!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
