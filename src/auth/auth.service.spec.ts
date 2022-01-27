import { assert, expect } from 'chai';

import { UnauthorizedException } from '@nestjs/common';

import { UserProfile } from '../../shared/models/user-profile';
import { generateMockUser } from '../../shared/testing/mock/user.mock';
import { cleanTestDB, closeTestDB } from '../testing/test_db_setup';
import { createTestModuleWithDB, getMockRootUserFromDB } from '../testing/test_utils';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  before(async () => {
    const { module } = await createTestModuleWithDB({
      imports: [AuthModule],
    });

    authService = module.get<AuthService>(AuthService);
  });

  beforeEach(cleanTestDB);
  after(closeTestDB);

  it('should authenticate successfully', async () => {
    const user = await authService.authenticate('root@mail.com', 'root');
    expect(user.email).to.eq('root@mail.com');
  });

  it('should fail to authenticate and return Unauthorized exception', async () => {
    try {
      await authService.authenticate('random@mail.com', 'randompassword');
      assert.fail('Should have failed to authenticate user, but succeed');
    } catch (error) {
      expect(error).to.be.instanceof(UnauthorizedException);
    }
  });

  it('should generate a token for the provided user and decode it back', async () => {
    const rootUser = (await getMockRootUserFromDB()).toJSON() as UserProfile;
    const token = authService.generateToken(rootUser);
    expect(typeof token).to.eq('string');
    expect(token.length > 50).to.be.true;

    // Expect the root user to be equal to the decoded user from the token
    const decodedUser = authService.decodeToken(token);
    expect(decodedUser.email).to.eq(rootUser.email);
  });

  it('should return true for user having role "admin', () => {
    const testUser = generateMockUser(['admin']);
    expect(authService.userHasRoles(testUser, 'admin')).to.be.true;
  });

  it('should return true for user having role "admin" and "operator"', () => {
    const testUser = generateMockUser(['admin', 'operator']);
    expect(authService.userHasRoles(testUser, 'admin', 'operator')).to.be.true;
  });

  it('should return false for user having role "admin"', () => {
    const testUser = generateMockUser();
    expect(authService.userHasRoles(testUser, 'admin')).to.be.false;
  });
});
