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

export function calculateShipping(weightGrams: number, country: string): number {
  const weightKg = weightGrams / 1000;
  switch (country) {
    case "US":
      return weightKg <= 0.5 ? 5.99 : weightKg <= 1 ? 8.99 : 8.99 + (weightKg - 1) * 4;
    case "GB":
      return weightKg <= 0.5 ? 6.99 : weightKg <= 1 ? 9.99 : 9.99 + (weightKg - 1) * 4.5;
    case "CA":
      return weightKg <= 0.5 ? 6.49 : weightKg <= 1 ? 9.49 : 9.49 + (weightKg - 1) * 4;
    case "DE":
    case "FR":
    case "IT":
    case "ES":
    case "NL":
      return weightKg <= 0.5 ? 7.99 : weightKg <= 1 ? 11.99 : 11.99 + (weightKg - 1) * 5;
    default:
      return weightKg <= 0.5 ? 8.99 : weightKg <= 1 ? 13.99 : 13.99 + (weightKg - 1) * 6;
  }
}
