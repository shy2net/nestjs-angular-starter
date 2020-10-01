import { Injectable } from '@nestjs/common';

import config from '../config';
import { AppConfig } from '../models/app-config';

/**
 * You can use the config service in order to inject the configurations to other services.
 */
@Injectable()
export class ConfigService {
  getConfig(): AppConfig {
    return config;
  }
}
