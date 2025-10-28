import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import walletNotifacation from '../models/walletNotifacation.js';
// Generate an array of fake notifications
const dummyWalletNotifications = Array.from({ length: 100 }, () => {
    const recipientId = '68d4a203177e0c284c4dd7df';
    return {
        userId: recipientId,
        notificationType: 'walletToWallet',
        details: {
            senderId: '68d4a203177e0c284c4dd7e0',
            amount: Number(faker.finance.amount({ min: 5, max: 1000, dec: 2 })),
        },
        status: 'Close',
    };
});
async function insetFaker() {
    console.log('faking');
    const result = await walletNotifacation.insertMany(dummyWalletNotifications);
}
insetFaker();
//# sourceMappingURL=notifactionsFaker.js.map