import Stripe from 'stripe';
import type { BankAccountDetails, Result } from '../global.js';
declare class walletToAccount {
    initializedStrip: Stripe | undefined;
    constructor();
    createConnectedAccount(userId: string, ip: string): Promise<Result<String>>;
    createAndAddbankaccount(userId: string, bankDetails: BankAccountDetails): Promise<Result<String>>;
    initiateBankTransfer(userId: string, destinationId: string, amount: number): Promise<Result<any>>;
    disconnectAllaccount(id: string): Promise<Result<boolean>>;
}
declare const _default: walletToAccount;
export default _default;
//# sourceMappingURL=wallet_to_Account.d.ts.map