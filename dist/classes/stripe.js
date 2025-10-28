import Stripe from 'stripe';
import logger from '../utils/logger.js';
import wallet from '../models/wallet.js';
import { randomUUID } from 'node:crypto';
const APIKEY = process.env.STRIP_API_KEY;
const webHookSecret = process.env.WEBHOOKS_SECRETS;
class _Stripe extends Stripe {
    ternatePlusId = 'price_1RyJeJAmslBBInwXy822WdEK';
    constructor() {
        if (!APIKEY) {
            logger.fatal('stripe APIKEY not found');
            return;
        }
        super(APIKEY, {
            apiVersion: '2025-03-31.basil',
        });
    }
    //create customer
    async createCustomer(customerPayload) {
        const customer = await this.customers.create({
            ...customerPayload,
        });
        return customer.id;
    }
    //get customer details
    async getCustomerDetails(customerId) {
        const customer = await this.customers.retrieve(customerId);
        return customer;
    }
    //delete user account
    async removeCustomer(customerId) {
        const removedAccount = await this.customers.del(customerId);
        return removedAccount;
    }
    //create subscription for customer
    async createTernatePlus(customerId, currency) {
        const subscription = await this.subscriptions.create({
            customer: customerId,
            currency: currency || 'CZK',
            items: [{ price: this.ternatePlusId }],
        });
        return subscription.id;
    }
    //council subscription
    async cancelSubscription(subscriptionId) {
        const subscription = await this.subscriptions.cancel(subscriptionId);
        return subscription.status;
    }
    //get subscription status . You pass the subscription id of the user
    async getSubscriptionStatus(subscriptionId) {
        const status = await this.subscriptions.retrieve(subscriptionId);
        return status;
    }
    //get all subscriptions of a particular user
    async getSubscriptionsOfCustomer(customerId) {
        const subscriptions = await this.subscriptions.list({
            customer: customerId,
            status: 'all',
        });
        return subscriptions;
    }
    //create connected account
    async createConnectedAccount(Payload, ip) {
        const connectedAccount = await this.accounts.create({
            controller: {
                stripe_dashboard: { type: 'none' },
                fees: { payer: 'application' },
                losses: { payments: 'application' },
                requirement_collection: 'application',
            },
            capabilities: {
                transfers: { requested: true },
                card_payments: { requested: true },
            },
            country: Payload.address.country ?? 'CZ',
            email: Payload.email,
            metadata: {
                userId: Payload.metadata.userId,
            },
            business_type: 'individual',
            //the default url is user name or id
            business_profile: {
                mcc: '5734',
                url: 'https://deposito.com/profile/' + Payload.metadata.userId,
            },
            // the default external account is deposito external account
            external_account: 'btok_us_verified',
            individual: {
                first_name: Payload.firstName,
                last_name: Payload.lastName,
                email: Payload.email,
                dob: {
                    day: Payload.dob.day,
                    month: Payload.dob.month,
                    year: Payload.dob.year,
                },
                phone: Payload.address.phone,
                address: {
                    line1: Payload.address.line1,
                    city: Payload.address.city,
                    postal_code: Payload.address.postal_code,
                    country: Payload.address.country || 'CZ',
                },
            },
            tos_acceptance: {
                date: Math.floor(Date.now() / 1000),
                ip: ip,
            },
        });
        return connectedAccount.id;
    }
    //get connect account
    async getConnectedAccount(connectedAccountId) {
        const account = await this.accounts.retrieve(connectedAccountId);
        return account;
    }
    //disconnect Account
    async disconnectAccount(connectedAccountId) {
        const account = await this.accounts.del(connectedAccountId);
        return account.deleted;
    }
    //add external account to connectedAccount
    async addExternalaccount(connectedAccountId, bankDetails) {
        const externalAccount = await this.accounts.createExternalAccount(connectedAccountId, {
            external_account: {
                object: 'bank_account',
                country: 'CZ',
                currency: 'czk',
                account_number: bankDetails.account_number,
                account_holder_name: bankDetails.account_holder_name,
                account_holder_type: bankDetails.account_holder_type,
            },
        });
        return externalAccount.id;
    }
    //get all the connectedExternal accounts attached to a connected account
    async getExternalAccounts(accountId) {
        const externalAccounts = this.accounts.listExternalAccounts(accountId);
        return externalAccounts;
    }
    //create payment intent
    async createPaymentIntent(userId, accountId, amount, currency) {
        const feePercentage = 0.5 / 100; // 0.5%
        const platformPercentage = Math.round(amount * 100 * feePercentage);
        const paymentIntent = await this.paymentIntents.create({
            amount: amount * 100,
            currency: currency || 'czk',
            automatic_payment_methods: { enabled: true },
            metadata: { accountId, userId },
            description: 'Bank to Wallet',
            transfer_data: {
                destination: accountId,
            },
            application_fee_amount: platformPercentage,
        });
        return paymentIntent.client_secret;
    }
    //update payment intent
    async updatePaymentIntent(paymentIntentId, updates) {
        const updatedIntent = await this.paymentIntents.update(paymentIntentId, updates);
        return updatedIntent;
    }
    //transfer to bank || initate payout
    async initiatePayout(connectedAccountId, currency, externalBankAccountId, amount) {
        const payout = await this.payouts.create({
            amount: amount * 100,
            currency,
            destination: externalBankAccountId,
            description: 'Wallet withdrawal',
            metadata: { connectedAccountId },
        }, {
            stripeAccount: connectedAccountId,
        });
        return payout;
    }
    //check connected account balance
    async connectedAccountBalance(accountId) {
        const balance = await this.balance.retrieve({
            stripeAccount: accountId,
        });
        return balance.instant_available?.[0]?.amount ?? null;
    }
    //transfer money from connected account to platform
    async transferMoneyFromConnectedAccount(currency, amount, originAccount, destinationAccountId) {
        //transfer from connected account platform
        const transfer = await this.transfers.create({
            amount,
            currency,
            destination: process.env.PLATFORM_ACCOUNT_ID, // back to platform
            description: 'Reclaim from origin account',
            metadata: {
                destinationAccountId: process.env.PLATFORM_ACCOUNT_ID,
                amount,
                type: 'WalletToWallet',
                originAccount,
            },
        }, { stripeAccount: originAccount });
        return transfer;
    }
    //transfer money from platform to connected account
    async transferToConnectedAccount(currency, amount, destinationConnectedAccountId) {
        // from platform to destination
        const transfer = await this.transfers.create({
            amount,
            destination: destinationConnectedAccountId,
            currency: currency || 'CZK',
            metadata: {
                destinationAccount: destinationConnectedAccountId,
            },
        });
        return transfer;
    }
    //check connected account balance
    async checkAccountBalance(accountId) {
        const balance = await this.balance.retrieve({
            stripeAccount: accountId,
        });
        return balance;
    }
    //validate webhook event and returns an event
    async validateWebHook(sig, body) {
        return this.webhooks.constructEvent(body, sig, webHookSecret);
    }
    //add externalBank external to account
    async addBankAccount(connectedAccountId, bankDetails) {
        const bank = await this.accounts.createExternalAccount(connectedAccountId, bankDetails);
        return bank;
    }
    //get externalBankaccount details
    async getExternalBankaccountDetails(connectAccountId, externalBankId) {
        return this.accounts.retrieveExternalAccount(connectAccountId, externalBankId);
    }
    //get list of connected bank accounts
    async getBankAccounts(connectAccountId) {
        return await this.accounts.listExternalAccounts(connectAccountId, {
            object: 'bank_account',
        });
    }
}
export default new _Stripe();
//# sourceMappingURL=stripe.js.map