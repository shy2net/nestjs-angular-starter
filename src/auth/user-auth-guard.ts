import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { AppRequest } from '../models';
import { AuthService } from './auth.service';

/**
 * Responsible of guarding endpoints by authenticating them, including their roles using JWT.
 */
@Injectable()
export class UserAuthGuard extends AuthGuard('jwt') {
  constructor(private authService: AuthService, private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First validate the user
    const isUserValidated = await (<Promise<boolean>>(
      this.validateAndAppendUserToRequest(context)
    ));

    // If the user is validated, validate it's roles
    if (isUserValidated) {
      const userHasRoles = this.validateUserRoles(context);

      // If the user don't have the required roles
      if (!userHasRoles)
        throw new ForbiddenException(`You don't have the required roles!`);
      return true;
    }

    return false;
  }

  /**
   * Validates the request, add the user to the request, and return true or false if request is authorized.
   * @param context
   */
  async validateAndAppendUserToRequest(
    context: ExecutionContext,
  ): Promise<boolean> {
    // If we are on test environment, use 'simplified' authentication
    if (process.env.NODE_ENV === 'test') {
      const testUserValidated = await this.validateAndAppendUserForTest(
        context,
      );

      if (testUserValidated) return true;
    }

    // Use normal JWT authentication
    return <Promise<boolean>>super.canActivate(context);
  }

  async validateAndAppendUserForTest(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: AppRequest = context.switchToHttp().getRequest();
    const authorizationHeader: string = request.header('authorization');

    // If this authorization header is bearer
    if (
      authorizationHeader &&
      authorizationHeader.toLowerCase().startsWith('bearer')
    ) {
      // Get the token itself (removes the 'bearer')
      const token = this.extractTokenFromBearerHeader(authorizationHeader);

      // If it's the admin user token
      if (token === 'admin') {
        // This is the administrator token, use the root user
        const rootUser = await this.authService.getUserFromDB('root@mail.com');
        request.user = rootUser;
        return true;
      } else if (token === 'viewer') {
        // This is the viewer token, use the viewer user
        const viewerUser = await this.authService.getUserFromDB(
          'viewer@mail.com',
        );
        request.user = viewerUser;
        return true;
      }
    }
  }

  /**
   * Validates that the user has all of the required roles, if no roles were provided, automatically returns true.
   * @param context
   */
  validateUserRoles(context: ExecutionContext): boolean {
    const request: AppRequest = context.switchToHttp().getRequest();

    // Get the user from the request
    const user = request.user;

    // Get the roles if provided in the metadata
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    // If no roles were specified, continue
    if (!roles) return true;

    // If roles were specified, make sure the user meets them
    return this.authService.userHasRoles(user, ...roles);
  }

  /**
   * Extracts only the token portion from the bearer header.
   * @param bearerHeader
   */
  private extractTokenFromBearerHeader(bearerHeader: string): string {
    return /(?<=bearer ).+/gi.exec(bearerHeader)[0];
  }
}
