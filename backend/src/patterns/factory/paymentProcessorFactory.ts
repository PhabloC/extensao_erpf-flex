export interface PaymentResult {
  provider: string;
  transactionId: string;
  status: 'processed';
}

interface PaymentProcessor {
  process(amount: number): PaymentResult;
}

class CardPaymentProcessor implements PaymentProcessor {
  process(amount: number): PaymentResult {
    return {
      provider: 'card-gateway',
      transactionId: `card-${amount.toFixed(0)}`,
      status: 'processed',
    };
  }
}

class PixPaymentProcessor implements PaymentProcessor {
  process(amount: number): PaymentResult {
    return {
      provider: 'pix-gateway',
      transactionId: `pix-${amount.toFixed(0)}`,
      status: 'processed',
    };
  }
}

export class PaymentProcessorFactory {
  create(method: 'card' | 'pix'): PaymentProcessor {
    const processors = {
      card: new CardPaymentProcessor(),
      pix: new PixPaymentProcessor(),
    } satisfies Record<'card' | 'pix', PaymentProcessor>;

    return processors[method];
  }
}
