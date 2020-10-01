import { UserProfileModel } from '../../shared/models/user-profile.model';
import { getHashedPassword } from '../misc/utils';

export class RegisterForm extends UserProfileModel {
  getHashedPassword(): Promise<string> {
    return getHashedPassword(this.password);
  }
}
