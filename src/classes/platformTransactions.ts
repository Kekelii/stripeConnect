import type {
	Earnings,
	Month,
	TransactionType,
	WalletEarning,
	WalletSpending,
} from '../global.js';
import earnings from '../models/earnings.js';
import spendings from '../models/spendings.js';

import wallet from '../models/wallet.js';
import { AppError } from '../utils/appError.js';
import {
	getDateRangeForCurrentWeek,
	getDateRangeForYear,
	getDayName,
	getMonth,
	getYear,
} from '../utils/helpers.js';

export class FinancialDataService {
	public static async generateGraphDataMonthly(userId: string) {
		const { startDate, endDate } = getDateRangeForYear(getYear());
		let earningsMontly: { period: string; data: number }[] = [
			{
				period: '',
				data: 0,
			},
		];
		let spendingsMonthly: { period: string; data: number }[] = [
			{
				period: '',
				data: 0,
			},
		];
		const spendingIntheYear: { [k: string]: number } = {
			January: 0,
			February: 0,
			March: 0,
			April: 0,
			May: 0,
			June: 0,
			July: 0,
			August: 0,
			September: 0,
			October: 0,
			November: 0,
			December: 0,
		};
		const earningIntheYear: { [k: string]: number } = {
			January: 0,
			February: 0,
			March: 0,
			April: 0,
			May: 0,
			June: 0,
			July: 0,
			August: 0,
			September: 0,
			October: 0,
			November: 0,
			December: 0,
		};
		const e = await earnings.find({
			userId,
			createdAt: {
				$gte: startDate,
				$lt: endDate,
			},
		});
		const s = await spendings.find({
			userId,
			createdAt: {
				$gte: startDate,
				$lt: endDate,
			},
		});
		e.forEach((i) => {
			const m = getMonth(i.createdAt);
			earningIntheYear[m] = earningIntheYear[m] || 0;
			earningIntheYear[m] += i.amount;
		});
		s.forEach((i) => {
			const m = getMonth(i.createdAt);
			spendingIntheYear[m] = spendingIntheYear[m] || 0;
			spendingIntheYear[m] += i.amount;
		});
		Object.keys(earningIntheYear).forEach((e) => {
			earningIntheYear[e] =
				Math.round((earningIntheYear[e] as number) * 100) / 100;
		});
		spendingsMonthly.pop();
		Object.keys(spendingIntheYear).forEach((e) => {
			spendingIntheYear[e] =
				Math.round((spendingIntheYear[e] as number) * 100) / 100;
			spendingsMonthly.push({ period: e, data: spendingIntheYear[e] });
		});
		earningsMontly.pop();
		Object.keys(earningIntheYear).forEach((e) => {
			earningIntheYear[e] =
				Math.round((earningIntheYear[e] as number) * 100) / 100;
			earningsMontly.push({ period: e, data: earningIntheYear[e] });
		});

		return [{ earnings: earningsMontly }, { spendings: spendingsMonthly }];
	}

	public static async generateGraphDataYearly(userId: string) {
		let earningsYearly: { period: number; data: number }[] = [
			{
				period: getYear(),
				data: 0,
			},
		];
		const spendingsYearly: { period: number; data: number }[] = [
			{
				period: getYear(),
				data: 0,
			},
		];
		let eY: { [k: number]: number } = {};
		const sY: { [k: number]: number } = {};
		const e = await earnings.find({ userId });
		const s = await spendings.find({ userId });

		e.forEach((i) => {
			const year = getYear(i.createdAt as Date);
			eY[year] = eY[year] || 0;
			eY[year] += i.amount;
		});

		s.forEach((i) => {
			const year = getYear(i.createdAt as Date);
			sY[year] = sY[year] || 0;
			sY[year] += i.amount;
		});
		earningsYearly.pop();
		Object.keys(eY).forEach((i) => {
			earningsYearly.push({
				period: parseInt(i),
				data: Math.round((eY[parseInt(i)] as number) * 100) / 100,
			});
		});
		spendingsYearly.pop();
		Object.keys(sY).forEach((i) => {
			spendingsYearly.push({
				period: parseInt(i),
				data: Math.round((sY[parseInt(i)] as number) * 100) / 100,
			});
		});
		return [{ earnings: earningsYearly }, { spendings: spendingsYearly }];
	}

	public static async generateGraphDataWeekly(userId: string) {
		const { startDate, endDate } = getDateRangeForCurrentWeek();
		let earningsWeekly: { period: string; data: number }[] = [];
		let spendingsWeekly: { period: string; data: number }[] = [];
		const dayNames = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
		];

		const spendingInTheWeek: { [k: string]: number } = dayNames.reduce(
			(acc, day) => {
				acc[day] = 0;
				return acc;
			},
			{} as { [k: string]: number }
		);

		const earningInTheWeek: { [k: string]: number } = dayNames.reduce(
			(acc, day) => {
				acc[day] = 0;
				return acc;
			},
			{} as { [k: string]: number }
		);

		const e = await earnings.find({
			userId,
			createdAt: {
				$gte: startDate,
				$lt: endDate,
			},
		});
		const s = await spendings.find({
			userId,
			createdAt: {
				$gte: startDate,
				$lt: endDate,
			},
		});

		e.forEach((i) => {
			const day = getDayName(i.createdAt as Date) as string;
			earningInTheWeek[day] = earningInTheWeek[day] || 0;
			earningInTheWeek[day] += i.amount;
		});

		s.forEach((i) => {
			const day = getDayName(i.createdAt as Date) as string;
			spendingInTheWeek[day] = spendingInTheWeek[day] || 0;
			spendingInTheWeek[day] += i.amount;
		});

		dayNames.forEach((dayName) => {
			const rawAmount = earningInTheWeek[dayName] as number;
			const roundedAmount = Math.round(rawAmount * 100) / 100;
			earningsWeekly.push({ period: dayName, data: roundedAmount });
		});

		dayNames.forEach((dayName) => {
			const rawAmount = spendingInTheWeek[dayName] as number;
			const roundedAmount = Math.round(rawAmount * 100) / 100;
			spendingsWeekly.push({ period: dayName, data: roundedAmount });
		});

		return [{ earnings: earningsWeekly }, { spendings: spendingsWeekly }];
	}

	public static async SpendingEntry(
		userId: string,
		amount: number,
		spendingType: TransactionType,
		time?: Date
	): Promise<WalletSpending> {
		try {
			const spendingEntry = await spendings.insertOne({
				userId,
				amount,
				spendingType,
				// createdAt: time,
			});
			const walletUpdate = await wallet.findOneAndUpdate(
				{ userId },
				{ $inc: { spendings: amount } }
			);
			return spendingEntry;
		} catch (err) {
			throw new AppError((err as Error).message, 404);
		}
	}

	public static async EarningsEntry(
		userId: string,
		amount: number,
		earningType: Earnings,
		time?: Date
	): Promise<WalletEarning> {
		try {
			const EarningsEntry = await earnings.insertOne({
				userId,
				amount,
				earningType,
				// createdAt: time,
			});

			const walletUpdate = await wallet.findOneAndUpdate(
				{ userId },
				{ $inc: { earnings: amount } }
			);
			return EarningsEntry;
		} catch (err) {
			throw new AppError((err as Error).message, 404);
		}
	}
}
