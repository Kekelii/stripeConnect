import mongoose from 'mongoose';
import walletNotification from '../Schemas/notificationSchema.js';

export default mongoose.model('walletNotifaction', walletNotification);
