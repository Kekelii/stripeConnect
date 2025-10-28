import mongoose from 'mongoose';
import paymentIntents from '../Schemas/paymentIntents.js';

export default mongoose.model('PaymentIntents', paymentIntents);
