import { AppConfig } from '../models';

/**
 * Returns all of the configurations provided from the system environment.
 */
export function getEnvConfig(): unknown {
  // Allows initializing configurations from environment, we initialize non-primitive types
  const webEnvConfigs = {
    SSL_CERTIFICATE: {},
    JWT: {},
    ANGULAR: {},
  } as AppConfig;

  for (const envName in process.env) {
    const envValue = process.env[envName];
    let envAdded = false;

    // Check if it's a non-primitive config
    for (const envConfName in webEnvConfigs) {
      // If it's a non-primitive type
      if (Object(webEnvConfigs[envConfName])) {
        const re = new RegExp(`WEB_CONF_${envConfName}_(\\w+)`, 'gi');
        const groups = re.exec(envName);
        if (groups && groups.length > 1) {
          webEnvConfigs[envConfName][groups[1]] = envValue;
          envAdded = true;
          break;
        }
      }
    }

    // If it's a primitive type
    if (!envAdded) {
      const result = /WEB_CONF_(\w+)/g.exec(envName);
      if (result && result.length > 1) {
        webEnvConfigs[result[1]] = envValue;
        envAdded = true;
      }
    }
  }

  return webEnvConfigs;
}
