import mongoose from 'mongoose';
const options = { timestamps: false };
const Earnings = new mongoose.Schema({
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    earningType: { type: String, required: true },
    createdAt: { type: Date, required: false },
}, options);
export default Earnings;
//# sourceMappingURL=earningsSchemma.js.map