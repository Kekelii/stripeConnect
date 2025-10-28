import mongoose from 'mongoose';
import type { ServiceFees } from '../global.js';

const options = { timestamps: true };

const ServiceFeesSchema = new mongoose.Schema<ServiceFees>(
	{
		amount: { type: Number, required: true },
		transactionType: { type: String, required: true },
		userId: { type: String, required: true },
		walletId: { type: String, required: true },
		status: { type: String, required: true },
	},
	options
);

export default ServiceFeesSchema;
