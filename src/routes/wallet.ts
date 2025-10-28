import express, { Router } from 'express';
import { asyncHandler } from '../utils/asyncHander.js';
import userWallet from '../classes/userWallet.js';
import {
	allBankAccounts,
	balance,
	createExternalBankaccount,
	createWallet,
	downloadTransaction,
	getWallet,
	graphData,
	notifictaions,
	removeWallat,
	topUpWallet,
	transactions,
} from '../controllers/wallet/main.js';
import type { ExtendedRequest } from '../global.js';
import { TransferBetweenWallets } from '../controllers/wallet_to_wallet/main.js';
import { processPayout } from '../controllers/Wallet_to_account/main.js';

//this router is responsible for all issues involving bank to wallet transfer
const _Wallet: Router = express.Router();
//get userDetails
_Wallet.get(
	'/user',
	asyncHandler(async (req, res) => {
		const userId = (req as unknown as ExtendedRequest).userId;
		const user = await userWallet.getUser(userId);
		res.json(user);
	})
);
// get wallet details
_Wallet.get(
	'/walletInfo',
	asyncHandler(async (req, res) => {
		const userId = (req as unknown as ExtendedRequest).userId;
		const wallet = await getWallet(userId);
		res.json(wallet);
	})
);
//create wallet or returns a wallet that already exists
_Wallet.get(
	'/create/:userId',
	asyncHandler(async (req, res) => {
		const { userId } = req.params;
		const Ternate = await createWallet(userId, req.ip as string);
		res.send(Ternate);
	})
);
//delete wallet
_Wallet.delete(
	'/delete/:userId',
	asyncHandler(async (req, res) => {
		const { userId } = req.params;
		const deletedWallet = await userWallet.deleteWallet(userId);
		res.json({ data: deletedWallet.data });
	})
);
//update Wallet
_Wallet.post(
	'/update/:userId',
	asyncHandler(async (req, res) => {
		const { userId } = req.params;
		const data = req.body;
		const updates = await userWallet.updateWallet(userId, data);
		res.json({ clientSecret: updates.data });
	})
);
//wallet topUp
_Wallet.post(
	'/topup',
	asyncHandler(async (req, res) => {
		const { amount } = req.body;
		const userId = (req as unknown as ExtendedRequest).userId;
		//get connectedAccount
		const paymentIntent = await topUpWallet(userId, amount);
		return res.json(paymentIntent);
	})
);

//delete wallet
_Wallet.delete(
	'/deleteAccount/:userId',
	asyncHandler(async (req, res) => {
		const { userId } = req.params;
		const removedConfirmation = await removeWallat(userId);
		res.json(removedConfirmation);
	})
);
//wallet to wallet transfer
_Wallet.post(
	'/walletToWallet',
	asyncHandler(async (req, res) => {
		const userId = (req as unknown as ExtendedRequest).userId;
		const { amount, destination } = req.body;
		const transfer = await TransferBetweenWallets(userId, destination, amount);
		res.json(transfer);
	})
);
//add external bank account
_Wallet.post(
	'/addExternalBank',
	asyncHandler(async (req, res) => {
		const userId = (req as unknown as ExtendedRequest).userId;
		const {
			accountNumber,
			country,
			currency,
			accountHolderName,
			routingNumber,
		} = req.body;

		const bankAccount = await createExternalBankaccount(userId, {
			account_holder_name: accountHolderName,
			account_holder_type: 'individual',
			country: country,
			currency,
			routingNumber,
			account_number: accountNumber,
		});
		res.json(bankAccount);
	})
);
//initiate external Bank payout
_Wallet.post(
	'/payout',
	asyncHandler(async (req, res) => {
		const userId = (req as unknown as ExtendedRequest).userId;
		const { amount, externalBankId } = req.body;
		const payoutIntent = await processPayout(userId, amount, externalBankId);
		res.json(payoutIntent);
	})
);
//get all external bank accounts
_Wallet.get(
	'/bankaccounts',
	asyncHandler(async (req, res) => {
		const userId = (req as unknown as ExtendedRequest).userId;
		const bankAccounts = await allBankAccounts(userId);
		res.send(bankAccounts);
	})
);
//get wallet balance
_Wallet.get(
	'/balance',
	asyncHandler(async (req, res) => {
		const userId = (req as unknown as ExtendedRequest).userId;
		const _balance = await balance(userId);
		res.json(_balance);
	})
);
//get transcation hsitory
_Wallet.get(
	'/transactions',
	asyncHandler(async (req, res) => {
		const userId = (req as unknown as ExtendedRequest).userId;
		const { type, page, limit } = req.query;
		const transaction = await transactions(type, page, limit, userId);
		res.json(transaction);
	})
);
//downLoad transaction history
_Wallet.get(
	'/transactions/download',
	asyncHandler(async (req, res) => {
		const userId = (req as unknown as ExtendedRequest).userId;
		const { type, month, year } = req.query;
		const transactions = await downloadTransaction(type, month, year, userId);
		res.setHeader('Content-Type', 'text/csv');
		res.setHeader(
			'Content-Disposition',
			`attachment; filename="${type}-${year || 'all'}-${month || 'all'}.csv"`
		);
		res.send(transactions);
	})
);
//get graph data
_Wallet.get(
	'/graphdata',
	asyncHandler(async (req, res) => {
		const userId = (req as unknown as ExtendedRequest).userId;
		const data = await graphData(userId);
		res.send(data);
	})
);

//get notifications
_Wallet.get(
	'/notifications',
	asyncHandler(async (req, res) => {
		const userId = (req as unknown as ExtendedRequest).userId;
		const { page, limit } = req.query;
		const notices = await notifictaions(userId, page, limit);
		res.send(notices);
	})
);
export default _Wallet;
