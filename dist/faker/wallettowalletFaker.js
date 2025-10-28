import { faker } from '@faker-js/faker';
import WalletToWalletTranscations from '../models/WalletToWalletTranscations.js';
function generateFakeWalletToWalletTransaction() {
    return {
        _id: faker.database.mongodbObjectId(),
        amount: Number(faker.finance.amount({ min: 10, max: 5000, dec: 0 })),
        receiverId: '68d4a203177e0c284c4dd7df',
        senderId: '68d4a203177e0c284c4dd7e0',
        status: faker.helpers.arrayElement([
            'Pending',
            'Successful',
            'Failed',
        ]),
        createdAt: faker.date.between({ from: '2025-01-01', to: '2025-12-31' }),
    };
}
// ✅ Generate multiple transactions
const fakeWalletToWalletTransactions = Array.from({ length: 100 }, generateFakeWalletToWalletTransaction);
async function insetFaker() {
    console.log('faking');
    const result = await WalletToWalletTranscations.insertMany(fakeWalletToWalletTransactions);
}
insetFaker();
//# sourceMappingURL=wallettowalletFaker.js.map