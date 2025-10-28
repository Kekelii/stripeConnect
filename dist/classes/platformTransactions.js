import earnings from '../models/earnings.js';
import spendings from '../models/spendings.js';
import wallet from '../models/wallet.js';
import { AppError } from '../utils/appError.js';
import { getDateRangeForCurrentWeek, getDateRangeForYear, getDayName, getMonth, getYear, } from '../utils/helpers.js';
export class FinancialDataService {
    static async generateGraphDataMonthly(userId) {
        const { startDate, endDate } = getDateRangeForYear(getYear());
        let earningsMontly = [
            {
                period: '',
                data: 0,
            },
        ];
        let spendingsMonthly = [
            {
                period: '',
                data: 0,
            },
        ];
        const spendingIntheYear = {
            January: 0,
            February: 0,
            March: 0,
            April: 0,
            May: 0,
            June: 0,
            July: 0,
            August: 0,
            September: 0,
            October: 0,
            November: 0,
            December: 0,
        };
        const earningIntheYear = {
            January: 0,
            February: 0,
            March: 0,
            April: 0,
            May: 0,
            June: 0,
            July: 0,
            August: 0,
            September: 0,
            October: 0,
            November: 0,
            December: 0,
        };
        const e = await earnings.find({
            userId,
            createdAt: {
                $gte: startDate,
                $lt: endDate,
            },
        });
        const s = await spendings.find({
            userId,
            createdAt: {
                $gte: startDate,
                $lt: endDate,
            },
        });
        e.forEach((i) => {
            const m = getMonth(i.createdAt);
            earningIntheYear[m] = earningIntheYear[m] || 0;
            earningIntheYear[m] += i.amount;
        });
        s.forEach((i) => {
            const m = getMonth(i.createdAt);
            spendingIntheYear[m] = spendingIntheYear[m] || 0;
            spendingIntheYear[m] += i.amount;
        });
        Object.keys(earningIntheYear).forEach((e) => {
            earningIntheYear[e] =
                Math.round(earningIntheYear[e] * 100) / 100;
        });
        spendingsMonthly.pop();
        Object.keys(spendingIntheYear).forEach((e) => {
            spendingIntheYear[e] =
                Math.round(spendingIntheYear[e] * 100) / 100;
            spendingsMonthly.push({ period: e, data: spendingIntheYear[e] });
        });
        earningsMontly.pop();
        Object.keys(earningIntheYear).forEach((e) => {
            earningIntheYear[e] =
                Math.round(earningIntheYear[e] * 100) / 100;
            earningsMontly.push({ period: e, data: earningIntheYear[e] });
        });
        return [{ earnings: earningsMontly }, { spendings: spendingsMonthly }];
    }
    static async generateGraphDataYearly(userId) {
        let earningsYearly = [
            {
                period: getYear(),
                data: 0,
            },
        ];
        const spendingsYearly = [
            {
                period: getYear(),
                data: 0,
            },
        ];
        let eY = {};
        const sY = {};
        const e = await earnings.find({ userId });
        const s = await spendings.find({ userId });
        e.forEach((i) => {
            const year = getYear(i.createdAt);
            eY[year] = eY[year] || 0;
            eY[year] += i.amount;
        });
        s.forEach((i) => {
            const year = getYear(i.createdAt);
            sY[year] = sY[year] || 0;
            sY[year] += i.amount;
        });
        earningsYearly.pop();
        Object.keys(eY).forEach((i) => {
            earningsYearly.push({
                period: parseInt(i),
                data: Math.round(eY[parseInt(i)] * 100) / 100,
            });
        });
        spendingsYearly.pop();
        Object.keys(sY).forEach((i) => {
            spendingsYearly.push({
                period: parseInt(i),
                data: Math.round(sY[parseInt(i)] * 100) / 100,
            });
        });
        return [{ earnings: earningsYearly }, { spendings: spendingsYearly }];
    }
    static async generateGraphDataWeekly(userId) {
        const { startDate, endDate } = getDateRangeForCurrentWeek();
        let earningsWeekly = [];
        let spendingsWeekly = [];
        const dayNames = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
        ];
        const spendingInTheWeek = dayNames.reduce((acc, day) => {
            acc[day] = 0;
            return acc;
        }, {});
        const earningInTheWeek = dayNames.reduce((acc, day) => {
            acc[day] = 0;
            return acc;
        }, {});
        const e = await earnings.find({
            userId,
            createdAt: {
                $gte: startDate,
                $lt: endDate,
            },
        });
        const s = await spendings.find({
            userId,
            createdAt: {
                $gte: startDate,
                $lt: endDate,
            },
        });
        e.forEach((i) => {
            const day = getDayName(i.createdAt);
            earningInTheWeek[day] = earningInTheWeek[day] || 0;
            earningInTheWeek[day] += i.amount;
        });
        s.forEach((i) => {
            const day = getDayName(i.createdAt);
            spendingInTheWeek[day] = spendingInTheWeek[day] || 0;
            spendingInTheWeek[day] += i.amount;
        });
        dayNames.forEach((dayName) => {
            const rawAmount = earningInTheWeek[dayName];
            const roundedAmount = Math.round(rawAmount * 100) / 100;
            earningsWeekly.push({ period: dayName, data: roundedAmount });
        });
        dayNames.forEach((dayName) => {
            const rawAmount = spendingInTheWeek[dayName];
            const roundedAmount = Math.round(rawAmount * 100) / 100;
            spendingsWeekly.push({ period: dayName, data: roundedAmount });
        });
        return [{ earnings: earningsWeekly }, { spendings: spendingsWeekly }];
    }
    static async SpendingEntry(userId, amount, spendingType, time) {
        try {
            const spendingEntry = await spendings.insertOne({
                userId,
                amount,
                spendingType,
                // createdAt: time,
            });
            const walletUpdate = await wallet.findOneAndUpdate({ userId }, { $inc: { spendings: amount } });
            return spendingEntry;
        }
        catch (err) {
            throw new AppError(err.message, 404);
        }
    }
    static async EarningsEntry(userId, amount, earningType, time) {
        try {
            const EarningsEntry = await earnings.insertOne({
                userId,
                amount,
                earningType,
                // createdAt: time,
            });
            const walletUpdate = await wallet.findOneAndUpdate({ userId }, { $inc: { earnings: amount } });
            return EarningsEntry;
        }
        catch (err) {
            throw new AppError(err.message, 404);
        }
    }
}
//# sourceMappingURL=platformTransactions.js.map