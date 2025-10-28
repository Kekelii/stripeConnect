import mongoose from 'mongoose';
import type { WalletEarning } from '../global.js';

const options = { timestamps: false };

const Earnings = new mongoose.Schema<WalletEarning>(
	{
		userId: { type: String, required: true },
		amount: { type: Number, required: true },
		earningType: { type: String, required: true },
		createdAt: { type: Date, required: false },
	},
	options
);

export default Earnings;
