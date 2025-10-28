import mongoose, {} from 'mongoose';
const options = { timestamps: true };
const WalletToWalletTranscationsSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    amount: { type: Number, required: true },
    receiverId: { type: String, required: true },
    senderId: { type: String, required: true },
    status: { type: String, default: 'pending' },
}, options);
export default WalletToWalletTranscationsSchema;
//# sourceMappingURL=walletToWalletTransactionsSchema.js.map