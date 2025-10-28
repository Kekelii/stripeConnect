import mongoose from 'mongoose';
import type { WalletNotificationType } from '../global.js';
declare const walletNotification: mongoose.Schema<WalletNotificationType, mongoose.Model<WalletNotificationType, any, any, any, mongoose.Document<unknown, any, WalletNotificationType, any, {}> & WalletNotificationType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, WalletNotificationType, mongoose.Document<unknown, {}, mongoose.FlatRecord<WalletNotificationType>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<WalletNotificationType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default walletNotification;
//# sourceMappingURL=notificationSchema.d.ts.map