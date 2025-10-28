import mongoose, {} from "mongoose";
const options = { timestamps: true };
const walletIncomeTransactionsSchema = new mongoose.Schema({
    commission: { type: Number, required: true },
    referalId: { type: String, required: true },
    referedUser: { type: String, required: true },
    brokerId: { type: String, reqired: true },
    brokerName: { type: String, required: true },
    status: { type: String, default: 'pending' }
}, options);
export default walletIncomeTransactionsSchema;
//# sourceMappingURL=walletIncomeTransactionsSchema.js.map