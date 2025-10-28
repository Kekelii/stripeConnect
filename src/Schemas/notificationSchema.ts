import mongoose from 'mongoose';
import type { WalletNotificationType } from '../global.js';
import { tr } from '@faker-js/faker';

const options = { timestamps: true };

const walletNotification = new mongoose.Schema<WalletNotificationType>(
	{
		userId: { type: String, required: true },
		notificationType: { type: String, required: true },
		details: { type: Object, required: true },
		status: { type: String, required: true },
	},
	options
);

export default walletNotification;
