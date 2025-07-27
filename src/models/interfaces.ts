export interface Product {
  sku: string;
  name: string;
  priceInCents: number;
}

export interface PricingRule {
  applies(sku: string): boolean;
  calculatePrice(quantity: number, basePrice: number): number;
}

export interface CheckoutInterface {
  scan(sku: string): void;
  total(): number;
}
