import type { Month } from '../global.js';
export declare function getYear(date?: Date): number;
export declare function getMonth(date?: Date): Month;
export declare function getDateRangeForYear(year: number): {
    startDate: Date;
    endDate: Date;
};
export declare function getDayName(date: Date): string | undefined;
export declare function getDateRangeForCurrentWeek(): {
    startDate: Date;
    endDate: Date;
};
//# sourceMappingURL=helpers.d.ts.map