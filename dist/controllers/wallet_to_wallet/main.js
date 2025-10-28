import { destination } from 'pino';
import stripe from '../../classes/stripe.js';
import { AppError } from '../../utils/appError.js';
import wallet from '../../models/wallet.js';
import WalletToWalletTranscations from '../../models/WalletToWalletTranscations.js';
export async function TransferBetweenWallets(_originUserId, _destinationUserId, amount) {
    try {
        const originAccountObj = await wallet.findOne({ userId: _originUserId });
        const destinationAccountObj = await wallet.findOne({
            userId: _destinationUserId,
        });
        const originAccount = originAccountObj?.connectedAccountId;
        const destinationAccount = destinationAccountObj?.connectedAccountId;
        const amountMinor = Math.round(amount * 100);
        const originBalance = await stripe.checkAccountBalance(originAccount);
        const availableOrigin = originBalance.available.reduce((sum, b) => sum + b.amount, 0);
        if (availableOrigin < amountMinor) {
            throw new Error('Insufficient funds in origin account');
        }
        //move money to platform
        const toPlatform = await stripe.transferMoneyFromConnectedAccount('czk', amountMinor, originAccount, destinationAccount);
        //calculate platform fees
        const feePercentage = 0.005; // 0.5%
        const fee = Math.round(amountMinor * feePercentage);
        const finalAmount = amountMinor - fee;
        //move to destination account
        const toDestination = await stripe.transferToConnectedAccount('czk', finalAmount, destinationAccount);
        await WalletToWalletTranscations.insertOne({
            receiverId: destinationAccountObj?.userId,
            amount: finalAmount / 100,
            senderId: originAccountObj?.userId,
            _id: toDestination.id,
            status: 'pending',
        });
        return {
            originAccount,
            destination,
            amount: finalAmount / 100,
            platform: 0.5,
        };
    }
    catch (err) {
        throw new AppError(err.message, 404);
    }
}
//# sourceMappingURL=main.js.map