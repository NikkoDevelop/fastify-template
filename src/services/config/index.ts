import * as fs from 'fs';

import { plainToClass } from 'class-transformer';

import { ConfigSchema } from '@Service/config/ConfigSchema';
import { Logger } from '@Service/logger';
import { validate } from 'class-validator';

export class Config {
  private readonly winston: Logger;
  public data!: ConfigSchema;

  private constructor() {
    this.winston = new Logger('Config');
  }

  public static async create(): Promise<Config> {
    const config = new Config();
    await config.loadConfig();
    return config;
  }

  private async loadConfig() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const jsonData = JSON.parse(fs.readFileSync('config/default.json', 'utf8'));
    const data = plainToClass(ConfigSchema, jsonData);

    const errors = await validate(data);
    if (errors.length > 0) {
      errors.forEach((error) => {
        this.winston.logger.error(error.toString());
      });
      throw new Error('Configuration file has errors. Please check your default.json for valid data');
    } else {
      this.data = data;
      this.winston.logger.info('Configuration is loaded');
    }
  }
}
