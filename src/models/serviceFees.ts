import mongoose from "mongoose"
import ServiceFeesSchema from "../Schemas/serviceFeesSchema.js"



export default mongoose.model('ServiceFees', ServiceFeesSchema)