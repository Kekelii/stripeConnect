import mongoose from 'mongoose';
const options = { timestamps: true };
const ServiceFeesSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    transactionType: { type: String, required: true },
    userId: { type: String, required: true },
    walletId: { type: String, required: true },
    status: { type: String, required: true },
}, options);
export default ServiceFeesSchema;
//# sourceMappingURL=serviceFeesSchema.js.map