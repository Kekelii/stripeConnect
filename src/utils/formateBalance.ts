export default function formatBalance(amount: number, divideBy100 = true) {
	const _value = divideBy100 ? amount / 100 : amount;
	const value = Math.abs(_value);
	return value.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}
