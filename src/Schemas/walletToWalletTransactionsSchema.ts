import mongoose, { type ObjectId } from 'mongoose';
import type {
	ServiceFees,
	_WalletToWalletTranscations,
	Withdrawals,
} from '../global.js';

const options = { timestamps: true };

const WalletToWalletTranscationsSchema =
	new mongoose.Schema<_WalletToWalletTranscations>(
		{
			_id: { type: String, required: true },
			amount: { type: Number, required: true },
			receiverId: { type: String, required: true },
			senderId: { type: String, required: true },
			status: { type: String, default: 'pending' },
		},
		options
	);

export default WalletToWalletTranscationsSchema;
