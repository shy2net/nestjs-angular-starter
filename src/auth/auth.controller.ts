import { LoginResponse } from 'shared';

import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';

import { UserProfile } from '../../shared/models/user-profile';
import { UserProfileDbModel } from '../database/models/user-profile.db.model';
import { RegisterForm } from '../forms/register.form';
import { AuthService } from './auth.service';
import { RequestUser } from './request-user.decorator';
import { UserAuthGuard } from './user-auth-guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Performs the login process of a user, if the username and password are correct,
   * returns the token and related user profile data.
   * @param username
   * @param password
   */
  @Post('/login')
  @HttpCode(200)
  login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<LoginResponse> {
    return this.authService.authenticate(username, password).then(user => {
      const token = this.authService.generateToken(user.toJSON());

      return {
        token: token,
        user,
      };
    });
  }

  /**
   * Registers a new local user.
   * @param registerForm
   */
  @Post('/register')
  register(@Body() registerForm: RegisterForm): Promise<UserProfile> {
    // Hash the user password and create it afterwards
    return registerForm.getHashedPassword().then(hashedPassword => {
      return UserProfileDbModel.create({
        ...registerForm,
        password: hashedPassword,
      });
    });
  }

  @UseGuards(UserAuthGuard)
  @Get('/profile')
  getProfile(@RequestUser() user: UserProfile): UserProfile {
    return user;
  }

  @UseGuards(UserAuthGuard)
  @Get('/logout')
  logout(): void {
    // TODO: Perform your own logout logic (blacklisting token, etc)
  }
}
