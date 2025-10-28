/**
 * this class is responsible for handling all activities involving the movement of money from the client
 * bank or cash in server to depositor account
 * 1.Initiate transction the ready the process
 * 2.collect user detail and submit to strip
 * 3.await confirmation from strip and update the db accordingly
 */
import Stripe from 'stripe';
declare class AccountTOWallet {
    initializedStrip: Stripe | undefined;
    constructor();
    updatePaymentIntent(StripeEventObject: Stripe.PaymentIntent): Promise<void>;
    updateBalance(balance: Stripe.Balance, connectedAccountId: string): Promise<void>;
}
declare const _default: AccountTOWallet;
export default _default;
//# sourceMappingURL=strip_Account_to_Wallet.d.ts.map