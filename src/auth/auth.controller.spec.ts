import { LoginResponse, UserProfile } from 'shared';

import { generateMockUser } from '../../shared/testing/mock/user.mock';
import { cleanTestDB } from '../testing/test_db_setup';
import { closeNestApp, getNestApp, getRequest, setAdminHeaders } from '../testing/test_utils';

describe('AuthController', () => {
  beforeAll(getNestApp);
  beforeEach(cleanTestDB);
  afterAll(closeNestApp);

  it('/login (POST) should login as root and obtain a token', async () => {
    const response = await (await getRequest())
      .post('/login')
      .send({ username: 'root@mail.com', password: 'root' })
      .expect(200);

    const result = response.body as LoginResponse;

    // Check that the token looks fine
    expect(typeof result.token).toBe('string');
    expect(result.token.length).toBeGreaterThan(0);

    // Check that the user if fine
    expect(result.user.email).toBe('root@mail.com');
  });

  it('/login (POST) should fail to login as root with an invalid password', async () => {
    await (await getRequest())
      .post('/login')
      .send({ username: 'root@mail.com', password: 'wrongpassword' })
      .expect(401)
      .expect({
        statusCode: 401,
        message: 'Email or password are invalid!',
        error: 'Unauthorized',
      });
  });

  it('/profile (GET) should return the root user profile', async () => {
    const response = await setAdminHeaders(
      (await getRequest()).get('/profile'),
    ).expect(200);

    const result: UserProfile = response.body;

    // Check that we obtained the correct user by it's email address
    expect(result.email).toBe('root@mail.com');
  });

  it('/profile (GET) should fail to return a user profile because no credentials provided', async () => {
    await (await getRequest())
      .get('/profile')
      .expect(401)
      .expect({
        statusCode: 401,
        message: 'Unauthorized',
      });
  });

  it('/register (POST) should register a new user successfully', async () => {
    const testUser = generateMockUser();
    const response = await (await getRequest())
      .post('/register')
      .send(testUser)
      .expect(201);

    const returnedUser: UserProfile = response.body;

    // Remove the password field for compare
    delete testUser.password;

    // Now check if the returned user is the same as the created test user
    expect(returnedUser).toEqual(expect.objectContaining(testUser));
  });

  it('/register (POST) should fail to register a new user because one field is not valid', async () => {
    const testUser: UserProfile = generateMockUser();
    testUser.email = 'notanemail';

    await (await getRequest())
      .post('/register')
      .send(testUser)
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['email must be an email'],
        error: 'Bad Request',
      });
  });
});
