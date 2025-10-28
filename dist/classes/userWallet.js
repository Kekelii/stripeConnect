//this class is responsible for creating user wallets
import { nanoid } from 'nanoid';
import user from '../models/user.js';
import wallet from '../models/wallet.js';
import { AppError } from '../utils/appError.js';
class User {
    constructor() { }
    async getUser(userId) {
        try {
            const _user = await user.findById(userId);
            if (!_user)
                throw new AppError('User does not exit', 404);
            const userObj = _user.toObject();
            delete userObj.password;
            return userObj;
        }
        catch (err) {
            throw new AppError(err.message, 404);
        }
    }
    async createUserWallet(userId, customerId, connectedAccountId) {
        //check if user and wallet exists
        const { ternateId, brokerId } = this.generateTernantBrokerId();
        const preWalletInfo = {
            userId: userId,
            ternatId: ternateId,
            brokerId: brokerId,
            balance: 0,
            pendingBalance: 0,
            earnings: 0,
            spendings: 0,
            isEligible: false,
            connectedAccountId,
            customerId,
            quickTransfers: [],
            connectedBankAccounts: [],
        };
        const createdWallet = await wallet.insertOne(preWalletInfo);
        return { data: createdWallet, error: null };
    }
    async updateWallet(userId, walletUpdate) {
        //check if user and wallet exists
        const userExists = await user.findById(userId).exec();
        const walletExist = await wallet.findOne({ userId }).exec();
        if (!userExists) {
            throw new Error('User does not exist');
        }
        if (!walletExist) {
            throw new Error('Wallet does not exist');
        }
        const updates = await wallet.findOneAndUpdate({ userId }, walletUpdate);
        return { data: updates, error: null };
    }
    async deleteWallet(userId) {
        //check if user and wallet exists
        const userExists = await user.findById(userId).exec();
        const walletExist = await wallet.findOne({ userId }).exec();
        if (!userExists) {
            throw new Error('User does not exist');
        }
        if (!walletExist) {
            throw new Error('Wallet does not exist');
        }
        const deletedWallet = await wallet.deleteOne({ userId }).exec();
        return { data: deletedWallet, error: null };
    }
    generateTernantBrokerId() {
        let id = nanoid();
        return {
            ternateId: `T-${id}`,
            brokerId: `B-${id}`,
        };
    }
}
export default new User();
//# sourceMappingURL=userWallet.js.map