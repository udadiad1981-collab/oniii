export function formatPrice(amount: number, currency: string = "USD"): string {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CNY: "¥",
    JPY: "¥",
  };
  const symbol = symbols[currency] || "$";
  return `${symbol}${amount.toFixed(2)}`;
}

export function cnyToUsd(cny: number, rate: number = 0.14): number {
  return Math.round(cny * rate * 100) / 100;
}

export function generateOrderNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `EQ${date}${rand}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Calculate shipping cost based on weight and destination
 * Supports: Manual rate table + Future integration with logistics API (e.g., Kuaidi100)
 */
export function calculateShipping(weightGrams: number, country: string): number {
  const weightKg = weightGrams / 1000;
  
  // Define rate structure (USD)
  // Region-based pricing with weight tiers
  const region = getShippingRegion(country);
  const baseRates = shippingRates[region];
  
  let rate: number;
  
  // Weight tier calculation with weight multiplier support
  if (weightKg <= 0.5) {
    rate = baseRates.tier1;
  } else if (weightKg <= 1) {
    rate = baseRates.tier2;
  } else if (weightKg <= 3) {
    rate = baseRates.tier2 + (baseRates.perExtraKg * (weightKg - 1));
  } else {
    rate = baseRates.tier2 + (baseRates.perExtraKg * 2) + 
           (baseRates.extraWeightMultiplier * (weightKg - 3));
  }

  // Minimum floor price for logistics handling
  return Math.max(Math.round(rate * 100) / 100, baseRates.minFloor);
}

function getShippingRegion(country: string): 'a' | 'b' | 'c' {
  const tierA = ["US", "CA", "GB"]; // North America + UK (highest volume)
  const tierB = ["DE", "FR", "IT", "ES", "NL", "AU", "NZ"]; // EU + Oceania
  const tierC = ["JP", "KR", "SG", "HK", "TW"]; // Asia
  
  if (tierA.includes(country)) return 'a';
  if (tierB.includes(country)) return 'b';
  if (tierC.includes(country)) return 'c';
  
  return 'a'; // Default to tier A (safest fallback)
}

// Shipping rate table by region (USD)
const shippingRates = {
  a: { // Tier A: US/CA/GB (high volume, competitive rates)
    tier1: 5.99,           // ≤0.5kg
    tier2: 8.99,           // ≤1kg  
    perExtraKg: 4.00,      // + each extra kg
    extraWeightMultiplier: 1.5,  // >3kg multiplier
    minFloor: 4.99         // Absolute minimum for handling
  },
  b: { // Tier B: EU + Oceania (medium volume)
    tier1: 7.99,
    tier2: 11.99,
    perExtraKg: 5.00,
    extraWeightMultiplier: 1.8,
    minFloor: 6.99
  },
  c: { // Tier C: Asia (moderate distance)
    tier1: 6.99,
    tier2: 10.99,  
    perExtraKg: 4.50,
    extraWeightMultiplier: 1.6,
    minFloor: 5.99
  }
};
