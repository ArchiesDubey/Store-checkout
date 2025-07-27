import { ProductModel } from '../models/Product';
import { Product } from '../models/interfaces';

export const defaultProducts: Product[] = [
  new ProductModel('ipd', 'Super iPad', 549.99),
  new ProductModel('mbp', 'MacBook Pro', 1399.99),
  new ProductModel('atv', 'Apple TV', 109.50),
  new ProductModel('vga', 'VGA adapter', 30.00)
];
