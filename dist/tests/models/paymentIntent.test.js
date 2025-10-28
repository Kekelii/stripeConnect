import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import PaymentIntents from '../../models/paymentIntents.js';
// Test database connection
const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/depositoo_test';
describe('PaymentIntents Model Tests', () => {
    before(async () => {
        // Connect to test database
        await mongoose.connect(MONGODB_TEST_URI);
    });
    after(async () => {
        // Clean up and close connection
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
    beforeEach(async () => {
        // Clear the collection before each test
        await PaymentIntents.deleteMany({});
    });
    test('should create a payment intent with valid data', async () => {
        const testData = {
            userId: 'user123',
            paymentIntent: { id: 'pi_test123', amount: 2000, currency: 'usd' },
            clientSecret: 'pi_test123_secret_abc',
            status: 'pending',
        };
        const result = await PaymentIntents.create(testData);
        assert.strictEqual(result.userId, testData.userId);
        assert.strictEqual(result.clientSecret, testData.clientSecret);
        assert.strictEqual(result.status, testData.status);
        assert.ok(result._id);
        assert.ok(result.createdAt);
        assert.ok(result.updatedAt);
    });
    test('should fail to create payment intent without required fields', async () => {
        const invalidData = {
            userId: 'user123',
            // Missing required fields: paymentIntentId, clientSecret
        };
        await assert.rejects(async () => {
            await PaymentIntents.create(invalidData);
        }, {
            name: 'ValidationError',
        });
    });
    test('should set default status to pending', async () => {
        const testData = {
            userId: 'user123',
            paymentIntent: { id: 'pi_test789', amount: 3000, currency: 'usd' },
            clientSecret: 'pi_test456_secret_def',
            // No status provided - should default to 'pending'
        };
        const result = await PaymentIntents.create(testData);
        assert.strictEqual(result.status, 'pending');
    });
    test('should update payment intent status', async () => {
        // Create initial payment intent
        const testData = {
            userId: 'user123',
            paymentIntent: { id: 'pi_test789', amount: 3000, currency: 'usd' },
            clientSecret: 'pi_test789_secret_ghi',
            status: 'pending',
        };
        const created = await PaymentIntents.create(testData);
        // Update status
        const updated = await PaymentIntents.findByIdAndUpdate(created._id, { status: 'succeeded' }, { new: true });
        assert.strictEqual(updated?.status, 'succeeded');
        assert.notEqual(updated?.updatedAt, created.updatedAt);
    });
    test('should find payment intent by userId', async () => {
        const testData = {
            userId: 'user456',
            paymentIntent: { id: 'pi_test789', amount: 3000, currency: 'usd' },
            clientSecret: 'pi_findtest_secret',
            status: 'pending',
        };
        await PaymentIntents.create(testData);
        const found = await PaymentIntents.findOne({ userId: 'user456' });
        assert.ok(found);
        assert.strictEqual(found.userId, 'user456');
    });
    test('should handle paymentIntentId as object', async () => {
        const complexPaymentIntent = {
            id: 'pi_complex123',
            amount: 5000,
            currency: 'usd',
        };
        const testData = {
            userId: 'user789',
            paymentIntent: complexPaymentIntent,
            clientSecret: 'pi_complex123_secret',
            status: 'processing',
        };
        const result = await PaymentIntents.create(testData);
        assert.strictEqual(result.paymentIntent.id, complexPaymentIntent.id);
        assert.strictEqual(result.paymentIntent.amount, complexPaymentIntent.amount);
        assert.strictEqual(result.paymentIntent.currency, complexPaymentIntent.currency);
    });
    test('should validate required fields', async () => {
        const testCases = [
            { paymentIntent: { id: 'test' }, clientSecret: 'secret' }, // Missing userId
            { userId: 'user123', clientSecret: 'secret' }, // Missing paymentIntentId
            { userId: 'user123', paymentIntentId: { id: 'test' } }, // Missing clientSecret
        ];
        for (const testCase of testCases) {
            await assert.rejects(async () => {
                await PaymentIntents.create(testCase);
            }, {
                name: 'ValidationError',
            });
        }
    });
    test('should retrieve all payment intents for a user', async () => {
        const userId = 'user_multi';
        const testData = [
            {
                userId,
                paymentIntent: { id: 'pi_test789', amount: 3000, currency: 'usd' },
                clientSecret: 'secret_1',
                status: 'pending',
            },
            {
                userId,
                paymentIntent: { id: 'pi_test789', amount: 3000, currency: 'usd' },
                clientSecret: 'secret_2',
                status: 'succeeded',
            },
        ];
        await PaymentIntents.insertMany(testData);
        const userPayments = await PaymentIntents.find({ userId });
        assert.strictEqual(userPayments.length, 2);
        assert.ok(userPayments.every((payment) => payment.userId === userId));
    });
});
//# sourceMappingURL=paymentIntent.test.js.map