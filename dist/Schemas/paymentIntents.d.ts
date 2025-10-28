import mongoose from 'mongoose';
import type { PaymentIntent } from '../global.js';
declare const paymentIntents: mongoose.Schema<PaymentIntent, mongoose.Model<PaymentIntent, any, any, any, mongoose.Document<unknown, any, PaymentIntent, any, {}> & PaymentIntent & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, PaymentIntent, mongoose.Document<unknown, {}, mongoose.FlatRecord<PaymentIntent>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<PaymentIntent> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default paymentIntents;
//# sourceMappingURL=paymentIntents.d.ts.map