import mongoose from 'mongoose';
const options = { timestamps: true };
const paymentIntents = new mongoose.Schema({
    userId: { type: String, required: true },
    paymentIntent: {
        id: { type: String, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
    },
    status: { type: String, default: 'pending' },
    clientSecret: { type: String, required: false },
}, options);
export default paymentIntents;
//# sourceMappingURL=paymentIntents.js.map