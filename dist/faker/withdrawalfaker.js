import { faker } from '@faker-js/faker';
import Withdrawals from '../models/Withdrawals.js';
// ✅ Generate one fake withdrawal record
function generateFakeWithdrawal() {
    return {
        _id: faker.database.mongodbObjectId(),
        amount: Number(faker.finance.amount({ min: 50, max: 10000, dec: 0 })),
        tranasferMethod: faker.helpers.arrayElement([
            'Wallet',
            'Card',
            'Bank Transfer',
        ]),
        walletId: '68dac707a96a956d97193509',
        accountNumber: '68dac707a96a956d971',
        status: faker.helpers.arrayElement(['Pending', 'Successful', 'Failed']),
        createdAt: faker.date.between({ from: '2025-01-01', to: '2025-12-31' }),
    };
}
// ✅ Generate multiple fake withdrawals
const fakeWithdrawals = Array.from({ length: 100 }, generateFakeWithdrawal);
async function insetFaker() {
    console.log('faking');
    const result = await Withdrawals.insertMany(fakeWithdrawals);
}
insetFaker();
//# sourceMappingURL=withdrawalfaker.js.map