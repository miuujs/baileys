import P from 'pino';
/** Default pino logger with ISO timestamp formatting */
export default P({ timestamp: () => `,"time":"${new Date().toJSON()}"` });
