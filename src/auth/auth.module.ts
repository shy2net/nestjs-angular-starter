import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import config from '../config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

/**
 * Responsible of authenticating the user requests using JWT authentication
 * and Passport. It exposes the AuthService which allows managing user authentication,
 * and the UserAuthGuard which allows authenticating each user request.
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: config.JWT.SECRET,
      signOptions: config.JWT.OPTIONS,
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
