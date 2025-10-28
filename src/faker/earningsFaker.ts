import type { WalletEarning } from '../global.js';
import { faker } from '@faker-js/faker';
import { FinancialDataService } from '../classes/platformTransactions.js';

const today = new Date();
const lastYear = new Date();
lastYear.setFullYear(today.getFullYear() - 1);
// Note: Date strings for faker need to be ISO strings or Date objects
const DATE_RANGE_FROM = lastYear;
const DATE_RANGE_TO = today;

// Generate an array of fake notifications
const dummyData: WalletEarning[] = Array.from(
	{ length: 120 },
	(): WalletEarning => {
		const randomDate = faker.date.between({
			from: '2020-01-01T00:00:00.000Z',
			to: '2025-01-01T00:00:00.000Z',
		});
		const randomAmount = Number(
			faker.finance.amount({
				min: 50,
				max: 5000,
				dec: 2,
			})
		);
		const recipientId = '68d4a203177e0c284c4dd7df';
		return {
			userId: recipientId,
			amount: randomAmount,
			earningType: 'Comissions',
			createdAt: randomDate,
		};
	}
);

async function insetFaker() {
	console.log('faking');
	await Promise.all(
		dummyData.map((i) => {
			FinancialDataService.EarningsEntry(
				i.userId,
				i.amount,
				i.earningType,
				i.createdAt as Date
			);
		})
	);
}

insetFaker();
