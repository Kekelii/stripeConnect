import Stripe from 'stripe';
import logger from '../utils/logger.js';
import { AppError } from '../utils/appError.js';
import user from '../models/user.js';
import wallet from '../models/wallet.js';
const APIKEY = process.env.STRIP_API_KEY;
class walletToAccount {
    initializedStrip;
    constructor() {
        if (!APIKEY) {
            logger.fatal('stripe APIKEY not found');
            return;
        }
        this.initializedStrip = new Stripe(APIKEY, {
            apiVersion: '2025-03-31.basil',
        });
    }
    //create connected Account
    async createConnectedAccount(userId, ip) {
        if (!this.initializedStrip) {
            logger.error('Stripe not initialized');
            return { data: null, error: new AppError('Stripe not initialized', 500) };
        }
        if (!userId) {
            throw new AppError('user id is required', 404);
        }
        try {
            const userInfo = await user.findById(userId).exec();
            if (!userInfo || !userInfo.dob || !userInfo.address) {
                throw new AppError('user not found', 404);
            }
            const account = await this.initializedStrip.accounts.create({
                controller: {
                    stripe_dashboard: { type: 'none' },
                    fees: { payer: 'application' },
                    losses: { payments: 'application' },
                    requirement_collection: 'application',
                },
                capabilities: {
                    transfers: { requested: true },
                },
                country: 'CZ',
                email: userInfo.email,
                metadata: {
                    userId,
                },
                business_type: 'individual',
                individual: {
                    first_name: userInfo.firstName,
                    last_name: userInfo.lastName,
                    dob: {
                        day: userInfo.dob.day,
                        month: userInfo.dob.month,
                        year: userInfo.dob.year,
                    },
                    address: {
                        line1: userInfo.address.line1,
                        city: userInfo.address.city,
                        postal_code: userInfo.address.postal_code,
                        country: userInfo.address.country || 'CZ',
                    },
                },
                tos_acceptance: {
                    date: Math.floor(Date.now() / 1000),
                    ip: ip,
                },
            });
            await wallet.findOneAndUpdate({ userId }, { connectedAccountId: account.id });
            return { data: account.id, error: null };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error(`Failed to create connected account: ${errorMessage}`);
            return { data: null, error: new AppError(errorMessage, 500) };
        }
    }
    //create linking Bank account
    async createAndAddbankaccount(userId, bankDetails) {
        if (!this.initializedStrip) {
            logger.error('Stripe not initialized');
            return { data: null, error: new AppError('Stripe not initialized', 500) };
        }
        try {
            const _wallet = await wallet.findOne({ userId });
            if (!userId || !_wallet || !_wallet.connectedAccountId) {
                throw new AppError('user id with a valid wallet is  is required ', 404);
            }
            const createdAndAddbankaccount = await this.initializedStrip.accounts.createExternalAccount(_wallet.connectedAccountId, {
                external_account: {
                    object: 'bank_account',
                    country: 'CZ',
                    currency: 'czk',
                    account_number: bankDetails.account_number,
                    account_holder_name: bankDetails.account_holder_name,
                    account_holder_type: bankDetails.account_holder_type,
                },
            });
            await wallet.findOneAndUpdate({ userId }, { $push: { connectedBankAccounts: createdAndAddbankaccount } });
            return { data: createdAndAddbankaccount.id, error: null };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error(`Failed to create connected account: ${errorMessage}`);
            return { data: null, error: new AppError(errorMessage, 500) };
        }
        //transfer money from wallet to account
    }
    //transfer money to tenant bank account
    async initiateBankTransfer(userId, destinationId, amount) {
        console.log('in');
        const bankDetails = await wallet.findOne({ userId }, 'connectedBankAccounts');
        if (!bankDetails) {
            throw new AppError('Wallet does not exist', 404);
        }
        const banks = bankDetails.connectedBankAccounts;
        if (banks.length < 1) {
            throw new AppError('No bank account linked with wallet', 404);
        }
        const acceptedBank = banks.find((b) => b.id === destinationId);
        if (!acceptedBank) {
            throw new AppError('Bank detination does not exist', 404);
        }
        // Step 1: Transfer funds to the connected account's balance
        const transfer = await this.initializedStrip?.transfers.create({
            amount: amount,
            currency: acceptedBank.currency,
            destination: acceptedBank.account, // Connected account ID
            description: 'Wallet withdrawal',
        });
        if (!transfer) {
            throw new AppError('Bank withdrawal failed', 404);
        }
        return { data: transfer, error: null };
    }
    //disconnect all acounts from plaform
    async disconnectAllaccount(id) {
        try {
            await this.initializedStrip?.accounts.del(id);
            // console.log(await this.initializedStrip?.accounts.list());
            return { data: true, error: null };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error(`Failed to create connected account: ${errorMessage}`);
            return { data: null, error: new AppError(errorMessage, 500) };
        }
    }
}
export default new walletToAccount();
//# sourceMappingURL=wallet_to_Account.js.map