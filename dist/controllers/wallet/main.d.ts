import type Stripe from 'stripe';
import type { _WalletToWalletTranscations, BankAccountDetails, Result, TransactionType } from '../../global.js';
export declare function createWallet(userId: string, ip: string): Promise<Result<String>>;
export declare function getWallet(userId: string): Promise<{
    data: import("../../global.js").Wallet & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }> & {
        __v: number;
    };
    error: null;
}>;
export declare function removeWallat(userId: string): Promise<Result<boolean>>;
export declare function topUpWallet(userId: string, amount: number): Promise<Result<String>>;
export declare function transferCreated(transferObject: Stripe.Transfer): Promise<void>;
export declare function createExternalBankaccount(userId: string, bankDetails: BankAccountDetails): Promise<string>;
export declare function payoutMade(payoutObject: Stripe.Payout): Promise<void>;
export declare function allBankAccounts(userId: string): Promise<Stripe.Response<Stripe.ApiList<Stripe.ExternalAccount>>>;
export declare function balance(userId: string): Promise<{
    availableBalance: string;
    pendingBalance: string;
}>;
export declare function transactions(transactionType: TransactionType, start: number, limit: number, userId?: string): Promise<{
    data: (import("mongoose").FlattenMaps<{
        createdAt: Date;
        commission: number;
        status: import("../../global.js").status;
        referalId: string;
        referedUser: string;
        brokerId: string;
        brokerName: string;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[];
    totalCount: number;
} | {
    data: (import("mongoose").Document<unknown, {}, import("../../global.js").ServiceFees, {}, import("mongoose").DefaultSchemaOptions> & import("../../global.js").ServiceFees & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }> & {
        __v: number;
    })[];
    totalCount: number;
} | {
    data: (import("mongoose").Document<unknown, {}, import("../../global.js").Withdrawals, {}, import("mongoose").DefaultSchemaOptions> & import("../../global.js").Withdrawals & Required<{
        _id: string;
    }> & {
        __v: number;
    })[];
    totalCount: number;
} | {
    data: _WalletToWalletTranscations[];
    totalCount: number;
} | undefined>;
export declare function downloadTransaction(transactionType: TransactionType, month: number, year: number, userId: string): Promise<string | import("@json2csv/node").Transform<object, object> | undefined>;
export declare function graphData(userId: string): Promise<{
    yearly: ({
        earnings: {
            period: number;
            data: number;
        }[];
        spendings?: never;
    } | {
        spendings: {
            period: number;
            data: number;
        }[];
        earnings?: never;
    })[];
    monthly: ({
        earnings: {
            period: string;
            data: number;
        }[];
        spendings?: never;
    } | {
        spendings: {
            period: string;
            data: number;
        }[];
        earnings?: never;
    })[];
    weekly: ({
        earnings: {
            period: string;
            data: number;
        }[];
        spendings?: never;
    } | {
        spendings: {
            period: string;
            data: number;
        }[];
        earnings?: never;
    })[];
}>;
export declare function notifictaions(userId: string, start: number, limit: number): Promise<{
    _id: import("mongoose").Types.ObjectId;
    notificationType: "walletToWallet";
    details: {
        amount: number;
        senderId: string;
        senderName: string;
    };
    userId: string;
    status: "Open" | "Close";
    __v: number;
}[]>;
//# sourceMappingURL=main.d.ts.map