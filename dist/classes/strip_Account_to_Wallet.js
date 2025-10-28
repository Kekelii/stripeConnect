/**
 * this class is responsible for handling all activities involving the movement of money from the client
 * bank or cash in server to depositor account
 * 1.Initiate transction the ready the process
 * 2.collect user detail and submit to strip
 * 3.await confirmation from strip and update the db accordingly
 */
//imports
import Stripe from 'stripe';
import logger from '../utils/logger.js';
import { AppError } from '../utils/appError.js';
import PaymentIntents from '../models/paymentIntents.js';
import wallet from '../models/wallet.js';
import stripe from './stripe.js';
const APIKEY = process.env.STRIP_API_KEY;
class AccountTOWallet {
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
    //hooks event
    async updatePaymentIntent(StripeEventObject) {
        const dataObject = StripeEventObject;
        const paymentIntent = dataObject.id;
        const paymentIntentStatus = dataObject.status;
        const metadata = dataObject.metadata;
        const connectedAccountId = metadata.accountId;
        const userId = metadata.userId;
        const currency = dataObject.currency;
        const amount = dataObject.amount ? dataObject.amount / 100 : 0;
        try {
            if (paymentIntentStatus == 'requires_payment_method') {
                await PaymentIntents.create({
                    userId,
                    paymentIntent: { id: paymentIntent, amount, currency },
                    status: paymentIntentStatus,
                });
            }
            await PaymentIntents.updateOne({
                userId,
                'paymentIntent.id': paymentIntent,
            }, { $set: { status: paymentIntentStatus, amount } });
            if (paymentIntentStatus === 'succeeded') {
                const balance = (await stripe.connectedAccountBalance(connectedAccountId));
                await wallet.updateOne({ userId }, { $set: { pendingBalance: balance / 100 } });
            }
        }
        catch (error) {
            logger.warn(error, 'something went wrong');
        }
    }
    //hook event
    async updateBalance(balance, connectedAccountId) {
        try {
            if (!balance || !connectedAccountId) {
                if (!balance) {
                    throw new AppError('Balance object is required for  updating balance', 500);
                }
                else {
                    logger.info('platform balanced with %');
                    return;
                }
            }
            const _balance = await stripe.balance.retrieve({
                stripeAccount: connectedAccountId,
            });
            const availableAmount = _balance.available.reduce((sum, b) => sum + (b.amount ?? 0), 0);
            const pendingAmount = _balance.pending.reduce((sum, p) => sum + (p.amount ?? 0), 0);
            await wallet.updateOne({ connectedAccountId }, {
                $set: {
                    balance: availableAmount / 100,
                    pendingBalance: pendingAmount / 100,
                },
            });
        }
        catch (error) {
            logger.warn(error, 'something went wrong');
        }
    }
}
export default new AccountTOWallet();
//# sourceMappingURL=strip_Account_to_Wallet.js.map