import { PricingRule } from '../models/interfaces';

export abstract class AbstractPricingRule implements PricingRule {
  constructor(protected sku: string) {}

  applies(sku: string): boolean {
    return this.sku === sku;
  }

  abstract calculatePrice(quantity: number, basePriceInCents: number): number;
}
