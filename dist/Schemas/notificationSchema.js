import mongoose from 'mongoose';
import { tr } from '@faker-js/faker';
const options = { timestamps: true };
const walletNotification = new mongoose.Schema({
    userId: { type: String, required: true },
    notificationType: { type: String, required: true },
    details: { type: Object, required: true },
    status: { type: String, required: true },
}, options);
export default walletNotification;
//# sourceMappingURL=notificationSchema.js.map