import * as process from 'process';

import { parseEnvString } from './config-parser';

describe('config-parser', () => {
  it('check home directory (~) parse', () => {
    const value = '~/some/long/path';
    expect(parseEnvString(value)).not.toContain('~/');
  });

  it('check cwd parse (process.cwd)', () => {
    const value = './this/cwd/test';

    // Create an expected value by replace the './' variables with the current working directory manually
    const expectedValue = `${process.cwd()}/${value.substring(2)}`;

    expect(parseEnvString(value)).not.toContain('./');
    expect(parseEnvString(value)).toBe(expectedValue);
  });

  it('should return boolean values', () => {
    const trueValue = 'true';
    const falseValue = 'false';

    expect(parseEnvString(trueValue)).toBeTruthy();
    expect(parseEnvString(falseValue)).toBeFalsy();
  });
});
