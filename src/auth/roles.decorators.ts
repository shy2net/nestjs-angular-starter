import { SetMetadata } from '@nestjs/common';

/**
 * Requires the user to have all of the provided roles in order to access the provided endpoint.
 * @param roles
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
