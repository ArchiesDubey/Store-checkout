import { CheckoutInterface, PricingRule } from './models/interfaces';
import { ProductCatalog } from './services/ProductCatalog';
import { BuyXGetYFreeRule } from './pricing-rules/BuyXGetYFreeRule';
import { BulkDiscountRule } from './pricing-rules/BulkDiscountRule';
import * as fs from 'fs';
import * as path from 'path';

export class Checkout implements CheckoutInterface {
  private scannedItems: Map<string, number> = new Map();
  private productCatalog: ProductCatalog;
  private pricingRules: PricingRule[];

  constructor(pricingRules: PricingRule[] = [], productCatalog?: ProductCatalog) {
    this.pricingRules = pricingRules;
    this.productCatalog = productCatalog || ProductCatalog.fromFile(path.resolve(__dirname, '../config.json'));
  }

  scan(sku: string): void {
    if (!this.productCatalog.hasProduct(sku)) {
      throw new Error(`Cannot scan unknown product: ${sku}`);
    }

    const currentQuantity = this.scannedItems.get(sku) || 0;
    this.scannedItems.set(sku, currentQuantity + 1);
  }

  total(): number {
    let totalInCents = 0;

    for (const [sku, quantity] of this.scannedItems) {
      const product = this.productCatalog.getProduct(sku)!;
      const applicableRules = this.pricingRules.filter(rule => rule.applies(sku));
      
      let bestPriceInCents = quantity * product.priceInCents; // Default price
      
      // Find the best price among all applicable rules
      for (const rule of applicableRules) {
        const rulePriceInCents = rule.calculatePrice(quantity, product.priceInCents);
        bestPriceInCents = Math.min(bestPriceInCents, rulePriceInCents);
      }
      
      totalInCents += bestPriceInCents;
    }

    return totalInCents / 100; // Convert cents to dollars
  }

  // Utility method for testing and debugging
  getScannedItems(): Map<string, number> {
    return new Map(this.scannedItems);
  }

  // Reset checkout for new transaction
  reset(): void {
    this.scannedItems.clear();
  }
}
