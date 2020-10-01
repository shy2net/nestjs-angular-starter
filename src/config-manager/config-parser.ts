import * as path from 'path';
import * as process from 'process';

/**
 * Parse environment variables, parse out path strings, and boolean values.
 * @param value
 */
export const parseEnvString = (value: string): string | boolean => {
  // If it's a boolean string, return it as a boolean
  if (value === 'true' || value === 'false') {
    return value === 'true' ? true : false;
  }

  if (
    value.startsWith('/') ||
    value.startsWith('./') ||
    value.startsWith('~')
  ) {
    // Replace home directory with correct value (if exists)
    const output = value.replace(
      '~/',
      `${process.env.HOME || process.env.USERPROFILE}/`
    );

    // Parse other values
    return path.resolve(output);
  }

  // Don't do anything to paths that are not relative or non-path related values
  return value;
};

/**
 * Parses all values from specified configuration, replacing string with special characters such as '~' to
 * which represents user home directory.
 * @param config
 */
export const parseConfig = (config: unknown): void => {
  if (config instanceof Object) {
    for (const key in config) {
      const value = config[key];

      if (value instanceof Object) parseConfig(value);
      else if (typeof value === 'string') config[key] = parseEnvString(value);
    }
  }
};
