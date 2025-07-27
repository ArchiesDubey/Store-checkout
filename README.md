# Zeller Checkout System

A flexible checkout system for Zeller computer store with configurable pricing rules.

## Features

- Product scanning and total calculation
- Flexible pricing rule engine
- Support for promotional offers (Buy X Get Y Free, Bulk Discounts)
- TypeScript implementation with full type safety
- Comprehensive unit test coverage
- Monetary values handled in integer cents to avoid floating-point inaccuracies.
- Product catalog loaded from `config.json` for easy modification.

## Installation

```bash
npm install
npm run build
```

## Usage

```typescript
import { createDefaultCheckout } from './src';

const checkout = createDefaultCheckout();

checkout.scan('atv');
checkout.scan('atv');
checkout.scan('atv');
checkout.scan('vga');

console.log(checkout.total()); // $249.00
```

## Testing

```bash
npm test                # Run all tests
npm run test:coverage   # Run tests with coverage
npm run test:watch      # Run tests in watch mode
```

## Architecture

The system is built with flexibility and extensibility in mind:

- **Checkout**: Main orchestrator for scanning and calculations
- **PricingRule**: Abstract interface for promotional rules
- **ProductCatalog**: Manages product information, now configurable from `config.json`
- **Pricing Rules**: Configurable promotional logic

## Adding New Pricing Rules

Create a new class implementing the `PricingRule` interface:

```typescript
export class NewPromotionRule extends BasePricingRule {
  calculatePrice(quantity: number, basePriceInCents: number): number {
    // Your promotion logic here
  }
}
```

Then, add the new rule to your `config.json` and ensure it's instantiated in your `Checkout` setup.

## Current Test Coverage

As of the last run, test coverage is high, with minor uncovered branches primarily due to the nature of `Math.min` in the `Checkout` class and the current set of pricing rules always providing a discount. All critical paths and business requirements are fully covered by tests.

This implementation provides a solid foundation that can scale with Zeller's business needs while maintaining the flexibility required for rapid promotional changes.
