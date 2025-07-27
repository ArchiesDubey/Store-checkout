import { AbstractPricingRule } from './PricingRule';

export class BuyXGetYFreeRule extends AbstractPricingRule {
  private buyQuantity: number;
  private freeQuantity: number;

  constructor(sku: string, buyQuantity: number, freeQuantity: number = 1) {
    super(sku);
    this.buyQuantity = buyQuantity;
    this.freeQuantity = freeQuantity;

    if (buyQuantity <= 0 || freeQuantity <= 0) {
      throw new Error('Buy and free quantities must be positive');
    }
  }

  calculatePrice(quantity: number, basePriceInCents: number): number {
    if (quantity < this.buyQuantity) {
      return quantity * basePriceInCents;
    }

    const dealGroupSize = this.buyQuantity + this.freeQuantity;
    const completeDeals = Math.floor(quantity / dealGroupSize);
    const remainingItems = quantity % dealGroupSize;
    
    const paidItems = completeDeals * this.buyQuantity + 
                     Math.min(remainingItems, this.buyQuantity);

    return paidItems * basePriceInCents;
  }
}
