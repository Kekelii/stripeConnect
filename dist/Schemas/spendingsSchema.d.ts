import mongoose from 'mongoose';
import type { WalletSpending } from '../global.js';
declare const Spendings: mongoose.Schema<WalletSpending, mongoose.Model<WalletSpending, any, any, any, mongoose.Document<unknown, any, WalletSpending, any, {}> & WalletSpending & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, WalletSpending, mongoose.Document<unknown, {}, mongoose.FlatRecord<WalletSpending>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<WalletSpending> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Spendings;
//# sourceMappingURL=spendingsSchema.d.ts.map