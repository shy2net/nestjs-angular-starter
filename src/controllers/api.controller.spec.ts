import { cleanTestDB } from '../testing/test_db_setup';
import { closeNestApp, getNestApp, getRequest } from '../testing/test_utils';

describe('ApiController', () => {
  beforeAll(getNestApp);
  beforeEach(cleanTestDB);
  afterAll(closeNestApp);

  it('/test (GET) should return status ok', async () => {
    await (await getRequest())
      .get('/test')
      .expect(200)
      .expect({ status: 'ok' });
  });
});
