import { Checkout } from '../src/Checkout';
import { ProductCatalog } from '../src/services/ProductCatalog';
import { BuyXGetYFreeRule } from '../src/pricing-rules/BuyXGetYFreeRule';
import { BulkDiscountRule } from '../src/pricing-rules/BulkDiscountRule';
import { ProductModel } from '../src/models/Product';
import * as path from 'path';

describe('Checkout System', () => {
  let checkout: Checkout;
  let productCatalog: ProductCatalog;

  beforeEach(() => {
    productCatalog = ProductCatalog.fromFile(path.resolve(__dirname, '../config.json'));
    const pricingRules = [
      new BuyXGetYFreeRule('atv', 2, 1), // 3 for 2 on Apple TV (Buy 2, Get 1 Free)
      new BulkDiscountRule('ipd', 5, 499.99) // Bulk discount on iPad when buying 5+
    ];
    checkout = new Checkout(pricingRules, productCatalog);
  });

  describe('Basic Functionality', () => {
    test('should scan items successfully', () => {
      expect(() => checkout.scan('atv')).not.toThrow();
      expect(() => checkout.scan('ipd')).not.toThrow();
    });

    test('should throw error for unknown SKU', () => {
      expect(() => checkout.scan('unknown')).toThrow('Cannot scan unknown product: unknown');
    });

    test('should calculate total for single item', () => {
      checkout.scan('vga');
      expect(checkout.total()).toBe(30.00);
    });

    test('should calculate total for multiple different items', () => {
      checkout.scan('vga');
      checkout.scan('mbp');
      expect(checkout.total()).toBe(1429.99);
    });
  });

  describe('Apple TV 3-for-2 Promotion', () => {
    test('should apply 3-for-2 discount correctly', () => {
      checkout.scan('atv');
      checkout.scan('atv');
      checkout.scan('atv');
      checkout.scan('vga');
      expect(checkout.total()).toBe(249.00); // 2 * 109.50 + 30.00
    });

    test('should handle 6 Apple TVs (2 complete deals)', () => {
      for (let i = 0; i < 6; i++) {
        checkout.scan('atv');
      }
      expect(checkout.total()).toBe(438.00); // 4 * 109.50
    });

    test('should handle 7 Apple TVs (2 complete deals + 1)', () => {
      for (let i = 0; i < 7; i++) {
        checkout.scan('atv');
      }
      expect(checkout.total()).toBe(547.50); // 5 * 109.50
    });
  });

  describe('iPad Bulk Discount Promotion', () => {
    test('should not apply bulk discount for 4 iPads', () => {
      for (let i = 0; i < 4; i++) {
        checkout.scan('ipd');
      }
      expect(checkout.total()).toBe(2199.96); // 4 * 549.99
    });

    test('should apply bulk discount for 5 iPads', () => {
      for (let i = 0; i < 5; i++) {
        checkout.scan('ipd');
      }
      expect(checkout.total()).toBe(2499.95); // 5 * 499.99
    });

    test('should apply bulk discount for more than 5 iPads', () => {
      for (let i = 0; i < 6; i++) {
        checkout.scan('ipd');
      }
      expect(checkout.total()).toBe(2999.94); // 6 * 499.99
    });
  });

  describe('Business Acceptance Scenarios', () => {
    test('Scenario 1: atv, atv, atv, vga = $249.00', () => {
      checkout.scan('atv');
      checkout.scan('atv');
      checkout.scan('atv');
      checkout.scan('vga');
      expect(checkout.total()).toBe(249.00);
    });

    test('Scenario 2: atv, ipd, ipd, atv, ipd, ipd, ipd = $2718.95', () => {
      checkout.scan('atv');
      checkout.scan('ipd');
      checkout.scan('ipd');
      checkout.scan('atv');
      checkout.scan('ipd');
      checkout.scan('ipd');
      checkout.scan('ipd');
      expect(checkout.total()).toBe(2718.95);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty cart', () => {
      expect(checkout.total()).toBe(0);
    });

    test('should handle scanning same item multiple times', () => {
      checkout.scan('vga');
      checkout.scan('vga');
      expect(checkout.total()).toBe(60.00);
    });

    test('should reset cart correctly', () => {
      checkout.scan('vga');
      checkout.reset();
      expect(checkout.total()).toBe(0);
    });
  });

  describe('Multiple Promotions Interaction', () => {
    test('should apply best price when multiple rules could apply', () => {
      // This would be relevant if we had overlapping rules
      checkout.scan('atv');
      checkout.scan('ipd');
      expect(checkout.total()).toBe(659.49); // 109.50 + 549.99
    });
  });
});

describe('Pricing Rules', () => {
  describe('BuyXGetYFreeRule', () => {
    test('should create rule with valid parameters', () => {
      expect(() => new BuyXGetYFreeRule('atv', 2, 1)).not.toThrow();
    });

    test('should throw error for invalid parameters', () => {
      expect(() => new BuyXGetYFreeRule('atv', 0, 1)).toThrow();
      expect(() => new BuyXGetYFreeRule('atv', 2, 0)).toThrow();
    });

    test('should calculate price correctly for various quantities', () => {
      const rule = new BuyXGetYFreeRule('atv', 2, 1);
      expect(rule.calculatePrice(1, 100)).toBe(100);
      expect(rule.calculatePrice(2, 100)).toBe(200);
      expect(rule.calculatePrice(3, 100)).toBe(200); // 3 for 2
      expect(rule.calculatePrice(4, 100)).toBe(300);
      expect(rule.calculatePrice(6, 100)).toBe(400); // 2 complete deals
    });
  });

  describe('BulkDiscountRule', () => {
    test('should create rule with valid parameters', () => {
      expect(() => new BulkDiscountRule('ipd', 5, 499.99)).not.toThrow();
    });

    test('should throw error for invalid parameters', () => {
      expect(() => new BulkDiscountRule('ipd', 0, 499.99)).toThrow();
      expect(() => new BulkDiscountRule('ipd', 5, -1)).toThrow();
    });

    test('should calculate price correctly', () => {
      const rule = new BulkDiscountRule('ipd', 5, 450.00);
      expect(rule.calculatePrice(4, 50000)).toBe(200000); // 4 * 500
      expect(rule.calculatePrice(5, 50000)).toBe(225000); // 5 * 450
      expect(rule.calculatePrice(10, 50000)).toBe(450000); // 10 * 450
    });
  });
});

describe('ProductCatalog', () => {
  let catalog: ProductCatalog;

  beforeEach(() => {
    catalog = ProductCatalog.fromFile(path.resolve(__dirname, '../config.json'));
  });

  test('should have default products', () => {
    expect(catalog.hasProduct('ipd')).toBe(true);
    expect(catalog.hasProduct('mbp')).toBe(true);
    expect(catalog.hasProduct('atv')).toBe(true);
    expect(catalog.hasProduct('vga')).toBe(true);
  });

  test('should get product details', () => {
    const ipad = catalog.getProduct('ipd');
    expect(ipad.name).toBe('Super iPad');
    expect(ipad.priceInCents).toBe(54999);
  });

  test('should throw error for unknown product', () => {
    expect(() => catalog.getProduct('unknown')).toThrow(/Product with SKU 'unknown' not found/);
  });
});

describe('ProductModel', () => {
  test('should throw error if price is negative', () => {
    expect(() => new ProductModel('test', 'Test Product', -10)).toThrow('Product price cannot be negative');
  });
});

describe('Integration Tests', () => {
  test('should work with factory function', () => {
    const productCatalog = ProductCatalog.fromFile(path.resolve(__dirname, '../config.json'));
    const pricingRules = [
      new BuyXGetYFreeRule('atv', 2, 1), // 3 for 2 deal on Apple TV (Buy 2, Get 1 Free)
      new BulkDiscountRule('ipd', 5, 499.99) // Bulk discount on Super iPad
    ];
    const checkout = new Checkout(pricingRules, productCatalog);
    
    // Test the business scenarios
    checkout.scan('atv');
    checkout.scan('atv');
    checkout.scan('atv');
    checkout.scan('vga');
    expect(checkout.total()).toBe(249.00);
    
    checkout.reset();
    
    checkout.scan('atv');
    checkout.scan('ipd');
    checkout.scan('ipd');
    checkout.scan('atv');
    checkout.scan('ipd');
    checkout.scan('ipd');
    checkout.scan('ipd');
    expect(checkout.total()).toBe(2718.95);
  });
});
