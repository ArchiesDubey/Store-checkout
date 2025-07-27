import { Product } from '../models/interfaces';
import { ProductModel } from '../models/Product';
import * as fs from 'fs';

export class ProductCatalog {
  private products: Map<string, Product> = new Map();

  private constructor(products: Product[]) {
    products.forEach(product => {
      this.products.set(product.sku, product);
    });
  }

  static fromFile(filePath: string): ProductCatalog {
    const productsData = JSON.parse(fs.readFileSync(filePath, 'utf-8')).products;
    const products = productsData.map(
      (p: any) => new ProductModel(p.sku, p.name, p.price)
    );
    return new ProductCatalog(products);
  }

  static fromRepository(products: Product[]): ProductCatalog {
    return new ProductCatalog(products);
  }

  getProduct(sku: string): Product {
    const product = this.products.get(sku);
    if (!product) {
      throw new Error(`Product with SKU '${sku}' not found`);
    }
    return product;
  }

  hasProduct(sku: string): boolean {
    return this.products.has(sku);
  }
}
