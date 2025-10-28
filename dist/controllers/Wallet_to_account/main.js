import stripe from '../../classes/stripe.js';
import wallet from '../../models/wallet.js';
import { AppError } from '../../utils/appError.js';
import Withdrawals from '../../models/Withdrawals.js';
import logger from '../../utils/logger.js';
export async function processPayout(userId, amount, externalBankAccountId, currency) {
    try {
        const walletObj = (await wallet.findOne({ userId }));
        const connectedAccountId = walletObj.connectedAccountId;
        const connectedAccounts = walletObj.connectedBankAccounts;
        const accountExists = connectedAccounts?.includes(externalBankAccountId);
        const DbtrabsactionId = crypto.randomUUID();
        const selectedCurrency = currency || 'czk';
        if (!accountExists) {
            throw new AppError('Account does not exist', 404);
        }
        const externalBankDetails = stripe.getExternalBankaccountDetails(connectedAccountId, externalBankAccountId);
        if (!externalBankDetails) {
            throw new AppError('Account does not exist', 404);
        }
        const payout = await stripe.initiatePayout(connectedAccountId, selectedCurrency, externalBankAccountId, amount);
        await Withdrawals.insertOne({
            _id: payout.id,
            amount: payout.amount,
            tranasferMethod: 'Bank Transfer',
            walletId: walletObj._id?.toString(),
            status: 'pending',
        });
        return payout;
    }
    catch (err) {
        throw new AppError(err.message, 404);
    }
}
//hook event
export async function addExternalBankAccountToWallet(createdExternalBankAccount) {
    try {
        const connectedAccountId = createdExternalBankAccount.account;
        await wallet.findOneAndUpdate({ connectedAccountId }, {
            $push: {
                connectedBankAccounts: createdExternalBankAccount.id,
            },
        });
    }
    catch (error) {
        logger.warn(error, 'something went wrong');
    }
}
//# sourceMappingURL=main.js.map