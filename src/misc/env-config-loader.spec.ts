import { getEnvConfig } from './env-config-loader';

describe('EnvConfigLoader', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let originalEnv: any;

  beforeAll(() => {
    // Store the original environment variables of .env
    originalEnv = process.env;
  });

  beforeEach(() => {
    process.env = {};
  });

  afterAll(() => {
    // Restore the original environment variables of .env
    process.env = originalEnv;
  });

  it('should return CLIENT_URL and INSTALL_FREEZE_TIME variables (primitive type)', () => {
    process.env['WEB_CONF_CLIENT_URL'] = 'http://custom-client.url';
    process.env['WEB_CONF_DB_URI'] = 'my-custom-uri';

    const extractedConfigs = getEnvConfig();

    expect(extractedConfigs['CLIENT_URL']).toBe('http://custom-client.url');
    expect(extractedConfigs['DB_URI']).toBe('my-custom-uri');
  });

  it('should return JWT environment variables (non-primitive types)', () => {
    const jwtObject = {
      SECRET: 'sdaddadas',
      CUSTOM_VALUE: '1000',
    };

    // Load up query non-primitives
    process.env['WEB_CONF_JWT_SECRET'] = jwtObject.SECRET;
    process.env['WEB_CONF_JWT_CUSTOM_VALUE'] = jwtObject.CUSTOM_VALUE;

    const extractedConfigs = getEnvConfig();

    expect(extractedConfigs['JWT']).toEqual(jwtObject);
  });
});
