import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { UserProfile } from '../../shared/models/user-profile';
import config from '../config';
import { AuthService } from './auth.service';

/**
 * This service is reponsible of implementing the local passport authentication strategy which is based
 * on JWT and being provided using the 'Bearer' header.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWT.SECRET,
    });
  }

  validate(payload: UserProfile): Promise<UserProfile> {
    return this.authService.getUserFromDB(payload.email).exec();
  }
}
