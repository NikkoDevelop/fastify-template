import winston from 'winston';

export class Logger {
  public readonly service: string;
  public readonly logger: winston.Logger;

  constructor(service: string) {
    const { combine, timestamp, printf, colorize, align } = winston.format;

    this.logger = winston.createLogger({
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        printf(
          (info) =>
            `[${service}] - [${info.timestamp}] ${info.level}: ${typeof info.message === 'object' ? JSON.stringify(info.message, null, 4) : info.message}`,
        ),
      ),
      defaultMeta: {
        service: service,
      },
      transports: [
        new winston.transports.Console({
          format: combine(colorize({ all: true }), align()),
        }),
      ],
    });
  }
}
