import { Type } from 'class-transformer';
import { IsNotEmpty, IsPort, IsString, ValidateNested } from 'class-validator';

import { SettingsSchema } from '@Service/config/schemas/SettingsSchema';

export class ConfigSchema {
  @IsString()
  @IsNotEmpty()
  public readonly name!: string;

  @IsPort()
  @IsNotEmpty()
  public readonly port!: string;

  @ValidateNested()
  @Type(() => SettingsSchema)
  public readonly settings!: SettingsSchema;
}
