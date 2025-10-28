import { faker } from '@faker-js/faker';
import walletIncomeTransactions from '../models/walletIncomeTransactions.js';
// interface WalletIncomeTransaction {
// 	createdAt: Date;
// 	commission: number;
// 	status: 'pending' | 'completed' | 'failed';
// 	referalId: string;
// 	referedUser: string;
// 	brokerId: string;
// 	brokerName: string;
// }
// Generate an array of 20 dummy transactions
const dummyWalletIncomeTransactions = Array.from({ length: 100 }, () => {
    const randomDate = faker.date.between({
        from: '2025-01-01T00:00:00.000Z',
        to: '2025-12-31T23:59:59.999Z',
    });
    return {
        createdAt: randomDate,
        commission: Number(faker.finance.amount({ min: 10, max: 500, dec: 2 })),
        status: faker.helpers.arrayElement(['Pending', 'Successful', 'Failed']),
        referalId: faker.string.uuid(),
        referedUser: faker.person.fullName(),
        brokerId: 'B-vomfYzKtubAuXPECr-mNk',
        brokerName: faker.company.name(),
    };
});
async function insetFaker() {
    console.log('faking');
    const result = await walletIncomeTransactions.insertMany(dummyWalletIncomeTransactions);
}
insetFaker();
//# sourceMappingURL=incomeFaker.js.map