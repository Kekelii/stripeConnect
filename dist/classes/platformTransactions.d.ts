import type { Earnings, TransactionType, WalletEarning, WalletSpending } from '../global.js';
export declare class FinancialDataService {
    static generateGraphDataMonthly(userId: string): Promise<({
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
    })[]>;
    static generateGraphDataYearly(userId: string): Promise<({
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
    })[]>;
    static generateGraphDataWeekly(userId: string): Promise<({
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
    })[]>;
    static SpendingEntry(userId: string, amount: number, spendingType: TransactionType, time?: Date): Promise<WalletSpending>;
    static EarningsEntry(userId: string, amount: number, earningType: Earnings, time?: Date): Promise<WalletEarning>;
}
//# sourceMappingURL=platformTransactions.d.ts.map