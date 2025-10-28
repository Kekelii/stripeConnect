import mongoose from 'mongoose';
import Earnings from '../Schemas/earningsSchemma.js';

export default mongoose.model('earnings', Earnings);
