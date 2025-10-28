import mongoose, { type ObjectId } from 'mongoose';
import type { Withdrawals } from '../global.js';

const options = { timestamps: true };

const WithdrawalsSchema = new mongoose.Schema<Withdrawals>(
	{
		_id: { type: String, required: true },
		amount: { type: Number, required: true },
		tranasferMethod: { type: String, required: true },
		walletId: { type: String, required: true },
		accountNumber: { type: String, required: true },
		status: { type: String, default: 'pending' },
	},
	options
);

export default WithdrawalsSchema;
