import * as faker from 'faker';

import { UserProfile } from '../../models/user-profile';

/**
 * Generates a root user we can connect with to the web interface.
 */
export function generateMockRootUser(): UserProfile {
  return {
    ...generateMockUser(),
    email: 'root@mail.com',
    password: 'root',
    roles: ['admin'],
  };
}

export function generateMockViewerUser(): UserProfile {
  return {
    ...generateMockUser(),
    email: 'viewer@mail.com',
    password: 'viewer',
    roles: ['viewer'],
  };
}

/**
 * Generates a mock user for the tests.
 * @param roles
 */
export function generateMockUser(roles: string[] = []): UserProfile {
  return {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: faker.internet.password(),
    roles: roles,
  };
}
