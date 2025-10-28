import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import Stripe from 'stripe';
import walletToAccount from '../../src/classes/wallet_to_Account.js';
import { AppError } from '../../src/utils/appError.js';
import * as userModel from '../../src/models/user.js';
// --- Mock Stripe ---
// class StripeMock {
// 	accounts = {
// 		create: async (_: any) => ({ id: 'acct_mocked' }),
// 	};
// }
describe('walletToAccount', () => {
    // beforeEach(() => {
    // 	// Reset mocks before each test
    // 	(walletToAccount as any).initializedStrip =
    // 		new StripeMock() as unknown as Stripe;
    // });
    it('should return account id when creation succeeds', async () => {
        // Mock user.findById
        // mock.method(userModel.default, 'findById', () => ({
        // 	exec: async () => ({
        // 		email: 'jane@example.com',
        // 		first_name: 'Jane',
        // 		last_name: 'Doe',
        // 		dob: { day: 10, month: 5, year: 1990 },
        // 		address: {
        // 			line1: '123 Main St',
        // 			city: 'Prague',
        // 			postal_code: '11000',
        // 			country: 'CZ',
        // 		},
        // 	}),
        // }));
        const result = await walletToAccount.createConnectedAccount('68b841954c3828ced84ccfb0', '127.0.0.1');
        console.log(result);
        // assert.strictEqual(result.error, null);
        // assert.strictEqual(result.data, 'acct_mocked');
    });
    it.skip('should return AppError when Stripe throws error', async () => {
        // Mock user
        mock.method(userModel.default, 'findById', () => ({
            exec: async () => ({
                email: 'jane@example.com',
                first_name: 'Jane',
                last_name: 'Doe',
                dob: { day: 10, month: 5, year: 1990 },
                address: {
                    line1: '123 Main St',
                    city: 'Prague',
                    postal_code: '11000',
                    country: 'CZ',
                },
            }),
        }));
        // Force Stripe error
        walletToAccount.initializedStrip = {
            accounts: {
                create: async () => {
                    throw new Error('Stripe error');
                },
            },
        };
        const result = await walletToAccount.createConnectedAccount('68b841954c3828ced84ccfb0', '127.0.0.1');
        assert.strictEqual(result.data, null);
        assert.ok(result.error instanceof AppError);
        assert.strictEqual(result.error?.message, 'Stripe error');
    });
    it.skip('should handle uninitialized Stripe', async () => {
        walletToAccount.initializedStrip = undefined;
        const result = await walletToAccount.createConnectedAccount('68b841954c3828ced84ccfb0', '127.0.0.1');
        assert.strictEqual(result.data, null);
        assert.ok(result.error instanceof AppError);
        assert.strictEqual(result.error?.message, 'Stripe not initialized');
    });
    it.skip('should throw AppError if user not found', async () => {
        // Mock user returning null
        mock.method(userModel.default, 'findById', () => ({
            exec: async () => null,
        }));
        await assert.rejects(walletToAccount.createConnectedAccount('invalidUserId', '127.0.0.1'), (err) => {
            assert.ok(err instanceof AppError);
            assert.strictEqual(err.message, 'user not found');
            return true;
        });
    });
});
//# sourceMappingURL=walletToAccount.test.js.map