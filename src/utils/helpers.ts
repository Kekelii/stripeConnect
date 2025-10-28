import type { Month } from '../global.js';

export function getYear(date?: Date) {
	const time = date ? new Date(date) : new Date();
	return time.getFullYear();
}

export function getMonth(date?: Date): Month {
	const months: { [k: number]: Month } = {
		0: 'January',
		1: 'February',
		2: 'March',
		3: 'April',
		4: 'May',
		5: 'June',
		6: 'July',
		7: 'August',
		8: 'September',
		9: 'October',
		10: 'November',
		11: 'December',
	};
	const time = date ? new Date(date) : new Date();
	return months[time.getMonth()] as Month;
}
export function getDateRangeForYear(year: number) {
	const startDate = new Date(year, 0, 1);
	const endDate = new Date(year + 1, 0, 1);
	return { startDate, endDate };
}
export function getDayName(date: Date) {
	const days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];
	return days[date.getDay()];
}
export function getDateRangeForCurrentWeek() {
	const today = new Date();
	const dayOfWeek = today.getDay();
	const startDate = new Date(today);
	startDate.setDate(today.getDate() - dayOfWeek);
	startDate.setHours(0, 0, 0, 0); // Start of Sunday (00:00:00.000)
	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + 7);

	return { startDate, endDate };
}
