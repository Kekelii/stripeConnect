import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import walletNotifacation from '../models/walletNotifacation.js';
import earnings from '../models/earnings.js';
import { FinancialDataService } from '../classes/platformTransactions.js';
const today = new Date();
const lastYear = new Date();
lastYear.setFullYear(today.getFullYear() - 1);
// Note: Date strings for faker need to be ISO strings or Date objects
const dummyData = Array.from({ length: 100 }, () => {
    const randomDate = faker.date.between({
        from: '2020-01-01T00:00:00.000Z',
        to: '2026-01-01T00:00:00.000Z',
    });
    const randomAmount = Number(faker.finance.amount({
        min: 50,
        max: 5000,
        dec: 2,
    }));
    const recipientId = '68d4a203177e0c284c4dd7df';
    return {
        userId: recipientId,
        amount: randomAmount,
        spendingType: 'Subscription',
        createdAt: randomDate,
    };
});
async function insetFaker() {
    console.log('faking');
    await Promise.all(dummyData.map((i) => {
        FinancialDataService.SpendingEntry(i.userId, i.amount, i.spendingType, i.createdAt);
    }));
}
insetFaker();
//# sourceMappingURL=spendingFacker.js.map