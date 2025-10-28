import express from 'express';
import '@dotenvx/dotenvx/config';
import cors from 'cors';
import logger from './utils/logger.js';

import './DB_M/db_connect.js';
import { errorHandler } from './middlewares/errorHander.js';
import addUserId from './middlewares/addUserId.js';
import webHooks from './controllers/webHooks/main.js';

// import W2B from './controllers/Wallet_to_account/main.js';
import _Wallet from './routes/wallet.js';
import stripe from './classes/stripe.js';

// import './faker/incomeFaker.js';
// import './faker/serviceFee faker.js';
// import './faker/wallettowalletFaker.js';
// import './faker/withdrawalfaker.js';
// import './faker/notifactionsFaker.js';
// import './faker/earningsFaker.js';
// import './faker/spendingFacker.js';

const app = express();
const port = process.env.PORT;

//setting
app.set('trust proxy', true);

//middlewares & routes
app.use(cors());
app.use(addUserId);
app.use('/webhooks', webHooks);

//middlewares that depend of json data
app.use(express.json());
app.use('/wallet', _Wallet);
app.get('/ping', async (req, res) => {
	 
	res.send('pong');
});
// app.use('/w2a', W2B);

//error handler
app.use(errorHandler);

app.listen(port, async () => {
	logger.info(`server is listening on ${port} in ${process.env.NODE_ENV}`);
});
