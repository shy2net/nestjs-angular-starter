import * as cors from 'cors';
import * as jwt from 'jsonwebtoken';

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
  CORS_OPTIONS: cors.CorsOptions;
  LOGS_DIR: string;
  LOG_LEVEL: 'debug' | 'info';
  USE_SSR: boolean;
  DEBUG_MODE: boolean;
}
