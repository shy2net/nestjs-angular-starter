import { cleanTestDB } from '../testing/test_db_setup';
import {
    closeNestApp, getNestApp, getRequest, setAdminHeaders, setViewerHeaders
} from '../testing/test_utils';

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

  it('/admin (GET) should return You are an admin', async () => {
    await setAdminHeaders((await getRequest()).get('/admin'))
      .expect(200)
      .expect('You are an admin!');
  });

  it('/admin (GET) should fail to access route with status code 403', async () => {
    await setViewerHeaders(
      (await getRequest()).get('/admin').expect(403),
    ).expect({
      statusCode: 403,
      message: `You don't have the required roles!`,
      error: 'Forbidden',
    });
  });
});
