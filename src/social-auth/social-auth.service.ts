import * as bcrypt from 'bcryptjs';
import { Application } from 'express';
import * as passport from 'passport';
import * as FacebookTokenStrategy from 'passport-facebook-token';
import { Strategy as GoogleTokenStrategy } from 'passport-google-token';
import * as randomstring from 'randomstring';

import { Inject, Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { UserProfile } from '../../shared/models';
import { IUserProfileDbModel, UserProfileDbModel } from '../database/models/user-profile.db.model';
import { SocialAuthModuleConfig } from './social-auth.models';

/**
 * Responsible of initializing social authentication with 3rd party providers
 * (such as Google and Facebook), by initializing passport facebook and google middlewares.
 */
@Injectable()
export class SocialAuthService {
  constructor(
    @Inject('SOCIAL_AUTH_MODULE_CONFIG') private config: SocialAuthModuleConfig,
    adapterHost: HttpAdapterHost,
  ) {
    // Don't do anything on test as there is not instance of express
    if (process.env.NODE_ENV === 'test') return;

    // Get the express app in order to initialize social authentication
    const expressApp = adapterHost.httpAdapter.getInstance() as Application;

    // Now initialize the social authentication
    this.init(expressApp);
  }

  private init(express: Application): void {
    express.use(passport.initialize());
    this.initFacebook();
    this.initGoogle();
  }

  private initFacebook(): void {
    const facebookCredentials = this.config.socialAuthServices['facebook'];

    passport.use(
      new FacebookTokenStrategy(
        {
          clientID: facebookCredentials.APP_ID,
          clientSecret: facebookCredentials.APP_SECRET,
        },
        (accessToken, refreshToken, profile, done) => {
          const fbProfile = profile._json;
          const email = fbProfile.email as string;

          this.findOrCreateUser(email, fbProfile, {
            email: 'email',
            first_name: 'firstName',
            last_name: 'lastName',
          })
            .then(user => {
              done(null, user.toJSON());
            })
            .catch(error => {
              done(error, null);
            });
        },
      ),
    );
  }

  private initGoogle(): void {
    const googleCredentials = this.config.socialAuthServices['google'];

    passport.use(
      new GoogleTokenStrategy(
        {
          clientID: googleCredentials.APP_ID,
        },
        (accessToken, refreshToken, profile, done) => {
          const googleProfile = profile._json;
          const email = googleProfile.email;

          this.findOrCreateUser(email, googleProfile, {
            email: 'email',
            given_name: 'firstName',
            family_name: 'lastName',
          })
            .then(user => {
              done(null, user.toJSON());
            })
            .catch(error => {
              done(error, null);
            });
        },
      ),
    );
  }

  /**
   * Finds a user based on the provided email. If the email provided already exists, returns a token
   * for that user. If the user's email does not exist in the database, create the user according
   * to the profile fetched from the 3rd party and saves it.
   * @param email
   * @param socialProfile
   * @param map
   */
  async findOrCreateUser(
    email: string,
    socialProfile: unknown,
    map: unknown,
  ): Promise<IUserProfileDbModel> {
    const user = await UserProfileDbModel.findOne({ email });

    if (user) {
      return user;
    }

    const generatedProfile = await this.generateUserFromSocialProfile(
      socialProfile,
      map,
    );

    return UserProfileDbModel.create(generatedProfile);
  }

  /**
   * Fills the user profile data from the provided social profile using the map specified
   * @param socialProfile The social profile containing the data we want to transfer to our own user profile
   * @param userProfile Our user profile To save the data into
   * @param map A dictionary that associates the social profile fiels to the user profile fields
   */
  generateUserFromSocialProfile(
    socialProfile: unknown,
    map: unknown,
  ): Promise<UserProfile> {
    const userProfile = {} as UserProfile;

    Object.keys(map).forEach(key => {
      const userKey = map[key];
      userProfile[userKey] = socialProfile[key];
    });

    const password = randomstring.generate();

    // Generate a random password for this user
    return bcrypt.genSalt().then(salt => {
      return bcrypt.hash(password, salt).then(hash => {
        userProfile.password = hash;
        return userProfile;
      });
    });
  }
}
