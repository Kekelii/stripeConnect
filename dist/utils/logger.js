import pino from 'pino';
const config = {
    transport: {
        target: 'pino-pretty',
        options: { colorize: true },
    },
};
const logger = pino(config);
export default logger;
//# sourceMappingURL=logger.js.map