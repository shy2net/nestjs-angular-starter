import { expect } from 'chai';

import { UserProfile } from '../../shared/models';
import { generateMockUser } from '../../shared/testing/mock/user.mock';
import { RegisterForm } from './register.form';

describe('RegisterForm', () => {
  let user: UserProfile;
  let registerForm: RegisterForm;

  before(async () => {
    user = generateMockUser();

    // Setup a static password for testing
    user.password = 'randompassword';
    registerForm = new RegisterForm();

    // Set the user properties in the object
    Object.assign(registerForm, user);
  });

  it('should return a hashed password', async () => {
    const result = await registerForm.getHashedPassword();
    expect(typeof result).to.eq('string');
    expect(result.length).to.eq(60);
  });
});
