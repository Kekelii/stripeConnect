import mongoose from 'mongoose';
import walletIncomeTransactionsSchema from '../Schemas/walletIncomeTransactionsSchema.js';

export default mongoose.model(
	'walletIncomeTransactions',
	walletIncomeTransactionsSchema
);
