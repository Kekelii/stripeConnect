import type { Schema } from 'mongoose';

// Error handling
type Success<T> = { data: T; error: null };
type Failure<E> = { data: null; error: E };
type Result<T, E = Error> = Success<T> | Failure<E>;

// Types
type mongooseId = Schema.Types.ObjectId;
type TransactionType =
	| 'Subscription'
	| 'ServiceFee'
	| 'Income'
	| 'WalletToWallet'
	| 'Withdrawls';
type Earnings = 'Comissions';
type paymentMethod = 'Wallet' | 'Card';
type status = 'pending' | 'sucessful' | 'failed';
type graphDataFeedDuration = 'Monthly' | 'Weekly' | 'yearly';
type graphDataFeedtype = 'Spending' | 'Earnings';
type Month =
	| 'January'
	| 'February'
	| 'March'
	| 'April'
	| 'May'
	| 'June'
	| 'July'
	| 'August'
	| 'September'
	| 'October'
	| 'November'
	| 'December';
type DayOfWeek =
	| 'Sunday'
	| 'Monday'
	| 'Tuesday'
	| 'Wednesday'
	| 'Thursday'
	| 'Friday'
	| 'Saturday';

// Interfaces
type User = {
	_id?: string;
	email: string;
	password?: string;
	firstName: string;
	lastName: string;
	dob: {
		day: number;
		month: number;
		year: number;
	};
	address: {
		line1: string;
		city: string;
		postal_code: string;
		country: string;
	};
	role: 'tenant' | 'landlord' | 'admin' | 'subadmin' | null;
	isSubscribed: boolean;
	subRole: (
		| 'conflict resolution admin'
		| 'advertisement admin'
		| 'tenants & landlords admin'
		| 'document verification admin'
	)[];
	status: 'active' | 'inactive';
	lastLogin: Date;
	isVerified: boolean;
	resetPasswordToken?: string;
	resetPasswordExpiresAt?: Date;
	verificationToken?: string;
	verificationTokenExpiresAt?: Date;
	authProvider: 'google' | 'facebook' | null;
	authProviderId?: string | null;
	profilePicture?: string | null;
	bio?: string | null;
	phone: string;
	Kids: number;
	leaseTerm:
		| '12 months'
		| '24 months'
		| '36 months'
		| '48 months'
		| '60 months';
	pets?: string | null;
	smoke?: string | null;
	subscriptions: string[];
	createdAt?: Date;
	updatedAt?: Date;
};

interface Wallet {
	_id?: mongooseId;
	userId: string;
	ternatId: string;
	brokerId: string;
	balance: number;
	pendingBalance: number;
	earnings: number;
	spendings: number;
	isEligible: boolean;
	quickTransfers: Array<mongooseId>;
	connectedAccountId: string;
	customerId: string;
	connectedBankAccounts: [];
	createdAt?: Date;
	updatedAt?: Date;
}

interface ServiceFees {
	_id: mongooseId;
	createdAt: Date;
	amount: number;
	transactionType: 'Subscription' | 'ID verification fee';
	status: status;
	paymentMethod: paymentMethod;
	userId: string;
	walletId: string;
}

interface Withdrawals {
	_id: string;
	walletId: string;
	amount: number;
	tranasferMethod: paymentMethod;
	accountNumber: string;
	status: status;
	createdAt: Date;
}

interface _WalletToWalletTranscations {
	_id: string;
	amount: number;
	status: status;
	receiverId: string;
	senderId: string;
	createdAt: Date;
}

interface walletIncomeTransactions {
	createdAt: Date;
	commission: number;
	status: status;
	referalId: string;
	referedUser: string;
	brokerId: string;
	brokerName: string;
}

interface PaymentIntent {
	userId: string;
	status: 'pending' | 'success' | 'canceled';
	paymentIntent: {
		id: { type: String; required: true };
		amount: { type: Number; required: true };
		currency: { type: String; required: true };
	};
	clientSecret: string;
	createdAt?: Date;
	updatedAt?: Date;
}
interface ExtendedRequest<P = any, ResBody = any, ReqBody = any, ReqQuery = any>
	extends Request<P, ResBody, ReqBody, ReqQuery> {
	userId: string;
}
type WalletProcess = 'Wallet to Bank' | 'Bank to Wallet';
// Interface for all supported Stripe events
type StripeEventData =
	| {
			type: 'payment_intent.succeeded';
			data: Stripe.PaymentIntent;
	  }
	| {
			type: 'payment_intent.payment_failed';
			data: Stripe.PaymentIntent;
	  }
	| {
			type: 'payment_intent.requires_action';
			data: Stripe.PaymentIntent;
	  }
	| {
			type: 'charge.refunded';
			data: Stripe.Charge;
	  };

// Wrapper for the whole webhook event
interface StripeWebhookEvent {
	id: string;
	object: 'event';
	created: number;
	type: StripeEventData['type'];
	data: StripeEventData['data'];
}
type BankAccountDetails = {
	account_holder_name: string;
	account_holder_type: 'individual' | 'company';
	country: string;
	currency: string;
	account_number: string;
	routingNumber?: string;
};
type StripeCustomerPayload = {
	email: string;
	name: string; // firstName + lastName
	phone?: string;
	address: {
		line1: string;
		city: string;
		postal_code: string;
		country: string;
	};
	metadata?: Record<string, string>;
};
type StripeConnectedAccountUser = {
	email: string;
	firstName: string;
	lastName: string;
	dob: {
		day: number;
		month: number;
		year: number;
	};
	address: {
		line1: string;
		city: string;
		postal_code: string;
		country?: string;
		phone: string;
	};

	metadata: { userId: string };
};
interface WalletNotificationType {
	userId: string;
	notificationType: 'walletToWallet';
	details: WalletToWalletNotification;
	status: 'Open' | 'Close';
}
interface WalletToWalletNotification {
	senderId: string;
	amount: number;
}

interface WalletEarning {
	userId: string;
	createdAt?: Date;
	amount: number;
	earningType: Earnings;
}
interface WalletSpending {
	userId: string;
	createdAt?: Date;
	amount: number;
	spendingType: TransactionType;
}
