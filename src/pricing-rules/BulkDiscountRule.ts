import { AbstractPricingRule } from './PricingRule';

export class BulkDiscountRule extends AbstractPricingRule {
  private discountPriceInCents: number;
  constructor(
    sku: string,
    private minQuantity: number,
    discountPriceInDollars: number
  ) {
    super(sku);
    this.minQuantity = minQuantity;
    this.discountPriceInCents = Math.round(discountPriceInDollars * 100);

    if (minQuantity <= 0) {
      throw new Error('Threshold must be positive');
    }
    if (discountPriceInDollars < 0) {
      throw new Error('Discount price cannot be negative');
    }
  }

  calculatePrice(quantity: number, basePriceInCents: number): number {
    if (quantity >= this.minQuantity) {
      return quantity * this.discountPriceInCents;
    }
    return quantity * basePriceInCents;
  }
}
