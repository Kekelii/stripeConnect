import mongoose from 'mongoose';
import type { WalletEarning, WalletSpending } from '../global.js';

const options = { timestamps: true };

const Spendings = new mongoose.Schema<WalletSpending>(
	{
		userId: { type: String, required: true },
		amount: { type: Number, required: true },
		spendingType: { type: String, required: true },
		createdAt: { type: Date, required: false },
	},
	options
);

export default Spendings;
