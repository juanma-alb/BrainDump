import pino from 'pino';

const isDevelopment = process.env['NODE_ENV'] !== 'production';

const transport = isDevelopment
  ? pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    })
  : undefined;

export const logger = pino(
  {
    level: isDevelopment ? 'debug' : 'info',
  },
  transport,
);
