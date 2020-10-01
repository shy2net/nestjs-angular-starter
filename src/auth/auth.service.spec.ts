import { UnauthorizedException } from '@nestjs/common';

import { UserProfile } from '../../shared/models/user-profile';
import { generateMockUser } from '../../shared/testing/mock/user.mock';
import { cleanTestDB, closeTestDB } from '../testing/test_db_setup';
import { createTestModuleWithDB, getMockRootUserFromDB } from '../testing/test_utils';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeAll(async () => {
    const { module } = await createTestModuleWithDB({
      imports: [AuthModule],
    });

    authService = module.get<AuthService>(AuthService);
  });

  beforeEach(cleanTestDB);
  afterAll(closeTestDB);

  it('should authenticate successfully', async () => {
    const user = await authService.authenticate('root@mail.com', 'root');
    expect(user.email).toBe('root@mail.com');
  });

  it('should fail to authenticate and return Unauthorized exception', async () => {
    await expect(
      authService.authenticate('random@mail.com', 'randompassword'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should generate a token for the provided user and decode it back', async () => {
    const rootUser = (await getMockRootUserFromDB()).toJSON() as UserProfile;
    const token = authService.generateToken(rootUser);
    expect(typeof token).toBe('string');
    expect(token.length > 50).toBeTruthy();

    // Expect the root user to be equal to the decoded user from the token
    const decodedUser = authService.decodeToken(token);
    expect(decodedUser.email).toEqual(rootUser.email);
  });

  it('should return true for user having role "admin', () => {
    const testUser = generateMockUser(['admin']);
    expect(authService.userHasRoles(testUser, 'admin')).toBeTruthy();
  });

  it('should return true for user having role "admin" and "operator"', () => {
    const testUser = generateMockUser(['admin', 'operator']);
    expect(
      authService.userHasRoles(testUser, 'admin', 'operator'),
    ).toBeTruthy();
  });

  it('should return false for user having role "admin"', () => {
    const testUser = generateMockUser();
    expect(authService.userHasRoles(testUser, 'admin')).toBeFalsy();
  });
});
