import { SetMetadata } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
