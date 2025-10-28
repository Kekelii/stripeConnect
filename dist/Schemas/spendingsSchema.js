import mongoose from 'mongoose';
const options = { timestamps: true };
const Spendings = new mongoose.Schema({
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    spendingType: { type: String, required: true },
    createdAt: { type: Date, required: false },
}, options);
export default Spendings;
//# sourceMappingURL=spendingsSchema.js.map