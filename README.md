# Zeller Checkout System

A flexible checkout system for Zeller's computer store, designed for easy product scanning, pricing, and promotional offers.

## Key Features

-   **Product Handling:** Items can be scanned and totals calculated.
-   **Flexible Pricing:** A powerful rule engine supports various promotions (e.g., Buy X Get Y Free, bulk discounts).
-   **Robust & Accurate:** Built with TypeScript for type safety, comprehensive tests, and uses integer cents for precise monetary calculations.
-   **Configurable:** The product catalog and pricing rules are easily updated via `config.json`.

## Setup

```bash
npm install
npm run build
```

## Usage Example

```typescript
import { createDefaultCheckout } from './src';

const checkout = createDefaultCheckout();

checkout.scan('atv');
checkout.scan('atv');
checkout.scan('atv');
checkout.scan('vga');

console.log(checkout.total()); // Expected: $249.00
```

## Testing

```bash
npm test                # Runs all tests
npm run test:coverage   # Runs tests with coverage report
npm run test:watch      # Runs tests in watch mode
```

## Architecture Overview

The system is modular and extensible:

-   **Checkout:** Orchestrates scanning and total calculation.
-   **PricingRule:** Defines the interface for all promotional rules.
-   **ProductCatalog:** Manages product information, loaded from `config.json`.
-   **Pricing Rules:** Implement specific promotional logic.

## Extending with New Pricing Rules

To add a new promotion, a new rule can be added to `config.json` and ensured it is included in the `Checkout` setup.

## Test Coverage
----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------------------|---------|----------|---------|---------|-------------------
All files             |   97.33 |     87.5 |      90 |   97.29 |                   
 src                  |   95.65 |    71.42 |   83.33 |   95.45 |                   
  Checkout.ts         |   95.65 |    71.42 |   83.33 |   95.45 | 50                
 src/models           |     100 |      100 |     100 |     100 |                   
  Product.ts          |     100 |      100 |     100 |     100 |                   
 src/pricing-rules    |     100 |     92.3 |     100 |     100 |                   
  BulkDiscountRule.ts |     100 |      100 |     100 |     100 |                   
  BuyXGetYFreeRule.ts |     100 |    85.71 |     100 |     100 | 7                 
  PricingRule.ts      |     100 |      100 |     100 |     100 |                   
 src/services         |   93.75 |      100 |   85.71 |   93.75 |                   
  ProductCatalog.ts   |   93.75 |      100 |   85.71 |   93.75 | 23                
----------------------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       27 passed, 27 total
Snapshots:   0 total
Time:        1.408 s
