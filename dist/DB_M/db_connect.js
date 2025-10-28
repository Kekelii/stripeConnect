import mongoose, { Mongoose } from "mongoose";
import logger from "../utils/logger.js";
const conString = process.env.DATABASE_CONNECTION_STRING;
async function M_connect() {
    if (conString.length < 1)
        throw new Error('connect string for database not found');
    try {
        await mongoose.connect(conString);
        logger.info('connection to database established ...');
    }
    catch (err) {
        logger.fatal(err);
        throw err;
    }
}
export default M_connect();
//# sourceMappingURL=db_connect.js.map