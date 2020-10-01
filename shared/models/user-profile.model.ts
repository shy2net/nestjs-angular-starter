import { IsEmail, MinLength } from 'class-validator';

import { UserProfile } from './user-profile';

export class UserProfileModel implements UserProfile {
  @IsEmail()
  email: string;

  @MinLength(1)
  firstName: string;
  @MinLength(1)
  lastName: string;
  @MinLength(6)
  password: string;

  roles?: string[];
}
