import mongoose, { Mongoose } from "mongoose";
import logger from "../utils/logger.js";

const conString: string = process.env.DATABASE_CONNECTION_STRING as string


async function M_connect() {
    if (conString.length < 1)
        throw new Error('connect string for database not found')
    try {
        await mongoose.connect(conString);
        logger.info('connection to database established ...')
    } catch (err) {
        logger.fatal(err)
        throw err
    }
}

export default M_connect()