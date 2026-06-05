export interface ShippingResult {
  carrier: string;
  fee: number;
  deliveryWindow: string;
}

export interface ShippingStrategy {
  calculate(orderTotal: number): ShippingResult;
}

export class StandardShippingStrategy implements ShippingStrategy {
  calculate(orderTotal: number): ShippingResult {
    return {
      carrier: 'Standard Carrier',
      fee: orderTotal > 200 ? 0 : 14.9,
      deliveryWindow: '5 to 7 business days',
    };
  }
}

export class ExpressShippingStrategy implements ShippingStrategy {
  calculate(orderTotal: number): ShippingResult {
    return {
      carrier: 'Express Carrier',
      fee: orderTotal > 500 ? 19.9 : 29.9,
      deliveryWindow: '1 to 2 business days',
    };
  }
}

export class PickupShippingStrategy implements ShippingStrategy {
  calculate(): ShippingResult {
    return {
      carrier: 'Store Pickup',
      fee: 0,
      deliveryWindow: 'Available in 2 hours',
    };
  }
}

export function resolveShippingStrategy(
  method: 'standard' | 'express' | 'pickup',
) {
  const strategies = {
    standard: new StandardShippingStrategy(),
    express: new ExpressShippingStrategy(),
    pickup: new PickupShippingStrategy(),
  } satisfies Record<'standard' | 'express' | 'pickup', ShippingStrategy>;

  return strategies[method];
}
