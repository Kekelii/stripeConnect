import type Stripe from 'stripe';
import stripe from '../../classes/stripe.js';
import userWallet from '../../classes/userWallet.js';
import type {
	_WalletToWalletTranscations,
	BankAccountDetails,
	graphDataFeedDuration,
	graphDataFeedtype,
	Result,
	TransactionType,
	User,
} from '../../global.js';
import user from '../../models/user.js';
import wallet from '../../models/wallet.js';
import { AppError } from '../../utils/appError.js';
import strip_Account_to_Wallet from '../../classes/strip_Account_to_Wallet.js';
import Withdrawals from '../../models/Withdrawals.js';
import logger from '../../utils/logger.js';
import WalletToWalletTranscations from '../../models/WalletToWalletTranscations.js';
import formatBalance from '../../utils/formateBalance.js';
import walletIncomeTransactions from '../../models/walletIncomeTransactions.js';
import serviceFees from '../../models/serviceFees.js';
import { AsyncParser } from '@json2csv/node';
import walletNotifacation from '../../models/walletNotifacation.js';
import { FinancialDataService } from '../../classes/platformTransactions.js';

export async function createWallet(
	userId: string,
	ip: string
): Promise<Result<String>> {
	//get user details
	try {
		const ternante = await user.findOne({ _id: userId });
		const walletExists = await wallet.findOne({ userId });
		if (!ternante) {
			throw new AppError('User does not exist', 404);
		}
		//if uer exists
		if (walletExists) {
			return {
				data: `user exists with ${walletExists.id}`,
				error: null,
			};
		}
		//create customer
		const customer = await stripe.createCustomer({
			email: ternante.email,
			name: `${ternante.firstName} ${ternante.lastName}`,
			phone: ternante.phone ?? '',
			address: {
				line1: ternante.address.line1,
				city: ternante.address.city,
				postal_code: ternante.address.postal_code,
				country: ternante.address.country,
			},
			metadata: {
				userId: ternante.id,
			},
		});
		//create connected account
		const connectedAccount = await stripe.createConnectedAccount(
			{
				email: ternante.email,
				firstName: ternante.firstName,
				lastName: ternante.lastName,
				dob: {
					day: ternante.dob.day,
					month: ternante.dob.month,
					year: ternante.dob.year,
				},
				address: {
					line1: ternante.address.line1,
					city: ternante.address.city,
					postal_code: ternante.address.postal_code,
					phone: ternante.phone,
				},
				metadata: {
					userId: ternante.id,
				},
			},
			ip
		);
		//create wallet
		const createdWallet = await userWallet.createUserWallet(
			userId,
			customer,
			connectedAccount
		);

		return {
			error: null,
			data: createdWallet.data?.userId,
		};
	} catch (err) {
		throw new AppError((err as Error).message, 404);
	}
}
//get wallet
export async function getWallet(userId: string) {
	try {
		const walletExists = await wallet.findOne({ userId });
		if (!walletExists) {
			throw new AppError('wallet does not exist', 404);
		}

		return {
			data: walletExists?.toObject(),
			error: null,
		};
	} catch (err) {
		throw new AppError((err as Error).message, 404);
	}
}
export async function removeWallat(userId: string): Promise<Result<boolean>> {
	const userWallet = await wallet.findOne({ userId });
	if (!userWallet) {
		throw new AppError('wallet does not exist', 404);
	}
	try {
		const removeConnectedAcount = await stripe.disconnectAccount(
			userWallet.connectedAccountId
		);
		const removeCustomerAccount = await stripe.removeCustomer(
			userWallet.customerId
		);
		const removedWallet = await wallet.findOneAndDelete({ userId });
		return {
			data: true,
			error: null,
		};
	} catch (err) {
		throw new AppError((err as Error).message, 404);
	}
}
export async function topUpWallet(
	userId: string,
	amount: number
): Promise<Result<String>> {
	try {
		const walletExists = await wallet.findOne({ userId });
		if (!walletExists) {
			throw new AppError('user does not have an active wallet', 404);
		}
		//create payment intent
		const paymentIntent = await stripe.createPaymentIntent(
			userId,
			walletExists.connectedAccountId,
			amount
		);
		if (!paymentIntent) {
			throw new AppError('clientSecret not generate', 404);
		}
		return {
			data: paymentIntent,
			error: null,
		};
	} catch (err) {
		throw new AppError((err as Error).message, 404);
	}
}
//hook event
export async function transferCreated(transferObject: Stripe.Transfer) {
	try {
		const originAccount =
			transferObject.metadata.originAccount ||
			(transferObject.metadata.destinationAccount as string);
		const balanceOfOrigin = await stripe.checkAccountBalance(originAccount);
		const update = await strip_Account_to_Wallet.updateBalance(
			balanceOfOrigin,
			originAccount
		);
		if (transferObject.metadata.destinationAccount) {
			await WalletToWalletTranscations.findOneAndUpdate(
				{ _id: transferObject.id },
				{ status: 'successfull' }
			);
		}
	} catch (error) {
		logger.warn(error, 'something went wrong');
	}
}
export async function createExternalBankaccount(
	userId: string,
	bankDetails: BankAccountDetails
) {
	const _wallet = await wallet.findOne({ userId });
	if (!_wallet) {
		throw new AppError('user account does not exist', 404);
	}
	const connectAccountId = _wallet.connectedAccountId as string;
	const details: Stripe.AccountCreateExternalAccountParams = {
		external_account: {
			object: 'bank_account',
			account_number: bankDetails.account_number,
			account_holder_name: bankDetails.account_holder_name,
			account_holder_type: 'individual',
			currency: bankDetails.currency,
			country: bankDetails.country,
		},
	};
	const createdAccount = await stripe.addBankAccount(connectAccountId, details);

	return createdAccount.id;
}
export async function payoutMade(payoutObject: Stripe.Payout) {
	try {
		const connectedAccountId = payoutObject.metadata
			?.connectedAccountId as string;
		const balance = await stripe.checkAccountBalance(connectedAccountId);
		await strip_Account_to_Wallet.updateBalance(balance, connectedAccountId);
		await Withdrawals.findOneAndUpdate(
			{ _id: payoutObject.id },
			{ status: 'succesful' }
		);
	} catch (err) {
		logger.warn(err, 'something went wrong');
	}
}
export async function allBankAccounts(userId: string) {
	try {
		const walletObj = await wallet.findOne({ userId });
		const connectedAccount = walletObj?.connectedAccountId as string;
		const accounts = await stripe.getBankAccounts(connectedAccount);
		return accounts;
	} catch (err) {
		throw new AppError((err as Error).message, 404);
	}
}
export async function balance(userId: string) {
	try {
		const walletObj = await wallet.findOne({ userId });
		const connectedAccount = walletObj?.connectedAccountId as string;
		const balance = await stripe.checkAccountBalance(connectedAccount);
		const availableBalance = formatBalance(
			balance.available.reduce((sum, b) => sum + b.amount, 0)
		);

		const pendingBalance = formatBalance(
			balance.pending.reduce((sum, b) => sum + b.amount, 0)
		);

		return {
			availableBalance,
			pendingBalance,
		};
	} catch (err) {
		throw new AppError((err as Error).message, 404);
	}
}
export async function transactions(
	transactionType: TransactionType,
	start: number,
	limit: number,
	userId?: string
) {
	const _page = start || 1;
	const _limit = limit || 10;
	const _skip = (_page - 1) * limit;
	try {
		const _wallet = await wallet.findOne({ userId });
		if (!_wallet) throw new AppError('invalid user id', 404);

		if (transactionType === 'Income') {
			const query = { brokerId: _wallet.brokerId };
			const [data, totalCount] = await Promise.all([
				walletIncomeTransactions
					.find(query)
					.sort({ created: -1 })
					.skip(_skip)
					.limit(_limit)
					.lean(),
				walletIncomeTransactions.countDocuments(query),
			]);
			return { data, totalCount };
		}
		if (transactionType === 'ServiceFee') {
			const query = { userId };

			const [data, totalCount] = await Promise.all([
				serviceFees.find(query).sort({ created: -1 }).skip(_skip).limit(_limit),
				serviceFees.countDocuments(query),
			]);
			return { data, totalCount };
		}
		if (transactionType === 'Withdrawls') {
			const query = { walletId: _wallet.id };

			const [data, totalCount] = await Promise.all([
				Withdrawals.find(query).sort({ created: -1 }).skip(_skip).limit(_limit),
				Withdrawals.countDocuments(query),
			]);
			return { data, totalCount };
		}
		if (transactionType === 'WalletToWallet') {
			const query = { $or: [{ senderId: userId }, { receiverId: userId }] };
			let [data, totalCount] = await Promise.all([
				WalletToWalletTranscations.find(query)
					.sort({ created: -1 })
					.skip(_skip)
					.limit(_limit),
				WalletToWalletTranscations.countDocuments(query),
			]);
			const userIds = Array.from(
				new Set(
					data.flatMap((tx) => [
						tx.senderId?.toString(),
						tx.receiverId?.toString(),
					])
				)
			);
			const users = await user
				.find({ _id: { $in: userIds } }, { firstName: 1, lastName: 1 })
				.lean();
			const userMap: Record<string, string> = {};
			users.forEach((a) => {
				userMap[a._id.toString()] = `${a.firstName} ${a.lastName}`;
			});

			const transformedData: _WalletToWalletTranscations[] = data.map((tx) => ({
				_id: tx._id.toString(),
				amount: tx.amount,
				status: tx.status,
				receiverId: tx.receiverId,
				senderId: tx.senderId,
				receiverName: userMap[tx.receiverId],
				senderName: userMap[tx.senderId],
				createdAt: tx.createdAt,
			}));
			return { data: transformedData, totalCount };
		}
	} catch (err) {
		throw new AppError((err as Error).message, 404);
	}
}
export async function downloadTransaction(
	transactionType: TransactionType,
	month: number,
	year: number,
	userId: string
) {
	try {
		const _wallet = await wallet.findOne({ userId });
		const parser = new AsyncParser();
		let csv;
		if (!_wallet) throw new AppError('invalid user id', 404);
		let dateFilter = {};
		if (month && year) {
			const start = new Date(year, month - 1, 1);
			const end = new Date(year, month, 1);
			dateFilter = { createdAt: { $gte: start, $lt: end } };
		} else {
			const start = new Date(year, 0, 1);
			const end = new Date(year + 1, 0, 1);
			dateFilter = {
				createdAt: { $gte: start, $lt: end },
			};
		}
		if (transactionType === 'Income') {
			const data = await walletIncomeTransactions
				.find({ brokerId: _wallet.brokerId, ...dateFilter })
				.sort({ created: -1 })
				.lean();

			if (data.length === 0) {
				throw new AppError('No withdrawal data found for this period', 404);
			}
			csv = await parser.parse(data).promise();
		}
		if (transactionType === 'ServiceFee') {
			const data = await serviceFees
				.find({ userId, ...dateFilter })
				.sort({ created: -1 })
				.lean();
			if (data.length === 0) {
				throw new AppError('No withdrawal data found for this period', 404);
			}
			csv = await parser.parse(data);
		}
		if (transactionType === 'Withdrawls') {
			const data = await Withdrawals.find({
				walletId: _wallet.id,
				...dateFilter,
			})
				.sort({ created: -1 })
				.lean();
			if (data.length === 0) {
				throw new AppError('No withdrawal data found for this period', 404);
			}
			csv = await parser.parse(data);
		}
		if (transactionType === 'WalletToWallet') {
			const data = await WalletToWalletTranscations.find({
				$or: [{ senderId: userId }, { receiverId: userId }],
				...dateFilter,
			})
				.sort({ created: -1 })
				.lean();
			if (data.length === 0) {
				throw new AppError('No withdrawal data found for this period', 404);
			}
			csv = await parser.parse(data);
		}
		return csv;
	} catch (err) {
		throw new AppError((err as Error).message, 404);
	}
}
export async function graphData(userId: string) {
	try {
		const monthly = await FinancialDataService.generateGraphDataMonthly(userId);
		const weekly = await FinancialDataService.generateGraphDataWeekly(userId);
		const yearly = await FinancialDataService.generateGraphDataYearly(userId);

		return { yearly, monthly, weekly };
	} catch (err) {
		throw new AppError((err as Error).message, 404);
	}
}
export async function notifictaions(
	userId: string,
	start: number,
	limit: number
) {
	const _page = start || 1;
	const _limit = limit || 10;
	const _skip = (_page - 1) * limit;
	const nots = await walletNotifacation
		.find({ userId })
		.sort({ created: -1 })
		.skip(_skip)
		.limit(_limit)
		.lean();
	const set = new Set();
	const dic: { [k: string]: User } = {};
	nots.forEach((i) => set.add(i.details.senderId));
	const recipientIds = Array.from(set);
	const recipient = await user.find({ _id: { $in: recipientIds } });
	recipient.forEach((i) => (dic[i._id.toString()] = i));

	const returnedData = nots.map((i) => {
		return {
			...i,
			_id: i._id,
			notificationType: i.notificationType,
			details: {
				amount: i.details.amount,
				senderId: i.details.senderId,
				senderName: `${dic[i.details.senderId]?.firstName} ${
					dic[i.details.senderId]?.lastName
				}`,
			},
		};
	});
	return returnedData;
}
