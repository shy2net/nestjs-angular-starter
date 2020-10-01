import { UserProfile } from './user-profile';

export interface LoginResponse {
  token: string;
  user: UserProfile;
}
