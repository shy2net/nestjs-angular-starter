import * as jwt from 'jsonwebtoken';

import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export interface AppConfig {
  ENVIRONMENT: string;
  DB_URI: string;
  CLIENT_URL: string;
  JWT: {
    SECRET: string;
    OPTIONS: jwt.SignOptions;
    VERIFY_OPTIONS: jwt.VerifyOptions;
  };
  SSL_CERTIFICATE: {
    KEY: string;
    CERT: string;
    CA: string;
  };
  SOCIAL_CREDENTIALS: unknown;
  CORS_OPTIONS: CorsOptions;
  LOGS_DIR: string;
  LOG_LEVEL: 'debug' | 'info';
  ANGULAR: {
    MOUNT: boolean;
    USE_SSR?: boolean;
  };
  DEBUG_MODE: boolean;
}
