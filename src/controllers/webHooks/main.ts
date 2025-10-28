import express, { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHander.js';
import type { WalletProcess } from '../../global.js';
import strip_Account_to_Wallet from '../../classes/strip_Account_to_Wallet.js';
import stripe from '../../classes/stripe.js';
import type Stripe from 'stripe';
import { payoutMade, transferCreated } from '../wallet/main.js';
import { addExternalBankAccountToWallet } from '../Wallet_to_account/main.js';

const webHooks: Router = express.Router();

webHooks.post(
	'/stripe',
	express.raw({ type: 'application/json' }),
	asyncHandler(async (req, res) => {
		try {
			const sig = req.headers['stripe-signature'] as string;
			const event = await stripe.validateWebHook(sig, req.body);
			switch (event.type) {
				case 'payment_intent.succeeded': {
					const paymentIntent = event.data.object as Stripe.PaymentIntent;
					await strip_Account_to_Wallet.updatePaymentIntent(paymentIntent);
					break;
				}
				case 'payment_intent.created': {
					const paymentIntent = event.data.object as Stripe.PaymentIntent;
					await strip_Account_to_Wallet.updatePaymentIntent(paymentIntent);
					break;
				}
				case 'balance.available': {
					const balance = event.data.object as Stripe.Balance;
					await strip_Account_to_Wallet.updateBalance(
						balance,
						event.account as string
					);
					break;
				}
				case 'transfer.created': {
					const transfer = event.data.object;
					await transferCreated(transfer);
					break;
				}
				case 'account.external_account.created': {
					const account = event.data.object;
					await addExternalBankAccountToWallet(account);
					break;
				}
				case 'payout.paid': {
					const payout = event.data.object;
					await payoutMade(payout);
				}
				default:
					console.log(`⚠️ Unhandled event type: ${event.type} `);
			}

			res.status(200).end();
		} catch (error) {
			console.error('Webhook error:', (error as Error).message);
			return res.status(400).send(`Webhook Error: ${(error as Error).message}`);
		}
	})
);

export default webHooks;
