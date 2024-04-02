import { IsString } from 'class-validator';

export class SettingsSchema {
  @IsString()
  public readonly cookieSecret!: string;
}
