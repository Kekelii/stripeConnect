import mongoose, { Schema, type ObjectId } from 'mongoose';
import type { Wallet } from '../global.js';

const options = { timestamps: true };
const wallertSchema = new mongoose.Schema<Wallet>(
	{
		userId: { type: String, required: true },
		ternatId: { type: String, required: true },
		brokerId: { type: String, required: true },
		balance: { type: Number, default: 0 },
		pendingBalance: { type: Number, default: 0 },
		earnings: { type: Number, default: 0 },
		isEligible: { type: Boolean, default: false },
		spendings: { type: Number, default: 0 },
		quickTransfers: [],
		connectedBankAccounts: [],
		connectedAccountId: { type: String, required: true },
		customerId: { type: String, required: true },
	},
	options
);

export default wallertSchema;
