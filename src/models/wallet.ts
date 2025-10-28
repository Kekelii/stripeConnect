import mongoose from "mongoose"
import wallertSchema from "../Schemas/walletSchema.js"

export default mongoose.model('wallet', wallertSchema)