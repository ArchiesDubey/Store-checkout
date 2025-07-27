import { Product } from '../models/interfaces';
import { ProductModel } from '../models/Product';

// This is a mock repository simulating a database connection.
// In a real application, this would interact with a database.
export class ProductRepository {
  async getAllProducts(): Promise<Product[]> {
    // Simulate async DB call
    return Promise.resolve([
      new ProductModel('ipd', 'Super iPad', 549.99),
      new ProductModel('mbp', 'MacBook Pro', 1399.99),
      new ProductModel('atv', 'Apple TV', 109.50),
      new ProductModel('vga', 'VGA adapter', 30.00)
    ]);
  }
}
