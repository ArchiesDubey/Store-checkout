import { Product } from './interfaces';

export class ProductModel implements Product {
  public sku: string;
  public name: string;
  public priceInCents: number;

  constructor(sku: string, name: string, priceInDollars: number) {
    if (priceInDollars < 0) {
      throw new Error('Product price cannot be negative');
    }
    this.sku = sku;
    this.name = name;
    this.priceInCents = Math.round(priceInDollars * 100);
  }
}
