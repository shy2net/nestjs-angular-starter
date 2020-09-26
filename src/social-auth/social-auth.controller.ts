import * as passport from 'passport';
import { LoginResponse } from 'shared';

import { Body, Controller, Get, Param, Request, Response } from '@nestjs/common';

import { UserProfile } from '../../shared/models/user-profile';
import { AuthService } from '../auth/auth.service';
import { middlewareToPromise } from '../misc/utils';
import { AppRequest, AppResponse } from '../models';

@Controller('social-login')
export class SocialAuthController {
  constructor(private authService: AuthService) {}

  @Get('/:provider')
  async socialLogin(
    @Param('provider') provider: string,
    @Body() user: UserProfile,
    @Request() req?: AppRequest,
    @Response() res?: AppResponse,
  ): Promise<LoginResponse> {
    // If this is not unit testing and we have obtained a request
    if (req) {
      // Wait for the passport middleware to run
      await middlewareToPromise(
        passport.authenticate(`${provider}-token`, { session: false }),
        req,
        res,
      ); // Authenticate using the provider suitable (google-token, facebook-token)
      user = req.user;
    }

    const token = this.authService.generateToken(user);
    return {
      token,
      user,
    };
  }
}
