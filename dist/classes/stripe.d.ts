import Stripe from 'stripe';
import type { BankAccountDetails, StripeConnectedAccountUser, StripeCustomerPayload } from '../global.js';
declare class _Stripe extends Stripe {
    ternatePlusId: string;
    constructor();
    createCustomer(customerPayload: StripeCustomerPayload): Promise<string>;
    getCustomerDetails(customerId: string): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>>;
    removeCustomer(customerId: string): Promise<Stripe.Response<Stripe.DeletedCustomer>>;
    createTernatePlus(customerId: string, currency?: string): Promise<string>;
    cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription.Status>;
    getSubscriptionStatus(subscriptionId: string): Promise<Stripe.Response<Stripe.Subscription>>;
    getSubscriptionsOfCustomer(customerId: string): Promise<Stripe.Response<Stripe.ApiList<Stripe.Subscription>>>;
    createConnectedAccount(Payload: StripeConnectedAccountUser, ip: string): Promise<string>;
    getConnectedAccount(connectedAccountId: string): Promise<Stripe.Response<Stripe.Account>>;
    disconnectAccount(connectedAccountId: string): Promise<true>;
    addExternalaccount(connectedAccountId: string, bankDetails: BankAccountDetails): Promise<string>;
    getExternalAccounts(accountId: string): Promise<Stripe.Response<Stripe.ApiList<Stripe.ExternalAccount>>>;
    createPaymentIntent(userId: string, accountId: string, amount: number, currency?: string): Promise<string | null>;
    updatePaymentIntent(paymentIntentId: string, updates: Stripe.PaymentIntentUpdateParams): Promise<Stripe.Response<Stripe.PaymentIntent>>;
    initiatePayout(connectedAccountId: string, currency: string, externalBankAccountId: string, amount: number): Promise<Stripe.Response<Stripe.Payout>>;
    connectedAccountBalance(accountId: string): Promise<number | null>;
    transferMoneyFromConnectedAccount(currency: string, amount: number, originAccount: string, destinationAccountId?: string): Promise<Stripe.Response<Stripe.Transfer>>;
    transferToConnectedAccount(currency: string, amount: number, destinationConnectedAccountId: string): Promise<Stripe.Response<Stripe.Transfer>>;
    checkAccountBalance(accountId: string): Promise<Stripe.Response<Stripe.Balance>>;
    validateWebHook(sig: string, body: Buffer | string): Promise<Stripe.Event>;
    addBankAccount(connectedAccountId: string, bankDetails: Stripe.AccountCreateExternalAccountParams): Promise<Stripe.Response<Stripe.ExternalAccount>>;
    getExternalBankaccountDetails(connectAccountId: string, externalBankId: string): Promise<Stripe.Response<Stripe.ExternalAccount>>;
    getBankAccounts(connectAccountId: string): Promise<Stripe.Response<Stripe.ApiList<Stripe.ExternalAccount>>>;
}
declare const _default: _Stripe;
export default _default;
//# sourceMappingURL=stripe.d.ts.map