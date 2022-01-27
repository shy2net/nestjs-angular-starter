import * as cors from 'cors';
import * as _ from 'lodash';
import * as path from 'path';

/**
 * This file is responsible for the configurations, it is generated according to the
 *  environment specified in the NODE_ENV environment variable.
 */
import { Logger } from '@nestjs/common';

import { parseConfig } from './config-manager/config-parser';
import { getEnvConfig } from './misc/env-config-loader';
import { AppConfig } from './models';

let config: AppConfig;
let ENVIRONMENT = process.env['NODE_ENV'] || 'development';

function loadEnvironmentAndConfigurations() {
  let isVerboseTest = false;

  // if it's a 'test-verbose' environment (where we print all logs as usual)
  if (process.env.NODE_ENV === 'test-verbose') {
    // Set the env as 'test' just for the configurations from 'config/test.json' to be loaded correctly
    process.env.NODE_ENV = 'test';
    isVerboseTest = true;
  }

  // The directory where all of the configurations are stored
  process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '/config');

  // Now load all of the configurations using the 'config' library
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  config = require('config');

  // If it's a verbose test, return the NODE_ENV to the correct one
  if (isVerboseTest) {
    process.env.NODE_ENV = 'verbose-test';

    // Special 'test-verbose' case where test is still treated in code but output is still being generated
    // (NestJS by default hides all output if 'test' environment is being set)
    ENVIRONMENT = 'test';
  }
}

loadEnvironmentAndConfigurations();

let exportedConfig = config as AppConfig;

/*
 This file is responsible for the entire configuration of the server.
 */
let isDebugging = false;

// Get the environment configurations
const webEnvConfigs = getEnvConfig();

// Read the supplied arguments
process.argv.forEach(function(val) {
  if (val != null && typeof val === 'string') {
    if (val === '-debug') isDebugging = true;
  }
});

const DEBUG_MODE = isDebugging;

const CORS_OPTIONS: cors.CorsOptions = {
  origin: exportedConfig.CLIENT_URL,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
};

exportedConfig = {
  ...exportedConfig,
  ENVIRONMENT,
  CORS_OPTIONS,
  DEBUG_MODE,
};

/*
Merge the web env configs with the exported configs (so we won't delete any existing values),
environment configurations always have higher priority.
*/
exportedConfig = _.merge(exportedConfig, webEnvConfigs);

// Parse all config values to replace special chars such as '~'
parseConfig(exportedConfig);

// Print out the configurations we are loading
if (process.env.NODE_ENV !== 'test')
  Logger.log(`Loaded config: ${JSON.stringify(exportedConfig, null, 2)}`);

export default exportedConfig as AppConfig;
