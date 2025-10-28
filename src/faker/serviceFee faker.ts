import mongoose, { Schema, Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import type { paymentMethod, ServiceFees, status } from '../global.js';
import serviceFees from '../models/serviceFees.js';

function generateFakeServiceFee(): ServiceFees {
	const transactionTypes: ServiceFees['transactionType'][] = [
		'Subscription',
		'ID verification fee',
	];

	const paymentMethods: paymentMethod[] = ['Card', 'Wallet'];

	return {
		_id: new Types.ObjectId() as unknown as Schema.Types.ObjectId,
		createdAt: faker.date.between({
			from: '2025-01-01T00:00:00.000Z',
			to: '2025-12-31T23:59:59.999Z',
		}),
		status: faker.helpers.arrayElement([
			'Pending',
			'Successfull',
			'Failed',
		]) as status,
		amount: Number(faker.finance.amount({ min: 10, max: 500, dec: 2 })),
		transactionType: transactionTypes[
			Math.floor(Math.random() * transactionTypes.length)
		] as ServiceFees['transactionType'],
		paymentMethod: paymentMethods[
			Math.floor(Math.random() * paymentMethods.length)
		] as paymentMethod,
		userId: '68d4a203177e0c284c4dd7df',
		walletId: '68dac707a96a956d97193509',
	};
}

// Example: generate 20 fake service fee records
const fakeServiceFees: ServiceFees[] = Array.from(
	{ length: 100 },
	generateFakeServiceFee
);

async function insetFaker() {
	console.log('faking');
	const result = await serviceFees.insertMany(fakeServiceFees);
}
insetFaker();
