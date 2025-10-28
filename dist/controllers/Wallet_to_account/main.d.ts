import type Stripe from 'stripe';
export declare function processPayout(userId: string, amount: number, externalBankAccountId: string, currency?: string): Promise<Stripe.Response<Stripe.Payout>>;
export declare function addExternalBankAccountToWallet(createdExternalBankAccount: Stripe.ExternalAccount): Promise<void>;
//# sourceMappingURL=main.d.ts.map