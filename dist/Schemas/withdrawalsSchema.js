import mongoose, {} from 'mongoose';
const options = { timestamps: true };
const WithdrawalsSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    amount: { type: Number, required: true },
    tranasferMethod: { type: String, required: true },
    walletId: { type: String, required: true },
    accountNumber: { type: String, required: true },
    status: { type: String, default: 'pending' },
}, options);
export default WithdrawalsSchema;
//# sourceMappingURL=withdrawalsSchema.js.map