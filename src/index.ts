export { Checkout } from './Checkout';
export { ProductCatalog } from './services/ProductCatalog';
export { ProductModel } from './models/Product';
export { BuyXGetYFreeRule } from './pricing-rules/BuyXGetYFreeRule';
export { BulkDiscountRule } from './pricing-rules/BulkDiscountRule';
export * from './models/interfaces';

import { Checkout } from './Checkout';
import { ProductCatalog } from './services/ProductCatalog';
import { BuyXGetYFreeRule } from './pricing-rules/BuyXGetYFreeRule';
import { BulkDiscountRule } from './pricing-rules/BulkDiscountRule';
import * as path from 'path';

// Example usage and setup
export function createDefaultCheckout(): Checkout {
  const productCatalog = ProductCatalog.fromFile(path.resolve(__dirname, '../config.json'));
  const pricingRules = [
    new BuyXGetYFreeRule('atv', 2, 1), // 3 for 2 deal on Apple TV (Buy 2, Get 1 Free)
    new BulkDiscountRule('ipd', 5, 499.99) // Bulk discount on Super iPad
  ];
  
  return new Checkout(pricingRules, productCatalog);
}

// Example of how to use the checkout system
async function runExample() {
  const checkout = createDefaultCheckout();

  console.log('\n--- Scenario 1: atv, atv, atv, vga ---');
  checkout.scan('atv');
  checkout.scan('atv');
  checkout.scan('atv');
  checkout.scan('vga');
  console.log('Total: 
 + checkout.total().toFixed(2)); // Expected: $249.00

  checkout.reset();

  console.log('\n--- Scenario 2: atv, ipd, ipd, atv, ipd, ipd, ipd ---');
  checkout.scan('atv');
  checkout.scan('ipd');
  checkout.scan('ipd');
  checkout.scan('atv');
  checkout.scan('ipd');
  checkout.scan('ipd');
  checkout.scan('ipd');
  console.log('Total: 
 + checkout.total().toFixed(2)); // Expected: $2718.95
}

// Run the example if this file is executed directly
if (require.main === module) {
  runExample();
}
