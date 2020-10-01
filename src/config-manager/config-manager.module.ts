import { Module } from '@nestjs/common';

import { ConfigService } from './config.service';

/**
 * This module is a NestJS representation of 'config.ts', which is a singleton file containing all of the configurations.
 * You can use it to inject the configurations anywhere you want.
 *
 * You can also import 'config.ts' directly and access those configurations without any injection.
 */
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigManagerModule {}
